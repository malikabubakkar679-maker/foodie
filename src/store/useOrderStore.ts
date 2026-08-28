import { create } from 'zustand';
import { Order, Address, OrderStatus } from '@/types/food.types';
import { orderService } from '@/services/orderService';
import { realtimeOrderSync, RealtimeOrderEvent } from '@/services/realtimeOrderSync';
import { useCartStore } from './useCartStore';
import { useNotificationStore } from './useNotificationStore';
import { INITIAL_ORDERS } from '@/data/initialData';

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
  isRealtimeConnected: boolean;
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

export const useOrderStore = create<OrderState>((set, get) => {
  // Subscribe to Realtime Sync Events immediately
  if (typeof window !== 'undefined') {
    realtimeOrderSync.subscribe((event: RealtimeOrderEvent) => {
      const state = get();

      switch (event.type) {
        case 'ORDER_CREATED': {
          const exists = state.orders.some((o) => o.id === event.order.id);
          if (!exists) {
            set({ orders: [event.order, ...state.orders] });
            // Notification for admin / other views
            useNotificationStore.getState().showToast({
              title: `Live Order #${event.order.orderNumber} Received! 📦`,
              message: `New customer order with ${event.order.items.length} item(s) ($${event.order.total.toFixed(2)}).`,
              type: 'order_confirmed',
              icon: '⚡',
            });
          }
          break;
        }

        case 'ORDER_STATUS_UPDATED': {
          const updated = state.orders.map((o) => {
            if (o.id === event.orderId) {
              return {
                ...o,
                status: event.status,
                step: event.step,
                courierProgress:
                  event.courierProgress !== undefined
                    ? event.courierProgress
                    : event.step === 2
                    ? 0.65
                    : event.step === 3
                    ? 1.0
                    : 0.2,
              };
            }
            return o;
          });

          const active =
            state.activeTrackingOrder?.id === event.orderId
              ? updated.find((x) => x.id === event.orderId) || null
              : state.activeTrackingOrder;

          set({ orders: updated, activeTrackingOrder: active });

          // Live Toast notification on update
          const order = updated.find((o) => o.id === event.orderId);
          if (order) {
            const statusEmoji =
              event.status === 'Preparing'
                ? '🔥'
                : event.status === 'Out for Delivery'
                ? '🛵'
                : event.status === 'Delivered'
                ? '🍕'
                : '📦';

            useNotificationStore.getState().showToast({
              title: `Order #${order.orderNumber} Status: ${event.status} ${statusEmoji}`,
              message: `Live GPS telemetry updated to step ${event.step + 1} of 4.`,
              type: 'order_confirmed',
              icon: statusEmoji,
            });
          }
          break;
        }

        case 'DRIVER_ASSIGNED': {
          const updated = state.orders.map((o) =>
            o.id === event.orderId
              ? { ...o, driverName: event.driverName, driverPhone: event.driverPhone }
              : o
          );
          const active =
            state.activeTrackingOrder?.id === event.orderId
              ? updated.find((x) => x.id === event.orderId) || null
              : state.activeTrackingOrder;

          set({ orders: updated, activeTrackingOrder: active });
          break;
        }

        case 'ORDER_DELETED': {
          const updated = state.orders.filter((o) => o.id !== event.orderId);
          set({
            orders: updated,
            activeTrackingOrder: state.activeTrackingOrder?.id === event.orderId ? null : state.activeTrackingOrder,
          });
          break;
        }

        case 'ORDERS_SYNC': {
          set({ orders: event.orders });
          break;
        }
      }
    });
  }

  return {
    orders: INITIAL_ORDERS,
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
    isRealtimeConnected: true,

    fetchOrders: async (userId?: string) => {
      try {
        const orders = await orderService.getOrders(userId);
        set({ orders });
      } catch {
        set({ orders: INITIAL_ORDERS });
      }
    },

    fetchAllOrdersAdmin: async () => {
      try {
        const orders = await orderService.getOrders();
        set({ orders });
        return orders;
      } catch {
        return INITIAL_ORDERS;
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
            courierProgress:
              courierProgress !== undefined
                ? courierProgress
                : step === 2
                ? 0.65
                : step === 3
                ? 1.0
                : 0.2,
          };
        }
        return o;
      });

      const active =
        activeTrackingOrder?.id === orderId
          ? updated.find((x) => x.id === orderId) || null
          : activeTrackingOrder;

      set({ orders: updated, activeTrackingOrder: active });

      // Save to persistence
      orderService.updateOrderStatus(orderId, status, step, courierProgress);

      // Broadcast Realtime Event to other open tabs / windows
      const order = updated.find((o) => o.id === orderId);
      realtimeOrderSync.broadcastStatusUpdated(orderId, status, step, courierProgress, order);

      // Local toast
      if (order) {
        useNotificationStore.getState().showToast({
          title: `Status: ${status} ${status === 'Out for Delivery' ? '🛵' : '🔥'}`,
          message: `Order #${order.orderNumber} updated live across all devices.`,
          type: 'order_confirmed',
          icon: status === 'Out for Delivery' ? '🛵' : '⚡',
        });
      }
    },

    assignDriver: (orderId: string, driverName: string, driverPhone: string) => {
      const updated = get().orders.map((o) =>
        o.id === orderId ? { ...o, driverName, driverPhone } : o
      );
      set({ orders: updated });
      orderService.assignDriver(orderId, driverName, driverPhone);
      realtimeOrderSync.broadcastDriverAssigned(orderId, driverName, driverPhone);
    },

    deleteOrder: (orderId: string) => {
      const updated = get().orders.filter((o) => o.id !== orderId);
      set({ orders: updated });
      orderService.deleteOrder(orderId);
      realtimeOrderSync.broadcastOrderDeleted(orderId);
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

      // Broadcast Realtime Event to Admin and other tabs
      realtimeOrderSync.broadcastOrderCreated(newOrder);

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
  };
});
