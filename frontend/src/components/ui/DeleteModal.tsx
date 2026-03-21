import React, { useEffect, useCallback } from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
}) => {
  const [loading, setLoading] = React.useState(false);

  // Close on ESC
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    },
    [loading, onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, handleEsc]);

  const handleDelete = async () => {
    if (loading) return; // prevent double click

    try {
      setLoading(true);
      await onConfirm(); // support async
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = () => {
    if (!loading) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
      onClick={handleBackdropClick}>
      <div
        className='bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-scaleIn'
        onClick={(e) => e.stopPropagation()} // prevent closing on inner click
      >
        {/* Title */}
        <h2 className='text-lg font-semibold mb-2'>{title}</h2>

        {/* Message */}
        <p className='text-gray-600 mb-6'>{message}</p>

        {/* Actions */}
        <div className='flex justify-end gap-3'>
          <button
            disabled={loading}
            onClick={onClose}
            className='px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50'>
            {cancelText}
          </button>

          <button
            disabled={loading}
            onClick={handleDelete}
            className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50'>
            {loading ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
