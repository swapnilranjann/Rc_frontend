import Toast from './Toast';
import { ToastState } from '../hooks/useToast';

interface ToastContainerProps {
  toasts: ToastState[];
  removeToast: (id: number) => void;
}

const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            position: 'fixed',
            top: `${100 + index * 80}px`,
            right: '20px',
            zIndex: 10000,
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  );
};

export default ToastContainer;

