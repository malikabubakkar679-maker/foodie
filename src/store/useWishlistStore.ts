import { create } from 'zustand';

interface WishlistState {
  favoriteIds: Set<string>;
  toggleFavorite: (productId: string) => boolean;
  isFavorite: (productId: string) => boolean;
  getFavoritesCount: () => number;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  favoriteIds: new Set(),

  toggleFavorite: (productId: string) => {
    const current = new Set(get().favoriteIds);
    let added = false;
    if (current.has(productId)) {
      current.delete(productId);
      added = false;
    } else {
      current.add(productId);
      added = true;
    }
    set({ favoriteIds: current });
    return added;
  },

  isFavorite: (productId: string) => {
    return get().favoriteIds.has(productId);
  },

  getFavoritesCount: () => {
    return get().favoriteIds.size;
  },
}));
