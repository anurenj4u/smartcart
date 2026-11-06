import { useMutation } from '@tanstack/react-query';
import { useCartStore, type CartItem } from '@/features/cart';
import { useOrdersStore } from '@/features/orders';
import { getErrorMessage } from '@/shared/api';
import { OrderRejectedError, submitOrder } from '../api/checkoutApi';
import type { ShippingDetails } from '../types';
import { createOrder } from '../utils/createOrder';

type PlaceOrderInput = {
  items: CartItem[];
  shipping: ShippingDetails;
};

export function getOrderErrorMessage(error: unknown): string {
  return error instanceof OrderRejectedError
    ? 'Some items are no longer available. Please review your cart.'
    : getErrorMessage(error);
}

export function usePlaceOrder() {
  return useMutation({
    mutationFn: async ({ items, shipping }: PlaceOrderInput) => {
      await submitOrder(items);
      return createOrder(items, shipping);
    },
    onSuccess: order => {
      useOrdersStore.getState().addOrder(order);
      useCartStore.getState().clear();
    },
  });
}
