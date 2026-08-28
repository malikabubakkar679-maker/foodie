import { Order, CartItem, Address } from '@/types/food.types';

const ORDERS_DB_KEY = 'foodie_user_orders_db';

export const orderService = {
  async getOrders(userId?: string): Promise<Order[]> {
    try {
      const saved = localStorage.getItem(ORDERS_DB_KEY);
      if (saved) {
        const allOrders: Order[] = JSON.parse(saved);
        if (userId) {
          return allOrders.filter((o) => o.userId === userId);
        }
        return allOrders;
      }
    } catch {
      return [];
    }
    // Fresh user has 0 orders by default
    return [];
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
      deliveryAddress: address ? `${address.fullAddress}, ${address.city}` : 'Brooklyn, NY',
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
    } catch {
      allOrders = [];
    }

    const updated = [newOrder, ...allOrders];
    localStorage.setItem(ORDERS_DB_KEY, JSON.stringify(updated));

    return newOrder;
  },
};
