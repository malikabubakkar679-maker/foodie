export type FoodCategory = {
  id: string;
  name: string;
  icon: string;
  image?: string;
};

export type ProductSizeOption = {
  id: 'small' | 'medium' | 'large';
  name: string;
  inches: string;
  extraPrice: number;
  imageUrl?: string;
  volumeUnit?: 'ml' | 'L';
  volumeValue?: string;
  portionName?: string;
};

export type CrustOption = {
  id: string;
  name: string;
  description: string;
  extraPrice: number;
};

export type ToppingOption = {
  id: string;
  name: string;
  price: number;
  icon: string;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  rating: number;
  reviewsCount: number;
  prepTime: number;
  calories: number;
  ingredients: string[];
  isVeg?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
  imageUrl: string;
  sizes: ProductSizeOption[];
};

export type CartItem = {
  id: string;
  product: Product;
  size: ProductSizeOption;
  crust: CrustOption;
  toppings: ToppingOption[];
  quantity: number;
  unitPrice: number;
  specialInstructions?: string;
};

export type Address = {
  id: string;
  userId: string;
  title: string;
  fullAddress: string;
  city: string;
  phone: string;
  isDefault: boolean;
};

export type OrderStatus = 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered';

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl: string;
};

export type Order = {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  step: number; // 0: Confirmed, 1: Preparing, 2: Out for Delivery, 3: Delivered
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryAddress: string;
  driverName: string;
  driverPhone: string;
  createdAt: string;
  courierProgress?: number;
  adminNotes?: string;
};

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  walletBalance: number;
  role?: 'user' | 'admin';
};

export type ChatMessage = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
};
