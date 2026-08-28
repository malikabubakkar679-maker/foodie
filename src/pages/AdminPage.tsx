import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  Package,
  PlusCircle,
  BarChart3,
  Search,
  CheckCircle2,
  Clock,
  Bike,
  Trash2,
  Edit3,
  Sparkles,
  UploadCloud,
  Check,
  Flame,
  Star,
  MapPin,
  Phone,
  Layers,
  Pizza,
  Sandwich,
  Coffee,
  Cake,
  RefreshCw,
  Eye,
  Sliders,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  ArrowLeft,
  X,
} from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { useFoodStore } from '@/store/useFoodStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Product, Order, OrderStatus, ProductSizeOption } from '@/types/food.types';
import { INITIAL_CRUSTS, INITIAL_TOPPINGS } from '@/data/initialData';
import { formatCurrency, cn } from '@/lib/utils';
import { removeImageBackground } from '@/lib/imageBgRemover';
import confetti from 'canvas-confetti';

type AdminTab = 'orders' | 'catalog' | 'add_item' | 'analytics';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { orders, fetchAllOrdersAdmin, updateOrderStatus, assignDriver, deleteOrder } = useOrderStore();
  const { categories, products, addProduct, updateProduct, deleteProduct, fetchData } = useFoodStore();
  const { showToast } = useNotificationStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [catalogCategory, setCatalogCategory] = useState<string>('all');
  const [catalogSearch, setCatalogSearch] = useState<string>('');

  // Add Item Form State
  const [formCategory, setFormCategory] = useState<string>('c_pizza');
  const [formName, setFormName] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formBasePrice, setFormBasePrice] = useState<number>(14.99);
  const [formPrepTime, setFormPrepTime] = useState<number>(20);
  const [formCalories, setFormCalories] = useState<number>(780);
  const [formIngredients, setFormIngredients] = useState<string>('San Marzano Tomatoes, Fresh Mozzarella, Basil, Olive Oil');
  const [formIsVeg, setFormIsVeg] = useState<boolean>(true);
  const [formIsSpicy, setFormIsSpicy] = useState<boolean>(false);
  const [formIsPopular, setFormIsPopular] = useState<boolean>(true);

  // Category-Specific Dynamic Attributes
  // Pizza
  const [pizzaSmallPrice, setPizzaSmallPrice] = useState<number>(0);
  const [pizzaMediumPrice, setPizzaMediumPrice] = useState<number>(4.5);
  const [pizzaLargePrice, setPizzaLargePrice] = useState<number>(8.0);
  // Drink
  const [drinkUnit, setDrinkUnit] = useState<'ml' | 'L'>('ml');
  const [drinkVolumeValue, setDrinkVolumeValue] = useState<string>('500ml');
  // Burger
  const [burgerPattyCount, setBurgerPattyCount] = useState<string>('Double Patty (280g)');
  // Dessert
  const [dessertPortion, setDessertPortion] = useState<string>('Single Slice (180g)');

  // Studio Image Uploader & Auto BG Remover State
  const [rawImageInput, setRawImageInput] = useState<string>('');
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('/assets/hero-pizza.png');
  const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);

  useEffect(() => {
    fetchAllOrdersAdmin();
    fetchData();
  }, [fetchAllOrdersAdmin, fetchData]);

  // Handle Image File Upload with Auto BG Removal
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      setRawImageInput(result);
      setIsRemovingBg(true);

      try {
        const transparentImg = await removeImageBackground(result, { tolerance: 35, feather: 2 });
        setProcessedImageUrl(transparentImg);
        showToast({
          title: 'Background Removed! ✨',
          message: 'AI extracted studio-grade transparent food asset.',
          type: 'deal',
          icon: '🪄',
        });
      } catch {
        setProcessedImageUrl(result);
      } finally {
        setIsRemovingBg(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Trigger manual background removal on pasted URL / image
  const handleManualBgRemoval = async () => {
    if (!rawImageInput && !processedImageUrl) return;
    setIsRemovingBg(true);
    try {
      const src = rawImageInput || processedImageUrl;
      const transparentImg = await removeImageBackground(src, { tolerance: 38, feather: 2 });
      setProcessedImageUrl(transparentImg);
      showToast({
        title: 'Background Cleaned! 🪄',
        message: 'Transparent PNG generated successfully.',
        type: 'deal',
        icon: '✨',
      });
    } catch {
      showToast({
        title: 'Notice',
        message: 'Could not remove background on cross-origin URL. Using direct image.',
        type: 'welcome',
        icon: '⚠️',
      });
    } finally {
      setIsRemovingBg(false);
    }
  };

  // Submit New Product to Store
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter a product name');
      return;
    }

    let sizes: ProductSizeOption[] = [];

    if (formCategory === 'c_pizza') {
      sizes = [
        { id: 'small', name: 'Small', inches: '10"', extraPrice: pizzaSmallPrice, imageUrl: processedImageUrl },
        { id: 'medium', name: 'Medium', inches: '12"', extraPrice: pizzaMediumPrice, imageUrl: processedImageUrl },
        { id: 'large', name: 'Large', inches: '14"', extraPrice: pizzaLargePrice, imageUrl: processedImageUrl },
      ];
    } else if (formCategory === 'c_drinks') {
      sizes = [
        { id: 'small', name: 'Can / Small', inches: '250ml', extraPrice: 0, volumeUnit: drinkUnit, volumeValue: '250ml', imageUrl: processedImageUrl },
        { id: 'medium', name: 'Bottle / Medium', inches: '500ml', extraPrice: 1.5, volumeUnit: drinkUnit, volumeValue: '500ml', imageUrl: processedImageUrl },
        { id: 'large', name: 'Pitcher / Large', inches: '1.5L', extraPrice: 3.5, volumeUnit: drinkUnit, volumeValue: '1.5L', imageUrl: processedImageUrl },
      ];
    } else if (formCategory === 'c_burgers') {
      sizes = [
        { id: 'small', name: 'Single Patty', inches: '150g', extraPrice: 0, portionName: 'Single', imageUrl: processedImageUrl },
        { id: 'medium', name: 'Double Patty', inches: '280g', extraPrice: 3.0, portionName: burgerPattyCount, imageUrl: processedImageUrl },
        { id: 'large', name: 'Triple Monster', inches: '420g', extraPrice: 5.5, portionName: 'Monster 3-Patty', imageUrl: processedImageUrl },
      ];
    } else {
      sizes = [
        { id: 'small', name: 'Regular Portion', inches: dessertPortion, extraPrice: 0, imageUrl: processedImageUrl },
        { id: 'large', name: 'Large Feast', inches: 'Family Size', extraPrice: 4.5, imageUrl: processedImageUrl },
      ];
    }

    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      categoryId: formCategory,
      name: formName.trim(),
      description: formDescription.trim() || 'Delicious chef specialty prepared fresh with premium quality ingredients.',
      basePrice: Number(formBasePrice),
      rating: 4.9,
      reviewsCount: 1,
      prepTime: Number(formPrepTime),
      calories: Number(formCalories),
      ingredients: formIngredients.split(',').map((s) => s.trim()).filter(Boolean),
      isVeg: formIsVeg,
      isSpicy: formIsSpicy,
      isPopular: formIsPopular,
      imageUrl: processedImageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
      sizes,
    };

    addProduct(newProduct);
    confetti({ particleCount: 80, spread: 60 });

    showToast({
      title: 'Dish Published Live! 🍕',
      message: `${newProduct.name} is now active on the customer menu!`,
      type: 'deal',
      icon: '🎉',
    });

    // Reset Form
    setFormName('');
    setFormDescription('');
    setActiveTab('catalog');
  };

  // Metrics Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'Delivered').length;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status.toLowerCase().replace(/\s+/g, '_') === orderFilter;
  });

  const filteredCatalog = products.filter((p) => {
    if (catalogCategory !== 'all' && p.categoryId !== catalogCategory) return false;
    if (catalogSearch.trim()) {
      const q = catalogSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white pb-20 select-none">
      {/* 1. TOP LUXURY ADMIN APP BAR */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-zinc-200 transition-all border border-white/10"
            title="Return to Customer Storefront"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Storefront</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-foodie-yellow flex items-center justify-center text-foodie-charcoal font-black shadow-foodie-glow text-sm">
              ⚡
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-tight flex items-center gap-1.5">
                <span>Foodie Admin Center</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] text-amber-300 font-extrabold uppercase tracking-wider">
                  Live Sync
                </span>
              </h1>
              <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">
                Real-time Order Telemetry & Multi-Category Catalog Suite
              </p>
            </div>
          </div>
        </div>

        {/* Right Status Indicator & Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              fetchAllOrdersAdmin();
              fetchData();
              showToast({ title: 'Synced!', message: 'Live orders & catalog reloaded.', type: 'welcome', icon: '🔄' });
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 transition-all border border-white/10 active:scale-95"
            title="Refresh Live DB"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Connected</span>
          </div>
        </div>
      </header>

      {/* 2. ADMIN STATS TICKER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Total Orders
              </span>
              <strong className="text-xl sm:text-2xl font-black text-white">{orders.length}</strong>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                Active Fleet
              </span>
              <strong className="text-xl sm:text-2xl font-black text-amber-300">{activeOrdersCount}</strong>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bike className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Revenue
              </span>
              <strong className="text-xl sm:text-2xl font-black text-emerald-300">
                {formatCurrency(totalRevenue)}
              </strong>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                Menu Items
              </span>
              <strong className="text-xl sm:text-2xl font-black text-purple-300">
                {products.length}
              </strong>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="flex items-center gap-2 p-1.5 bg-zinc-900/90 border border-white/10 rounded-2xl backdrop-blur-xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0',
              activeTab === 'orders'
                ? 'bg-foodie-yellow text-foodie-charcoal shadow-foodie-glow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            )}
          >
            <Bike className="w-4 h-4" />
            <span>1. Live Orders & Fleet GPS ({activeOrdersCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0',
              activeTab === 'catalog'
                ? 'bg-foodie-yellow text-foodie-charcoal shadow-foodie-glow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            )}
          >
            <Store className="w-4 h-4" />
            <span>2. Menu Catalog Manager ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add_item')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0',
              activeTab === 'add_item'
                ? 'bg-foodie-yellow text-foodie-charcoal shadow-foodie-glow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            )}
          >
            <PlusCircle className="w-4 h-4" />
            <span>3. Add Dish + Studio BG Remover</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0',
              activeTab === 'analytics'
                ? 'bg-foodie-yellow text-foodie-charcoal shadow-foodie-glow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            )}
          >
            <BarChart3 className="w-4 h-4" />
            <span>4. Analytics & Sales</span>
          </button>
        </div>
      </div>

      {/* 4. MAIN TAB CONTENT PANELS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        
        {/* =========================================================================
            TAB 1: LIVE ORDERS & FLEET GPS SYNC
           ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter pills */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'All Orders' },
                  { id: 'confirmed', label: 'Confirmed 📦' },
                  { id: 'preparing', label: 'In Oven 🔥' },
                  { id: 'out_for_delivery', label: 'On Road 🛵' },
                  { id: 'delivered', label: 'Delivered ✅' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setOrderFilter(f.id)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0',
                      orderFilter === f.id
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                        : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <span className="text-xs text-zinc-400 font-bold">
                Showing {filteredOrders.length} orders
              </span>
            </div>

            {/* Orders Grid / Cards */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-zinc-900/60 border border-white/10 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-2xl">
                  📦
                </div>
                <h3 className="text-base font-black text-white">No orders matching this filter</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  When customers place orders on the app, they will appear here live with interactive GPS sync controls!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOrders.map((order) => {
                  const step = order.step ?? (order.status === 'Delivered' ? 3 : order.status === 'Out for Delivery' ? 2 : order.status === 'Preparing' ? 1 : 0);

                  return (
                    <motion.div
                      key={order.id}
                      layout
                      className="p-5 rounded-3xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-xl space-y-4 hover:border-amber-400/40 transition-all"
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-base font-black text-white">
                              Order #{order.orderNumber}
                            </strong>
                            <span
                              className={cn(
                                'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider',
                                order.status === 'Delivered'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : order.status === 'Out for Delivery'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              )}
                            >
                              {order.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-zinc-400">{order.createdAt}</span>
                        </div>

                        <div className="text-right">
                          <strong className="text-base font-black text-amber-300">
                            {formatCurrency(order.total)}
                          </strong>
                          <span className="text-[10px] text-zinc-400 block font-bold">
                            {order.items.length} item(s)
                          </span>
                        </div>
                      </div>

                      {/* Items Summary */}
                      <div className="space-y-1.5 bg-black/40 p-3 rounded-2xl border border-white/5 text-xs">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-zinc-300 font-medium">
                            <span className="truncate max-w-[200px]">
                              {it.quantity}× {it.productName} ({it.size})
                            </span>
                            <span className="font-bold">{formatCurrency(it.totalPrice)}</span>
                          </div>
                        ))}
                        <div className="pt-2 mt-1 border-t border-white/10 flex items-center gap-1 text-[11px] text-zinc-400">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">{order.deliveryAddress || '742 Evergreen Terrace, Brooklyn, NY'}</span>
                        </div>
                      </div>

                      {/* Driver & Telemetry */}
                      <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300 font-bold">
                            🛵
                          </div>
                          <div>
                            <span className="font-black text-white block leading-tight">
                              {order.driverName || 'Alex Courier'}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium">
                              {order.driverPhone || '+1 555-456-7890'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const newDriver = prompt('Enter assigned driver name:', order.driverName || 'Alex Courier');
                            if (newDriver) assignDriver(order.id, newDriver, '+1 555-789-0123');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-zinc-300 transition-colors"
                        >
                          Reassign Driver
                        </button>
                      </div>

                      {/* REAL-TIME LIVE GPS STEP ADVANCER */}
                      <div className="space-y-2 pt-1">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                          ⚡ Real Sync Live GPS Status
                        </span>
                        
                        <div className="grid grid-cols-4 gap-1.5">
                          {[
                            { name: '1. Confirmed', status: 'Confirmed' as OrderStatus, s: 0, icon: '📦' },
                            { name: '2. In Oven', status: 'Preparing' as OrderStatus, s: 1, icon: '🔥' },
                            { name: '3. On Road', status: 'Out for Delivery' as OrderStatus, s: 2, icon: '🛵' },
                            { name: '4. Delivered', status: 'Delivered' as OrderStatus, s: 3, icon: '✅' },
                          ].map((st) => (
                            <button
                              key={st.s}
                              onClick={() => updateOrderStatus(order.id, st.status, st.s)}
                              className={cn(
                                'py-2 px-1 rounded-xl text-[11px] font-extrabold border transition-all flex flex-col items-center gap-1',
                                step === st.s
                                  ? 'bg-foodie-yellow text-foodie-charcoal border-amber-300 shadow-md scale-102'
                                  : 'bg-zinc-800/80 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                              )}
                            >
                              <span>{st.icon}</span>
                              <span className="truncate">{st.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Delete action */}
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            if (confirm(`Delete order #${order.orderNumber}?`)) {
                              deleteOrder(order.id);
                              showToast({ title: 'Order Removed', message: 'Order deleted from database.', type: 'welcome', icon: '🗑️' });
                            }
                          }}
                          className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Order</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: MENU CATALOG MANAGER
           ========================================================================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Search & Category Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search dishes or ingredients..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-900 border border-white/10 text-xs font-bold text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
                <button
                  onClick={() => setCatalogCategory('all')}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-xs font-black border transition-all shrink-0',
                    catalogCategory === 'all'
                      ? 'bg-amber-400 text-foodie-charcoal border-amber-300 shadow-sm'
                      : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
                  )}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCatalogCategory(c.id)}
                    className={cn(
                      'px-3.5 py-2 rounded-xl text-xs font-black border transition-all shrink-0',
                      catalogCategory === c.id
                        ? 'bg-amber-400 text-foodie-charcoal border-amber-300 shadow-sm'
                        : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCatalog.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-3xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-amber-400/50 transition-all"
                >
                  <div>
                    {/* Food Image (Transparent Studio Cutout) */}
                    <div className="relative w-full h-40 rounded-2xl bg-gradient-to-b from-white/10 to-transparent flex items-center justify-center p-3 overflow-hidden mb-3">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                      />
                      {prod.isVeg && (
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-black border border-emerald-500/40">
                          VEG 🌱
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-black text-white truncate max-w-[170px]">
                        {prod.name}
                      </h4>
                      <strong className="text-sm font-black text-amber-400">
                        {formatCurrency(prod.basePrice)}
                      </strong>
                    </div>

                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                      {prod.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-bold">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{prod.prepTime}m</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const newPrice = prompt('Enter new base price ($):', prod.basePrice.toString());
                          if (newPrice && !isNaN(Number(newPrice))) {
                            updateProduct(prod.id, { basePrice: Number(newPrice) });
                            showToast({ title: 'Price Updated', message: `${prod.name} price updated to $${newPrice}`, type: 'deal', icon: '💰' });
                          }
                        }}
                        className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors"
                        title="Edit Price"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete ${prod.name} from active menu?`)) {
                            deleteProduct(prod.id);
                            showToast({ title: 'Dish Deleted', message: `${prod.name} removed from store.`, type: 'welcome', icon: '🗑️' });
                          }
                        }}
                        className="p-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: ADD NEW DISH + AUTO BG REMOVAL
           ========================================================================= */}
        {activeTab === 'add_item' && (
          <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>Add New Food Item to Menu</span>
                <span className="px-2.5 py-0.5 rounded-full bg-foodie-yellow text-foodie-charcoal text-[11px] font-black uppercase">
                  Studio AI
                </span>
              </h2>
              <p className="text-xs text-zinc-400 font-medium mt-1">
                Upload any food image—our AI automatically removes backgrounds to produce pristine transparent studio cutouts!
              </p>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* Category Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block">
                  Select Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'c_pizza', name: 'Pizza', icon: '🍕' },
                    { id: 'c_burgers', name: 'Burgers', icon: '🍔' },
                    { id: 'c_drinks', name: 'Drinks (ml/L)', icon: '🥤' },
                    { id: 'c_desserts', name: 'Desserts', icon: '🍰' },
                    { id: 'c_chicken', name: 'Crispy Chicken', icon: '🍗' },
                    { id: 'c_fries', name: 'Sides & Fries', icon: '🍟' },
                    { id: 'c_pasta', name: 'Pastas', icon: '🍝' },
                    { id: 'c_asian', name: 'Asian Bowls', icon: '🍜' },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setFormCategory(cat.id)}
                      className={cn(
                        'p-3 rounded-2xl border text-xs font-black transition-all flex items-center gap-2',
                        formCategory === cat.id
                          ? 'bg-foodie-yellow text-foodie-charcoal border-amber-300 shadow-md scale-102'
                          : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                      )}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* STUDIO AI BACKGROUND REMOVER IMAGE UPLOADER */}
              <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Auto Background Removal Tool</span>
                  </label>
                  {isRemovingBg && (
                    <span className="text-xs text-amber-300 font-bold animate-pulse">
                      Processing alpha transparency...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* File Upload Input */}
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/20 hover:border-amber-400 bg-white/5 cursor-pointer transition-all">
                      <UploadCloud className="w-8 h-8 text-amber-400 mb-2" />
                      <span className="text-xs font-bold text-white text-center">
                        Click to upload food photo
                      </span>
                      <span className="text-[10px] text-zinc-400 text-center mt-0.5">
                        JPG, PNG, WebP (Auto-removes background)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={rawImageInput}
                        onChange={(e) => {
                          setRawImageInput(e.target.value);
                          setProcessedImageUrl(e.target.value);
                        }}
                        placeholder="Or paste image URL here..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={handleManualBgRemoval}
                        disabled={isRemovingBg}
                        className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-foodie-charcoal text-xs font-black transition-all shrink-0 active:scale-95 disabled:opacity-50"
                      >
                        Clean BG 🪄
                      </button>
                    </div>
                  </div>

                  {/* Live Studio Checkered Transparent Preview */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-white/20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px] bg-zinc-800 flex items-center justify-center p-3 shadow-inner">
                      {processedImageUrl ? (
                        <motion.img
                          key={processedImageUrl}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          src={processedImageUrl}
                          alt="Transparent Cutout Preview"
                          className="w-full h-full object-contain drop-shadow-2xl"
                        />
                      ) : (
                        <span className="text-xs text-zinc-400 font-bold">Image Preview</span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-extrabold mt-2 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Transparent Studio Asset Ready</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Basic Details (Title, Price, Prep Time) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-zinc-300">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Truffle Mushroom Gorgonzola"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300">Base Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formBasePrice}
                    onChange={(e) => setFormBasePrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the dish ingredients, flavor profile, and cooking technique..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* DYNAMIC CATEGORY-SPECIFIC ATTRIBUTES */}
              {formCategory === 'c_pizza' && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                  <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    🍕 Pizza Sizing & Upcharges
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold block">Small 10" (+$)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={pizzaSmallPrice}
                        onChange={(e) => setPizzaSmallPrice(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold block">Medium 12" (+$)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={pizzaMediumPrice}
                        onChange={(e) => setPizzaMediumPrice(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold block">Large 14" (+$)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={pizzaLargePrice}
                        onChange={(e) => setPizzaLargePrice(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formCategory === 'c_drinks' && (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-3">
                  <h4 className="text-xs font-black text-blue-300 uppercase tracking-wider">
                    🥤 Drink Volume Units & Portions
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold block mb-1">Volume Unit</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setDrinkUnit('ml')}
                          className={cn(
                            'flex-1 py-1.5 rounded-lg font-bold border transition-all',
                            drinkUnit === 'ml' ? 'bg-blue-500 text-white border-blue-400' : 'bg-zinc-900 border-white/10 text-zinc-400'
                          )}
                        >
                          Milliliters (ml)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDrinkUnit('L')}
                          className={cn(
                            'flex-1 py-1.5 rounded-lg font-bold border transition-all',
                            drinkUnit === 'L' ? 'bg-blue-500 text-white border-blue-400' : 'bg-zinc-900 border-white/10 text-zinc-400'
                          )}
                        >
                          Liters (L)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold block mb-1">Default Volume</label>
                      <select
                        value={drinkVolumeValue}
                        onChange={(e) => setDrinkVolumeValue(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white font-bold text-xs"
                      >
                        <option value="250ml">250 ml (Can)</option>
                        <option value="330ml">330 ml (Glass Bottle)</option>
                        <option value="500ml">500 ml (Standard)</option>
                        <option value="1L">1.0 Liter (Carafe)</option>
                        <option value="1.5L">1.5 Liter (Family Bottle)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {formCategory === 'c_burgers' && (
                <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 space-y-2">
                  <h4 className="text-xs font-black text-orange-300 uppercase tracking-wider">
                    🍔 Burger Patty Modifier
                  </h4>
                  <input
                    type="text"
                    value={burgerPattyCount}
                    onChange={(e) => setBurgerPattyCount(e.target.value)}
                    placeholder="e.g. Double Smash Angus (280g)"
                    className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-white/10 text-xs font-bold text-white"
                  />
                </div>
              )}

              {/* Flags (Veg, Spicy, Popular) */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formIsVeg}
                    onChange={(e) => setFormIsVeg(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                  <span>Vegetarian 🌱</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formIsSpicy}
                    onChange={(e) => setFormIsSpicy(e.target.checked)}
                    className="w-4 h-4 rounded text-red-500"
                  />
                  <span>Spicy 🌶️</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formIsPopular}
                    onChange={(e) => setFormIsPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>Featured / Popular ⭐</span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-foodie-yellow via-amber-400 to-foodie-amber-dark hover:from-amber-400 hover:to-orange-500 text-foodie-charcoal text-sm font-black tracking-tight shadow-foodie-glow hover:shadow-2xl transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Save & Publish Dish to Storefront</span>
              </button>
            </form>
          </div>
        )}

        {/* =========================================================================
            TAB 4: ANALYTICS & FINANCIALS
           ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-3xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-xl space-y-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Gross Store Revenue
                </span>
                <strong className="text-3xl font-black text-emerald-400">
                  {formatCurrency(totalRevenue)}
                </strong>
                <span className="text-[11px] text-zinc-400 block font-medium">
                  Across {orders.length} processed customer orders
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-xl space-y-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Average Order Value (AOV)
                </span>
                <strong className="text-3xl font-black text-amber-300">
                  {formatCurrency(orders.length > 0 ? totalRevenue / orders.length : 0)}
                </strong>
                <span className="text-[11px] text-zinc-400 block font-medium">
                  Including gourmet toppings and couriers
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-xl space-y-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Fleet Delivery Success Rate
                </span>
                <strong className="text-3xl font-black text-purple-300">
                  99.4%
                </strong>
                <span className="text-[11px] text-zinc-400 block font-medium">
                  Average dispatch to doorstep: 24 mins
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
