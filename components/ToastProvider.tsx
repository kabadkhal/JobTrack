"use client";

import {
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (
    message: string,
    type?: ToastType
  ) => void;
}

const ToastContext =
  createContext<ToastContextType | null>(null);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "success"
    ) => {
      const id = Date.now() + Math.random();

      setToasts((current) => [
        ...current,
        {
          id,
          message,
          type,
        },
      ]);

      setTimeout(() => {
        setToasts((current) =>
          current.filter((toast) => toast.id !== id)
        );
      }, 3000);
    },
    []
  );

  const removeToast = (id: number) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6 sm:w-full"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";

          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl"
              style={{
                background: "var(--glass)",
                borderColor: isSuccess
                  ? "rgba(16, 185, 129, 0.3)"
                  : isError
                  ? "rgba(251, 113, 133, 0.3)"
                  : "var(--glass-border)",
              }}
            >
              <div className="mt-0.5 shrink-0">
                {isSuccess ? (
                  <CheckCircle2
                    size={19}
                    style={{
                      color: "#10b981",
                    }}
                  />
                ) : isError ? (
                  <XCircle
                    size={19}
                    style={{
                      color: "#fb7185",
                    }}
                  />
                ) : (
                  <Info
                    size={19}
                    style={{
                      color: "var(--accent)",
                    }}
                  />
                )}
              </div>

              <p
                className="min-w-0 flex-1 text-sm leading-5"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                {toast.message}
              </p>

              <button
                type="button"
                onClick={() =>
                  removeToast(toast.id)
                }
                className="shrink-0 rounded-lg p-1 transition hover:opacity-70"
                style={{
                  color: "var(--text-muted)",
                }}
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return context;
}