import { appStorage } from '@/shared/storage/appStorage';
import type { CartProduct } from '../../types';
import { useCartStore } from '../cartStore';

const product = (id: number, overrides: Partial<CartProduct> = {}) => ({
  id,
  title: `Item ${id}`,
  thumbnail: 'thumbnail',
  price: 10.1,
  discountPercentage: 10,
  stock: 3,
  ...overrides,
});

const cart = () => useCartStore.getState();

describe('cartStore', () => {
  beforeEach(() => cart().clear());

  describe('addItem', () => {
    it('stores prices in cents', () => {
      cart().addItem(product(1));

      expect(cart().items[0]).toMatchObject({
        productId: 1,
        quantity: 1,
        listCents: 1010,
        unitCents: 909,
      });
    });

    it('increases the quantity of an existing item', () => {
      cart().addItem(product(1));
      cart().addItem(product(1));

      expect(cart().items).toHaveLength(1);
      expect(cart().items[0].quantity).toBe(2);
    });

    it('never exceeds the stock', () => {
      for (let count = 0; count < 5; count += 1) {
        cart().addItem(product(1));
      }

      expect(cart().items[0].quantity).toBe(3);
    });

    it('ignores out of stock products', () => {
      cart().addItem(product(1, { stock: 0 }));

      expect(cart().items).toEqual([]);
    });

    it('uses the latest price and stock when added again', () => {
      cart().addItem(product(1));
      cart().addItem(product(1));
      cart().addItem(product(1));
      cart().addItem(product(1, { price: 5, discountPercentage: 0, stock: 2 }));

      expect(cart().items[0]).toMatchObject({
        quantity: 2,
        stock: 2,
        unitCents: 500,
      });
    });
  });

  describe('setQuantity', () => {
    beforeEach(() => cart().addItem(product(1)));

    it('updates the quantity', () => {
      cart().setQuantity(1, 2);

      expect(cart().items[0].quantity).toBe(2);
    });

    it('limits the quantity to the stock', () => {
      cart().setQuantity(1, 99);

      expect(cart().items[0].quantity).toBe(3);
    });

    it('removes the item at zero', () => {
      cart().setQuantity(1, 0);

      expect(cart().items).toEqual([]);
    });

    it('ignores products not in the cart', () => {
      cart().setQuantity(2, 2);

      expect(cart().items.map(item => item.productId)).toEqual([1]);
    });
  });

  describe('removeItem and clear', () => {
    beforeEach(() => {
      cart().addItem(product(1));
      cart().addItem(product(2));
    });

    it('removes only the chosen item', () => {
      cart().removeItem(1);

      expect(cart().items.map(item => item.productId)).toEqual([2]);
    });

    it('empties the cart', () => {
      cart().clear();

      expect(cart().items).toEqual([]);
    });
  });

  describe('persistence', () => {
    it('saves items without actions', () => {
      cart().addItem(product(7));

      const saved = JSON.parse(appStorage.getItem('cart') ?? '{}');

      expect(saved.version).toBe(1);
      expect(saved.state.items[0].productId).toBe(7);
      expect(saved.state.addItem).toBeUndefined();
    });

    it('restores saved items', async () => {
      cart().addItem(product(7));
      const saved = appStorage.getItem('cart') ?? '';
      useCartStore.setState({ items: [] });
      appStorage.setItem('cart', saved);

      await useCartStore.persist.rehydrate();

      expect(cart().items[0].productId).toBe(7);
    });

    it('survives corrupted saved data', async () => {
      appStorage.setItem('cart', '{corrupt');

      await useCartStore.persist.rehydrate();

      expect(typeof cart().addItem).toBe('function');
    });
  });
});
