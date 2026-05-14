import { useState } from "react";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

/**
 * DeleteDialog Component
 * Confirmation interface for high-risk operations.
 * Pivoted to Industrial Light theme.
 */
export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Risk Confirmation",
  message = "Are you sure you want to proceed with this high-risk data link termination?",
}: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[var(--color-industrial-border)]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
      <div className="industrial-panel bg-[var(--color-industrial-panel)] p-10 max-w-lg w-full shadow-2xl border-[var(--color-industrial-border)] transform animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 shadow-sm">
            <svg
              className="w-6 h-6 text-rose-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-black text-[var(--color-industrial-text)] uppercase tracking-tight italic">
              {title}
            </h3>
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
              Action Required
            </span>
          </div>
        </div>

        <p className="text-sm font-bold text-[var(--color-industrial-text-muted)] mb-10 leading-relaxed uppercase tracking-tight">
          {message}
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-3 text-xs font-black text-[var(--color-industrial-text-muted)] uppercase tracking-[0.2em] hover:text-[var(--color-industrial-text)] transition-colors disabled:opacity-50"
          >
            Abort
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-8 py-3 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-500/20 transition-all uppercase tracking-widest active:scale-95 disabled:bg-rose-300"
          >
            {isDeleting ? "Syncing Logic..." : "Confirm Termination"}
          </button>
        </div>
      </div>
    </div>
  );
}
