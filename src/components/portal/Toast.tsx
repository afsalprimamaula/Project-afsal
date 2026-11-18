'use client';

import { useState, useEffect, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: ((t: Toast) => void)[] = [];

export function showToast(message: string, type: ToastType = 'info') {
  const toast: Toast = { id: Date.now().toString(), message, type };
  toastListeners.forEach((fn) => fn(toast));
}

const STYLES: Record<ToastType, string> = {
  success: 'bg-green-800 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-slate-800 text-white',
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Toast) => {
    setToasts((prev) => [...prev, t]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 3500);
  }, []);

  useEffect(() => {
    toastListeners.push(addToast);
    return () => { toastListeners = toastListeners.filter((fn) => fn !== addToast); };
  }, [addToast]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-5 py-3 rounded-xl text-sm font-semibold shadow-xl animate-in slide-in-from-bottom-2 duration-300 ${STYLES[t.type]}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
