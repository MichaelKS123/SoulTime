// server.js - SoulTime Backend by Michael Semera
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/soultime', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Capsule Schema
const capsuleSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  encryptedContent: { type: String, required: true },
  unlockDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  type: { type: String, enum: ['text', 'image', 'audio', 'video'], default: 'text' },
  fileUrl: { type: String },
  locked: { type: Boolean, default: true },
  encryptionKey: { type: String, required: true },
  iv: { type: String, required: true }
});

const Capsule = mongoose.model('Capsule', capsuleSchema);

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mp3|wav|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});

// AES-256 Encryption Functions
const ALGORITHM = 'aes-256-cbc';

function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encrypted, iv: iv.toString('hex') };
}

function decrypt(encrypted, key, iv) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(key, 'hex'),
    Buffer.from(iv, 'hex')
  );
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('hex');
}

// Routes

// Create a new time capsule
app.post('/api/capsules', upload.single('file'), async (req, res) => {
  try {
    const { userId, title, content, unlockDate, type } = req.body;
    
    if (!userId || !title || !content || !unlockDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const encryptionKey = generateEncryptionKey();
    const { encrypted, iv } = encrypt(content, encryptionKey);

    const capsule = new Capsule({
      userId,
      title,
      encryptedContent: encrypted,
      unlockDate: new Date(unlockDate),
      type: type || 'text',
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      encryptionKey,
      iv
    });

    await capsule.save();
    
    res.status(201).json({
      id: capsule._id,
      title: capsule.title,
      unlockDate: capsule.unlockDate,
      createdAt: capsule.createdAt,
      type: capsule.type,
      locked: capsule.locked
    });
  } catch (error) {
    console.error('Error creating capsule:', error);
    res.status(500).json({ error: 'Failed to create capsule' });
  }
});

// Get all capsules for a user
app.get('/api/capsules/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const capsules = await Capsule.find({ userId }).sort({ createdAt: -1 });
    
    const now = new Date();
    const capsulesData = capsules.map(capsule => {
      const isUnlocked = now >= capsule.unlockDate;
      
      return {
        id: capsule._id,
        title: capsule.title,
        unlockDate: capsule.unlockDate,
        createdAt: capsule.createdAt,
        type: capsule.type,
        locked: !isUnlocked,
        fileUrl: isUnlocked ? capsule.fileUrl : null,
        content: isUnlocked ? decrypt(capsule.encryptedContent, capsule.encryptionKey, capsule.iv) : null
      };
    });
    
    res.json(capsulesData);
  } catch (error) {
    console.error('Error fetching capsules:', error);
    res.status(500).json({ error: 'Failed to fetch capsules' });
  }
});

// Get a specific capsule
app.get('/api/capsules/:userId/:capsuleId', async (req, res) => {
  try {
    const { userId, capsuleId } = req.params;
    const capsule = await Capsule.findOne({ _id: capsuleId, userId });
    
    if (!capsule) {
      return res.status(404).json({ error: 'Capsule not found' });
    }
    
    const now = new Date();
    const isUnlocked = now >= capsule.unlockDate;
    
    if (!isUnlocked) {
      return res.status(403).json({ 
        error: 'Capsule is still locked',
        unlockDate: capsule.unlockDate 
      });
    }
    
    const decryptedContent = decrypt(capsule.encryptedContent, capsule.encryptionKey, capsule.iv);
    
    res.json({
      id: capsule._id,
      title: capsule.title,
      content: decryptedContent,
      unlockDate: capsule.unlockDate,
      createdAt: capsule.createdAt,
      type: capsule.type,
      fileUrl: capsule.fileUrl,
      locked: false
    });
  } catch (error) {
    console.error('Error fetching capsule:', error);
    res.status(500).json({ error: 'Failed to fetch capsule' });
  }
});

// Delete a capsule
app.delete('/api/capsules/:userId/:capsuleId', async (req, res) => {
  try {
    const { userId, capsuleId } = req.params;
    const capsule = await Capsule.findOneAndDelete({ _id: capsuleId, userId });
    
    if (!capsule) {
      return res.status(404).json({ error: 'Capsule not found' });
    }
    
    res.json({ message: 'Capsule deleted successfully' });
  } catch (error) {
    console.error('Error deleting capsule:', error);
    res.status(500).json({ error: 'Failed to delete capsule' });
  }
});

// Update capsule (only if still locked)
app.put('/api/capsules/:userId/:capsuleId', async (req, res) => {
  try {
    const { userId, capsuleId } = req.params;
    const { title, content, unlockDate } = req.body;
    
    const capsule = await Capsule.findOne({ _id: capsuleId, userId });
    
    if (!capsule) {
      return res.status(404).json({ error: 'Capsule not found' });
    }
    
    const now = new Date();
    if (now >= capsule.unlockDate) {
      return res.status(403).json({ error: 'Cannot edit unlocked capsule' });
    }
    
    if (title) capsule.title = title;
    if (unlockDate) capsule.unlockDate = new Date(unlockDate);
    
    if (content) {
      const { encrypted, iv } = encrypt(content, capsule.encryptionKey);
      capsule.encryptedContent = encrypted;
      capsule.iv = iv;
    }
    
    await capsule.save();
    
    res.json({
      id: capsule._id,
      title: capsule.title,
      unlockDate: capsule.unlockDate,
      message: 'Capsule updated successfully'
    });
  } catch (error) {
    console.error('Error updating capsule:', error);
    res.status(500).json({ error: 'Failed to update capsule' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SoulTime API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`SoulTime server running on port ${PORT}`);
  console.log(`Created by Michael Semera`);
});