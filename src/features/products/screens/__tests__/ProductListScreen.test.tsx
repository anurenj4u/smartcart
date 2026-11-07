import { onlineManager } from '@tanstack/react-query';
import {
  act,
  configure,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { FlatList } from 'react-native';
import {
  makeProduct,
  mockApi,
  renderWithClient,
} from '../../../../../test-utils';
import { ProductListScreen } from '../ProductListScreen';

configure({ asyncUtilTimeout: 5000 });

const navigation = { navigate: jest.fn() };
const renderScreen = () =>
  renderWithClient(
    <ProductListScreen navigation={navigation as any} route={{} as any} />,
  );

const list = () => screen.UNSAFE_getByType(FlatList);
const reachEnd = () => act(async () => list().props.onEndReached());
const setOnline = (online: boolean) =>
  act(async () => onlineManager.setOnline(online));
const search = (text: string) =>
  fireEvent.changeText(screen.getByPlaceholderText('Search products'), text);

const catalog = Array.from({ length: 45 }, (_, index) =>
  makeProduct(index + 1),
);

describe('ProductListScreen', () => {
  describe('listing', () => {
    it('shows product name, discounted price and rating', async () => {
      mockApi([
        makeProduct(1, {
          title: 'Blue Mug',
          price: 100,
          discountPercentage: 10,
          rating: 4.26,
        }),
      ]);
      renderScreen();

      expect(await screen.findByText('Blue Mug')).toBeTruthy();
      expect(screen.getByText('$90.00')).toBeTruthy();
      expect(screen.getByText('$100.00')).toBeTruthy();
      expect(screen.getByText('4.3')).toBeTruthy();
    });

    it('shows skeletons until products load', async () => {
      mockApi([makeProduct(1, { title: 'Blue Mug' })]);
      renderScreen();

      expect(screen.getByLabelText('Loading products')).toBeTruthy();
      expect(screen.getByLabelText('Loading categories')).toBeTruthy();

      await screen.findByText('Blue Mug');

      expect(screen.queryByLabelText('Loading products')).toBeNull();
    });

    it('labels products that are out of stock', async () => {
      mockApi([makeProduct(1, { stock: 0 })]);
      renderScreen();

      expect(await screen.findByText('Out of stock')).toBeTruthy();
    });

    it('opens product details', async () => {
      mockApi([makeProduct(7, { title: 'Blue Mug' })]);
      renderScreen();

      fireEvent.press(await screen.findByText('Blue Mug'));

      expect(navigation.navigate).toHaveBeenCalledWith('ProductDetails', {
        productId: 7,
      });
    });

    it('shows an empty state', async () => {
      mockApi([]);
      renderScreen();

      expect(await screen.findByText('No products found')).toBeTruthy();
    });
  });

  describe('pagination', () => {
    it('loads pages until there are no more', async () => {
      const api = mockApi(catalog);
      renderScreen();
      await screen.findByText('Item 1');

      await reachEnd();
      await waitFor(() => expect(api.pageRequests()).toHaveLength(2));
      expect(api.pageRequests()[1]).toContain('skip=20');

      await reachEnd();
      await waitFor(() => expect(api.pageRequests()).toHaveLength(3));
      expect(api.pageRequests()[2]).toContain('skip=40');

      await reachEnd();
      expect(api.pageRequests()).toHaveLength(3);
    });
  });

  describe('failures', () => {
    it('offers a retry when the first load fails', async () => {
      const api = mockApi(catalog);
      api.failAll();
      renderScreen();

      expect(await screen.findByText("Couldn't load products")).toBeTruthy();

      api.restore();
      fireEvent.press(screen.getByLabelText('Try again'));

      expect(await screen.findByText('Item 1')).toBeTruthy();
    });

    it('does not keep retrying when the next page fails', async () => {
      const api = mockApi(catalog);
      renderScreen();
      await screen.findByText('Item 1');

      api.failAll();
      await reachEnd();
      await screen.findByText("Couldn't load more products.");
      const requestCount = api.fetchMock.mock.calls.length;

      await reachEnd();

      expect(api.fetchMock.mock.calls).toHaveLength(requestCount);
    });

    it('keeps products when a refresh fails', async () => {
      const api = mockApi(catalog);
      renderScreen();
      await screen.findByText('Item 1');

      api.failAll();
      await act(async () => {
        await list().props.refreshControl.props.onRefresh();
      });

      expect(screen.getByText('Item 1')).toBeTruthy();
      expect(await screen.findByText(/Couldn't refresh/)).toBeTruthy();
      expect(list().props.refreshControl.props.refreshing).toBe(false);
    });
  });

  describe('search', () => {
    it('sends one request after typing stops', async () => {
      const api = mockApi([makeProduct(1, { title: 'Red phone' })]);
      renderScreen();
      await screen.findByText('Red phone');

      search('p');
      search('ph');
      search('phone');
      expect(api.urls().join()).not.toContain('/products/search');

      await waitFor(() =>
        expect(
          api.urls().filter(url => url.includes('/products/search')),
        ).toHaveLength(1),
      );
      expect(api.urls().join()).toContain('q=phone');
    });

    it('clears filters from the empty state', async () => {
      mockApi([makeProduct(1, { title: 'Red phone' })]);
      renderScreen();
      await screen.findByText('Red phone');

      search('zzz');
      fireEvent.press(await screen.findByLabelText('Clear filters'));

      expect(await screen.findByText('Red phone')).toBeTruthy();
    });
  });

  describe('categories and filters', () => {
    const products = [
      makeProduct(1, { title: 'Red phone', category: 'phones' }),
      makeProduct(2, { title: 'Blue phone', category: 'beauty' }),
      makeProduct(3, { title: 'Lipstick', category: 'beauty' }),
    ];

    it('filters by category', async () => {
      const api = mockApi(products);
      renderScreen();

      fireEvent.press(await screen.findByLabelText('Beauty'));

      expect(await screen.findByText('Lipstick')).toBeTruthy();
      await waitFor(() => expect(screen.queryByText('Red phone')).toBeNull());
      expect(api.urls().join()).toContain('/products/category/beauty');
    });

    it('combines search and category on the device', async () => {
      mockApi(products);
      renderScreen();

      fireEvent.press(await screen.findByLabelText('Beauty'));
      search('phone');

      expect(await screen.findByText('Blue phone')).toBeTruthy();
      await waitFor(() => expect(screen.queryByText('Lipstick')).toBeNull());
      expect(screen.queryByText('Red phone')).toBeNull();
    });

    it('rejects an invalid price range', async () => {
      mockApi(products);
      renderScreen();

      fireEvent.press(await screen.findByLabelText('Sort and filter'));
      fireEvent.changeText(screen.getByLabelText('Minimum price'), '9');
      fireEvent.changeText(screen.getByLabelText('Maximum price'), '5');

      expect(screen.getByText(/Minimum price must be lower/)).toBeTruthy();
      expect(
        screen.getByLabelText('Apply').props.accessibilityState.disabled,
      ).toBe(true);
    });

    it('applies filters and shows how many are active', async () => {
      mockApi([
        makeProduct(1, { title: 'Cheap', price: 5 }),
        makeProduct(2, { title: 'Costly', price: 50 }),
      ]);
      renderScreen();

      fireEvent.press(await screen.findByLabelText('Sort and filter'));
      fireEvent.changeText(screen.getByLabelText('Minimum price'), '10');
      fireEvent.press(screen.getByLabelText('Price: low to high'));
      fireEvent.press(screen.getByLabelText('Apply'));

      expect(
        await screen.findByLabelText('Sort and filter, 2 active'),
      ).toBeTruthy();
      await waitFor(() => expect(screen.queryByText('Cheap')).toBeNull());
      expect(screen.getByText('Costly')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('says so instead of spinning, then loads on reconnect', async () => {
      const api = mockApi(catalog);
      await setOnline(false);
      renderScreen();

      expect(await screen.findByText("You're offline")).toBeTruthy();
      expect(api.fetchMock).not.toHaveBeenCalled();

      await setOnline(true);

      expect(await screen.findByText('Item 1')).toBeTruthy();
    });

    it('searches the saved catalog without the network', async () => {
      const api = mockApi([
        makeProduct(1),
        makeProduct(2, { title: 'Red phone' }),
      ]);
      renderScreen();
      await screen.findByText('Item 1');
      await waitFor(() => expect(api.urls().join()).toContain('limit=0'));
      await waitFor(() =>
        expect(api.fetchMock.mock.results.length).toBeGreaterThan(1),
      );
      await act(async () => {
        await new Promise<void>(resolve => setTimeout(resolve, 10));
      });

      await setOnline(false);
      const requestCount = api.fetchMock.mock.calls.length;
      search('phone');

      for (let step = 0; step < 10; step += 1) {
        await act(async () => {
          await new Promise<void>(resolve => setTimeout(resolve, 200));
        });
      }

      expect(screen.getByText('Red phone')).toBeTruthy();
      expect(screen.queryByText('Item 1')).toBeNull();
      expect(api.fetchMock.mock.calls).toHaveLength(requestCount);
    });

    it('ends pull to refresh immediately', async () => {
      mockApi(catalog);
      renderScreen();
      await screen.findByText('Item 1');
      await setOnline(false);

      await act(async () => {
        await list().props.refreshControl.props.onRefresh();
      });

      expect(list().props.refreshControl.props.refreshing).toBe(false);
    });
  });
});
