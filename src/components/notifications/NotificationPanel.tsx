import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Bell, X, CheckCheck, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const NotificationPanel: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    isPanelOpen,
    closePanel,
    openDetailModal,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationStore();

  if (!isPanelOpen) return null;

  const handleNotificationClick = (notif: any) => {
    closePanel();
    openDetailModal(notif);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] overflow-hidden select-none">
        {/* Frosted Glass Blurred Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={closePanel}
          className="fixed inset-0 bg-black/50 backdrop-blur-md"
        />

        {/* Panel Container */}
        <div className="fixed inset-y-0 right-0 max-w-full flex">
          <motion.div
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="w-screen max-w-md bg-white/85 backdrop-blur-2xl border-l border-white/70 shadow-2xl flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/60 bg-white/60 backdrop-blur-xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-foodie-yellow to-foodie-amber-dark flex items-center justify-center text-foodie-charcoal shadow-sm">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foodie-charcoal flex items-center gap-2">
                    <span>Notifications</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-foodie-yellow font-black text-foodie-charcoal">
                      {notifications.length}
                    </span>
                  </h3>
                  <span className="text-[11px] text-foodie-muted font-bold">
                    Tap any item to read details
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-1.5 rounded-xl hover:bg-black/5 text-foodie-muted hover:text-foodie-charcoal transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={closePanel}
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-foodie-muted hover:text-foodie-charcoal flex items-center justify-center transition-all"
                  aria-label="Close panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                  <div className="w-20 h-20 bg-white/80 border border-white/90 rounded-3xl flex items-center justify-center text-4xl shadow-md">
                    🔔
                  </div>
                  <h4 className="text-lg font-black text-foodie-charcoal">No Notifications</h4>
                  <p className="text-xs text-foodie-muted max-w-xs">
                    You're all caught up! Order status and exclusive deal alerts will appear here.
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      'p-4 rounded-3xl border transition-all flex items-start gap-3.5 relative group cursor-pointer hover:scale-[1.01]',
                      notif.isRead
                        ? 'bg-white/60 border-white/60 opacity-80 hover:opacity-100'
                        : 'bg-white/90 border-white/90 shadow-sm border-l-4 border-l-foodie-amber-dark'
                    )}
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-2xl bg-foodie-yellow-soft flex items-center justify-center text-xl shrink-0 shadow-2xs">
                      {notif.icon || '🔔'}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-5">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs sm:text-sm font-black text-foodie-charcoal truncate block">
                          {notif.title}
                        </strong>
                      </div>
                      <p className="text-[11px] sm:text-xs text-foodie-muted font-medium mt-1 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1">
                        <span className="text-[10px] text-foodie-muted font-bold">{notif.time}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-foodie-amber-dark group-hover:underline">
                          <span>{notif.actionLabel || 'View Details'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    {/* Delete single notification */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notif.id);
                      }}
                      className="absolute top-3.5 right-3.5 text-foodie-muted hover:text-foodie-red p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Sticky Bottom Actions */}
            {notifications.length > 0 && (
              <div className="p-4 bg-white/70 border-t border-white/70 flex items-center justify-between shrink-0">
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 text-xs font-black text-foodie-red hover:underline"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>

                <button
                  onClick={() => {
                    closePanel();
                    navigate('/notifications');
                  }}
                  className="text-xs font-black text-foodie-amber-dark hover:underline"
                >
                  Open Full Inbox →
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
