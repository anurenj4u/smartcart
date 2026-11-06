import { getCartTotals, type CartItem } from '@/features/cart';
import type { Order } from '@/features/orders';
import type { ShippingDetails } from '../types';

export function createOrder(
  items: CartItem[],
  shipping: ShippingDetails,
  now: Date = new Date(),
): Order {
  return {
    id: `SC-${now.getTime().toString(36).toUpperCase()}`,
    placedAt: now.toISOString(),
    items: items.map(
      ({ productId, title, thumbnail, unitCents, quantity }) => ({
        productId,
        title,
        thumbnail,
        unitCents,
        quantity,
      }),
    ),
    ...getCartTotals(items),
    shipping: {
      fullName: shipping.fullName.trim(),
      address: shipping.address.trim(),
      city: shipping.city.trim(),
      postalCode: shipping.postalCode.trim(),
    },
  };
}
