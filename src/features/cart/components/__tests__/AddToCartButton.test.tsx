import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { useCartStore } from '../../store/cartStore';
import { AddToCartButton } from '../AddToCartButton';

const product = {
  id: 1,
  title: 'Blue Mug',
  thumbnail: 'thumbnail',
  price: 10,
  discountPercentage: 0,
  stock: 2,
};

const quantity = () => useCartStore.getState().items[0]?.quantity;

describe('AddToCartButton', () => {
  beforeEach(() => act(() => useCartStore.getState().clear()));

  it('adds the product', () => {
    render(<AddToCartButton product={product} />);

    fireEvent.press(screen.getByLabelText('Add to cart'));

    expect(quantity()).toBe(1);
    expect(screen.getByText('In your cart')).toBeTruthy();
  });

  it('is disabled when out of stock', () => {
    render(<AddToCartButton product={{ ...product, stock: 0 }} />);

    fireEvent.press(screen.getByLabelText('Out of stock'));

    expect(useCartStore.getState().items).toEqual([]);
  });

  it('stops increasing at the available stock', () => {
    render(<AddToCartButton product={product} />);
    fireEvent.press(screen.getByLabelText('Add to cart'));

    const increase = () => screen.getByLabelText('Increase Blue Mug quantity');

    fireEvent.press(increase());
    expect(quantity()).toBe(2);
    expect(increase().props.accessibilityState.disabled).toBe(true);

    fireEvent.press(increase());
    expect(quantity()).toBe(2);
  });

  it('removes the item when decreased from one', () => {
    render(<AddToCartButton product={product} />);
    fireEvent.press(screen.getByLabelText('Add to cart'));

    fireEvent.press(screen.getByLabelText('Remove Blue Mug'));

    expect(useCartStore.getState().items).toEqual([]);
    expect(screen.getByLabelText('Add to cart')).toBeTruthy();
  });

  it('hides the label in the compact layout', () => {
    render(<AddToCartButton product={product} compact />);
    fireEvent.press(screen.getByLabelText('Add to cart'));

    expect(screen.queryByText('In your cart')).toBeNull();
    expect(screen.getByLabelText('Blue Mug quantity 1')).toBeTruthy();
  });
});
