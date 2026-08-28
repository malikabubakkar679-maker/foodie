import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Bell, CheckCheck, Trash2, ArrowRight, ArrowLeft, Sparkles, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NotificationType } from '@/types/notification.types';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    openDetailModal,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationStore();

  const [activeTab, setActiveTab] = useState<'all' | 'orders' | 'deals'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'orders') {
      return n.type === 'order_confirmed' || n.type === 'out_for_delivery' || n.type === 'order_delivered' || n.type === 'order_cancelled';
    }
    if (activeTab === 'deals') {
      return n.type === 'deal' || n.type === 'welcome';
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-5xl mx-auto space-y-6 pb-12 select-none"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 flex items-center justify-center text-foodie-charcoal hover:bg-foodie-yellow shadow-xs transition-all shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-foodie-charcoal tracking-tight flex items-center gap-2">
              <span>Notification Center</span>
              <span className="text-xs px-3 py-1 rounded-full bg-foodie-yellow font-black text-foodie-charcoal shadow-xs">
                {notifications.length}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-foodie-muted font-bold mt-0.5">
              Live updates on kitchen orders, coupons, GPS tracking, and promo rewards
            </p>
          </div>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={markAllAsRead}
              className="px-3.5 py-2 rounded-2xl bg-white/90 border border-white/80 hover:bg-foodie-yellow text-foodie-charcoal transition-all text-xs font-black flex items-center gap-1.5 shadow-2xs"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4 text-foodie-green" />
              <span>Mark All Read</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={clearAll}
              className="px-3.5 py-2 rounded-2xl bg-white/90 border border-white/80 hover:bg-red-50 text-foodie-red transition-all text-xs font-black flex items-center gap-1.5 shadow-2xs"
              title="Clear all"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear All</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-foodie-border/60 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: 'All Updates' },
          { id: 'orders', label: '📦 Orders & Delivery' },
          { id: 'deals', label: '🏷️ Deals & Rewards' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0',
              activeTab === tab.id
                ? 'bg-foodie-charcoal text-white shadow-sm'
                : 'bg-white/85 border border-white/90 text-foodie-muted hover:text-foodie-charcoal hover:bg-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Cards List */}
      <div className="space-y-3.5">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white/85 backdrop-blur-2xl border border-white/90 rounded-3xl p-12 sm:p-16 text-center space-y-4 shadow-sm">
            <div className="w-24 h-24 mx-auto bg-foodie-yellow-soft rounded-3xl flex items-center justify-center text-5xl shadow-inner">
              🔔
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-foodie-charcoal">No Notifications in this tab</h3>
            <p className="text-xs sm:text-sm text-foodie-muted max-w-md mx-auto leading-relaxed">
              When kitchen prepares your orders or flash sales go live, you'll receive instant top-down alerts here.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredNotifications.map((notif) => (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => openDetailModal(notif)}
                className={cn(
                  'p-4 sm:p-6 rounded-3xl border transition-all flex items-start gap-4 sm:gap-5 relative group cursor-pointer hover:shadow-md hover:scale-[1.008]',
                  notif.isRead
                    ? 'bg-white/75 backdrop-blur-xl border-white/80 opacity-90'
                    : 'bg-white/95 backdrop-blur-2xl border-white/90 shadow-sm border-l-4 border-l-foodie-amber-dark'
                )}
              >
                {/* Icon */}
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-gradient-to-tr from-foodie-yellow to-foodie-amber-dark flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-sm">
                  {notif.icon || '🔔'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-2 sm:pr-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm sm:text-base font-black text-foodie-charcoal truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[11px] text-foodie-muted font-bold shrink-0 ml-2">{notif.time}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-foodie-muted font-medium mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-foodie-border/40">
                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-foodie-amber-dark group-hover:underline">
                      <span>{notif.actionLabel || 'Tap to view details'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notif.id);
                      }}
                      className="text-[11px] font-bold text-foodie-muted hover:text-foodie-red px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

