import { Order, CartItem, Address, OrderStatus } from '@/types/food.types';
import { INITIAL_ORDERS } from '@/data/initialData';

const ORDERS_DB_KEY = 'foodie_user_orders_db';

export const orderService = {
  async getOrders(userId?: string): Promise<Order[]> {
    try {
      const saved = localStorage.getItem(ORDERS_DB_KEY);
      if (saved) {
        const allOrders: Order[] = JSON.parse(saved);
        if (Array.isArray(allOrders) && allOrders.length > 0) {
          if (userId) {
            // Return user orders plus default initial demo orders if matched
            const userOrders = allOrders.filter((o) => o.userId === userId || o.userId === 'u1' || o.userId === 'u_guest');
            return userOrders.length > 0 ? userOrders : allOrders;
          }
          return allOrders;
        }
      }
    } catch (e) {
      console.warn('Error reading orders from localStorage:', e);
    }

    // Default Seed with INITIAL_ORDERS so previous orders are preserved and visible
    try {
      localStorage.setItem(ORDERS_DB_KEY, JSON.stringify(INITIAL_ORDERS));
    } catch {
      // ignore
    }
    return INITIAL_ORDERS;
  },

  async createOrder(
    userId: string,
    items: CartItem[],
    address: Address,
    subtotal: number,
    deliveryFee: number,
    discount: number,
    total: number
  ): Promise<Order> {
    const orderNumber = `FD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      userId: userId || 'u_guest',
      orderNumber,
      status: 'Confirmed',
      step: 0,
      subtotal,
      deliveryFee,
      discount,
      total,
      deliveryAddress: address ? `${address.fullAddress}, ${address.city}` : '742 Evergreen Terrace, Apt 4B, Brooklyn, NY',
      driverName: 'Alex Rodriguez',
      driverPhone: '+1 (555) 234-8901',
      createdAt: 'Just now',
      items: items.map((i) => ({
        id: `oi_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        productId: i.product.id,
        productName: i.product.name,
        size: i.size.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.unitPrice * i.quantity,
        imageUrl: i.product.imageUrl,
      })),
    };

    let allOrders: Order[] = [];
    try {
      const saved = localStorage.getItem(ORDERS_DB_KEY);
      if (saved) {
        allOrders = JSON.parse(saved);
      }
      if (!Array.isArray(allOrders) || allOrders.length === 0) {
        allOrders = [...INITIAL_ORDERS];
      }
    } catch {
      allOrders = [...INITIAL_ORDERS];
    }

    const updated = [newOrder, ...allOrders];
    localStorage.setItem(ORDERS_DB_KEY, JSON.stringify(updated));

    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, step: number, courierProgress?: number): Promise<Order | null> {
    try {
      const saved = localStorage.getItem(ORDERS_DB_KEY);
      let allOrders: Order[] = saved ? JSON.parse(saved) : [...INITIAL_ORDERS];
      let updatedOrder: Order | null = null;

      allOrders = allOrders.map((o) => {
        if (o.id === orderId) {
          updatedOrder = {
            ...o,
            status,
            step,
            courierProgress: courierProgress !== undefined ? courierProgress : (step === 2 ? 0.65 : step === 3 ? 1.0 : 0.2),
          };
          return updatedOrder;
        }
        return o;
      });

      localStorage.setItem(ORDERS_DB_KEY, JSON.stringify(allOrders));
      return updatedOrder;
    } catch (e) {
      console.warn('Error updating order status:', e);
      return null;
    }
  },

  async assignDriver(orderId: string, driverName: string, driverPhone: string): Promise<void> {
    try {
      const saved = localStorage.getItem(ORDERS_DB_KEY);
      let allOrders: Order[] = saved ? JSON.parse(saved) : [...INITIAL_ORDERS];

      allOrders = allOrders.map((o) => (o.id === orderId ? { ...o, driverName, driverPhone } : o));
      localStorage.setItem(ORDERS_DB_KEY, JSON.stringify(allOrders));
    } catch (e) {
      console.warn('Error assigning driver:', e);
    }
  },

  async deleteOrder(orderId: string): Promise<void> {
    try {
      const saved = localStorage.getItem(ORDERS_DB_KEY);
      let allOrders: Order[] = saved ? JSON.parse(saved) : [...INITIAL_ORDERS];

      allOrders = allOrders.filter((o) => o.id !== orderId);
      localStorage.setItem(ORDERS_DB_KEY, JSON.stringify(allOrders));
    } catch (e) {
      console.warn('Error deleting order:', e);
    }
  },
};
