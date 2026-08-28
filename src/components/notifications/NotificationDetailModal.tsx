import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { X, ArrowRight, Sparkles, Clock, Copy, Check, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationDetailModal: React.FC = () => {
  const navigate = useNavigate();
  const { selectedNotification, isDetailModalOpen, closeDetailModal } = useNotificationStore();
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const openCartDrawer = useCartStore((s) => s.openCartDrawer);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const openTrackingModal = useOrderStore((s) => s.openTrackingModal);
  const orders = useOrderStore((s) => s.orders);

  const [copied, setCopied] = React.useState(false);

  if (!isDetailModalOpen || !selectedNotification) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    applyCoupon(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrimaryAction = () => {
    closeDetailModal();

    if (selectedNotification.type === 'auth_prompt') {
      openAuthModal();
    } else if (selectedNotification.type === 'cart') {
      openCartDrawer();
    } else if (
      selectedNotification.type === 'order_confirmed' ||
      selectedNotification.type === 'out_for_delivery'
    ) {
      if (orders.length > 0) {
        openTrackingModal(orders[0]);
      } else {
        navigate('/orders');
      }
    } else if (selectedNotification.type === 'deal' || selectedNotification.type === 'welcome') {
      navigate('/search');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none">
        {/* Frosted Glass Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={closeDetailModal}
          className="fixed inset-0 bg-black/60 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 25 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-7 space-y-5"
        >
          {/* Top Close Button */}
          <button
            onClick={closeDetailModal}
            className="absolute top-4 right-4 w-9 h-9 rounded-2xl bg-black/5 hover:bg-black/10 text-foodie-muted hover:text-foodie-charcoal flex items-center justify-center transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Hero Header Pill & Icon */}
          <div className="flex items-center gap-3.5 pt-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-foodie-yellow via-foodie-yellow-light to-foodie-amber-dark flex items-center justify-center text-3xl shadow-md shrink-0">
              {selectedNotification.icon || '🔔'}
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-foodie-yellow-soft border border-foodie-yellow/40 text-[11px] font-black text-foodie-amber-dark uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Notification Alert</span>
              </span>
              <div className="flex items-center gap-1.5 text-xs text-foodie-muted font-bold mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{selectedNotification.time}</span>
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-foodie-charcoal tracking-tight leading-snug">
              {selectedNotification.title}
            </h3>
            <p className="text-xs sm:text-sm text-foodie-charcoal/80 font-medium leading-relaxed">
              {selectedNotification.detailDescription || selectedNotification.message}
            </p>
          </div>

          {/* Promo Code Copy Card if present */}
          {selectedNotification.code && (
            <div className="p-3.5 bg-foodie-yellow-soft/80 border border-foodie-yellow/50 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-foodie-muted block">Promo Code</span>
                <strong className="text-sm font-black text-foodie-charcoal tracking-wider">
                  {selectedNotification.code}
                </strong>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCopyCode(selectedNotification.code!)}
                className="px-3.5 py-1.5 bg-white border border-foodie-yellow rounded-xl text-xs font-black text-foodie-charcoal shadow-2xs hover:bg-foodie-yellow flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-foodie-green" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Applied!' : 'Copy & Apply'}</span>
              </motion.button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={closeDetailModal}
              className="px-4 py-3 bg-white border border-foodie-border hover:bg-foodie-app rounded-2xl text-xs font-black text-foodie-charcoal transition-colors"
            >
              Dismiss
            </button>

            {selectedNotification.actionLabel && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePrimaryAction}
                className="flex-1 py-3 px-5 bg-gradient-to-r from-foodie-yellow via-[#FFB800] to-foodie-amber-dark hover:from-foodie-yellow-dark hover:to-foodie-orange text-foodie-charcoal font-black text-xs sm:text-sm rounded-2xl shadow-foodie-glow flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{selectedNotification.actionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
