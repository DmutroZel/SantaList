'use client';

export default function LetterModal({ letter, onClose }) {
  if (!letter) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gradient-to-br from-red-50 to-green-50 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-red-900 flex items-center gap-2 ">
            📧 Лист від {letter.name}
          </h2>
          <button onClick={onClose} className="text-4xl text-red-600 hover:text-red-800 hover:rotate-90 transition-all duration-300">
            ×
          </button>
        </div>

        <div className="space-y-4 text-red-900">
          <div className="bg-white/80 p-4 rounded-xl shadow-md">
            <p className="font-semibold text-lg mb-2">📞 Контакти:</p>
            <p className="text-lg">{letter.phone}</p>
          </div>

          <div className="bg-white/80 p-4 rounded-xl shadow-md">
            <p className="font-semibold text-lg mb-2">📍 Адреса доставки:</p>
            <p className="text-lg">{letter.address.city}, {letter.address.street}</p>
            <p className="text-lg">
              Будинок: {letter.address.house}
              {letter.address.apartment && `, Кв. ${letter.address.apartment}`}
            </p>
            <p className="text-lg flex items-center gap-2 mt-2">
              {letter.address.elevator ? '✅' : '❌'} 
              {letter.address.elevator ? 'Є ліфт' : 'Немає ліфту'}
            </p>
          </div>

          <div className="bg-white/80 p-4 rounded-xl shadow-md">
            <p className="font-semibold text-lg mb-3">🎁 Список бажань:</p>
            <ul className="space-y-2">
              {letter.wishes.map((wish, i) => (
                <li key={i} className="text-lg flex items-start gap-2">
                  <span className="text-green-600 font-bold">{i + 1}.</span>
                  <span>{wish}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/80 p-4 rounded-xl shadow-md">
            <p className="text-sm text-gray-600">
              📅 Отримано: {new Date(letter.createdAt).toLocaleString('uk-UA')}
            </p>
          </div>
        </div>

        <button onClick={onClose} className="w-full mt-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all">
          Закрити
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}