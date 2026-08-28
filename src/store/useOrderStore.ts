import { create } from 'zustand';
import { Order, Address, OrderStatus } from '@/types/food.types';
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
  fetchAllOrdersAdmin: () => Promise<Order[]>;
  updateOrderStatus: (orderId: string, status: OrderStatus, step: number, courierProgress?: number) => void;
  assignDriver: (orderId: string, driverName: string, driverPhone: string) => void;
  deleteOrder: (orderId: string) => void;
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

const ORDERS_DB_KEY = 'foodie_user_orders_db';

const persistAllOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(ORDERS_DB_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn('Persist orders error:', e);
  }
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

  fetchAllOrdersAdmin: async () => {
    try {
      const orders = await orderService.getOrders();
      set({ orders });
      return orders;
    } catch {
      return [];
    }
  },

  updateOrderStatus: (orderId: string, status: OrderStatus, step: number, courierProgress?: number) => {
    const { orders, activeTrackingOrder } = get();
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          step,
          courierProgress: courierProgress !== undefined ? courierProgress : (step === 2 ? 0.65 : step === 3 ? 1.0 : 0.2),
        };
      }
      return o;
    });

    const active =
      activeTrackingOrder?.id === orderId
        ? updated.find((x) => x.id === orderId) || null
        : activeTrackingOrder;

    set({ orders: updated, activeTrackingOrder: active });
    persistAllOrders(updated);

    // Broadcast toast notification
    const order = updated.find((o) => o.id === orderId);
    if (order) {
      const statusTitle =
        status === 'Preparing'
          ? `Order #${order.orderNumber} in Oven! 🔥`
          : status === 'Out for Delivery'
          ? `Courier Out for Delivery! 🛵`
          : status === 'Delivered'
          ? `Order #${order.orderNumber} Delivered! 🍕`
          : `Order #${order.orderNumber} Confirmed! 🎉`;

      useNotificationStore.getState().showToast({
        title: statusTitle,
        message: `Order status updated to "${status}". Live GPS updated.`,
        type: 'order_confirmed',
        icon: status === 'Out for Delivery' ? '🛵' : '📦',
      });
    }
  },

  assignDriver: (orderId: string, driverName: string, driverPhone: string) => {
    const updated = get().orders.map((o) =>
      o.id === orderId ? { ...o, driverName, driverPhone } : o
    );
    set({ orders: updated });
    persistAllOrders(updated);
  },

  deleteOrder: (orderId: string) => {
    const updated = get().orders.filter((o) => o.id !== orderId);
    set({ orders: updated });
    persistAllOrders(updated);
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

    // Trigger user action toast
    useNotificationStore.getState().showToast({
      title: `Order #${newOrder.orderNumber} Confirmed! 🎉`,
      message: 'Your order has been sent to the kitchen. Track live GPS anytime.',
      type: 'order_confirmed',
      icon: '📦',
      actionLabel: 'Track GPS',
    });

    return newOrder;
  },

  simulateStatusAdvancement: (orderId) => {
    // Optional client demo advancement if triggered
    setTimeout(() => {
      get().updateOrderStatus(orderId, 'Preparing', 1, 0.25);
    }, 6000);

    setTimeout(() => {
      get().updateOrderStatus(orderId, 'Out for Delivery', 2, 0.6);
    }, 14000);

    setTimeout(() => {
      get().updateOrderStatus(orderId, 'Delivered', 3, 1.0);
    }, 24000);
  },
}));
