import React, { useState } from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Navigation, Clock, ArrowLeft, PackageCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, openTrackingModal } = useOrderStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'active') return o.status !== 'Delivered';
    if (filter === 'completed') return o.status === 'Delivered';
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 w-full max-w-5xl mx-auto select-none"
    >
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 flex items-center justify-center text-foodie-charcoal hover:bg-foodie-yellow shadow-xs transition-all shrink-0"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-foodie-charcoal tracking-tight flex items-center gap-2">
            <span>My Orders</span>
            <span>📋</span>
          </h1>
          <p className="text-xs sm:text-sm text-foodie-muted font-bold mt-0.5">
            Track active live courier delivery or review past meal history
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1.5 bg-white/85 backdrop-blur-xl rounded-2xl border border-white/90 max-w-md shadow-xs">
        {(['all', 'active', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-black capitalize rounded-xl transition-all ${
              filter === tab
                ? 'bg-foodie-yellow text-foodie-charcoal shadow-sm'
                : 'text-foodie-muted hover:text-foodie-charcoal'
            }`}
          >
            {tab === 'all' ? 'All Orders' : tab === 'active' ? '⚡ Live Active' : '✅ Completed'}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white/85 backdrop-blur-2xl border border-white/90 rounded-3xl p-12 sm:p-16 text-center space-y-4 shadow-sm">
          <div className="text-6xl animate-bounce">📦</div>
          <h4 className="text-xl sm:text-2xl font-black text-foodie-charcoal">No orders found</h4>
          <p className="text-xs sm:text-sm text-foodie-muted max-w-md mx-auto leading-relaxed">
            You don't have any {filter !== 'all' ? filter : ''} orders at the moment. Craving freshly baked artisan pizzas or smash burgers?
          </p>
          <Button onClick={() => navigate('/')} className="mt-4 px-8 py-3.5 text-sm font-black shadow-lg">
            Order Food Now 🍔
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white/85 backdrop-blur-2xl border border-white/90 rounded-3xl p-5 sm:p-7 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-center justify-between border-b border-foodie-border/60 pb-3.5 flex-wrap gap-2">
                <div>
                  <strong className="text-lg sm:text-xl font-black text-foodie-charcoal block">
                    #{order.orderNumber}
                  </strong>
                  <span className="text-xs text-foodie-muted font-bold flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-foodie-amber-dark" />
                    <span>{order.createdAt}</span>
                  </span>
                </div>

                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-50 text-foodie-green border border-emerald-200'
                      : 'bg-foodie-yellow-soft text-foodie-amber-dark border border-foodie-yellow/50 animate-pulse'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span>{order.status}</span>
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2.5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs sm:text-sm bg-foodie-app/60 px-3.5 py-2 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-foodie-charcoal bg-foodie-yellow px-2 py-0.5 rounded-md text-xs">{item.quantity}×</span>
                      <span className="text-foodie-charcoal font-black">{item.productName}</span>
                      <span className="text-foodie-muted text-xs font-semibold">({item.size})</span>
                    </div>
                    <strong className="text-foodie-charcoal font-black">{formatCurrency(item.totalPrice)}</strong>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-foodie-border/60 flex-wrap gap-3">
                <div className="text-xs sm:text-sm text-foodie-muted font-bold">
                  Total Paid:{' '}
                  <strong className="text-base sm:text-lg font-black text-foodie-amber-dark ml-1">
                    {formatCurrency(order.total)}
                  </strong>
                </div>

                <Button
                  size="sm"
                  onClick={() => openTrackingModal(order)}
                  className="flex items-center gap-2 px-5 py-2.5 shadow-md"
                >
                  <Navigation className="w-4 h-4 text-foodie-yellow animate-bounce" />
                  <span>Live GPS Tracking 🛵</span>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

