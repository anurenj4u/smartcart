import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { useCartStore } from '../../store/cartStore';
import { CartScreen } from '../CartScreen';

const mockStepperRender = jest.fn();

const mockNavigation = { navigate: jest.fn() };

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => mockNavigation,
}));

jest.mock('../../components/QuantityStepper', () => {
  const actual = jest.requireActual('../../components/QuantityStepper');
  return {
    QuantityStepper: (props: { label: string }) => {
      mockStepperRender(props.label);
      return actual.QuantityStepper(props);
    },
  };
});

const product = (id: number) => ({
  id,
  title: `Item ${id}`,
  thumbnail: 'thumbnail',
  price: 10,
  discountPercentage: 0,
  stock: 5,
});

describe('CartScreen rendering', () => {
  beforeEach(() => {
    act(() => {
      useCartStore.getState().clear();
      useCartStore.getState().addItem(product(1));
      useCartStore.getState().addItem(product(2));
      useCartStore.getState().addItem(product(3));
    });
    render(<CartScreen />);
    mockStepperRender.mockClear();
  });

  it('re-renders only the row whose quantity changed', () => {
    fireEvent.press(screen.getByLabelText('Increase Item 2 quantity'));

    expect(mockStepperRender.mock.calls).toEqual([['Item 2']]);
    expect(screen.getByText('Subtotal (4 items)')).toBeTruthy();
  });

  it('does not re-render remaining rows when one is removed', () => {
    fireEvent.press(screen.getByLabelText('Remove Item 2 from cart'));

    expect(mockStepperRender).not.toHaveBeenCalled();
    expect(screen.queryByLabelText('View Item 2')).toBeNull();
  });
});
