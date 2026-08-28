import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Clock,
  Flame,
  Heart,
  Plus,
  Minus,
  ArrowLeft,
  MessageSquare,
  ShoppingBag,
  Sparkles,
  X,
  Check,
} from 'lucide-react';
import { useFoodStore } from '@/store/useFoodStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { INITIAL_CRUSTS, INITIAL_TOPPINGS } from '@/data/initialData';
import { formatCurrency, cn } from '@/lib/utils';
import { ProductSizeOption, CrustOption, ToppingOption } from '@/types/food.types';
import { useNavigate } from 'react-router-dom';

export const FoodDetailModal: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDetailProduct, closeDetailModal } = useFoodStore();
  const addItemToCart = useCartStore((s) => s.addItem);
  const { isFavorite, toggleFavorite } = useWishlistStore();

  const [selectedSize, setSelectedSize] = useState<ProductSizeOption | null>(null);
  const [selectedCrust, setSelectedCrust] = useState<CrustOption>(INITIAL_CRUSTS[0]);
  const [selectedToppings, setSelectedToppings] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');
  const [rotateKey, setRotateKey] = useState(0);

  // Reset modal state when product changes
  useEffect(() => {
    if (selectedDetailProduct) {
      setSelectedSize(selectedDetailProduct.sizes[0] || null);
      setSelectedCrust(INITIAL_CRUSTS[0]);
      setSelectedToppings(new Set());
      setQuantity(1);
      setSpecialNotes('');
      setRotateKey(0);
    }
  }, [selectedDetailProduct]);

  if (!selectedDetailProduct) return null;

  const isFav = isFavorite(selectedDetailProduct.id);

  // Dynamic price calculation
  const basePrice = selectedDetailProduct.basePrice;
  const sizeExtra = selectedSize ? selectedSize.extraPrice : 0;
  const crustExtra = selectedCrust.extraPrice;
  let toppingsExtra = 0;
  selectedToppings.forEach((topId) => {
    const top = INITIAL_TOPPINGS.find((t) => t.id === topId);
    if (top) toppingsExtra += top.price;
  });

  const unitPrice = basePrice + sizeExtra + crustExtra + toppingsExtra;
  const totalPrice = unitPrice * quantity;

  // Toggle Topping
  const handleToggleTopping = (toppingId: string) => {
    setSelectedToppings((prev) => {
      const next = new Set(prev);
      if (next.has(toppingId)) {
        next.delete(toppingId);
      } else {
        next.add(toppingId);
      }
      return next;
    });
  };

  // Switch size with dynamic rotation & scale trigger
  const handleSelectSize = (s: ProductSizeOption) => {
    setSelectedSize(s);
    setRotateKey((prev) => prev + 1);
  };

  // Add to Cart
  const handleAddToCart = () => {
    if (!selectedSize) return;
    const toppingsList = Array.from(selectedToppings)
      .map((id) => INITIAL_TOPPINGS.find((t) => t.id === id))
      .filter(Boolean) as ToppingOption[];

    addItemToCart(
      selectedDetailProduct,
      selectedSize,
      selectedCrust,
      toppingsList,
      quantity,
      specialNotes
    );
    closeDetailModal();
  };

  const handleOpenChat = () => {
    closeDetailModal();
    navigate('/chat');
  };

  // Dynamic Size Morphing Scale Config
  const sizeScaleVariants = {
    small: { scale: 0.78, y: 0 },
    medium: { scale: 1.0, y: 0 },
    large: { scale: 1.22, y: 0 },
  };

  const currentSizeKey = (selectedSize?.id as 'small' | 'medium' | 'large') || 'small';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden select-none">
        {/* FROSTED GLASS BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={closeDetailModal}
          className="fixed inset-0 bg-black/65 backdrop-blur-xl"
        />

        {/* FULL SCREEN IMMERSIVE MOBILE / DESKTOP MODAL */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:max-w-2xl bg-white/95 backdrop-blur-2xl border border-white/80 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col my-0 sm:my-auto"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-foodie-yellow/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-10 w-60 h-60 bg-foodie-orange/15 rounded-full blur-3xl pointer-events-none" />

          {/* TOP BAR: BACK ICON & FAVORITE / CLOSE */}
          <div className="sticky top-0 z-30 flex items-center justify-between p-4 sm:p-5 bg-white/80 backdrop-blur-xl border-b border-white/60">
            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={closeDetailModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-foodie-border text-foodie-charcoal text-xs font-black shadow-sm hover:bg-foodie-yellow-soft transition-all"
              aria-label="Back to Menu"
            >
              <ArrowLeft className="w-4 h-4 text-foodie-charcoal" />
              <span>Back to Menu</span>
            </motion.button>

            {/* Top Right Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => toggleFavorite(selectedDetailProduct.id)}
                className="w-9 h-9 rounded-2xl bg-white border border-foodie-border shadow-sm flex items-center justify-center text-foodie-charcoal hover:text-foodie-red transition-colors"
                aria-label="Favorite"
              >
                <Heart className={cn('w-4 h-4', isFav && 'fill-foodie-red text-foodie-red')} />
              </motion.button>

              <button
                onClick={closeDetailModal}
                className="w-9 h-9 rounded-2xl bg-black/5 hover:bg-black/10 text-foodie-muted hover:text-foodie-charcoal flex items-center justify-center transition-all"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SCROLLABLE BODY */}
          <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
            
            {/* 1. HERO 3D FOOD ARTWORK STAGE (100% TRANSPARENT WITH ROTATION & SIZE MORPHING) */}
            <div className="relative w-full h-64 sm:h-76 bg-gradient-to-b from-foodie-yellow-soft/50 via-white/50 to-white/70 border border-white/80 rounded-3xl flex items-center justify-center overflow-hidden p-6 shadow-inner">
              <motion.div
                key={rotateKey}
                layout
                animate={sizeScaleVariants[currentSizeKey] || sizeScaleVariants.small}
                transition={{
                  scale: { type: 'spring', damping: 16, stiffness: 220 },
                  layout: { duration: 0.35 },
                }}
                className="relative shrink-0 flex items-center justify-center select-none"
              >
                <motion.img
                  src={selectedDetailProduct.imageUrl}
                  alt={selectedDetailProduct.name}
                  animate={{
                    y: [0, -6, 0],
                    rotate: [0, 8, -8, 0],
                  }}
                  transition={{
                    y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 0.45, ease: 'easeOut' },
                  }}
                  className="max-h-48 sm:max-h-56 w-auto object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.25)]"
                />
              </motion.div>

              {/* Dynamic Size Indicator Badge */}
              <span className="absolute bottom-3 right-3 px-3.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-black text-foodie-charcoal shadow-sm border border-white/80 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-foodie-amber-dark" />
                <span>Portion: {selectedSize?.name || 'Small'} ({selectedSize?.inches})</span>
              </span>
            </div>

            {/* 2. DIRECTLY BELOW IMAGE: SIZE SELECTOR BUTTONS (SMALL, MEDIUM, LARGE) */}
            <div className="p-4 bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-foodie-charcoal flex items-center gap-1.5">
                  <span>Choose Portion Size</span>
                  <span className="text-[10px] text-foodie-muted font-bold">(Tap to morph 3D image)</span>
                </h4>
                <span className="text-xs font-black text-foodie-amber-dark">
                  {selectedSize?.name} Size
                </span>
              </div>

              {/* Size Buttons Row with Animated Spring Layout */}
              <div className="grid grid-cols-3 gap-3">
                {selectedDetailProduct.sizes.map((s) => {
                  const isSizeActive = selectedSize?.id === s.id;
                  return (
                    <motion.button
                      key={s.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectSize(s)}
                      className={cn(
                        'relative flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl border transition-all text-center select-none overflow-hidden',
                        isSizeActive
                          ? 'border-foodie-yellow-dark bg-gradient-to-b from-foodie-yellow-soft to-foodie-yellow-light text-foodie-charcoal shadow-md shadow-foodie-yellow/20'
                          : 'border-white/80 bg-white/70 hover:bg-white text-foodie-charcoal hover:border-foodie-yellow/60'
                      )}
                    >
                      <strong className="text-sm font-black text-foodie-charcoal">{s.name}</strong>
                      <span className="text-[11px] text-foodie-muted font-bold mt-0.5">{s.inches}</span>
                      <span className="text-xs font-black text-foodie-amber-dark mt-1">
                        {s.extraPrice > 0 ? `+${formatCurrency(s.extraPrice)}` : 'Base Price'}
                      </span>

                      {isSizeActive && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-foodie-yellow flex items-center justify-center text-[9px] font-black text-foodie-charcoal shadow-2xs">
                          ✓
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 3. TITLE, RATING & PRICE ROW */}
            <div className="flex items-start justify-between gap-4 pt-1">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-foodie-charcoal tracking-tight">
                  {selectedDetailProduct.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-xs font-black text-foodie-charcoal">
                    <Star className="w-4 h-4 fill-foodie-yellow text-foodie-yellow" />
                    <span>{selectedDetailProduct.rating.toFixed(1)}</span>
                  </span>
                  <span className="text-xs text-foodie-muted font-semibold">
                    ({selectedDetailProduct.reviewsCount} reviews)
                  </span>
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-foodie-amber-dark bg-foodie-yellow-soft px-4 py-2 rounded-2xl border border-foodie-yellow/40 shadow-sm shrink-0">
                {formatCurrency(unitPrice)}
              </div>
            </div>

            {/* 4. QUICK META BADGES */}
            <div className="flex flex-wrap gap-2 text-xs font-bold text-foodie-charcoal">
              <span className="flex items-center gap-1.5 bg-white/80 border border-white/80 px-3 py-1.5 rounded-xl shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-foodie-amber-dark" />
                <span>{selectedDetailProduct.prepTime} mins prep</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/80 border border-white/80 px-3 py-1.5 rounded-xl shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-foodie-orange" />
                <span>{selectedDetailProduct.calories} kcal</span>
              </span>
              {selectedDetailProduct.isVeg && (
                <span className="bg-emerald-50 text-foodie-green px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
                  🌱 100% Vegetarian
                </span>
              )}
            </div>

            {/* 5. FULL DESCRIPTION */}
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-foodie-muted">About This Dish</h4>
              <p className="text-xs sm:text-sm text-foodie-charcoal/90 font-medium leading-relaxed">
                {selectedDetailProduct.description}
              </p>
            </div>

            {/* 6. INGREDIENTS LIST */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-foodie-muted mb-2">Key Ingredients</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedDetailProduct.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="px-3 py-1 bg-white/80 border border-white/80 rounded-xl text-xs font-bold text-foodie-charcoal shadow-2xs"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <hr className="border-foodie-border/60" />

            {/* 7. ARTISAN CRUST SELECTOR */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-foodie-charcoal">
                Choose Artisan Crust
              </h4>
              <div className="space-y-2">
                {INITIAL_CRUSTS.map((c) => {
                  const isCrustActive = selectedCrust.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCrust(c)}
                      className={cn(
                        'w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all',
                        isCrustActive
                          ? 'border-foodie-yellow-dark bg-foodie-yellow-soft shadow-sm'
                          : 'border-white/80 bg-white/70 hover:bg-white hover:border-foodie-yellow/50'
                      )}
                    >
                      <div>
                        <strong className="text-xs sm:text-sm font-bold text-foodie-charcoal block">{c.name}</strong>
                        <span className="text-[11px] text-foodie-muted">{c.description}</span>
                      </div>
                      <span className="text-xs font-black text-foodie-charcoal shrink-0 ml-2">
                        {c.extraPrice > 0 ? `+${formatCurrency(c.extraPrice)}` : 'Free'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 8. EXTRA TOPPINGS */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-foodie-charcoal">
                Add Extra Gourmet Toppings
              </h4>
              <div className="flex flex-wrap gap-2">
                {INITIAL_TOPPINGS.map((t) => {
                  const isSelected = selectedToppings.has(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleToggleTopping(t.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-bold transition-all',
                        isSelected
                          ? 'bg-foodie-yellow border-foodie-yellow-dark text-foodie-charcoal font-black shadow-sm'
                          : 'bg-white/80 border-white/80 text-foodie-charcoal hover:border-foodie-yellow/60'
                      )}
                    >
                      <span>{t.icon}</span>
                      <span>{t.name}</span>
                      <span className="text-foodie-amber-dark">+{formatCurrency(t.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 9. SPECIAL COOKING INSTRUCTIONS */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-foodie-charcoal mb-2">
                Special Cooking Instructions
              </h4>
              <textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. Well done, extra crispy, sauce on the side..."
                rows={2}
                className="w-full rounded-2xl border border-white/80 p-3 text-xs sm:text-sm text-foodie-charcoal placeholder:text-foodie-muted focus:outline-none focus:border-foodie-yellow resize-none bg-white/80"
              />
            </div>
          </div>

          {/* DESIGNER STICKY BOTTOM BAR WITH STEPPER, CHAT BUTTON & ADD TO CART */}
          <div className="sticky bottom-0 bg-white/90 backdrop-blur-2xl border-t border-white/70 p-4 sm:p-5 flex items-center gap-3 shrink-0 shadow-2xl">
            {/* Designer Stepper */}
            <div className="flex items-center bg-white/80 backdrop-blur-md border border-foodie-border/80 rounded-2xl p-1 shrink-0 shadow-inner">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-xl bg-white flex items-center justify-center font-black text-foodie-charcoal shadow-sm hover:bg-foodie-yellow-soft transition-colors"
                aria-label="Decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </motion.button>
              <span className="w-8 text-center text-sm font-black text-foodie-charcoal">
                {quantity}
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-xl bg-foodie-yellow flex items-center justify-center font-black text-foodie-charcoal shadow-sm hover:bg-foodie-yellow-dark transition-colors"
                aria-label="Increase"
              >
                <Plus className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Designer Chat Shortcut Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleOpenChat}
              className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md border border-foodie-border/80 hover:border-foodie-yellow flex items-center justify-center text-foodie-charcoal hover:bg-foodie-yellow-soft shadow-sm transition-all shrink-0"
              title="Chat / Ask chef about this dish"
            >
              <MessageSquare className="w-5 h-5 text-foodie-amber-dark" />
            </motion.button>

            {/* Designer Add to Cart CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-5 bg-gradient-to-r from-foodie-yellow via-[#FFB800] to-foodie-amber-dark hover:from-foodie-yellow-dark hover:to-foodie-orange text-foodie-charcoal text-sm sm:text-base font-black rounded-2xl shadow-foodie-glow hover:shadow-xl transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </div>
              <span className="text-base font-black">{formatCurrency(totalPrice)}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
