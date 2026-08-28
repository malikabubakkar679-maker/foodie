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
    if (!raw) {
      // Seed fresh initial demo account with zero balance
      const initialUsers: StoredAccount[] = [
        {
          id: 'u_demo',
          fullName: 'Alex Johnson',
          email: 'alex@foodie.com',
          phone: '+1 (555) 234-5678',
          password: 'password123',
          avatarUrl: DEFAULT_AVATARS[0],
          walletBalance: 0.0,
          createdAt: Date.now(),
        },
      ];
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(raw);
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
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
      return profile;
    }

    // Auto-create or login for demo / new test emails if password provided
    if (cleanEmail === 'alex@foodie.com' || cleanEmail.includes('@foodie.com')) {
      const namePart = cleanEmail.split('@')[0];
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const newAccount: StoredAccount = {
        id: `u_${Date.now()}`,
        fullName: formattedName,
        email: cleanEmail,
        phone: '+1 (555) 234-5678',
        password,
        avatarUrl: DEFAULT_AVATARS[0],
        walletBalance: 0.0,
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
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
      return profile;
    }

    throw new Error('No account found with this email. Please click "Create Account" below.');
  },

  async loginSocial(provider: 'Google' | 'Apple' | 'Facebook'): Promise<UserProfile> {
    const providerKey = provider.toLowerCase();
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

    if (isLiveSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: cleanName, phone: cleanPhone },
          },
        });
        if (error) throw error;
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            fullName: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            avatarUrl: DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
            walletBalance: 0.0,
          };
          localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
          return profile;
        }
      } catch (err) {
        console.warn('Live Supabase register failed, falling back to local DB:', err);
      }
    }

    // Local DB Registration - completely fresh account with 0.00 wallet balance
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
      walletBalance: 0.0, // Fresh account starts with 0.00
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
