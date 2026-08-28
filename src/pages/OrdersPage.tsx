import React, { useState } from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Navigation, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-2xl bg-white border border-foodie-border flex items-center justify-center text-foodie-charcoal hover:bg-foodie-yellow-soft shadow-xs transition-all shrink-0 active:scale-95"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-foodie-charcoal tracking-tight">
            My Orders 📋
          </h2>
          <p className="text-xs sm:text-sm text-foodie-muted mt-0.5">
            Track active live delivery or review past orders
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-foodie-app rounded-2xl border border-foodie-border max-w-sm">
        {(['all', 'active', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-2 text-xs font-black capitalize rounded-xl transition-all ${
              filter === tab
                ? 'bg-foodie-yellow text-foodie-charcoal shadow-sm'
                : 'text-foodie-muted hover:text-foodie-charcoal'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-foodie-border rounded-3xl p-12 text-center space-y-3">
          <div className="text-5xl">📦</div>
          <h4 className="text-lg font-black text-foodie-charcoal">No orders found</h4>
          <p className="text-xs sm:text-sm text-foodie-muted">
            You don't have any {filter !== 'all' ? filter : ''} orders at the moment.
          </p>
          <Button onClick={() => navigate('/')} className="mt-2">
            Order Food Now
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-foodie-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-foodie-border pb-3">
                <div>
                  <strong className="text-base sm:text-lg font-black text-foodie-charcoal block">
                    #{order.orderNumber}
                  </strong>
                  <span className="text-xs text-foodie-muted flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{order.createdAt}</span>
                  </span>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-black ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-50 text-foodie-green border border-emerald-200'
                      : 'bg-foodie-yellow-soft text-foodie-amber-dark border border-foodie-yellow/40 animate-pulse'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-foodie-charcoal">{item.quantity}×</span>
                      <span className="text-foodie-charcoal font-medium">{item.productName}</span>
                      <span className="text-foodie-muted text-xs">({item.size})</span>
                    </div>
                    <strong className="text-foodie-charcoal">{formatCurrency(item.totalPrice)}</strong>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-foodie-border">
                <div className="text-xs text-foodie-muted">
                  Total Paid:{' '}
                  <strong className="text-base font-black text-foodie-amber-dark">
                    {formatCurrency(order.total)}
                  </strong>
                </div>

                <Button
                  size="sm"
                  onClick={() => openTrackingModal(order)}
                  className="flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Track Live 🛵</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
