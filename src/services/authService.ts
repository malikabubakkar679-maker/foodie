import { supabase, isLiveSupabaseConfigured } from './supabaseClient';
import { UserProfile } from '@/types/food.types';

interface StoredAccount extends UserProfile {
  password?: string;
  createdAt: number;
}

const USERS_DB_KEY = 'foodie_users_db';
const SESSION_KEY = 'foodie_user_session';

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
];

const getStoredUsers = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    let users: StoredAccount[] = raw ? JSON.parse(raw) : [];

    // Ensure Default Admin Account always exists
    const hasAdmin = users.some((u) => u.email.toLowerCase() === 'admin@foodie.com');
    if (!hasAdmin) {
      const adminAccount: StoredAccount = {
        id: 'u_admin',
        fullName: 'Master Foodie Admin',
        email: 'admin@foodie.com',
        phone: '+1 (555) 000-7777',
        password: 'admin123',
        avatarUrl: DEFAULT_AVATARS[0],
        walletBalance: 500.0,
        role: 'admin',
        createdAt: Date.now(),
      };
      users.push(adminAccount);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    }

    return users;
  } catch {
    return [];
  }
};

const saveStoredUsers = (users: StoredAccount[]) => {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
};

export const authService = {
  async getCurrentSession(): Promise<UserProfile | null> {
    if (isLiveSupabaseConfigured) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const p = profile as Record<string, any>;
            return {
              id: p.id || session.user.id,
              fullName: p.full_name || 'Foodie Member',
              email: p.email || session.user.email || '',
              phone: p.phone || '',
              avatarUrl: p.avatar_url || DEFAULT_AVATARS[0],
              walletBalance: Number(p.wallet_balance) || 0.0,
              role: p.email === 'admin@foodie.com' ? 'admin' : (p.role || 'user'),
            };
          }
        }
      } catch (err) {
        console.warn('Supabase session fetch fallback to local:', err);
      }
    }

    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  },

  async login(email: string, password: string): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();

    if (isLiveSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (error) throw error;
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            fullName: data.user.user_metadata?.full_name || 'Foodie Member',
            email: data.user.email || cleanEmail,
            phone: data.user.user_metadata?.phone || '+1 (555) 000-0000',
            avatarUrl: DEFAULT_AVATARS[0],
            walletBalance: 0.0,
            role: cleanEmail === 'admin@foodie.com' ? 'admin' : 'user',
          };
          localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
          return profile;
        }
      } catch (err) {
        console.warn('Live Supabase login failed, using local DB:', err);
        throw err;
      }
    }

    // Local DB authentication
    const users = getStoredUsers();
    const existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existingUser) {
      if (existingUser.password && existingUser.password !== password) {
        throw new Error('Incorrect password. Please try again.');
      }
      const profile: UserProfile = {
        id: existingUser.id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        phone: existingUser.phone,
        avatarUrl: existingUser.avatarUrl || DEFAULT_AVATARS[0],
        walletBalance: existingUser.walletBalance ?? 0.0,
        role: existingUser.role || (existingUser.email === 'admin@foodie.com' ? 'admin' : 'user'),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
      return profile;
    }

    // Admin auto login helper if typing admin@foodie.com
    if (cleanEmail === 'admin@foodie.com') {
      const adminProfile: UserProfile = {
        id: 'u_admin',
        fullName: 'Master Foodie Admin',
        email: 'admin@foodie.com',
        phone: '+1 (555) 000-7777',
        avatarUrl: DEFAULT_AVATARS[0],
        walletBalance: 500.0,
        role: 'admin',
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(adminProfile));
      return adminProfile;
    }

    throw new Error('No account found with this email. Please click "Create Account" below.');
  },

  async loginSocial(provider: 'Google' | 'Apple' | 'Facebook'): Promise<UserProfile> {
    const providerKey = provider.toLowerCase();

    if (isLiveSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: providerKey as any,
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) throw error;
      } catch (err) {
        console.warn('OAuth redirect fallback to local:', err);
      }
    }

    const email = `${providerKey}.user@gmail.com`;
    const fullName =
      provider === 'Google'
        ? 'Alex Google'
        : provider === 'Apple'
        ? 'Alex Apple'
        : 'Alex Facebook';
    const avatarUrl =
      provider === 'Google'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
        : provider === 'Apple'
        ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80';

    const users = getStoredUsers();
    let user = users.find((u) => u.email.toLowerCase() === email);
    if (!user) {
      user = {
        id: `u_social_${providerKey}_${Date.now()}`,
        fullName,
        email,
        phone: '+1 (555) 888-9999',
        password: 'social-auth-password',
        avatarUrl,
        walletBalance: 0.0,
        role: 'user',
        createdAt: Date.now(),
      };
      users.push(user);
      saveStoredUsers(users);
    }

    const profile: UserProfile = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      walletBalance: user.walletBalance ?? 0.0,
      role: 'user',
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    return profile;
  },

  async register(
    fullName: string,
    email: string,
    phone: string,
    password: string
  ): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();

    const users = getStoredUsers();
    const alreadyExists = users.some((u) => u.email.toLowerCase() === cleanEmail);

    if (alreadyExists) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const randomAvatar = DEFAULT_AVATARS[users.length % DEFAULT_AVATARS.length];
    const newAccount: StoredAccount = {
      id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password,
      avatarUrl: randomAvatar,
      walletBalance: 0.0,
      role: cleanEmail === 'admin@foodie.com' ? 'admin' : 'user',
      createdAt: Date.now(),
    };

    users.push(newAccount);
    saveStoredUsers(users);

    const profile: UserProfile = {
      id: newAccount.id,
      fullName: newAccount.fullName,
      email: newAccount.email,
      phone: newAccount.phone,
      avatarUrl: newAccount.avatarUrl,
      walletBalance: newAccount.walletBalance,
      role: newAccount.role,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    return profile;
  },

  async logout(): Promise<void> {
    if (isLiveSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
    localStorage.removeItem(SESSION_KEY);
  },

  async syncProfileUpdate(data: Partial<UserProfile>): Promise<void> {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const current: UserProfile = JSON.parse(saved);
        const updated = { ...current, ...data };
        localStorage.setItem(SESSION_KEY, JSON.stringify(updated));

        // Update in users DB
        const users = getStoredUsers();
        const idx = users.findIndex((u) => u.id === current.id || u.email === current.email);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...data };
          saveStoredUsers(users);
        }
      } catch (err) {
        console.warn('Sync profile update error:', err);
      }
    }
  },
};
