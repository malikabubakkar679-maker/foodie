import { create } from 'zustand';
import { CartItem, Product, ProductSizeOption, CrustOption, ToppingOption } from '@/types/food.types';
import { useNotificationStore } from './useNotificationStore';

interface CartState {
  items: CartItem[];
  isCartDrawerOpen: boolean;
  appliedCoupon: string | null;
  discountPercentage: number;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addItem: (
    product: Product,
    size: ProductSizeOption,
    crust: CrustOption,
    toppings: ToppingOption[],
    quantity: number,
    specialInstructions?: string
  ) => void;
  quickAdd: (product: Product) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getDiscountAmount: () => number;
  getTax: () => number;
  getTotal: () => number;
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isCartDrawerOpen: false,
  appliedCoupon: null,
  discountPercentage: 0,

  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),

  addItem: (product, size, crust, toppings, quantity, specialInstructions = '') => {
    let unitPrice = product.basePrice + size.extraPrice + crust.extraPrice;
    toppings.forEach((t) => (unitPrice += t.price));

    const newItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      product,
      size,
      crust,
      toppings,
      quantity,
      unitPrice,
      specialInstructions,
    };

    set((state) => ({
      items: [...state.items, newItem],
    }));

    // Trigger Top-to-Bottom Animated Notification Toast
    useNotificationStore.getState().addNotification({
      type: 'cart',
      title: 'Added to Cart! 🛍️',
      message: `${quantity}x ${product.name} (${size.name}) added to your feast.`,
      icon: '🛍️',
      actionLabel: 'Open Cart',
    });
  },

  quickAdd: (product) => {
    const defaultSize = product.sizes[0] || {
      id: 'small',
      name: 'Small',
      inches: '10" (6 slices)',
      extraPrice: 0.0,
    };
    const defaultCrust = {
      id: 'c1',
      name: 'Classic Hand Tossed',
      description: 'Stone-baked crispy base',
      extraPrice: 0.0,
    };

    const newItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      product,
      size: defaultSize,
      crust: defaultCrust,
      toppings: [],
      quantity: 1,
      unitPrice: product.basePrice,
      specialInstructions: '',
    };

    set((state) => ({
      items: [...state.items, newItem],
    }));

    // Trigger Top-to-Bottom Animated Notification Toast
    useNotificationStore.getState().addNotification({
      type: 'cart',
      title: 'Added to Cart! 🍕',
      message: `${product.name} added to your cart.`,
      icon: '🍕',
      actionLabel: 'View Cart',
    });
  },

  updateQuantity: (id, delta) => {
    set((state) => {
      const updated = state.items
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      return { items: updated };
    });
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  clearCart: () => set({ items: [], appliedCoupon: null, discountPercentage: 0 }),

  applyCoupon: (code) => {
    const normalized = code.trim().toUpperCase();

    if (normalized === 'FOODIE50') {
      set({ appliedCoupon: 'FOODIE50', discountPercentage: 0.5 });
      useNotificationStore.getState().addNotification({
        type: 'deal',
        title: '50% Promo Applied! 🎉',
        message: 'Congratulations! 50% discount has been applied to your subtotal.',
        icon: '🏷️',
        actionLabel: 'Checkout',
      });
      return { success: true, message: '🎉 50% discount coupon applied!' };
    }

    if (normalized === 'WELCOME20') {
      set({ appliedCoupon: 'WELCOME20', discountPercentage: 0.2 });
      useNotificationStore.getState().addNotification({
        type: 'deal',
        title: '20% Promo Applied! ✨',
        message: '20% Welcome discount applied successfully.',
        icon: '🏷️',
        actionLabel: 'Checkout',
      });
      return { success: true, message: '✨ 20% discount coupon applied!' };
    }

    if (normalized === 'FREESHIP') {
      set({ appliedCoupon: 'FREESHIP', discountPercentage: 0.05 });
      useNotificationStore.getState().addNotification({
        type: 'deal',
        title: 'Free Delivery Unlocked! 🛵',
        message: 'Free shipping promo code activated on your order.',
        icon: '🛵',
        actionLabel: 'Checkout',
      });
      return { success: true, message: '🛵 Free delivery coupon applied!' };
    }

    return { success: false, message: 'Invalid or expired coupon code' };
  },

  removeCoupon: () => {
    set({ appliedCoupon: null, discountPercentage: 0 });
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  },

  getDeliveryFee: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    if (get().appliedCoupon === 'FREESHIP') return 0;
    return subtotal >= 35.0 ? 0.0 : 3.99;
  },

  getDiscountAmount: () => {
    const subtotal = get().getSubtotal();
    return subtotal * get().discountPercentage;
  },

  getTax: () => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscountAmount();
    const taxableAmount = Math.max(0, subtotal - discount);
    return taxableAmount * 0.08;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    const delivery = get().getDeliveryFee();
    const discount = get().getDiscountAmount();
    const tax = get().getTax();
    return Math.max(0, subtotal - discount + delivery + tax);
  },

  getTotalItemsCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
