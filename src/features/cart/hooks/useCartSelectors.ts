import { useMemo } from 'react';
import { useCartStore } from '../store/cartStore';
import { getCartTotals } from '../utils/cartTotals';

export function useCartItemCount() {
  return useCartStore(state =>
    state.items.reduce((count, item) => count + item.quantity, 0),
  );
}

export function useCartItemQuantity(productId: number) {
  return useCartStore(
    state =>
      state.items.find(item => item.productId === productId)?.quantity ?? 0,
  );
}

export function useCartTotals() {
  const items = useCartStore(state => state.items);
  return useMemo(() => getCartTotals(items), [items]);
}
