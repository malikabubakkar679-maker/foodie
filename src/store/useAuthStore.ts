import { create } from 'zustand';
import { UserProfile } from '@/types/food.types';
import { authService } from '@/services/authService';

export interface BankAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  cardType: 'Visa' | 'MasterCard' | 'Bank';
  isDefault: boolean;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMessage: string;
  onSuccessCallback?: () => void;
  bankAccounts: BankAccount[];
  login: (email: string, pass: string) => Promise<UserProfile>;
  loginSocial: (provider: 'Google' | 'Apple' | 'Facebook') => Promise<UserProfile>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateAvatar: (avatarUrl: string) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  addBankAccount: (account: Omit<BankAccount, 'id'>) => void;
  removeBankAccount: (id: string) => void;
  openAuthModal: (message?: string, onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  initializeSession: () => Promise<void>;
}

const getStoredBanks = (userId?: string): BankAccount[] => {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`foodie_banks_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredBanks = (userId: string, banks: BankAccount[]) => {
  localStorage.setItem(`foodie_banks_${userId}`, JSON.stringify(banks));
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isAuthModalOpen: false,
  authModalMessage: '',
  onSuccessCallback: undefined,
  bankAccounts: [], // Completely fresh & empty by default

  openAuthModal: (message = '', onSuccess?: () => void) =>
    set({ isAuthModalOpen: true, authModalMessage: message, onSuccessCallback: onSuccess }),

  closeAuthModal: () =>
    set({ isAuthModalOpen: false, authModalMessage: '', onSuccessCallback: undefined }),

  initializeSession: async () => {
    try {
      const user = await authService.getCurrentSession();
      if (user) {
        const bankAccounts = getStoredBanks(user.id);
        set({ user, isAuthenticated: true, bankAccounts });
      } else {
        set({ user: null, isAuthenticated: false, bankAccounts: [] });
      }
    } catch (e) {
      console.warn('Init session error:', e);
    }
  },

  login: async (email, pass) => {
    set({ isLoading: true });
    try {
      const user = await authService.login(email, pass);
      const bankAccounts = getStoredBanks(user.id);
      const callback = get().onSuccessCallback;
      set({
        user,
        isAuthenticated: true,
        isAuthModalOpen: false,
        isLoading: false,
        bankAccounts,
        onSuccessCallback: undefined,
      });
      if (callback) {
        callback();
      }
      return user;
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  loginSocial: async (provider: 'Google' | 'Apple' | 'Facebook') => {
    set({ isLoading: true });
    try {
      const user = await authService.loginSocial(provider);
      const bankAccounts = getStoredBanks(user.id);
      const callback = get().onSuccessCallback;
      set({
        user,
        isAuthenticated: true,
        isAuthModalOpen: false,
        isLoading: false,
        bankAccounts,
        onSuccessCallback: undefined,
      });
      if (callback) {
        callback();
      }
      return user;
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  register: async (name, email, phone, pass) => {
    set({ isLoading: true });
    try {
      const user = await authService.register(name, email, phone, pass);
      const callback = get().onSuccessCallback;
      set({
        user,
        isAuthenticated: true,
        isAuthModalOpen: false,
        isLoading: false,
        bankAccounts: [], // Fresh new account has 0 bank accounts
        onSuccessCallback: undefined,
      });
      if (callback) {
        callback();
      }
      return user;
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false, bankAccounts: [] });
  },

  updateAvatar: (avatarUrl: string) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, avatarUrl };
    set({ user: updated });
    authService.syncProfileUpdate(updated);
  },

  updateProfile: (data: Partial<UserProfile>) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...data };
    set({ user: updated });
    authService.syncProfileUpdate(updated);
  },

  addBankAccount: (account) => {
    const current = get().user;
    const newAccount: BankAccount = {
      ...account,
      id: `b_${Date.now()}`,
    };
    const updated = [...get().bankAccounts, newAccount];
    set({ bankAccounts: updated });
    if (current) {
      saveStoredBanks(current.id, updated);
    }
  },

  removeBankAccount: (id: string) => {
    const current = get().user;
    const updated = get().bankAccounts.filter((b) => b.id !== id);
    set({ bankAccounts: updated });
    if (current) {
      saveStoredBanks(current.id, updated);
    }
  },
}));
