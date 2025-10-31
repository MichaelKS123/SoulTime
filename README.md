# 🕰️ SoulTime - Digital Time Capsule

**Created by Michael Semera**

SoulTime is a modern digital time capsule application that allows users to preserve memories, messages, and media files that unlock on a future date. Built with security-first architecture featuring AES-256 encryption.

---

## ✨ Features

- 🔐 **Secure Encryption**: AES-256-CBC encryption for all capsule content
- ⏰ **Time-Locked Content**: Set future unlock dates for your capsules
- 📝 **Multiple Content Types**: Text messages, images, audio, and video
- 🎨 **Beautiful UI**: Modern gradient design with smooth animations
- ⚡ **Real-Time Countdown**: Live timer showing time until unlock
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🗄️ **Persistent Storage**: MongoDB database for reliable data storage
- 🔒 **User Privacy**: Content encrypted before storage, decrypted only when unlocked

---

## 🏗️ Tech Stack

### Front-End
- **React** - Interactive UI components
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Modern icon library
- **CSS Animations** - Smooth transitions and effects

### Back-End
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Security
- **AES-256-CBC** - Military-grade encryption
- **Crypto (Node.js)** - Built-in cryptography module
- **Unique IV per capsule** - Enhanced security

### File Storage
- **Multer** - File upload handling
- **Local Storage** - Development environment
- *(AWS S3 ready)* - Production deployment option

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 🚀 Installation

### 1. Clone or Download the Repository

If you have git:
```bash
git clone https://github.com/yourusername/soultime.git
cd soultime
```

Or download and extract the ZIP file, then navigate to the folder.

### 2. Backend Setup

```bash
# Create backend directory structure
mkdir -p backend/uploads
cd backend

# Create package.json
npm init -y
```

**Install backend dependencies:**
```bash
npm install express mongoose cors dotenv multer
npm install --save-dev nodemon
```

**Create the main server file** `server.js` with the backend code provided.

**Create `.env` file** in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/soultime
NODE_ENV=development
```

**Update `package.json`** scripts section:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### 3. Frontend Setup

```bash
# Navigate to root directory and create React app
cd ..
npx create-react-app frontend
cd frontend

# Install dependencies
npm install lucide-react
```

**Install Tailwind CSS:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configure Tailwind** - Update `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Update `src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Create the SoulTime component** in `src/components/SoulTime.jsx` with the frontend code provided.

**Update `src/App.js`:**
```javascript
import SoulTime from './components/SoulTime';

function App() {
  return <SoulTime />;
}

export default App;
```

**Create `.env` file** in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎮 Running the Application

### Option 1: Development Mode

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
✅ Backend running on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```
✅ Frontend running on `http://localhost:3000`

### Option 2: Production Build

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Serve static files from backend:**
```javascript
// Add to server.js
app.use(express.static(path.join(__dirname, '../frontend/build')));
```

---

## 📦 Project Structure

```
soultime/
├── backend/
│   ├── uploads/              # Uploaded files storage
│   ├── server.js            # Main Express server
│   ├── package.json         # Backend dependencies
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── SoulTime.jsx # Main React component
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json         # Frontend dependencies
│   ├── tailwind.config.js
│   └── .env
│
└── README.md                # This file
```

---

## 🔌 API Endpoints

### Create a Time Capsule
```http
POST /api/capsules
Content-Type: application/json

{
  "userId": "user123",
  "title": "My First Capsule",
  "content": "Hello future me!",
  "unlockDate": "2026-01-01T00:00:00",
  "type": "text"
}
```

**Response:**
```json
{
  "id": "capsule_id",
  "title": "My First Capsule",
  "unlockDate": "2026-01-01T00:00:00Z",
  "createdAt": "2025-10-31T12:00:00Z",
  "type": "text",
  "locked": true
}
```

### Get All User Capsules
```http
GET /api/capsules/:userId
```

**Response:**
```json
[
  {
    "id": "capsule_id",
    "title": "My First Capsule",
    "unlockDate": "2026-01-01T00:00:00Z",
    "createdAt": "2025-10-31T12:00:00Z",
    "type": "text",
    "locked": true,
    "content": null
  }
]
```

