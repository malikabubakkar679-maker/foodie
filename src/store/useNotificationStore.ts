import { create } from 'zustand';
import { FoodieNotification } from '@/types/notification.types';

interface NotificationState {
  notifications: FoodieNotification[];
  activeToasts: FoodieNotification[];
  selectedNotification: FoodieNotification | null;
  isPanelOpen: boolean;
  isDetailModalOpen: boolean;
  addNotification: (notification: Omit<FoodieNotification, 'id' | 'time' | 'isRead'>) => void;
  showToast: (notification: Omit<FoodieNotification, 'id' | 'time' | 'isRead'>) => void;
  dismissToast: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  openDetailModal: (notification: FoodieNotification) => void;
  closeDetailModal: () => void;
  getUnreadCount: () => number;
}

const INITIAL_NOTIFICATIONS: FoodieNotification[] = [
  {
    id: 'n1',
    type: 'welcome',
    title: 'Welcome to Foodie! 🎉',
    message: 'Enjoy 50% OFF on your handcrafted meal using promo code FOODIE50.',
    detailDescription:
      'We are thrilled to welcome you to Foodie! Taste our artisan stone-baked pizzas, gourmet smash burgers, and crispy sides crafted with 100% fresh ingredients. Apply promo code FOODIE50 at checkout to claim your 50% discount on your initial feast.',
    time: 'Just now',
    timestamp: Date.now(),
    icon: '🎉',
    isRead: false,
    actionLabel: 'Claim 50% Deal',
    code: 'FOODIE50',
  },
  {
    id: 'n2',
    type: 'deal',
    title: '🔥 Weekend Flash Deal Live!',
    message: 'Double Pepperoni Feast & Angus Smash Burgers are 50% OFF for the next 3 hours.',
    detailDescription:
      'Flash deal alert! Our top-rated Double Pepperoni Feast Pizza and Angus Smash Burger are now available at half price for a limited time. Don’t miss out on freshly prepared gourmet meals delivered under 30 minutes.',
    time: '10m ago',
    timestamp: Date.now() - 600000,
    icon: '🏷️',
    isRead: false,
    actionLabel: 'View Deals',
  },
  {
    id: 'n3',
    type: 'auth_prompt',
    title: 'Unlock $20 Foodie Wallet 💳',
    message: 'Sign in or create your profile to receive $20 instant wallet credit and live GPS tracking.',
    detailDescription:
      'Create your free Foodie account in under 30 seconds to instantly unlock $20 wallet balance, save your favorite addresses, add debit/credit cards, and get live GPS updates on all your orders.',
    time: '25m ago',
    timestamp: Date.now() - 1500000,
    icon: '👤',
    isRead: false,
    actionLabel: 'Sign In Now',
  },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: INITIAL_NOTIFICATIONS,
  activeToasts: [],
  selectedNotification: null,
  isPanelOpen: false,
  isDetailModalOpen: false,

  addNotification: (notif) => {
    const newNotif: FoodieNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      time: 'Just now',
      timestamp: Date.now(),
      isRead: false,
    };

    // PUSH ON-SCREEN BANNER FIRST + SAVE IN NOTIFICATION SESSION INBOX
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
      activeToasts: [newNotif, ...state.activeToasts.slice(0, 2)],
    }));

    // Auto dismiss on-screen banner after 4.5s
    setTimeout(() => {
      get().dismissToast(newNotif.id);
    }, 4500);
  },

  showToast: (notif) => {
    const newNotif: FoodieNotification = {
      ...notif,
      id: `toast_${Date.now()}`,
      time: 'Just now',
      timestamp: Date.now(),
      isRead: false,
    };

    // Show on screen + ensure it resides in notification session
    set((state) => {
      const alreadyExists = state.notifications.some((n) => n.title === notif.title);
      return {
        notifications: alreadyExists ? state.notifications : [newNotif, ...state.notifications],
        activeToasts: [newNotif, ...state.activeToasts.slice(0, 2)],
      };
    });

    setTimeout(() => {
      get().dismissToast(newNotif.id);
    }, 4500);
  },

  dismissToast: (id: string) => {
    set((state) => ({
      activeToasts: state.activeToasts.filter((t) => t.id !== id),
    }));
  },

  markAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      activeToasts: state.activeToasts.filter((t) => t.id !== id),
    }));
  },

  clearAll: () => {
    set({ notifications: [], activeToasts: [] });
  },

  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),

  openDetailModal: (notification) => {
    get().markAsRead(notification.id);
    set({ selectedNotification: notification, isDetailModalOpen: true });
  },
  closeDetailModal: () => set({ isDetailModalOpen: false, selectedNotification: null }),

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.isRead).length;
  },
}));
