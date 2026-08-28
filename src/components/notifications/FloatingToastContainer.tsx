import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '@/store/useNotificationStore';
import { X, ChevronRight } from 'lucide-react';

export const FloatingToastContainer: React.FC = () => {
  const { activeToasts, dismissToast, openDetailModal } = useNotificationStore();

  return (
    <aside
      aria-label="Notifications"
      className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-[99999] flex flex-col items-center gap-2.5 max-w-[440px] sm:max-w-[460px] w-[94vw] pointer-events-none select-none"
    >
      <AnimatePresence>
        {activeToasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -35, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.92, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', damping: 24, stiffness: 340 }}
            onClick={() => {
              dismissToast(toast.id);
              openDetailModal(toast);
            }}
            className="pointer-events-auto w-full bg-white/90 hover:bg-white/95 backdrop-blur-2xl border border-white/95 rounded-2xl py-3 px-4 sm:py-3.5 sm:px-4.5 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.16)] flex items-center gap-3 relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.01]"
          >
            {/* Left Glass Accent Gradient Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-foodie-yellow via-foodie-amber to-foodie-orange" />

            {/* Left Icon Badge (Slightly larger) */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-foodie-yellow to-foodie-amber-dark flex items-center justify-center text-base shrink-0 shadow-xs ml-0.5">
              {toast.icon || '🔔'}
            </div>

            {/* Message Body (Clear, Larger Typography & Comfortable Height) */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-2 leading-tight">
                <span className="text-xs sm:text-sm font-black text-foodie-charcoal truncate block">
                  {toast.title}
                </span>
                <span className="text-[10px] text-foodie-muted font-bold shrink-0">
                  • {toast.time}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-foodie-charcoal/80 font-semibold mt-0.5 leading-snug line-clamp-2">
                {toast.message}
              </p>
            </div>

            {/* Tap arrow indicator */}
            <ChevronRight className="w-4 h-4 text-foodie-muted/70 group-hover:text-foodie-amber-dark group-hover:translate-x-0.5 transition-all shrink-0" />

            {/* Quick Dismiss Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismissToast(toast.id);
              }}
              className="w-6 h-6 rounded-full bg-black/5 hover:bg-black/10 text-foodie-muted hover:text-foodie-charcoal flex items-center justify-center transition-all shrink-0 active:scale-90"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </aside>
  );
};
