'use client';

import { useState, useEffect, useRef } from 'react';
import WishInput from '@/components/WishInput';
import Santa from '@/components/Santa';

export default function Home() {
  const [slide, setSlide] = useState(0);           // 0 = форма, 1 = чат з Google AI (в ролі Санти)
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [wishes, setWishes] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSantaClick = () => {
    setSlide(1);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setLoading(true);

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      const data = await res.json();

         if (res.ok) {
       setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);  // ← reply, а не response
        }else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Ой-ой, мої ельфи щось наплутали з магією... Спробуй ще раз!' },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Звʼязок з Північним полюсом перервався... Спробуй пізніше!' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      address: {
        city: formData.get('city'),
        street: formData.get('street'),
        house: formData.get('house'),
        apartment: formData.get('apartment') || '',
        elevator: formData.get('elevator') === 'on',
      },
      wishes,
    };

    try {
      const res = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
        e.target.reset();
        setWishes([]);
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Помилка відправки листа. Спробуйте ще раз.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 text-gray-800 relative overflow-auto ">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-pulse">❄️</div>
        <div className="absolute top-40 right-20 text-4xl opacity-30 animate-bounce">❄️</div>
        <div className="absolute bottom-32 left-32 text-5xl opacity-25">✨</div>
        <div className="absolute top-60 right-40 text-3xl opacity-20">⭐</div>
      </div>

      <Santa onSantaClick={handleSantaClick} slide={slide} />

      <div className="relative">
        <div
          className="flex h-full"
          style={{
            transform: `translateX(-${slide * 100}%)`,
            transition: 'transform 700ms cubic-bezier(.22,.9,.32,1)',
            willChange: 'transform',
          }}
        >


          <section
            className="w-screen flex-shrink-0 flex items-center justify-center px-4 md:px-8"
            style={{
              transition: 'opacity 600ms ease, transform 600ms ease',
              opacity: slide === 0 ? 1 : 0.7,
              transform: slide === 0 ? 'translateX(0) scale(1)' : 'translateX(-10px) scale(0.98)',
            }}
          >
            <div className="max-w-7xl mx-auto w-full relative z-10">

              <div className="text-center mb-8 md:mb-12">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 text-red-600 drop-shadow-2xl">
                  Лист до Санти
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 font-medium">
                  Напиши свої побажання і Санта обов'язково їх побачить!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                <form onSubmit={handleSubmit} id="main-form" className="space-y-6">
                  <div className="bg-white/80 w-full max-w-md md:max-w-[600px] mx-auto md:mx-0 backdrop-blur-xl border-2 border-red-200 rounded-3xl p-5 md:p-10 shadow-2xl">
                    <h2 className="text-3xl font-bold mb-6 text-red-600 text-center">
                      Твої дані
                    </h2>

                    <input 
                      name="name" 
                      placeholder="Твоє ім'я" 
                      required 
                      className="w-full h-12 md:h-16 bg-gradient-to-r from-red-50 to-pink-50 text-gray-800 rounded-xl px-4 md:px-6 text-lg md:text-xl font-semibold shadow-lg mb-4 outline-none border-2 border-red-200 focus:border-red-400 transition-all hover:shadow-xl hover:scale-[1.02]"
                    />

                    <input 
                      name="phone" 
                      placeholder="Твій телефон" 
                      required 
                      type="tel"
                      className="w-full h-12 md:h-16 bg-gradient-to-r from-red-50 to-pink-50 text-gray-800 rounded-xl px-4 md:px-6 text-lg md:text-xl font-semibold shadow-lg mb-6 outline-none border-2 border-red-200 focus:border-red-400 transition-all hover:shadow-xl hover:scale-[1.02]"
                    />

                    <div className="my-6 text-center font-bold text-2xl text-red-600">
                      Адреса доставки
                    </div>

                    <input 
                      name="city" 
                      placeholder="Місто" 
                      required 
                      className="w-full h-12 md:h-14 bg-blue-50 text-gray-800 rounded-xl px-4 md:px-5 text-base md:text-lg font-semibold shadow-lg mb-3 outline-none border-2 border-blue-200 focus:border-blue-400 transition-all hover:scale-[1.02] hover:shadow-lg"
                    />

                    <input 
                      name="street" 
                      placeholder="Вулиця" 
                      required 
                      className="w-full h-12 md:h-14 bg-blue-50 text-gray-800 rounded-xl px-4 md:px-5 text-base md:text-lg font-semibold shadow-lg mb-3 outline-none border-2 border-blue-200 focus:border-blue-400 transition-all hover:scale-[1.02] hover:shadow-lg"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <input 
                        name="house" 
                        placeholder="Будинок" 
                        required 
                        className="h-12 md:h-14 bg-blue-50 text-gray-800 rounded-xl px-4 md:px-5 text-base md:text-lg font-semibold shadow-lg outline-none border-2 border-blue-200 focus:border-blue-400 transition-all hover:border-indigo-300 hover:shadow-md" 
                      />
                      <input 
                        name="apartment" 
                        placeholder="Квартира" 
                        className="h-12 md:h-14 bg-blue-50 text-gray-800 rounded-xl px-4 md:px-5 text-base md:text-lg font-semibold shadow-lg outline-none border-2 border-blue-200 focus:border-blue-400 transition-all hover:border-indigo-300 hover:shadow-sm" 
                      />
                    </div>

                    <label className="flex items-center gap-4 bg-gradient-to-r from-green-100 to-emerald-100 p-4 md:p-5 rounded-xl cursor-pointer hover:from-green-200 hover:to-emerald-200 transition-all border-2 border-green-300">
                      <input type="checkbox" name="elevator" className="w-6 h-6 md:w-8 md:h-8 accent-green-600 cursor-pointer" />
                      <span className="text-lg md:text-2xl font-bold text-gray-800">Є ліфт</span>
                    </label>
                  </div>
                </form>

                {/* ПРАВА КОЛОНКА — БАЖАННЯ */}
                <div className="space-y-6">
                  <div className="bg-white/80 w-full max-w-md md:max-w-[600px] mx-auto md:mx-0 backdrop-blur-xl border-2 border-blue-200 rounded-3xl p-5 md:p-10 shadow-2xl">
                    <h2 className="text-3xl font-bold mb-6 text-red-600 text-center">
                      Твої бажання
                    </h2>

                    <WishInput wishes={wishes} setWishes={setWishes} />

                    <button
                      type="submit"
                      form="main-form"
                      disabled={formLoading || wishes.length === 0}
                      className="w-full mt-6 py-3 md:py-5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-xl md:text-2xl font-bold rounded-xl shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {formLoading ? 'Відправляємо...' : 'Відправити листа Санті!'}
                    </button>

                    {success && (
                      <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-xl text-center animate-bounce shadow-xl">
                        <p className="text-2xl md:text-3xl font-bold">
                          Лист успішно відправлено!
                        </p>
                        <p className="text-lg mt-2">Санта вже читає твої побажання!</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </section>

          {slide === 1 && (
            <section className="w-screen flex-shrink-0 flex items-center justify-center px-8 py-12">
              <div className="w-full max-w-4xl h-[80vh] flex flex-col">
                <div className="bg-white/80 backdrop-blur-xl border-2 border-red-200 rounded-3xl shadow-2xl flex flex-col h-full">


                  <div className="flex items-center gap-4 p-6 border-b-2 border-red-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-4xl shadow-lg">
                      🎅
                    </div>
                    <h3 className="text-4xl font-bold text-red-600">Санта Клаус</h3>
                  </div>


                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-lg px-6 py-4 rounded-2xl shadow-lg ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                              : 'bg-gradient-to-r from-red-100 to-pink-100 text-gray-800'
                          }`}
                        >
                          <p className="text-xl leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="px-6 py-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl shadow-lg">
                          <p className="text-xl text-gray-600">Санта думає... ✨</p>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-6 border-t-2 border-red-100">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Напиши Санті..."
                        className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 text-xl outline-none border-2 border-gray-300 focus:border-red-400 transition-all"
                        disabled={loading}
                        autoFocus
                      />
                      <button
                        onClick={sendMessage}
                        disabled={loading || !inputValue.trim()}
                        className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold text-xl rounded-2xl shadow-lg transition-all disabled:opacity-50"
                      >
                        Надіслати
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSlide(0)}
                  className="mt-8 text-xl text-gray-600 hover:text-red-600 underline transition font-medium self-center"
                >
                  ← Повернутися до листа
                </button>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}