import React, { useState } from 'react';
import { X, Save, Key } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveToken: (token: string) => void;
  initialToken: string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, onSaveToken, initialToken }) => {
  const [token, setToken] = useState(initialToken);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSaveToken(token);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neo-yellow/90 backdrop-blur-none"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white border-4 border-neo-black shadow-neo-lg transform transition-all animate-slide-up">
        
        <div className="relative p-8">
          <div className="flex justify-between items-center mb-8 border-b-4 border-neo-black pb-4">
            <h2 className="text-3xl font-display font-bold text-neo-black uppercase flex items-center gap-3">
              <Key className="text-neo-black" size={32} />
              Config
            </h2>
            <button 
              onClick={onClose}
              className="p-2 border-4 border-transparent hover:border-neo-black hover:bg-neo-pink transition-all text-neo-black"
            >
              <X size={24} strokeWidth={3} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-bold text-neo-black mb-2 uppercase">API Token</label>
              <div className="relative">
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your secret..."
                  className="w-full bg-gray-100 border-4 border-neo-black px-4 py-4 text-neo-black font-mono placeholder-gray-500 focus:outline-none focus:bg-white focus:shadow-neo transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className={`w-full py-4 font-black text-lg uppercase flex items-center justify-center gap-2 border-4 border-neo-black shadow-neo transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                isSaved 
                ? 'bg-neo-green text-neo-black' 
                : 'bg-neo-black text-white hover:bg-white hover:text-neo-black'
              }`}
            >
              {isSaved ? 'SAVED!' : 'SAVE SETTINGS'}
              {!isSaved && <Save size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;

