import { useEffect, useRef, useState } from 'react';
import { useRigFilter } from '../store/rigFilterStore';

interface AlertToastProps {
  onViewDetails?: () => void;
}

interface DemoToast {
  id: number;
  closing: boolean;
  message: string;
}

const DEMO_TOAST_INTERVAL_MS = 60_000;
const MAX_DEMO_TOASTS = 2;
const DEMO_ALERT_LOCATIONS = [
  'West / Site 09 / Rig 146 / Cam 03 – Pipe Deck',
  'East / Site 28 / Rig 160 / Cam 01 – Pipe Deck',
  'North / Site 14 / Rig 132 / Cam 05 – Drill Floor',
  'South / Site 31 / Rig 171 / Cam 02 – Catwalk',
  'Central / Site 07 / Rig 120 / Cam 04 – BOP Area',
];

// Extract "Rig NNN" from a location string like "West / Site 09 / Rig 146 / Cam 03 – Pipe Deck"
function extractRigName(message: string): string {
  const match = message.match(/Rig\s+\d+/i);
  return match ? match[0] : '';
}

function AlertToast({ onViewDetails }: AlertToastProps) {
  const { isInScope } = useRigFilter();
  const nextLocationIndexRef = useRef(0);

  const createToast = (): DemoToast => {
    const location =
      DEMO_ALERT_LOCATIONS[nextLocationIndexRef.current % DEMO_ALERT_LOCATIONS.length];
    nextLocationIndexRef.current += 1;
    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      closing: false,
      message: `Human detected at ${location}`,
    };
  };

  const [toasts, setToasts] = useState<DemoToast[]>([createToast()]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setToasts((currentToasts) => {
        const nextToasts = [...currentToasts, createToast()];
        return nextToasts.slice(-MAX_DEMO_TOASTS);
      });
    }, DEMO_TOAST_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  const handleClose = (toastId: number) => {
    setToasts((currentToasts) =>
      currentToasts.map((toast) =>
        toast.id === toastId ? { ...toast, closing: true } : toast,
      ),
    );
    window.setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== toastId),
      );
    }, 300);
  };

  // Only show toasts whose rig is currently in scope
  const visibleToasts = toasts.filter(toast => {
    const rig = extractRigName(toast.message);
    return rig ? isInScope(rig) : true;
  });

  if (visibleToasts.length === 0) return null;

  return (
    <div className="alert-toast-stack" aria-live="assertive" aria-atomic="false">
      {visibleToasts.map((toast) => (
        <div
          key={toast.id}
          className={`alert-toast${toast.closing ? ' alert-toast--closing' : ''}`}
          role="alert"
          aria-atomic="true"
        >
          <div className="alert-toast__header">
            <span className="alert-toast__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3 2.8 19a1 1 0 0 0 .87 1.5h16.66a1 1 0 0 0 .87-1.5L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M12 9v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="17" r="1" fill="currentColor" />
              </svg>
            </span>
            <div className="alert-toast__content">
              <h3 className="alert-toast__title">Critical Alert</h3>
              <p className="alert-toast__message">{toast.message}</p>
            </div>
            <button
              className="alert-toast__close"
              onClick={() => handleClose(toast.id)}
              type="button"
              aria-label="Dismiss alert notification"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="alert-toast__footer">
            <button
              className="alert-toast__view-btn"
              type="button"
              onClick={onViewDetails}
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AlertToast;
