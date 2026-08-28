import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '@/store/useNotificationStore';
import { X, ChevronRight } from 'lucide-react';

export const FloatingToastContainer: React.FC = () => {
  const { activeToasts, dismissToast, openDetailModal } = useNotificationStore();

  return (
    <aside
      aria-label="Notifications"
      className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-[99999] flex flex-col items-center gap-2 max-w-[360px] w-[92vw] pointer-events-none select-none"
    >
      <AnimatePresence>
        {activeToasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={() => {
              dismissToast(toast.id);
              openDetailModal(toast);
            }}
            className="pointer-events-auto w-full bg-white/70 hover:bg-white/85 backdrop-blur-xl border border-white/80 rounded-2xl py-2 px-3 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.12)] flex items-center gap-2.5 relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.01]"
          >
            {/* Left Glass Accent Gradient Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-foodie-yellow via-foodie-amber to-foodie-orange" />

            {/* Left Compact Icon */}
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-foodie-yellow to-foodie-amber-dark flex items-center justify-center text-xs shrink-0 shadow-xs ml-0.5">
              {toast.icon || '🔔'}
            </div>

            {/* Message Body (Ultra-compact streamlined height) */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-[11px] sm:text-xs font-black text-foodie-charcoal truncate block">
                  {toast.title}
                </span>
                <span className="text-[9px] text-foodie-muted/80 font-medium shrink-0">
                  • {toast.time}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-foodie-muted font-medium truncate mt-0.5 leading-tight">
                {toast.message}
              </p>
            </div>

            {/* Tap arrow indicator */}
            <ChevronRight className="w-3.5 h-3.5 text-foodie-muted/60 group-hover:text-foodie-amber-dark group-hover:translate-x-0.5 transition-all shrink-0" />

            {/* Quick Dismiss Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismissToast(toast.id);
              }}
              className="w-5 h-5 rounded-full bg-black/5 hover:bg-black/10 text-foodie-muted hover:text-foodie-charcoal flex items-center justify-center transition-all shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </aside>
  );
};
