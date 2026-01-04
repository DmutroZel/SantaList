'use client';

import { useState } from 'react';
import LetterModal from './LetterModal';

export default function LettersTable({ letters }) {
  const [selectedLetter, setSelectedLetter] = useState(null);

  return (
    <>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            📬 Листи до Санти 
            <span className="bg-yellow-400 text-red-900 px-4 py-1 rounded-full text-2xl">
              {letters.length}
            </span>
          </h2>
        </div>

        {letters.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl text-white/70">🎄 Поки немає листів...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-4 text-lg font-semibold text-yellow-300">Ім'я</th>
                  <th className="text-left py-4 px-4 text-lg font-semibold text-yellow-300">Телефон</th>
                  <th className="text-left py-4 px-4 text-lg font-semibold text-yellow-300">Місто</th>
                  <th className="text-left py-4 px-4 text-lg font-semibold text-yellow-300">Бажань</th>
                  <th className="text-left py-4 px-4 text-lg font-semibold text-yellow-300">Дата</th>
                  <th className="text-center py-4 px-4 text-lg font-semibold text-yellow-300">Дії</th>
                </tr>
              </thead>
              <tbody>
                {letters.map((letter, index) => (
                  <tr key={letter._id || index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-lg font-semibold">{letter.name}</td>
                    <td className="py-4 px-4 text-lg">{letter.phone}</td>
                    <td className="py-4 px-4 text-lg">{letter.address.city}</td>
                    <td className="py-4 px-4 text-lg text-center">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full font-bold">
                        {letter.wishes.length}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-white/70">
                      {new Date(letter.createdAt).toLocaleDateString('uk-UA')}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button onClick={() => setSelectedLetter(letter)} className="bg-yellow-400 hover:bg-yellow-500 text-red-900 font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                        📖 Відкрити
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <LetterModal 
        letter={selectedLetter} 
        onClose={() => setSelectedLetter(null)} 
      />
    </>
  );
}