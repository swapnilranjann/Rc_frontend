import { useState, useCallback } from 'react';

export interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  id: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
      const id = Date.now();
      setToasts((prev) => [...prev, { message, type, id }]);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
};

