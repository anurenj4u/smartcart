import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { appStorage } from '@/shared/storage/appStorage';
import type { WishlistProduct } from '../types';

type WishlistState = {
  items: WishlistProduct[];
  toggle: (product: WishlistProduct) => void;
  remove: (productId: number) => void;
};

function toWishlistItem(product: WishlistProduct): WishlistProduct {
  const { id, title, thumbnail, price, discountPercentage, rating, stock } =
    product;

  return { id, title, thumbnail, price, discountPercentage, rating, stock };
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    set => ({
      items: [],
      toggle: product =>
        set(({ items }) => ({
          items: items.some(item => item.id === product.id)
            ? items.filter(item => item.id !== product.id)
            : [...items, toWishlistItem(product)],
        })),
      remove: productId =>
        set(({ items }) => ({
          items: items.filter(item => item.id !== productId),
        })),
    }),
    {
      name: 'wishlist',
      version: 1,
      storage: createJSONStorage(() => appStorage),
      partialize: ({ items }) => ({ items }),
    },
  ),
);

export function useIsWishlisted(productId: number) {
  return useWishlistStore(state =>
    state.items.some(item => item.id === productId),
  );
}
