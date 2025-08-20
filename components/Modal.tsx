import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300 ease-out animate-fade-in"
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative transform overflow-hidden rounded-2xl bg-slate-800 text-left shadow-2xl transition-all duration-300 ease-out sm:my-8 sm:w-full sm:max-w-lg border border-cyan-500/30 p-8 animate-scale-in"
          >
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="rounded-md bg-slate-800 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <CloseIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
