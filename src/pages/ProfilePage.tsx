import React, { useState, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Button } from '@/components/ui/Button';
import {
  MapPin,
  CreditCard,
  Bell,
  LogOut,
  ChevronRight,
  Crown,
  Camera,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  SlidersHorizontal,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    logout,
    openAuthModal,
    updateAvatar,
    updateProfile,
    bankAccounts,
    addBankAccount,
    removeBankAccount,
  } = useAuthStore();

  const { orders, addresses, setSelectedAddressId } = useOrderStore();
  const favoritesCount = useWishlistStore((s) => s.getFavoritesCount());

  const [activeTab, setActiveTab] = useState<'profile' | 'banking' | 'addresses' | 'settings'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  // Add Bank state
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState(user?.fullName || '');
  const [accountNumber, setAccountNumber] = useState('');
  const [cardType, setCardType] = useState<'Visa' | 'MasterCard' | 'Bank'>('Visa');

  // Add Address state
  const [isAddingAddr, setIsAddingAddr] = useState(false);
  const [addrTitle, setAddrTitle] = useState('');
  const [addrText, setAddrText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName: editName, phone: editPhone });
    setIsEditingProfile(false);
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !accountNumber) return;
    addBankAccount({
      bankName,
      accountHolder: accountHolder || (user?.fullName || 'User'),
      accountNumber: `•••• •••• •••• ${accountNumber.slice(-4) || '1234'}`,
      cardType,
      isDefault: bankAccounts.length === 0,
    });
    setIsAddingBank(false);
    setBankName('');
    setAccountNumber('');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrTitle || !addrText) return;
    const newId = `a_${Date.now()}`;
    addresses.push({
      id: newId,
      userId: user?.id || 'u1',
      title: addrTitle,
      fullAddress: addrText,
      city: 'New York, NY',
      phone: user?.phone || '+1 555 000-0000',
      isDefault: false,
    });
    setSelectedAddressId(newId);
    setIsAddingAddr(false);
    setAddrTitle('');
    setAddrText('');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto my-6 space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-2xl bg-white border border-foodie-border flex items-center justify-center text-foodie-charcoal hover:bg-foodie-yellow-soft shadow-xs transition-all shrink-0 active:scale-95"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="bg-white/75 backdrop-blur-2xl border border-white/80 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-tr from-foodie-yellow to-foodie-orange rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-lg shadow-foodie-yellow/30">
            👤
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-foodie-charcoal">Sign In to Foodie</h3>
            <p className="text-xs sm:text-sm text-foodie-muted max-w-xs mx-auto leading-relaxed">
              Create an account or login to upload your profile avatar, add bank accounts & saved addresses, and track orders.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Button onClick={() => openAuthModal()} size="lg" className="w-full text-base font-black shadow-foodie-glow">
              Sign In / Create Account
            </Button>
            <p className="text-[11px] text-foodie-muted font-bold">
              ⚡ Takes less than 30 seconds • 100% Secure
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto pb-10">
      {/* Top Header Row with Back Button */}
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
            Account Profile 👤
          </h2>
          <p className="text-xs text-foodie-muted font-bold mt-0.5">
            Manage your personal details, wallet & payment methods
          </p>
        </div>
      </div>

      {/* PROFILE HERO GLASS CARD */}
      <div className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-foodie-yellow/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Profile Avatar with Upload Trigger */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-foodie-yellow shadow-xl bg-white">
            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-foodie-charcoal hover:bg-black text-white flex items-center justify-center shadow-lg border-2 border-white transition-transform active:scale-95"
            title="Upload Profile Picture"
          >
            <Camera className="w-4 h-4 text-foodie-yellow" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {/* User Info Details */}
        <div className="flex-1 text-center sm:text-left space-y-1.5 z-10">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-foodie-charcoal">{user.fullName}</h2>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-foodie-yellow text-[11px] font-black text-foodie-charcoal shadow-sm">
              <Crown className="w-3 h-3 text-foodie-charcoal" />
              <span>Foodie Gold Member</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-foodie-muted font-medium flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>{user.email}</span>
          </p>
          <p className="text-xs sm:text-sm text-foodie-muted font-medium flex items-center justify-center sm:justify-start gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            <span>{user.phone || '+1 (555) 234-5678'}</span>
          </p>
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditName(user.fullName);
              setEditPhone(user.phone);
              setIsEditingProfile(!isEditingProfile);
            }}
            className="text-xs font-black bg-white/90"
          >
            {isEditingProfile ? 'Cancel' : '✏️ Edit Info'}
          </Button>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-foodie-red text-xs font-black border border-red-200 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* EDIT PROFILE INLINE FORM */}
      {isEditingProfile && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white/85 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 shadow-xl space-y-4"
        >
          <h4 className="text-sm font-black text-foodie-charcoal">Edit Profile Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-foodie-muted block mb-1">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-foodie-border bg-white text-xs font-bold"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-foodie-muted block mb-1">Phone Number</label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-foodie-border bg-white text-xs font-bold"
                required
              />
            </div>
          </div>
          <Button type="submit" size="sm">Save Changes</Button>
        </form>
      )}

      {/* STATS TILES */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div
          onClick={() => navigate('/orders')}
          className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-2xl p-4 text-center cursor-pointer hover:border-foodie-yellow transition-all shadow-sm group"
        >
          <strong className="text-2xl font-black text-foodie-charcoal block group-hover:text-foodie-amber-dark transition-colors">
            {orders.length}
          </strong>
          <span className="text-xs text-foodie-muted font-bold">Total Orders</span>
        </div>

        <div
          onClick={() => navigate('/wishlist')}
          className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-2xl p-4 text-center cursor-pointer hover:border-foodie-yellow transition-all shadow-sm group"
        >
          <strong className="text-2xl font-black text-foodie-charcoal block group-hover:text-foodie-amber-dark transition-colors">
            {favoritesCount}
          </strong>
          <span className="text-xs text-foodie-muted font-bold">Wishlist Items</span>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-2xl p-4 text-center shadow-sm">
          <strong className="text-2xl font-black text-foodie-amber-dark block">
            ${user.walletBalance.toFixed(2)}
          </strong>
          <span className="text-xs text-foodie-muted font-bold">Foodie Wallet</span>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex gap-2 p-1.5 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 overflow-x-auto scrollbar-none">
        {[
          { id: 'profile', label: 'Overview & Shortcuts', icon: User },
          { id: 'banking', label: 'Bank Accounts & Cards', icon: CreditCard },
          { id: 'addresses', label: 'Delivery Addresses', icon: MapPin },
          { id: 'settings', label: 'Security & Alerts', icon: SlidersHorizontal },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap',
                isActive
                  ? 'bg-foodie-yellow text-foodie-charcoal shadow-sm'
                  : 'text-foodie-muted hover:text-foodie-charcoal'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: BANK ACCOUNTS & CARDS */}
      {activeTab === 'banking' && (
        <div className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-foodie-charcoal">Bank Accounts & Cards</h3>
              <p className="text-xs text-foodie-muted">Manage your payment methods for instant one-tap checkout</p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsAddingBank(!isAddingBank)}
              className="text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Account</span>
            </Button>
          </div>

          {isAddingBank && (
            <form onSubmit={handleSaveBank} className="p-4 bg-foodie-yellow-soft/50 rounded-2xl border border-foodie-border space-y-3">
              <h4 className="text-xs font-black uppercase text-foodie-charcoal">New Bank Account / Card</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Bank Name (e.g. Chase, Bank of America)"
                  className="p-2.5 rounded-xl border border-foodie-border bg-white text-xs font-bold"
                  required
                />
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Account Holder Name"
                  className="p-2.5 rounded-xl border border-foodie-border bg-white text-xs font-bold"
                  required
                />
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Card / Account Number (Last 4 digits)"
                  className="p-2.5 rounded-xl border border-foodie-border bg-white text-xs font-bold"
                  required
                />
                <select
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value as any)}
                  className="p-2.5 rounded-xl border border-foodie-border bg-white text-xs font-bold"
                >
                  <option value="Visa">Visa Card</option>
                  <option value="MasterCard">MasterCard</option>
                  <option value="Bank">Direct Checking Account</option>
                </select>
              </div>
              <Button type="submit" size="sm">Save Payment Method</Button>
            </form>
          )}

          <div className="space-y-3">
            {bankAccounts.length === 0 ? (
              <div className="p-8 bg-foodie-app/60 rounded-2xl border border-foodie-border text-center space-y-2">
                <CreditCard className="w-8 h-8 text-foodie-muted mx-auto opacity-60" />
                <strong className="text-xs font-black text-foodie-charcoal block">No payment methods added</strong>
                <p className="text-[11px] text-foodie-muted max-w-xs mx-auto">
                  Add your debit/credit card or bank account for instant one-tap checkout.
                </p>
              </div>
            ) : (
              bankAccounts.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl border border-white/80 bg-white/70 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-foodie-yellow to-foodie-amber-dark text-foodie-charcoal flex items-center justify-center font-black shadow-sm">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-black text-foodie-charcoal">{b.bankName}</strong>
                        {b.isDefault && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-foodie-yellow text-foodie-charcoal">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-foodie-muted font-bold block mt-0.5">
                        {b.cardType} • {b.accountNumber} ({b.accountHolder})
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeBankAccount(b.id)}
                    className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-foodie-red flex items-center justify-center transition-colors"
                    title="Remove account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: DELIVERY ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-foodie-charcoal">Saved Delivery Addresses</h3>
              <p className="text-xs text-foodie-muted">Fast address selection during checkout</p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsAddingAddr(!isAddingAddr)}
              className="text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Address</span>
            </Button>
          </div>

          {isAddingAddr && (
            <form onSubmit={handleSaveAddress} className="p-4 bg-foodie-yellow-soft/50 rounded-2xl border border-foodie-border space-y-3">
              <h4 className="text-xs font-black uppercase text-foodie-charcoal">New Address</h4>
              <input
                type="text"
                value={addrTitle}
                onChange={(e) => setAddrTitle(e.target.value)}
                placeholder="Label (e.g. Office, Apartment, Parents)"
                className="w-full p-2.5 rounded-xl border border-foodie-border bg-white text-xs font-bold"
                required
              />
              <input
                type="text"
                value={addrText}
                onChange={(e) => setAddrText(e.target.value)}
                placeholder="Full Street Address & Apt"
                className="w-full p-2.5 rounded-xl border border-foodie-border bg-white text-xs font-bold"
                required
              />
              <Button type="submit" size="sm">Save Address</Button>
            </form>
          )}

          <div className="space-y-2.5">
            {addresses.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-2xl border border-white/80 bg-white/70 flex items-start gap-3 shadow-sm"
              >
                <MapPin className="w-4 h-4 text-foodie-amber-dark shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-black text-foodie-charcoal">{a.title}</strong>
                    {a.isDefault && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-foodie-yellow text-foodie-charcoal">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foodie-muted mt-0.5">{a.fullAddress}, {a.city}</p>
                  <span className="text-[11px] text-foodie-muted font-bold block mt-1">📞 {a.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SECURITY & ALERTS */}
      {activeTab === 'settings' && (
        <div className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-black text-foodie-charcoal">Account Security & Notifications</h3>
          <div className="space-y-3">
            {[
              { title: 'Order Tracking SMS Notifications', desc: 'Real-time courier SMS updates on active deliveries', checked: true },
              { title: 'Exclusive Foodie Promo Alerts', desc: 'Get notified for 50% flash discounts and weekend coupons', checked: true },
              { title: 'Two-Factor Authentication (2FA)', desc: 'Secure your Foodie wallet and saved cards with OTP', checked: true },
            ].map((s, idx) => (
              <label
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 border border-white/80 cursor-pointer shadow-sm"
              >
                <input type="checkbox" defaultChecked={s.checked} className="accent-foodie-yellow mt-1 w-4 h-4" />
                <div className="flex-1">
                  <strong className="text-xs sm:text-sm font-black text-foodie-charcoal block">{s.title}</strong>
                  <span className="text-[11px] text-foodie-muted">{s.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: OVERVIEW SHORTCUTS */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setActiveTab('addresses')}
            className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:border-foodie-yellow transition-all shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-foodie-yellow-soft flex items-center justify-center text-foodie-charcoal">
              <MapPin className="w-5 h-5 text-foodie-amber-dark" />
            </div>
            <div className="flex-1">
              <strong className="text-sm font-black text-foodie-charcoal block">Saved Addresses</strong>
              <span className="text-xs text-foodie-muted">{addresses.length} locations configured</span>
            </div>
            <ChevronRight className="w-4 h-4 text-foodie-muted" />
          </div>

          <div
            onClick={() => setActiveTab('banking')}
            className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:border-foodie-yellow transition-all shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-foodie-yellow-soft flex items-center justify-center text-foodie-charcoal">
              <CreditCard className="w-5 h-5 text-foodie-amber-dark" />
            </div>
            <div className="flex-1">
              <strong className="text-sm font-black text-foodie-charcoal block">Bank Accounts & Cards</strong>
              <span className="text-xs text-foodie-muted">{bankAccounts.length} payment cards linked</span>
            </div>
            <ChevronRight className="w-4 h-4 text-foodie-muted" />
          </div>

          <div
            onClick={() => setActiveTab('settings')}
            className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:border-foodie-yellow transition-all shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-foodie-yellow-soft flex items-center justify-center text-foodie-charcoal">
              <Bell className="w-5 h-5 text-foodie-amber-dark" />
            </div>
            <div className="flex-1">
              <strong className="text-sm font-black text-foodie-charcoal block">Notification Preferences</strong>
              <span className="text-xs text-foodie-muted">Order & coupon alert settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-foodie-muted" />
          </div>

          <div
            onClick={() => navigate('/orders')}
            className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:border-foodie-yellow transition-all shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-foodie-yellow-soft flex items-center justify-center text-foodie-charcoal">
              <ShieldCheck className="w-5 h-5 text-foodie-amber-dark" />
            </div>
            <div className="flex-1">
              <strong className="text-sm font-black text-foodie-charcoal block">Live Order Tracking</strong>
              <span className="text-xs text-foodie-muted">View active delivery riders on map</span>
            </div>
            <ChevronRight className="w-4 h-4 text-foodie-muted" />
          </div>
        </div>
      )}
    </div>
  );
};
