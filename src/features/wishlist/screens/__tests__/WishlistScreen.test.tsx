import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { useCartStore } from '@/features/cart';
import { useWishlistStore } from '../../store/wishlistStore';
import { WishlistScreen } from '../WishlistScreen';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

const product = (id: number, overrides = {}) => ({
  id,
  title: `Item ${id}`,
  thumbnail: 'thumbnail',
  price: 100,
  discountPercentage: 18.3,
  rating: 4.26,
  stock: 3,
  ...overrides,
});

const save = (...products: ReturnType<typeof product>[]) =>
  act(() => useWishlistStore.setState({ items: products }));

describe('WishlistScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    act(() => {
      useWishlistStore.setState({ items: [] });
      useCartStore.getState().clear();
    });
  });

  it('offers to browse when empty', () => {
    render(<WishlistScreen />);

    expect(screen.getByText('Your wishlist is empty')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Browse products'));

    expect(mockNavigate).toHaveBeenCalledWith('ShopTab', {
      screen: 'ProductList',
    });
  });

  it('counts saved items', () => {
    save(product(1));
    const { rerender } = render(<WishlistScreen />);

    expect(screen.getByText('1 saved item')).toBeTruthy();

    save(product(1), product(2));
    rerender(<WishlistScreen />);

    expect(screen.getByText('2 saved items')).toBeTruthy();
  });

  it('shows the price, discount and rating', () => {
    save(product(1));
    render(<WishlistScreen />);

    expect(screen.getByText('$81.70')).toBeTruthy();
    expect(screen.getByText('$100.00')).toBeTruthy();
    expect(screen.getByText('-18%')).toBeTruthy();
    expect(screen.getByText('4.3')).toBeTruthy();
  });

  it('hides the discount badge without a discount', () => {
    save(product(1, { discountPercentage: 0 }));
    render(<WishlistScreen />);

    expect(screen.queryByText(/^-\d+%$/)).toBeNull();
  });

  it('removes a product with the heart', () => {
    save(product(1));
    render(<WishlistScreen />);

    fireEvent.press(screen.getByLabelText('Remove Item 1 from wishlist'));

    expect(useWishlistStore.getState().items).toEqual([]);
    expect(screen.getByText('Your wishlist is empty')).toBeTruthy();
  });

  it('adds to the cart and keeps the product saved', () => {
    save(product(1));
    render(<WishlistScreen />);

    fireEvent.press(screen.getByLabelText('Add to cart'));

    expect(useCartStore.getState().items[0].productId).toBe(1);
    expect(useWishlistStore.getState().items).toHaveLength(1);
    expect(screen.getByLabelText('Item 1 quantity 1')).toBeTruthy();
  });

  it('prevents adding out of stock products', () => {
    save(product(1, { stock: 0 }));
    render(<WishlistScreen />);

    fireEvent.press(screen.getByLabelText('Out of stock'));

    expect(useCartStore.getState().items).toEqual([]);
  });

  it('opens product details in the shop tab', () => {
    save(product(5));
    render(<WishlistScreen />);

    fireEvent.press(screen.getByLabelText('View Item 5'));

    expect(mockNavigate).toHaveBeenCalledWith('ShopTab', {
      screen: 'ProductDetails',
      params: { productId: 5 },
      initial: false,
    });
  });
});
