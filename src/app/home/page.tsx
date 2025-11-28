'use client';

import { useState } from 'react';
import { processChatQuery } from '@/app/actions/chat';
import SectionFrame from '@/components/public/SectionFrame';
import Carousel from '@/components/Carousel';
import GalleryGrid from '@/components/GalleryGrid';

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: number;
    text: string;
    sender: string;
    resources?: Array<{ id: string; title: string; url: string | null; pdfUrl: string | null }>;
    posts?: Array<{ id: string; titulo: string; tipo: string; url: string }>;
  }>>([
    { id: 1, text: 'Hola, soy PumaHelper. ¿En qué puedo ayudarte?', sender: 'bot' }
  ]);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 1. Add user message to UI immediately
    const newUserMsg = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');

    // 2. Call the Server Action
    try {
      const response = await processChatQuery(newUserMsg.text);

      // 3. Add Bot Response to UI with resources and posts (combined in single message)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: response.reply,
          sender: 'bot',
          resources: response.data && response.data.length > 0 ? response.data : undefined,
          posts: response.posts && response.posts.length > 0 ? response.posts : undefined
        }
      ]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "Sorry, I had trouble connecting to the database.", sender: 'bot' }
      ]);
    }
  };

  return (
    <div className="relative min-h-screen pb-20">
      {/* Hero frame */}
      <section className="max-w-7xl mx-auto px-4 pt-10">
        <Carousel
          images={[
            {
              src: "/cu1(1).png",
              title: "Ciudad Universitaria",
              description: "Vista aérea de Ciudad Universitaria, UNAM.",
            },
            {
              src: "/tren-fi.jpeg",
              title: "Facultad de Ingeniería",
              description: "Acceso principal a la FI.",
            },
          ]}
        />
      </section>


      {/* Sección “Laboratorios” */}
      <GalleryGrid
        images={[
          {
            src: "/labo1.png",
            title: "Laboratorio de Termofluidos",
            description: "Laboratorio de termofluidos en edificio D.",
          },
          {
            src: "/labo2.png",
            title: "Automatización",
            description: "Laboratorio de Robótica y Automatización.",
          },
          {
            src: "/labo3.png",
            title: "Laboratorio iOS",
            description: "Laboratorio de desarrollo en iOS.",
          },
          {
            src: "/labo4.png",
            title: "Sala B",
            description: "Laboratorio de cómputo Sala B.",
          },
        ]}
      />



      {/* Chatbot */}
      <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end gap-4">

        {/* Chat Window (Apple Style) */}
        {isChatOpen && (
          <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-4">

            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-10">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">PumaHelper</h3>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full block"></span> Online
                </span>
              </div>
              {/* Close Button */}
              <button onClick={toggleChat} className="text-gray-400 hover:text-gray-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white scrollbar-thin scrollbar-thumb-gray-200">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 text-sm shadow-sm ${msg.sender === 'user'
                      ? 'bg-[#DC9B4F] text-white rounded-2xl rounded-tr-sm'
                      : 'bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
                      }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Render resources as clickable links */}
                    {msg.resources && msg.resources.length > 0 && (
                      <div className="mt-2 space-y-1.5 border-t border-gray-200 pt-2">
                        {msg.resources.map((resource) => {
                          const link = resource.pdfUrl || resource.url;
                          const isPdf = !!resource.pdfUrl;

                          // Skip if no link is available
                          if (!link) return null;

                          return (
                            <a
                              key={resource.id}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                              <span className="text-base flex-shrink-0">
                                {isPdf ? '📄' : '🔗'}
                              </span>
                              <span className="text-xs font-medium truncate">
                                {resource.title}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    )}

                    {/* Render posts as clickable links */}
                    {msg.posts && msg.posts.length > 0 && (
                      <div className="mt-2 space-y-1.5 border-t border-gray-200 pt-2">
                        {msg.posts.map((post) => (
                          <a
                            key={post.id}
                            href={post.url}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            <span className="text-base flex-shrink-0">
                              📰
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-medium truncate block">
                                {post.titulo}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {post.tipo}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-gray-50 rounded-full px-2 py-1 border border-gray-200 focus-within:border-gray-300 transition-colors">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribe un mensaje"
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-700 px-3 py-2 placeholder-gray-400 outline-none"
                />
                <button
                  type="submit"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#DC9B4F] text-white hover:brightness-110 transition-all shadow-sm flex-shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Toggle Button (Floating) */}
        {!isChatOpen && (
          <button
            onClick={toggleChat}
            className="w-14 h-14 rounded-full bg-[#DC9B4F] text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}