// ─── components/Toast.jsx ────────────────────────────────────────────────────
// Lightweight animated toast system (no external lib needed)
// Used across the app for success / error / info messages

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from "react-icons/fi";

// ── Individual Toast Item ─────────────────────────────────────────────────────
const ICONS = {
  success: <FiCheckCircle className="w-5 h-5 text-green-500" />,
  error:   <FiXCircle    className="w-5 h-5 text-red-500"   />,
  info:    <FiInfo       className="w-5 h-5 text-mango-500"  />,
};

const BG = {
  success: "border-emerald-500/30 bg-emerald-500/10",
  error:   "border-rose-500/30 bg-rose-500/10",
  info:    "border-amber-400/30 bg-white/8",
};

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 3500);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg
        font-body text-sm font-medium text-slate-100
        transform transition-all duration-300
        ${BG[toast.type] || BG.info}
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
      `}
    >
      {ICONS[toast.type] || ICONS.info}
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 300); }}
      className="text-slate-400 hover:text-white mt-0.5"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Toast Container ───────────────────────────────────────────────────────────
export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:top-5 sm:right-5 z-50 flex flex-col gap-2 w-[calc(100vw-2rem)] sm:w-80 max-w-[90vw]">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

// ── useToast hook ─────────────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useMemo(() => ({
    success: (msg, dur) => addToast(msg, "success", dur),
    error: (msg, dur) => addToast(msg, "error", dur),
    info: (msg, dur) => addToast(msg, "info", dur),
  }), [addToast]);

  return { toasts, toast, removeToast };
}
