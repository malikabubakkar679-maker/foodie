import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foodie-charcoal/65 backdrop-blur-md"
          />

          {/* Modal Container: Full Screen on Mobile, Centered Card on Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className={cn(
              'relative w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] bg-white sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col',
              maxWidth
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-foodie-border bg-white/95 backdrop-blur-md shrink-0 sticky top-0 z-20">
                {title && <h3 className="text-lg sm:text-xl font-black text-foodie-charcoal">{title}</h3>}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-foodie-app hover:bg-foodie-yellow/30 text-foodie-muted hover:text-foodie-charcoal transition-all ml-auto active:scale-90"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Smooth Scrollable Body */}
            <div className="overflow-y-auto overscroll-contain scroll-smooth p-5 sm:p-6 flex-1 pb-24 sm:pb-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
