export type NotificationType =
  | 'welcome'
  | 'deal'
  | 'cart'
  | 'order_confirmed'
  | 'out_for_delivery'
  | 'order_delivered'
  | 'order_cancelled'
  | 'auth_prompt';

export interface FoodieNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  detailDescription?: string;
  time: string;
  timestamp?: number;
  icon: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  bannerImage?: string;
  code?: string;
}
