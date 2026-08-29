import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, Tag, ShoppingBag, ArrowRight, Sparkles, Check, Flame } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore } from '@/store/useOrderStore';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

// Animated Price Counter Component
const AnimatedPrice: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => {
  return (
    <span className={`inline-flex items-baseline overflow-hidden font-black ${className}`}>
      <span>$</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value.toFixed(2)}
          initial={{ y: 7, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -7, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 350 }}
          className="inline-block"
        >
          {value.toFixed(2)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

// Animated Quantity Stepper Component
const AnimatedQuantity: React.FC<{ quantity: number }> = ({ quantity }) => {
  return (
    <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={quantity}
          initial={{ y: 8, opacity: 0, scale: 0.7 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -8, opacity: 0, scale: 0.7 }}
          transition={{ type: 'spring', damping: 18, stiffness: 380 }}
          className="text-xs font-black text-foodie-charcoal"
        >
          {quantity}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeItem,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDeliveryFee,
    getDiscountAmount,
    getTax,
    getTotal,
  } = useCartStore();

  const { isAuthenticated, openAuthModal } = useAuthStore();
  const openCheckoutModal = useOrderStore((s) => s.openCheckoutModal);

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; text?: string }>({});

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discountAmount = getDiscountAmount();
  const tax = getTax();
  const total = getTotal();

  const freeDeliveryThreshold = 35.0;
  const progressToFreeDelivery = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotal);

  const handleApplyCoupon = (e?: React.FormEvent, codeToUse?: string) => {
    if (e) e.preventDefault();
    const code = codeToUse || couponInput;
    if (!code.trim()) return;
    const res = applyCoupon(code);
    setCouponFeedback({ success: res.success, text: res.message });
    if (!codeToUse) setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      closeCartDrawer();
      openAuthModal('Please sign in or create an account to place your order.', () => {
        openCheckoutModal();
      });
      return;
    }
    closeCartDrawer();
    openCheckoutModal();
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-[9999] overflow-hidden select-none">
          {/* FROSTED GLASS BLURRED BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={closeCartDrawer}
          className="fixed inset-0 bg-black/50 backdrop-blur-md"
        />

        {/* SLIDE-OVER DRAWER PANEL (FROSTED GLASS TYPE DESIGN) */}
        <div className="fixed inset-y-0 right-0 max-w-full flex">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 27, stiffness: 300 }}
            className="w-screen max-w-md bg-white/85 backdrop-blur-2xl border-l border-white/60 shadow-2xl flex flex-col h-full overflow-hidden"
          >
            {/* GLASS HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/60 bg-white/60 backdrop-blur-xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-foodie-yellow to-foodie-amber-dark flex items-center justify-center text-foodie-charcoal shadow-sm">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foodie-charcoal flex items-center gap-1.5">
                    <span>Your Cart</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-foodie-yellow font-black text-foodie-charcoal">
                      {items.length}
                    </span>
                  </h3>
                  <span className="text-[11px] text-foodie-muted font-bold">
                    {items.length === 0 ? 'No items selected' : 'Freshly prepared food items'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs font-black text-foodie-red hover:underline px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={closeCartDrawer}
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-foodie-muted hover:text-foodie-charcoal flex items-center justify-center transition-all active:scale-95"
                  aria-label="Close cart"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* FREE DELIVERY PROGRESS BAR */}
            {items.length > 0 && (
              <div className="px-6 py-3 bg-foodie-yellow-soft/70 border-b border-foodie-border/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-foodie-charcoal">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-foodie-amber-dark" />
                    <span>
                      {remainingForFree <= 0 ? (
                        <span className="text-foodie-green font-black">🎉 You unlocked FREE Delivery!</span>
                      ) : (
                        <span>
                          Add <strong className="text-foodie-amber-dark">{formatCurrency(remainingForFree)}</strong> more for <strong>FREE Delivery</strong>
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="text-[11px] text-foodie-muted font-black">{Math.round(progressToFreeDelivery)}%</span>
                </div>
                <div className="w-full h-2 bg-white/80 rounded-full overflow-hidden border border-foodie-yellow/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToFreeDelivery}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-gradient-to-r from-foodie-yellow to-foodie-amber-dark rounded-full"
                  />
                </div>
              </div>
            )}

            {/* CART ITEMS LIST (ANIMATED) */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <div className="w-20 h-20 bg-white/80 border border-white/90 rounded-3xl flex items-center justify-center text-4xl shadow-md">
                    🛍️
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-foodie-charcoal">Your Cart is Empty</h4>
                    <p className="text-xs sm:text-sm text-foodie-muted max-w-xs leading-relaxed">
                      Add handcrafted pizzas, smash burgers, and delicious desserts to your cart!
                    </p>
                  </div>
                  <Button onClick={closeCartDrawer} className="mt-2 shadow-foodie-glow">
                    Explore Menu 🍕
                  </Button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 60, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white/80 backdrop-blur-xl border border-white/90 hover:border-foodie-yellow/70 rounded-3xl p-3.5 shadow-sm hover:shadow-md transition-all flex gap-3.5 relative group"
                    >
                      {/* Food Thumbnail */}
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-foodie-app border border-foodie-border/60 shrink-0 shadow-inner flex items-center justify-center">
                        <img
                          src={item.product.imageUrl || '/assets/hero-pizza.png'}
                          alt={item.product.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/hero-pizza.png';
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs sm:text-sm font-black text-foodie-charcoal truncate">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-foodie-muted hover:text-foodie-red p-1 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] font-bold text-foodie-amber-dark bg-foodie-yellow-soft px-2 py-0.5 rounded-md">
                              {item.size.name}
                            </span>
                            <span className="text-[11px] text-foodie-muted font-medium truncate">
                              • {item.crust.name}
                            </span>
                          </div>

                          {item.toppings.length > 0 && (
                            <span className="text-[10px] text-foodie-muted font-bold block mt-1 truncate">
                              +{item.toppings.map((t) => t.name).join(', ')}
                            </span>
                          )}
                        </div>

                        {/* Price & Quantity Stepper */}
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-foodie-border/40">
                          {/* Animated item total price */}
                          <AnimatedPrice
                            value={item.unitPrice * item.quantity}
                            className="text-sm font-black text-foodie-charcoal"
                          />

                          {/* Stepper with Animated Counter */}
                          <div className="flex items-center bg-white/95 border border-foodie-border rounded-xl p-0.5 shadow-sm">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-foodie-charcoal hover:bg-foodie-app transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>

                            <AnimatedQuantity quantity={item.quantity} />

                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded-lg bg-foodie-yellow flex items-center justify-center text-foodie-charcoal font-black hover:bg-foodie-yellow-dark transition-colors shadow-sm"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* STICKY GLASS FOOTER WITH BILL BREAKDOWN & ANIMATED COUNTER */}
            {items.length > 0 && (
              <div className="border-t border-white/70 p-5 sm:p-6 bg-white/80 backdrop-blur-2xl space-y-4 shrink-0 shadow-2xl">
                {/* PROMO CODES SECTION */}
                <div className="space-y-2">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-foodie-green">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Promo Code "<strong>{appliedCoupon}</strong>" Applied!</span>
                      </span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-foodie-red hover:underline ml-2 text-xs font-black"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Promo input */}
                      <form onSubmit={(e) => handleApplyCoupon(e)} className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 text-foodie-muted absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="Promo code (FOODIE50)"
                            className="w-full pl-8 pr-3 py-2 text-xs font-extrabold uppercase bg-white/90 border border-foodie-border rounded-xl focus:outline-none focus:border-foodie-yellow"
                          />
                        </div>
                        <Button type="submit" size="sm">
                          Apply
                        </Button>
                      </form>

                      {/* Fast Coupon Chips */}
                      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                        {['FOODIE50 (50% OFF)', 'WELCOME20 (20% OFF)', 'FREESHIP (Free Dev)'].map((code) => {
                          const cleanCode = code.split(' ')[0];
                          return (
                            <button
                              key={code}
                              type="button"
                              onClick={() => handleApplyCoupon(undefined, cleanCode)}
                              className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-foodie-yellow text-[10px] font-black text-foodie-charcoal border border-foodie-border/60 shrink-0 transition-colors shadow-2xs"
                            >
                              🏷️ {cleanCode}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {couponFeedback.text && (
                    <span
                      className={`text-[11px] font-bold block ${
                        couponFeedback.success ? 'text-foodie-green' : 'text-foodie-red'
                      }`}
                    >
                      {couponFeedback.text}
                    </span>
                  )}
                </div>

                {/* BILL SUMMARY WITH ANIMATED PRICES */}
                <div className="space-y-2 text-xs p-3.5 bg-foodie-cream/60 border border-white/80 rounded-2xl shadow-inner">
                  <div className="flex justify-between text-foodie-muted">
                    <span>Subtotal</span>
                    <AnimatedPrice value={subtotal} className="text-foodie-charcoal text-xs" />
                  </div>
                  <div className="flex justify-between text-foodie-muted">
                    <span>Delivery Fee</span>
                    <strong className={deliveryFee === 0 ? 'text-foodie-green font-black' : 'text-foodie-charcoal'}>
                      {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                    </strong>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-foodie-green font-bold">
                      <span>Discount Coupon</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-foodie-muted">
                    <span>Tax (8%)</span>
                    <AnimatedPrice value={tax} className="text-foodie-charcoal text-xs" />
                  </div>
                  <div className="flex justify-between text-base font-black text-foodie-charcoal pt-2 border-t border-foodie-border/60">
                    <span>Total Amount</span>
                    <AnimatedPrice value={total} className="text-base sm:text-lg font-black text-foodie-amber-dark" />
                  </div>
                </div>

                {/* PROCEED BUTTON WITH TAP MOTION */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProceedToCheckout}
                  className="w-full py-4 px-6 bg-gradient-to-r from-foodie-yellow via-[#FFB800] to-foodie-amber-dark text-foodie-charcoal text-sm sm:text-base font-black rounded-2xl shadow-foodie-glow hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <AnimatedPrice value={total} className="text-foodie-charcoal text-sm sm:text-base font-black" />
                  <ArrowRight className="w-4 h-4 ml-1" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    )}
  </AnimatePresence>
  );
};
