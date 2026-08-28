import { Order, OrderStatus } from '@/types/food.types';

export type RealtimeOrderEvent =
  | { type: 'ORDER_CREATED'; order: Order; timestamp: number }
  | { type: 'ORDER_STATUS_UPDATED'; orderId: string; status: OrderStatus; step: number; courierProgress?: number; timestamp: number; order?: Order }
  | { type: 'DRIVER_ASSIGNED'; orderId: string; driverName: string; driverPhone: string; timestamp: number }
  | { type: 'ORDER_DELETED'; orderId: string; timestamp: number }
  | { type: 'ORDERS_SYNC'; orders: Order[]; timestamp: number };

type Listener = (event: RealtimeOrderEvent) => void;

class RealtimeOrderSyncService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<Listener> = new Set();
  private channelName = 'foodie_realtime_orders_channel';
  private storageKey = 'foodie_realtime_order_event_ping';

  constructor() {
    this.initChannel();
  }

  private initChannel() {
    if (typeof window !== 'undefined') {
      try {
        if ('BroadcastChannel' in window) {
          this.channel = new BroadcastChannel(this.channelName);
          this.channel.onmessage = (e: MessageEvent<RealtimeOrderEvent>) => {
            if (e.data && e.data.type) {
              this.notify(e.data);
            }
          };
        }
      } catch (err) {
        console.warn('BroadcastChannel not available, falling back to storage listener:', err);
      }

      // Storage event listener fallback for cross-tab sync
      window.addEventListener('storage', (e: StorageEvent) => {
        if (e.key === this.storageKey && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue) as RealtimeOrderEvent;
            this.notify(parsed);
          } catch {
            // ignore
          }
        }
      });
    }
  }

  private notify(event: RealtimeOrderEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in realtime order listener:', err);
      }
    });
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public broadcast(event: RealtimeOrderEvent) {
    // Notify local listeners
    this.notify(event);

    // Broadcast cross-tab via BroadcastChannel
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch (err) {
        console.warn('BroadcastChannel postMessage error:', err);
      }
    }

    // Broadcast cross-tab via localStorage event
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(event));
      } catch {
        // ignore
      }
    }
  }

  public broadcastOrderCreated(order: Order) {
    this.broadcast({
      type: 'ORDER_CREATED',
      order,
      timestamp: Date.now(),
    });
  }

  public broadcastStatusUpdated(orderId: string, status: OrderStatus, step: number, courierProgress?: number, order?: Order) {
    this.broadcast({
      type: 'ORDER_STATUS_UPDATED',
      orderId,
      status,
      step,
      courierProgress,
      order,
      timestamp: Date.now(),
    });
  }

  public broadcastDriverAssigned(orderId: string, driverName: string, driverPhone: string) {
    this.broadcast({
      type: 'DRIVER_ASSIGNED',
      orderId,
      driverName,
      driverPhone,
      timestamp: Date.now(),
    });
  }

  public broadcastOrderDeleted(orderId: string) {
    this.broadcast({
      type: 'ORDER_DELETED',
      orderId,
      timestamp: Date.now(),
    });
  }

  public broadcastAllOrdersSync(orders: Order[]) {
    this.broadcast({
      type: 'ORDERS_SYNC',
      orders,
      timestamp: Date.now(),
    });
  }
}

export const realtimeOrderSync = new RealtimeOrderSyncService();
