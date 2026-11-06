import { useMutation } from '@tanstack/react-query';
import { useCartStore, type CartItem } from '@/features/cart';
import { getErrorMessage } from '@/shared/api';
import { OrderRejectedError, submitOrder } from '../api/checkoutApi';

export function getOrderErrorMessage(error: unknown): string {
  return error instanceof OrderRejectedError
    ? 'Some items are no longer available. Please review your cart.'
    : getErrorMessage(error);
}

export function usePlaceOrder() {
  return useMutation({
    mutationFn: (items: CartItem[]) => submitOrder(items),
    onSuccess: () => useCartStore.getState().clear(),
  });
}
