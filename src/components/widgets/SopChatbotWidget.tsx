'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, MessageSquare, Send, Bot, Sparkles } from 'lucide-react';
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
    'Halo! 👋 Saya asisten SOP Kopma Unpas bertenaga AI. Saya siap menjawab pertanyaan seputar:\n\n• Cara mendaftar anggota\n• Jenis-jenis simpanan (Pokok, Wajib, Sukarela)\n• Sistem titip jual konsinyasi\n• Jam operasional & lokasi\n• Pencairan dana\n• Pemesanan jaket PDH / korsa\n\nSilakan pilih topik cepat di bawah atau ketik pertanyaan Anda! 😊',
  timestamp: new Date(),
};

const QUICK_QUESTIONS = [
  'Cara daftar anggota?',
  'Apa itu Simpanan Pokok?',
  'Jam buka sekretariat?',
  'Pesan jaket PDH?',
  'Apa itu konsinyasi?',
  'Cara cairkan dana?',
];

function findLocalAnswer(query: string): string {
  const q = query.toLowerCase().trim();
  let bestMatch: { entry: (typeof sopFaq)[0]; score: number } | null = null;
  for (const entry of sopFaq) {
    const score = entry.keywords.reduce(
      (acc, kw) => acc + (q.includes(kw.toLowerCase()) ? 1 : 0),
      0
    );
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { entry, score };
    }
  }
  if (bestMatch) return bestMatch.entry.answer;
  return `Maaf, saya belum menemukan jawaban spesifik. 🙏\n\nHubungi kami:\n📧 kopmaunpas.bdg@gmail.com\n📲 Line: @nku4688t\n\nSekretariat: Kampus II Tamansari, Senin–Jumat 08.00–16.00 WIB.`;
}

function formatMessage(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

interface SopChatbotWidgetProps {
  /** If true, renders as an inline drawer panel (used inside portal sidebars) */
  inlineMode?: boolean;
  onClose?: () => void;
}

export default function SopChatbotWidget({ inlineMode = false, onClose }: SopChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = inlineMode ? true : isOpen;

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, open]);

  const sendMessage = async (text: string) => {
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

    try {
      const history = [...messages, userMessage].map((m) => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();

      let answer: string;
      if (data.fallback || !res.ok) {
        answer = findLocalAnswer(text);
      } else {
        answer = data.content;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: answer,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: findLocalAnswer(text),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const chatUI = (
    <div
      className={
        inlineMode
          ? 'flex flex-col h-full bg-white'
          : 'fixed inset-x-3 bottom-20 sm:bottom-24 sm:right-6 sm:left-auto sm:w-[380px] z-50 h-[480px] max-h-[calc(100svh-100px)] shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 flex flex-col bg-white animate-in slide-in-from-bottom-4 duration-200'
      }
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-950 to-green-900 px-4 py-3.5 flex items-center gap-3 flex-shrink-0 text-white">
        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 shadow border border-white/30 bg-white">
          <Image src="/images/logo-kopma.jpg" alt="Logo Kopma" fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-xs sm:text-sm leading-tight">AI CS Kopma Unpas</div>
          <div className="text-green-300 text-[10px]">Bertenaga Groq LLaMA 3.3 • Selalu Online</div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMessages([WELCOME_MESSAGE])}
            className="text-green-300 hover:text-white text-[10px] font-medium transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
          >
            Reset
          </button>
          {(inlineMode ? onClose : () => setIsOpen(false)) && (
            <button
              onClick={inlineMode ? onClose : () => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3 bg-slate-50/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 sm:gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === 'bot'
                  ? 'overflow-hidden border border-green-700/30 bg-white shadow-sm'
                  : 'bg-green-800'
              }`}
            >
              {msg.role === 'bot' ? (
                <Image src="/images/logo-kopma.jpg" alt="Bot" width={28} height={28} className="object-cover" />
              ) : (
                <Bot className="w-3.5 h-3.5 text-white" />
              )}
            </div>
            <div
              className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                msg.role === 'bot'
                  ? 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-sm'
                  : 'bg-green-800 text-white rounded-tr-sm'
              }`}
            >
              {formatMessage(msg.content)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 sm:gap-2.5">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden flex-shrink-0 border border-green-700/30 bg-white shadow-sm">
              <Image src="/images/logo-kopma.jpg" alt="Bot" width={28} height={28} className="object-cover" />
            </div>
            <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex gap-1.5 items-center">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 2 && (
        <div className="px-3 py-2 border-t border-slate-100 bg-white flex-shrink-0 overflow-x-auto">
          <div className="flex gap-1.5 flex-nowrap">
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

      {/* Input */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-slate-200/90 bg-white flex items-center gap-2 flex-shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tanya SOP Kopma..."
          className="flex-1 text-sm sm:text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 sm:px-3.5 py-2 outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition-colors"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className="w-9 h-9 rounded-xl bg-green-800 disabled:opacity-40 text-white flex items-center justify-center hover:bg-green-700 active:scale-95 transition-all flex-shrink-0 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (inlineMode) return chatUI;

  return (
    <>
      {isOpen && chatUI}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-full shadow-xl shadow-green-950/25 transition-all duration-300 active:scale-95 ${
          isOpen ? 'bg-green-950 pr-4 sm:pr-5' : 'bg-green-800 hover:bg-green-700'
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
            <span className="text-white text-xs sm:text-sm font-bold">Tanya AI</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 hidden sm:inline" />
          </>
        )}
      </button>
    </>
  );
}
