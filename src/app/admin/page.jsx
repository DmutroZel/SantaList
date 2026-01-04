'use client';

import { useState, useEffect, useRef } from 'react';
import LettersTable from '@/components/LettersTable';
import NotificationSound from '@/components/NotificationSound';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('admin-auth') === 'true') {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
  if (!authenticated) return;

  let previousLength = 0;

  const fetchLetters = async () => {
    try {
      const res = await fetch('/api/letters');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      // Сортуємо за датою (нові зверху)
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setLetters(data);
      setLoading(false);

      // Якщо з'явився новий лист — граємо звук
      if (previousLength > 0 && data.length > previousLength) {
        if (audioRef.current) {
          audioRef.current.play().catch(() => console.log('Audio play failed'));
        }
      }
      previousLength = data.length;
    } catch (err) {
      console.error('Error fetching letters:', err);
      setLoading(false);
    }
  };

  // Перше завантаження
  fetchLetters();

  // Оновлення кожні 10 секунд
  const interval = setInterval(fetchLetters, 10000);

  return () => clearInterval(interval);
}, [authenticated]);
  

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    
    if (password === correctPassword) {
      setAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin-auth', 'true');
      }
    } else {
      alert('❌ Неправильний пароль!');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin-auth');
    }
    setPassword('');
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-green-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg p-10 md:p-16 rounded-3xl border-4 border-yellow-400 shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎅</div>
            <h1 className="text-4xl font-bold text-yellow-300 mb-2">Адмін-панель</h1>
            <p className="text-white/80 text-lg">Вхід для Санти</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Введіть пароль" className="w-full px-6 py-4 rounded-xl text-yellow-200 text-xl font-bold outline-none border-2 border-transparent focus:border-yellow-400 transition-all"autoFocus/>
            <button type="submit"className="w-full px-8 py-4 bg-red-900 hover:bg-red-950 text-yellow-500 text-xl font-bold rounded-xl shadow-lg transition-all transform hover:scale-105">
              🔑 Увійти
            </button>
          </form>

          <p className="text-center text-white/60 text-sm mt-6">
            Дефолтний пароль: <span className="font-mono">santa2025</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-green-900 text-white p-4 md:p-10">
      <NotificationSound ref={audioRef} />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-yellow-300 mb-2">
              🎅 Адмін-панель Санти
            </h1>
            <p className="text-xl text-white/80">
              Всі листи від дітей в одному місці
            </p>
          </div>
          <button onClick={handleLogout} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg"
          >
            🚪 Вийти
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 border-yellow-400">
            <div className="text-5xl mb-2">📬</div>
            <div className="text-3xl font-bold text-yellow-300">{letters.length}</div>
            <div className="text-white/80">Всього листів</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 border-green-400">
            <div className="text-5xl mb-2">🎁</div>
            <div className="text-3xl font-bold text-green-300">
              {letters.reduce((sum, l) => sum + l.wishes.length, 0)}
            </div>
            <div className="text-white/80">Всього побажань</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 border-blue-400">
            <div className="text-5xl mb-2">👶</div>
            <div className="text-3xl font-bold text-blue-300">
              {letters.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length}
            </div>
            <div className="text-white/80">Сьогодні</div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-spin">🎄</div>
            <p className="text-2xl">Завантаження листів...</p>
          </div>
        ) : (
          <LettersTable letters={letters} />
        )}
      </div>
    </div>
  );
}