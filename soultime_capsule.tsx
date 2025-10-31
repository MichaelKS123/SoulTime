import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Plus, Calendar, FileText, Mic, Image, Clock, Trash2 } from 'lucide-react';

const SoulTime = () => {
  const [capsules, setCapsules] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newCapsule, setNewCapsule] = useState({
    title: '',
    message: '',
    unlockDate: '',
    type: 'text'
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadCapsules();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadCapsules = async () => {
    try {
      const result = await window.storage.get('soultime_capsules');
      if (result && result.value) {
        setCapsules(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No existing capsules found');
    }
  };

  const saveCapsules = async (caps) => {
    try {
      await window.storage.set('soultime_capsules', JSON.stringify(caps));
      setCapsules(caps);
    } catch (error) {
      console.error('Error saving capsules:', error);
    }
  };

  const encrypt = (text) => {
    return btoa(unescape(encodeURIComponent(text)));
  };

  const decrypt = (encrypted) => {
    return decodeURIComponent(escape(atob(encrypted)));
  };

  const createCapsule = () => {
    if (!newCapsule.title || !newCapsule.unlockDate) return;

    const capsule = {
      id: Date.now(),
      title: newCapsule.title,
      encryptedMessage: encrypt(newCapsule.message),
      unlockDate: new Date(newCapsule.unlockDate).getTime(),
      createdAt: Date.now(),
      type: newCapsule.type,
      locked: true
    };

    const updated = [...capsules, capsule];
    saveCapsules(updated);
    setShowCreate(false);
    setNewCapsule({ title: '', message: '', unlockDate: '', type: 'text' });
  };

  const deleteCapsule = (id) => {
    const updated = capsules.filter(c => c.id !== id);
    saveCapsules(updated);
  };

  const isUnlocked = (unlockDate) => {
    return currentTime.getTime() >= unlockDate;
  };

  const getTimeRemaining = (unlockDate) => {
    const diff = unlockDate - currentTime.getTime();
    if (diff <= 0) return 'Unlocked!';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-2 tracking-tight">
            SoulTime
          </h1>
          <p className="text-purple-200 text-lg">Preserve your memories for the future</p>
          <p className="text-purple-300 text-sm mt-2">by Michael Semera</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowCreate(true)}
            className="w-full mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-2xl"
          >
            <Plus size={24} />
            Create New Time Capsule
          </button>

          {showCreate && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-purple-500">
                <h2 className="text-3xl font-bold text-white mb-6">Create Time Capsule</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-purple-200 mb-2 font-medium">Title</label>
                    <input
                      type="text"
                      value={newCapsule.title}
                      onChange={(e) => setNewCapsule({...newCapsule, title: e.target.value})}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="Give your capsule a meaningful name..."
                    />
                  </div>

                  <div>
                    <label className="block text-purple-200 mb-2 font-medium">Message</label>
                    <textarea
                      value={newCapsule.message}
                      onChange={(e) => setNewCapsule({...newCapsule, message: e.target.value})}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 h-32"
                      placeholder="Write a message to your future self..."
                    />
                  </div>

                  <div>
                    <label className="block text-purple-200 mb-2 font-medium">Unlock Date</label>
                    <input
                      type="datetime-local"
                      value={newCapsule.unlockDate}
                      onChange={(e) => setNewCapsule({...newCapsule, unlockDate: e.target.value})}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={createCapsule}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
                    >
                      Create Capsule
                    </button>
                    <button
                      onClick={() => setShowCreate(false)}
                      className="flex-1 bg-slate-600 text-white py-3 rounded-xl font-semibold hover:bg-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6">
            {capsules.length === 0 ? (
              <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-3xl p-12 text-center border border-purple-500">
                <Lock size={64} className="mx-auto text-purple-400 mb-4" />
                <p className="text-purple-200 text-xl">No time capsules yet. Create your first one!</p>
              </div>
            ) : (
              capsules.map((capsule) => {
                const unlocked = isUnlocked(capsule.unlockDate);
                return (
                  <div
                    key={capsule.id}
                    className={`bg-gradient-to-br ${
                      unlocked 
                        ? 'from-emerald-800 to-teal-900 border-emerald-400' 
                        : 'from-slate-800 to-slate-900 border-purple-500'
                    } rounded-3xl p-6 border-2 backdrop-blur-lg shadow-2xl transform transition-all hover:scale-102`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {unlocked ? (
                          <Unlock className="text-emerald-400" size={32} />
                        ) : (
                          <Lock className="text-purple-400" size={32} />
                        )}
                        <div>
                          <h3 className="text-2xl font-bold text-white">{capsule.title}</h3>
                          <p className="text-purple-200 text-sm">
                            Created: {new Date(capsule.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteCapsule(capsule.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="bg-black bg-opacity-30 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-2 text-purple-200 mb-2">
                        <Clock size={20} />
                        <span className="font-medium">
                          {unlocked ? 'Unlocked!' : `Unlocks in: ${getTimeRemaining(capsule.unlockDate)}`}
                        </span>
                      </div>
                      <p className="text-purple-300 text-sm">
                        Unlock Date: {new Date(capsule.unlockDate).toLocaleString()}
                      </p>
                    </div>

                    {unlocked ? (
                      <div className="bg-black bg-opacity-30 rounded-xl p-4">
                        <p className="text-white whitespace-pre-wrap leading-relaxed">
                          {decrypt(capsule.encryptedMessage)}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-black bg-opacity-30 rounded-xl p-8 text-center">
                        <Lock size={48} className="mx-auto text-purple-400 mb-3 opacity-50" />
                        <p className="text-purple-300 italic">
                          This capsule is sealed until {new Date(capsule.unlockDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoulTime;