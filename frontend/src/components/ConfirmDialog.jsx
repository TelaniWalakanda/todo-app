import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FiTrash2, FiX } from 'react-icons/fi'

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  busyLabel = "Deleting...",
  busy = false,
  onConfirm,
  onCancel
}) {
  const cancelRef = useRef(null);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  });

  useEffect(() => {
    if (!open) return;

    const appRoot = document.getElementById('root');
    const previousOverflow = document.body.style.overflow;

    if (appRoot) appRoot.inert = true;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancelRef.current();
    };

    document.addEventListener('keydown', handleKeyDown);
    cancelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (appRoot) appRoot.inert = false;
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="dialog-backdrop absolute inset-0 bg-ink/35 backdrop-blur-md"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="dialog-panel relative w-full max-w-sm rounded-2xl border border-line bg-white p-6 text-left shadow-2xl shadow-ink/25"
      >
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger">
            <FiTrash2 className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id="confirm-dialog-title"
              className="text-base font-semibold text-ink"
            >
              {title}
            </h2>
            <p
              id="confirm-dialog-message"
              className="mt-1 text-sm break-words text-ink-soft"
            >
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-medium text-ink-soft transition hover:border-sage hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiX className="size-3.5" />
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-danger px-3 py-2 text-xs font-medium text-white transition hover:bg-danger-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiTrash2 className="size-3.5" />
            {busy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmDialog
