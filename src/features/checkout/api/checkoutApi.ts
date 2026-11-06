import type { CartItem } from '@/features/cart';
import { request } from '@/shared/api';

const DEMO_USER_ID = 1;

type CheckoutResponse = {
  totalProducts: number;
};

export class OrderRejectedError extends Error {
  constructor() {
    super('The order did not include every product in the cart');
    this.name = 'OrderRejectedError';
  }
}

export async function submitOrder(items: CartItem[]): Promise<void> {
  const { totalProducts } = await request<CheckoutResponse>('/carts/add', {
    method: 'POST',
    body: {
      userId: DEMO_USER_ID,
      products: items.map(({ productId, quantity }) => ({
        id: productId,
        quantity,
      })),
    },
  });

  if (totalProducts !== items.length) {
    throw new OrderRejectedError();
  }
}
