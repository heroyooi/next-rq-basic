"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: string;
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  pushToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback((message: string, type: ToastType = "info") => {
    const id = crypto.randomUUID();
    const toast: Toast = { id, type, message };

    setToasts((prev) => [...prev, toast]);

    // 2.5초 후 자동 제거
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* 토스트 UI */}
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          display: "grid",
          gap: 8,
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              minWidth: 240,
              maxWidth: 360,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #eee",
              background: "#fff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
            role="status"
            aria-live="polite"
          >
            <span
              aria-hidden
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background:
                  t.type === "success"
                    ? "#16a34a"
                    : t.type === "error"
                    ? "#dc2626"
                    : "#2563eb",
              }}
            />
            <span style={{ fontSize: 14 }}>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast는 ToastProvider 내부에서만 사용할 수 있습니다.");
  return ctx;
}
