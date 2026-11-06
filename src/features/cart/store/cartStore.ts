import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { appStorage } from '@/shared/storage/appStorage';
import { getProductPricing } from '@/shared/utils/pricing';
import type { CartItem, CartProduct } from '../types';

type CartState = {
  items: CartItem[];
  addItem: (product: CartProduct) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
};

function toCartItem(product: CartProduct, quantity: number): CartItem {
  const { listCents, finalCents } = getProductPricing(product);

  return {
    productId: product.id,
    title: product.title,
    thumbnail: product.thumbnail,
    listCents,
    unitCents: finalCents,
    stock: product.stock,
    quantity: Math.min(quantity, product.stock),
  };
}

export const useCartStore = create<CartState>()(
  persist(
    set => ({
      items: [],
      addItem: product =>
        set(({ items }) => {
          if (product.stock === 0) {
            return { items };
          }

          const existing = items.find(item => item.productId === product.id);

          return existing
            ? {
                items: items.map(item =>
                  item === existing
                    ? toCartItem(product, existing.quantity + 1)
                    : item,
                ),
              }
            : { items: [...items, toCartItem(product, 1)] };
        }),
      removeItem: productId =>
        set(({ items }) => ({
          items: items.filter(item => item.productId !== productId),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'cart',
      version: 1,
      storage: createJSONStorage(() => appStorage),
      partialize: ({ items }) => ({ items }),
    },
  ),
);
