import { act, fireEvent, screen } from '@testing-library/react-native';
import { FlatList } from 'react-native';
import { useWishlistStore } from '@/features/wishlist';
import {
  makeProduct,
  mockApi,
  renderWithClient,
} from '../../../../../test-utils';
import { ProductListScreen } from '../ProductListScreen';

const mockCardRender = jest.fn();

jest.mock('../../components/ProductPrice', () => {
  const actual = jest.requireActual('../../components/ProductPrice');
  return {
    ProductPrice: (props: unknown) => {
      mockCardRender();
      return actual.ProductPrice(props);
    },
  };
});

const renderScreen = async () => {
  mockApi(
    Array.from({ length: 8 }, (_, index) =>
      makeProduct(index + 1, { title: `Card ${index + 1}` }),
    ),
  );
  renderWithClient(
    <ProductListScreen
      navigation={{ navigate: jest.fn() } as any}
      route={{} as any}
    />,
  );
  await screen.findByText('Card 1');
  await act(async () => {
    await new Promise<void>(resolve => setTimeout(resolve, 100));
  });
  mockCardRender.mockClear();
};

describe('ProductListScreen rendering', () => {
  beforeEach(() => useWishlistStore.setState({ items: [] }));

  it('does not re-render cards while typing in search', async () => {
    await renderScreen();

    fireEvent.changeText(screen.getByPlaceholderText('Search products'), 'c');
    fireEvent.changeText(screen.getByPlaceholderText('Search products'), 'ca');

    expect(mockCardRender).not.toHaveBeenCalled();
  });

  it('does not re-render cards when opening the filter sheet', async () => {
    await renderScreen();

    fireEvent.press(screen.getByLabelText('Sort and filter'));

    expect(mockCardRender).not.toHaveBeenCalled();
  });

  it('does not re-render cards when toggling a wishlist heart', async () => {
    await renderScreen();

    fireEvent.press(screen.getByLabelText('Add Card 1 to wishlist'));

    expect(screen.getByLabelText('Remove Card 1 from wishlist')).toBeTruthy();
    expect(mockCardRender).not.toHaveBeenCalled();
  });

  it('keeps stable list callbacks between renders', async () => {
    await renderScreen();
    const before = screen.UNSAFE_getByType(FlatList).props;

    fireEvent.changeText(screen.getByPlaceholderText('Search products'), 'c');

    const after = screen.UNSAFE_getByType(FlatList).props;
    expect(after.renderItem).toBe(before.renderItem);
    expect(after.keyExtractor).toBe(before.keyExtractor);
  });
});