### Get Specific Capsule (If Unlocked)
```http
GET /api/capsules/:userId/:capsuleId
```

**Response (Unlocked):**
```json
{
  "id": "capsule_id",
  "title": "My First Capsule",
  "content": "Hello future me!",
  "unlockDate": "2026-01-01T00:00:00Z",
  "createdAt": "2025-10-31T12:00:00Z",
  "type": "text",
  "locked": false
}
```

**Response (Still Locked):**
```json
{
  "error": "Capsule is still locked",
  "unlockDate": "2026-01-01T00:00:00Z"
}
```

### Update Capsule (Only if Locked)
```http
PUT /api/capsules/:userId/:capsuleId
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "unlockDate": "2026-06-01T00:00:00"
}
```

### Delete Capsule
```http
DELETE /api/capsules/:userId/:capsuleId
```

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "SoulTime API is running"
}
```

---

## 🔐 Security Features

### 1. AES-256-CBC Encryption
Every capsule's content is encrypted using the Advanced Encryption Standard with 256-bit keys in Cipher Block Chaining mode.

```javascript
// Encryption process:
1. Generate unique 256-bit encryption key
2. Generate random Initialization Vector (IV)
3. Encrypt content using key + IV
4. Store encrypted content, key, and IV separately
```

### 2. Time-Based Access Control
```javascript
// Server validates unlock date before decryption
if (currentDate < unlockDate) {
  return "Access Denied - Capsule Still Locked";
}
// Only then decrypt and return content
```

### 3. Secure Key Management
- Each capsule has a unique encryption key
- Keys are generated using cryptographically secure random bytes
- Keys are never exposed to the client before unlock date

### 4. Input Validation & Sanitization
- File type restrictions (images, audio, video only)
- File size limits (50MB default)
- Request validation middleware
- XSS protection through input sanitization

---

## 🎨 Customization Guide

### Change the Color Theme

**Modify background gradient** in `SoulTime.jsx`:
```jsx
// Find this line:
className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"

// Change to your colors:
className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-green-900"
```

**Modify button colors:**
```jsx
// Find:
className="bg-gradient-to-r from-purple-500 to-pink-500"

// Change to:
className="bg-gradient-to-r from-blue-500 to-cyan-500"
```

### Adjust File Size Limits

In `backend/server.js`:
```javascript
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Change to 100MB
  // limits: { fileSize: 100 * 1024 * 1024 }
});
```

### Change Encryption Algorithm

In `backend/server.js` (advanced users):
```javascript
// Current:
const ALGORITHM = 'aes-256-cbc';

// Alternative options:
// const ALGORITHM = 'aes-256-gcm'; // More secure
// const ALGORITHM = 'aes-192-cbc'; // Less overhead
```

### Modify Countdown Display

In `SoulTime.jsx`, find the `getTimeRemaining` function:
```javascript
if (days > 0) return `${days}d ${hours}h ${minutes}m`;
// Customize format as needed
```

---

## 🚀 Deployment

### MongoDB Setup (Required)

#### Option A: Local MongoDB
```bash
# Install MongoDB
# macOS with Homebrew:
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB:
brew services start mongodb-community

# Use in .env:
MONGODB_URI=mongodb://localhost:27017/soultime
```

#### Option B: MongoDB Atlas (Recommended for Production)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (or specific IPs)
5. Get connection string
6. Update `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/soultime?retryWrites=true&w=majority
```

### Backend Deployment - Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
cd backend
heroku create soultime-api

# Set environment variables
heroku config:set MONGODB_URI="your_mongodb_atlas_connection_string"
heroku config:set NODE_ENV=production

# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

### Frontend Deployment - Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Update .env with production API URL
REACT_APP_API_URL=https://soultime-api.herokuapp.com/api

# Build and deploy
cd frontend
npm run build
vercel --prod
```

### Frontend Deployment - Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=build

# Set environment variables in Netlify dashboard:
# REACT_APP_API_URL = https://soultime-api.herokuapp.com/api
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
**Problem:** `MongooseError: connect ECONNREFUSED`

