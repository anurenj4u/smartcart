import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Alert, type AlertButton } from 'react-native';
import { useCartStore } from '../../store/cartStore';
import { CartScreen } from '../CartScreen';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

const product = (id: number, price: number) => ({
  id,
  title: `Item ${id}`,
  thumbnail: 'thumbnail',
  price,
  discountPercentage: 10,
  stock: 5,
});

const addItems = () =>
  act(() => {
    useCartStore.getState().addItem(product(1, 10));
    useCartStore.getState().addItem(product(1, 10));
    useCartStore.getState().addItem(product(2, 20));
  });

describe('CartScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    act(() => useCartStore.getState().clear());
  });

  it('offers to browse when empty', () => {
    render(<CartScreen />);

    fireEvent.press(screen.getByLabelText('Browse products'));

    expect(mockNavigate).toHaveBeenCalledWith('ShopTab', {
      screen: 'ProductList',
    });
  });

  it('shows line prices and totals', () => {
    addItems();
    render(<CartScreen />);

    expect(screen.getByText('Subtotal (3 items)')).toBeTruthy();
    expect(screen.getByText('$40.00')).toBeTruthy();
    expect(screen.getByText('-$4.00')).toBeTruthy();
    expect(screen.getAllByText('$36.00').length).toBeGreaterThan(0);
  });

  it('updates totals when the quantity changes', () => {
    addItems();
    render(<CartScreen />);

    fireEvent.press(screen.getByLabelText('Increase Item 2 quantity'));

    expect(screen.getByText('Subtotal (4 items)')).toBeTruthy();
    expect(screen.getByText('$60.00')).toBeTruthy();
  });

  it('removes an item', () => {
    addItems();
    render(<CartScreen />);

    fireEvent.press(screen.getByLabelText('Remove Item 1 from cart'));

    expect(screen.queryByLabelText('View Item 1')).toBeNull();
    expect(screen.getByText('Subtotal (1 item)')).toBeTruthy();
  });

  it('only clears after confirmation', () => {
    const alert = jest.spyOn(Alert, 'alert');
    addItems();
    render(<CartScreen />);

    fireEvent.press(screen.getByText('Clear cart'));

    expect(useCartStore.getState().items).toHaveLength(2);

    const buttons = alert.mock.calls[0][2] as AlertButton[];
    act(() => buttons.find(({ text }) => text === 'Clear cart')?.onPress?.());

    expect(useCartStore.getState().items).toEqual([]);
    expect(screen.getByText('Your cart is empty')).toBeTruthy();
    alert.mockRestore();
  });

  it('goes to checkout', () => {
    addItems();
    render(<CartScreen />);

    fireEvent.press(screen.getByLabelText('Checkout'));

    expect(mockNavigate).toHaveBeenCalledWith('Checkout');
  });
});
