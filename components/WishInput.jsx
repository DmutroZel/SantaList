'use client';

import { useState } from 'react';

export default function WishInput({ wishes, setWishes }) {
  const [input, setInput] = useState('');

  const addWish = () => {
    if (input.trim()) {
      setWishes([...wishes, input.trim()]);
      setInput('');
    }
  };

  const removeWish = (index) => {
    setWishes(wishes.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-3">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addWish())} placeholder="Твоє бажання..."className="flex-1 h-14 bg-white/95 text-red-900 rounded-xl px-5 text-lg font-semibold outline-none border-2 border-green-600 focus:border-yellow-400 transition-all"/>
        <button type="button" onClick={addWish} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
          ➕ Додати
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
        {wishes.map((wish, i) => (
          <div key={i} className="flex items-center justify-between bg-white/90 text-red-900 p-3 rounded-xl shadow-md hover:shadow-lg transition-all">
            <span className="text-lg font-semibold flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              {wish}
            </span>
            <button onClick={() => removeWish(i)} className="text-red-600 hover:text-red-800 text-2xl font-bold hover:scale-125 transition-transform">
              ×
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.7);
        }
      `}</style>
    </div>
  );
}