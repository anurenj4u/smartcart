import { appStorage } from '@/shared/storage/appStorage';
import { useWishlistStore } from '../wishlistStore';

const product = (id: number) => ({
  id,
  title: `Item ${id}`,
  thumbnail: 'thumbnail',
  price: 10,
  discountPercentage: 0,
  rating: 4,
  stock: 3,
});

const wishlist = () => useWishlistStore.getState();
const ids = () => wishlist().items.map(({ id }) => id);

describe('wishlistStore', () => {
  beforeEach(() => useWishlistStore.setState({ items: [] }));

  it('adds a product on the first toggle', () => {
    wishlist().toggle(product(1));

    expect(ids()).toEqual([1]);
  });

  it('removes a product on the second toggle', () => {
    wishlist().toggle(product(1));
    wishlist().toggle(product(1));

    expect(ids()).toEqual([]);
  });

  it('keeps items in the order they were saved', () => {
    wishlist().toggle(product(2));
    wishlist().toggle(product(1));

    expect(ids()).toEqual([2, 1]);
  });

  it('removes one product by id', () => {
    wishlist().toggle(product(1));
    wishlist().toggle(product(2));

    wishlist().remove(1);

    expect(ids()).toEqual([2]);
  });

  it('saves only the fields it needs', () => {
    wishlist().toggle({ ...product(1), description: 'extra' } as ReturnType<
      typeof product
    >);

    expect(wishlist().items[0]).toEqual(product(1));
  });

  it('restores saved items', async () => {
    wishlist().toggle(product(9));
    const saved = appStorage.getItem('wishlist') ?? '';
    useWishlistStore.setState({ items: [] });
    appStorage.setItem('wishlist', saved);

    await useWishlistStore.persist.rehydrate();

    expect(ids()).toEqual([9]);
  });
});
