import { create } from 'zustand';
import { Order, Address } from '@/types/food.types';
import { orderService } from '@/services/orderService';
import { useCartStore } from './useCartStore';
import { useNotificationStore } from './useNotificationStore';

interface OrderState {
  orders: Order[];
  addresses: Address[];
  selectedAddressId: string;
  activeTrackingOrder: Order | null;
  isTrackingModalOpen: boolean;
  isCheckoutModalOpen: boolean;
  isOrderSuccessModalOpen: boolean;
  latestPlacedOrder: Order | null;
  deliveryTiming: 'asap' | 'scheduled';
  paymentMethod: 'card' | 'applepay' | 'wallet' | 'cod';
  isLoading: boolean;
  fetchOrders: (userId?: string) => Promise<void>;
  setSelectedAddressId: (id: string) => void;
  setDeliveryTiming: (timing: 'asap' | 'scheduled') => void;
  setPaymentMethod: (method: 'card' | 'applepay' | 'wallet' | 'cod') => void;
  openCheckoutModal: () => void;
  closeCheckoutModal: () => void;
  openTrackingModal: (order: Order) => void;
  closeTrackingModal: () => void;
  closeOrderSuccessModal: () => void;
  submitOrder: (userId: string) => Promise<Order>;
  simulateStatusAdvancement: (orderId: string) => void;
}

const DEFAULT_ADDRESS: Address = {
  id: 'addr_1',
  userId: 'u_guest',
  title: 'Home Address',
  fullAddress: '742 Evergreen Terrace, Apt 4B',
  city: 'Brooklyn, NY',
  phone: '+1 (555) 234-5678',
  isDefault: true,
};

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [], // 0 orders by default for fresh accounts
  addresses: [DEFAULT_ADDRESS],
  selectedAddressId: 'addr_1',
  activeTrackingOrder: null,
  isTrackingModalOpen: false,
  isCheckoutModalOpen: false,
  isOrderSuccessModalOpen: false,
  latestPlacedOrder: null,
  deliveryTiming: 'asap',
  paymentMethod: 'card',
  isLoading: false,

  fetchOrders: async (userId?: string) => {
    try {
      const orders = await orderService.getOrders(userId);
      set({ orders });
    } catch {
      set({ orders: [] });
    }
  },

  setSelectedAddressId: (id) => set({ selectedAddressId: id }),
  setDeliveryTiming: (timing) => set({ deliveryTiming: timing }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  openCheckoutModal: () => set({ isCheckoutModalOpen: true }),
  closeCheckoutModal: () => set({ isCheckoutModalOpen: false }),

  openTrackingModal: (order) => set({ activeTrackingOrder: order, isTrackingModalOpen: true }),
  closeTrackingModal: () => set({ isTrackingModalOpen: false }),
  closeOrderSuccessModal: () => set({ isOrderSuccessModalOpen: false }),

  submitOrder: async (userId) => {
    set({ isLoading: true });
    const cartStore = useCartStore.getState();
    const address =
      get().addresses.find((a) => a.id === get().selectedAddressId) || get().addresses[0] || DEFAULT_ADDRESS;

    const subtotal = cartStore.getSubtotal();
    const deliveryFee = cartStore.getDeliveryFee();
    const discount = cartStore.getDiscountAmount();
    const total = cartStore.getTotal();

    const newOrder = await orderService.createOrder(
      userId,
      cartStore.items,
      address,
      subtotal,
      deliveryFee,
      discount,
      total
    );

    cartStore.clearCart();

    set((state) => ({
      orders: [newOrder, ...state.orders],
      latestPlacedOrder: newOrder,
      activeTrackingOrder: newOrder,
      isCheckoutModalOpen: false,
      isOrderSuccessModalOpen: true,
      isLoading: false,
    }));

    // Trigger Top-to-Bottom Animated Notification Toast
    useNotificationStore.getState().addNotification({
      type: 'order_confirmed',
      title: `Order #${newOrder.orderNumber} Confirmed! 🎉`,
      message: 'Chefs are crafting your hot stone-baked meal right now.',
      icon: '📦',
      actionLabel: 'Track Live GPS',
    });

    get().simulateStatusAdvancement(newOrder.id);
    return newOrder;
  },

  simulateStatusAdvancement: (orderId) => {
    setTimeout(() => {
      set((state) => {
        const updated = state.orders.map((o) =>
          o.id === orderId ? { ...o, status: 'Preparing' as const, step: 1 } : o
        );
        const active =
          state.activeTrackingOrder?.id === orderId
            ? updated.find((x) => x.id === orderId)
            : state.activeTrackingOrder;
        return { orders: updated, activeTrackingOrder: active || null };
      });

      useNotificationStore.getState().addNotification({
        type: 'order_confirmed',
        title: `Order Baking in Oven! 🔥`,
        message: 'Your meal is in the stone-baked oven with bubbling mozzarella.',
        icon: '👨‍🍳',
        actionLabel: 'View Order',
      });
    }, 6000);

    setTimeout(() => {
      set((state) => {
        const updated = state.orders.map((o) =>
          o.id === orderId ? { ...o, status: 'Out for Delivery' as const, step: 2 } : o
        );
        const active =
          state.activeTrackingOrder?.id === orderId
            ? updated.find((x) => x.id === orderId)
            : state.activeTrackingOrder;
        return { orders: updated, activeTrackingOrder: active || null };
      });

      useNotificationStore.getState().addNotification({
        type: 'out_for_delivery',
        title: `Courier Alex Out for Delivery! 🛵`,
        message: 'Food is packed in heated thermal bag. ETA: 12 mins.',
        icon: '🛵',
        actionLabel: 'Live GPS Map',
      });
    }, 14000);

    setTimeout(() => {
      set((state) => {
        const updated = state.orders.map((o) =>
          o.id === orderId ? { ...o, status: 'Delivered' as const, step: 3 } : o
        );
        const active =
          state.activeTrackingOrder?.id === orderId
            ? updated.find((x) => x.id === orderId)
            : state.activeTrackingOrder;
        return { orders: updated, activeTrackingOrder: active || null };
      });

      useNotificationStore.getState().addNotification({
        type: 'order_delivered',
        title: `Order Delivered! 🍕`,
        message: 'Your food has arrived at your door. Enjoy your delicious feast!',
        icon: '✅',
        actionLabel: 'Rate Order',
      });
    }, 24000);
  },
}));
