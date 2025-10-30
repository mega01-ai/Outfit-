import React, { useEffect } from 'react';

interface ImageModalProps {
  imageUrl: string;
  altText: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, altText, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="image-modal-title"
    >
      <div
        className="relative bg-white p-4 rounded-lg shadow-2xl max-w-3xl max-h-[90vh] w-full"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="image-modal-title" className="sr-only">Enlarged image of {altText}</h2>
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 text-white bg-gray-800 rounded-full h-8 w-8 flex items-center justify-center text-xl hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white z-10"
          aria-label="Close image view"
        >
          &times;
        </button>
        <div className="overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={altText}
            className="w-full h-auto object-contain max-h-[calc(90vh-2rem)]"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
