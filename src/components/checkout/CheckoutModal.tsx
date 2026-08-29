import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useOrderStore } from '@/store/useOrderStore';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatCurrency, cn } from '@/lib/utils';
import { MapPin, Zap, Clock, CreditCard, Smartphone, Wallet, Banknote } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    closeCheckoutModal,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    deliveryTiming,
    setDeliveryTiming,
    paymentMethod,
    setPaymentMethod,
    submitOrder,
    isLoading,
  } = useOrderStore();

  const { items, getSubtotal, getDeliveryFee, getDiscountAmount, getTax, getTotal } = useCartStore();
  const user = useAuthStore((s) => s.user);

  const [isAddingNewAddr, setIsAddingNewAddr] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discount = getDiscountAmount();
  const tax = getTax();
  const total = getTotal();

  const handlePlaceOrder = async () => {
    if (!user) return;

    try {
      await submitOrder(user.id);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.error('Order error:', e);
    }
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAddress) return;
    const newId = `a_${Date.now()}`;
    addresses.push({
      id: newId,
      userId: user?.id || 'u1',
      title: newTitle,
      fullAddress: newAddress,
      city: 'New York, NY',
      phone: user?.phone || '+1 555 234-5678',
      isDefault: false,
    });
    setSelectedAddressId(newId);
    setIsAddingNewAddr(false);
    setNewTitle('');
    setNewAddress('');
  };

  return (
    <Modal
      isOpen={isCheckoutModalOpen}
      onClose={closeCheckoutModal}
      title="Complete Your Order 📦"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Step 1: Delivery Address */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-foodie-charcoal">
              1. Delivery Address
            </h4>
            <button
              onClick={() => setIsAddingNewAddr(!isAddingNewAddr)}
              className="text-xs font-bold text-foodie-amber-dark hover:underline"
            >
              {isAddingNewAddr ? 'Cancel' : '+ Add Address'}
            </button>
          </div>

          {isAddingNewAddr && (
            <form onSubmit={handleAddNewAddress} className="p-4 bg-foodie-app rounded-2xl border border-foodie-border space-y-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Address Label (e.g. Grandma's House)"
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-foodie-border bg-white"
                required
              />
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Full Street Address & Apt Number"
                className="w-full text-xs p-2.5 rounded-xl border border-foodie-border bg-white"
                required
              />
              <Button type="submit" size="sm">Save Address</Button>
            </form>
          )}

          <div className="space-y-2">
            {addresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={cn(
                    'p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all',
                    isSelected
                      ? 'border-foodie-yellow-dark bg-foodie-yellow-soft shadow-sm'
                      : 'border-foodie-border bg-white hover:border-foodie-yellow/60'
                  )}
                >
                  <MapPin className={cn('w-4 h-4 mt-0.5', isSelected ? 'text-foodie-amber-dark' : 'text-foodie-muted')} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-foodie-charcoal">{addr.title}</strong>
                      {addr.isDefault && (
                        <span className="text-[10px] font-black bg-foodie-yellow px-2 py-0.5 rounded-md">Default</span>
                      )}
                    </div>
                    <p className="text-xs text-foodie-muted mt-0.5">{addr.fullAddress}, {addr.city}</p>
                  </div>
                  {isSelected && <span className="text-xs font-black text-foodie-amber-dark">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Delivery Timing */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-foodie-charcoal">
            2. Delivery Timing
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDeliveryTiming('asap')}
              className={cn(
                'p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all',
                deliveryTiming === 'asap'
                  ? 'border-foodie-yellow-dark bg-foodie-yellow-soft shadow-sm'
                  : 'border-foodie-border bg-white'
              )}
            >
              <Zap className="w-4 h-4 text-foodie-amber-dark shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs sm:text-sm font-black text-foodie-charcoal block">ASAP Delivery</strong>
                <span className="text-[11px] text-foodie-muted">~25 - 35 Minutes</span>
              </div>
            </button>

            <button
              onClick={() => setDeliveryTiming('scheduled')}
              className={cn(
                'p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all',
                deliveryTiming === 'scheduled'
                  ? 'border-foodie-yellow-dark bg-foodie-yellow-soft shadow-sm'
                  : 'border-foodie-border bg-white'
              )}
            >
              <Clock className="w-4 h-4 text-foodie-muted shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs sm:text-sm font-black text-foodie-charcoal block">Schedule Later</strong>
                <span className="text-[11px] text-foodie-muted">Today, 8:30 PM</span>
              </div>
            </button>
          </div>
        </div>

        {/* Step 3: Payment Method */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-foodie-charcoal">
            3. Payment Method
          </h4>
          <div className="space-y-2">
            {[
              { id: 'card', name: 'Credit / Debit Card', desc: 'Visa •••• 4242 (Instant)', icon: CreditCard },
              { id: 'applepay', name: 'Apple Pay / Google Pay', desc: 'One-Tap Secure Checkout', icon: Smartphone },
              { id: 'wallet', name: 'Foodie Wallet', desc: 'Available balance: $45.00', icon: Wallet },
              { id: 'cod', name: 'Cash on Delivery', desc: 'Pay in cash at your door', icon: Banknote },
            ].map((p) => {
              const Icon = p.icon;
              const isSelected = paymentMethod === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setPaymentMethod(p.id as any)}
                  className={cn(
                    'p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all',
                    isSelected
                      ? 'border-foodie-yellow-dark bg-foodie-yellow-soft shadow-sm'
                      : 'border-foodie-border bg-white hover:border-foodie-yellow/60'
                  )}
                >
                  <div className="w-8 h-8 rounded-xl bg-foodie-app flex items-center justify-center text-foodie-charcoal">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <strong className="text-xs sm:text-sm font-bold text-foodie-charcoal block">{p.name}</strong>
                    <span className="text-[11px] text-foodie-muted">{p.desc}</span>
                  </div>
                  {isSelected && <span className="text-xs font-black text-foodie-amber-dark">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 4: Final Summary */}
        <div className="space-y-3 p-4 bg-foodie-app rounded-2xl border border-foodie-border">
          <h4 className="text-xs font-black uppercase tracking-wider text-foodie-charcoal">
            4. Order Items Summary ({items.length} items)
          </h4>
          <div className="space-y-1.5 text-xs text-foodie-muted">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between">
                <span>{i.quantity}× {i.product.name} ({i.size.name})</span>
                <strong className="text-foodie-charcoal">{formatCurrency(i.unitPrice * i.quantity)}</strong>
              </div>
            ))}
          </div>

          <hr className="border-foodie-border" />

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-foodie-muted">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="flex justify-between text-foodie-muted">
              <span>Delivery</span>
              <strong>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</strong>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-foodie-green font-bold">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-foodie-muted">
              <span>Tax (8%)</span>
              <strong>{formatCurrency(tax)}</strong>
            </div>
            <div className="flex justify-between text-base font-black text-foodie-charcoal pt-2 border-t border-foodie-border">
              <span>Total Amount</span>
              <span className="text-foodie-amber-dark">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handlePlaceOrder}
          size="lg"
          isLoading={isLoading}
          className="w-full text-base"
        >
          <span>Place Order — {formatCurrency(total)}</span>
        </Button>
      </div>
    </Modal>
  );
};