**Solutions:**
1. Ensure MongoDB is running: `mongod` or `brew services start mongodb-community`
2. Check connection string in `.env`
3. For Atlas: Verify IP whitelist and credentials

### Port Already in Use
**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9

# Or use a different port in .env
PORT=5001
```

### CORS Errors
**Problem:** `Access to fetch blocked by CORS policy`

**Solution:** Verify backend `server.js` has:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### File Upload Errors
**Problem:** Files not uploading

**Solutions:**
1. Create uploads directory: `mkdir backend/uploads`
2. Check file size: Must be under 50MB
3. Verify file type: Only images, audio, video allowed
4. Check permissions: `chmod 755 backend/uploads`

### React Build Errors
**Problem:** Build fails with Tailwind errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Capsule Won't Unlock
**Problem:** Capsule past unlock date but still locked

**Solution:** Server uses server time, not client time. Check:
```bash
# In Node.js console:
node
> new Date()
# Compare with your unlock date
```

---

## 📦 Complete Package.json Files

### Backend `package.json`
```json
{
  "name": "soultime-backend",
  "version": "1.0.0",
  "description": "SoulTime Digital Time Capsule Backend by Michael Semera",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": ["time-capsule", "encryption", "mongodb", "express"],
  "author": "Michael Semera",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.4.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

### Frontend `package.json`
```json
{
  "name": "soultime-frontend",
  "version": "1.0.0",
  "description": "SoulTime Digital Time Capsule Frontend by Michael Semera",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "lucide-react": "^0.263.1",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.3",
    "postcss": "^8.4.27",
    "autoprefixer": "^10.4.14"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": ["react-app"]
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
```

---

## 🤝 Contributing

Contributions make the open-source community amazing! Any contributions are **greatly appreciated**.

### How to Contribute:

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Coding Guidelines:
- Follow existing code style
- Write clear commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** - see below for details:

```
MIT License

Copyright (c) 2025 Michael Semera

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Author

**Michael Semera**

- 💼 LinkedIn: [www.linkedin.com/in/michael-semera-586737295](https://www.linkedin.com/in/michael-semera-586737295/)
- 🐙 GitHub: [@MichaelKS123](https://github.com/MichaelKS123)
- 📧 Email: michaelsemera15@gmail.com

---

## 🙏 Acknowledgments

- **Inspiration**: Traditional time capsules and the desire to preserve digital memories
- **Design**: Modern web design trends and glassmorphism aesthetics
- **Security**: Best practices from OWASP and cryptography standards
- **Community**: Open-source contributors and developers worldwide
- **Technologies**: React, Node.js, MongoDB, Express, and all the amazing tools that make this possible

---

## 🔮 Future Roadmap

### Phase 1 - Core Features ✅
- [x] Time-locked capsules
- [x] AES-256 encryption
- [x] Real-time countdown
- [x] Beautiful UI
- [x] File upload support

### Phase 2 - Enhanced Features (Coming Soon)
- [ ] User authentication (JWT/OAuth)
- [ ] Email notifications on unlock
- [ ] Share capsules with friends
- [ ] Multiple recipient support
- [ ] In-browser voice recording
- [ ] Photo/video capture from camera
- [ ] Social media integration

### Phase 3 - Advanced Features
- [ ] End-to-end encryption option
- [ ] Blockchain timestamp verification
- [ ] NFT capsule ownership
- [ ] Multi-language support (i18n)
- [ ] Dark/Light theme toggle
- [ ] Mobile apps (iOS/Android)
- [ ] Desktop apps (Electron)

### Phase 4 - Enterprise Features
- [ ] Team/organization capsules
- [ ] Admin dashboard
- [ ] Analytics and insights
- [ ] Backup and restore
- [ ] API rate limiting
- [ ] Advanced security auditing
- [ ] Compliance features (GDPR, etc.)

---

## 📊 Performance Optimization

### Backend Optimization
- **Database Indexing**: Add indexes on `userId` and `unlockDate`
  ```javascript
  capsuleSchema.index({ userId: 1, unlockDate: 1 });
  ```
- **Caching**: Implement Redis for frequently accessed data
- **Rate Limiting**: Prevent abuse with express-rate-limit
- **Compression**: Enable gzip compression
  ```javascript
  const compression = require('compression');
  app.use(compression());
  ```

### Frontend Optimization
- **Code Splitting**: Lazy load components
  ```javascript
  const SoulTime = React.lazy(() => import('./components/SoulTime'));
  ```
- **Image Optimization**: Compress and use WebP format
- **CDN**: Host static assets on CDN
- **Service Worker**: Enable offline functionality

---

## 🔒 Security Best Practices

### Production Checklist
- [ ] Use HTTPS everywhere
- [ ] Enable MongoDB authentication
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Sanitize all user inputs
- [ ] Use helmet.js for HTTP headers
- [ ] Enable CORS only for trusted domains
- [ ] Regular security audits (`npm audit`)
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Implement proper error handling
- [ ] Add logging and monitoring
- [ ] Backup database regularly
- [ ] Use strong JWT secrets
- [ ] Implement account lockout after failed attempts

---

## 📞 Contacts, Support & Help

For questions, suggestions, or collaboration opportunities:
- Open an issue on GitHub
- Email: michaelsemera15@gmail.com
- LinkedIn: [Michael Semera](https://www.linkedin.com/in/michael-semera-586737295/)

For issues or questions:
- Review this documentation
- Check troubleshooting section
- Ensure proper privileges and setup
- Verify libpcap installation


### Getting Help

**Documentation**: This README covers most scenarios, but if you need more help:

1. **Check Existing Issues**: [GitHub Issues](https://github.com/yourusername/soultime/issues)
2. **Stack Overflow**: Tag questions with `soultime` and `time-capsule`
3. **Email Support**: support@soultime.app
4. **Community Discord**: [Join our Discord](https://discord.gg/soultime)

### Reporting Bugs

When reporting bugs, please include:
- Operating system and version
- Node.js version (`node --version`)
- Error messages and stack traces
- Steps to reproduce
- Expected vs actual behavior

### Feature Requests

We love hearing your ideas! Submit feature requests:
- As GitHub Issues with the `enhancement` label
- Via email to features@soultime.app
- In our Discord community

---

## 💡 Tips & Tricks

### For Users
1. **Test with short unlock times** (1 minute) before creating long-term capsules
2. **Backup important messages** externally until you're comfortable
3. **Use descriptive titles** to remember capsule contents
4. **Set reminders** in your calendar for unlock dates

### For Developers
1. **Use nodemon** for auto-restart during development
2. **Enable MongoDB logging** to debug queries
3. **Use Postman** or Insomnia to test API endpoints
4. **Implement unit tests** with Jest for reliability
5. **Use ESLint and Prettier** for code consistency

---

## 🎓 Learning Resources

### Understanding Time Capsules
- [The Science of Nostalgia](https://example.com/nostalgia)
- [Digital Preservation Best Practices](https://example.com/preservation)

### Technical Skills
- [React Documentation](https://react.dev/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MongoDB University](https://university.mongodb.com/)
- [Web Cryptography API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

## 🌟 Star History

If you find SoulTime helpful, please consider giving it a star on GitHub! ⭐

```bash
# Check out the project
git clone https://github.com/yourusername/soultime.git

# Give it a star
# Click the ⭐ button on GitHub
```

---

## 📈 Project Stats

- **Lines of Code**: ~2,000
- **Languages**: JavaScript, CSS, HTML
- **Dependencies**: 15+ packages
- **Supported Platforms**: Web, Mobile (via browser)
- **Encryption**: AES-256-CBC
- **Database**: MongoDB
- **License**: MIT

---

**Made with ❤️ by Michael Semera**

*Preserve your memories, unlock your future.*

---

### Quick Links
- 📖 [Documentation](#-table-of-contents)
- 🚀 [Get Started](#-installation)
- 🔐 [Security](#-security-features)
- 🚢 [Deploy](#-deployment)
- 🤝 [Contribute](#-contributing)
- 📞 [Support](#-support--help)

---

**Version**: 1.0.0  
**Last Updated**: October 31, 2025  

**Status**: Production Ready ✅
