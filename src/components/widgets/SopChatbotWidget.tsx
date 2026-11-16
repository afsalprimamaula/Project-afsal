'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, MessageSquare, Send, Bot, User, Sparkles, ChevronDown } from 'lucide-react';
import { sopFaq } from '@/data/kopmaData';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'bot',
  content:
    'Halo! 👋 Saya asisten SOP Kopma Unpas. Saya siap menjawab pertanyaan seputar:\n\n• Cara mendaftar anggota\n• Jenis-jenis simpanan (Pokok, Wajib, Sukarela)\n• Sistem titip jual konsinyasi\n• Jam operasional & lokasi\n• Pemesanan jaket PDH / korsa konveksi\n• Pembagian SHU (Sisa Hasil Usaha)\n\nSilakan pilih topik cepat di bawah atau ketik pertanyaan Anda! 😊',
  timestamp: new Date(),
};

const QUICK_QUESTIONS = [
  'Cara daftar anggota?',
  'Apa itu Simpanan Pokok?',
  'Jam buka sekretariat?',
  'Pesan jaket PDH?',
  'Apa itu konsinyasi?',
  'Cara dapat SHU?',
];

function findAnswer(query: string): string {
  const q = query.toLowerCase().trim();

  let bestMatch: { entry: (typeof sopFaq)[0]; score: number } | null = null;

  for (const entry of sopFaq) {
    const score = entry.keywords.reduce((acc, kw) => {
      return acc + (q.includes(kw.toLowerCase()) ? 1 : 0);
    }, 0);

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { entry, score };
    }
  }

  if (bestMatch) {
    return bestMatch.entry.answer;
  }

  return `Maaf, saya belum menemukan jawaban spesifik untuk pertanyaan tersebut. 🙏\n\nUntuk informasi lebih lanjut, silakan hubungi saluran resmi kami:\n📧 Email: kopmaunpas.bdg@gmail.com\n📲 Line: @nku4688t\n\nAtau kunjungi sekretariat kami di Kampus II Tamansari (Senin–Jumat, 08.00–16.00 WIB).`;
}

function formatMessage(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return (
      <span key={i}>
        <span dangerouslySetInnerHTML={{ __html: formatted }} />
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function SopChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = findAnswer(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 700 + Math.random() * 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput('');
  };

  return (
    <>
      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-20 sm:bottom-24 sm:right-6 sm:left-auto sm:w-[380px] z-50 h-[480px] max-h-[calc(100svh-100px)] shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 flex flex-col bg-white animate-in slide-in-from-bottom-4 duration-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-green-950 to-green-900 px-4 py-3.5 flex items-center gap-3 flex-shrink-0 text-white">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden flex-shrink-0 shadow border border-white/30 bg-white">
              <Image
                src="/images/logo-kopma.jpg"
                alt="Logo Kopma"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-xs sm:text-sm leading-tight">
                Asisten SOP Kopma Unpas
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-300 text-[10px] sm:text-[11px]">
                  Online • Siap Menjawab
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors text-[10px] sm:text-xs font-medium"
                title="Reset Obrolan"
              >
                Reset
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95"
                aria-label="Tutup Obrolan"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-slate-50/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble flex gap-2 sm:gap-2.5 ${
                  msg.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs ${
                    msg.role === 'bot'
                      ? 'relative overflow-hidden border border-green-700/30 bg-white'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {msg.role === 'bot' ? (
                    <Image
                      src="/images/logo-kopma.jpg"
                      alt="Logo Kopma"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.role === 'bot'
                      ? 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-sm'
                      : 'bg-green-800 text-white rounded-tr-sm'
                  }`}
                >
                  {formatMessage(msg.content)}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="chat-bubble flex gap-2 sm:gap-2.5">
                <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden flex-shrink-0 border border-green-700/30 bg-white shadow-xs">
                  <Image
                    src="/images/logo-kopma.jpg"
                    alt="Logo Kopma"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex gap-1.5 items-center">
                  <span
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions (Horizontal scroll on mobile) */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 border-t border-slate-100 bg-white flex-shrink-0 overflow-x-auto no-scrollbar">
              <div className="flex gap-1.5 flex-nowrap sm:flex-wrap">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="px-2.5 py-1 rounded-lg bg-green-50 border border-green-200/70 text-green-800 text-[11px] font-semibold hover:bg-green-100 active:scale-95 transition-all whitespace-nowrap flex-shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-slate-200/90 bg-white flex items-center gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya SOP Kopma..."
              className="flex-1 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 sm:px-3.5 py-2 outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition-colors"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-xl bg-green-800 disabled:opacity-40 text-white flex items-center justify-center hover:bg-green-700 active:scale-95 transition-all flex-shrink-0 shadow-xs"
              aria-label="Kirim"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-full shadow-xl shadow-green-950/25 transition-all duration-300 active:scale-95 ${
          isOpen
            ? 'bg-green-950 pr-4 sm:pr-5'
            : 'bg-green-800 hover:bg-green-700 pulse-green'
        }`}
        aria-label="Buka Chatbot SOP Kopma"
      >
        {isOpen ? (
          <>
            <X className="w-5 h-5 text-white" />
            <span className="text-white text-xs sm:text-sm font-bold">Tutup</span>
          </>
        ) : (
          <>
            <div className="relative">
              <MessageSquare className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-green-800" />
            </div>
            <span className="text-white text-xs sm:text-sm font-bold">Tanya SOP</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 hidden sm:inline" />
          </>
        )}
      </button>
    </>
  );
}
