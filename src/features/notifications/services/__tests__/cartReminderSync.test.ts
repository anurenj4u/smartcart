import notifee from '@notifee/react-native';
import { useCartStore } from '@/features/cart';
import { startCartReminderSync } from '../cartReminderSync';

const notifications = notifee as jest.Mocked<typeof notifee>;
const product = (id: number) => ({
  id,
  title: `Item ${id}`,
  thumbnail: 'thumbnail',
  price: 10,
  discountPercentage: 0,
  stock: 5,
});

const cart = () => useCartStore.getState();
const flushPromises = async () => {
  for (let count = 0; count < 10; count += 1) {
    await Promise.resolve();
  }
};
const settle = async () => {
  jest.advanceTimersByTime(500);
  await flushPromises();
};
const scheduled = () => notifications.createTriggerNotification.mock.calls;

describe('startCartReminderSync', () => {
  let stop: () => void = () => undefined;

  beforeEach(() => {
    jest.useFakeTimers();
    cart().clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    stop();
    jest.useRealTimers();
  });

  const start = async () => {
    stop = startCartReminderSync();
    await flushPromises();
  };

  describe('on startup', () => {
    it('cancels leftovers when the cart is empty', async () => {
      await start();

      expect(notifications.cancelNotification).toHaveBeenCalledWith(
        'abandoned-cart',
      );
    });

    it('leaves a pending reminder alone when the cart has items', async () => {
      cart().addItem(product(1));
      jest.clearAllMocks();

      await start();
      await settle();

      expect(notifications.cancelNotification).not.toHaveBeenCalled();
      expect(scheduled()).toHaveLength(0);
    });
  });

  describe('when the cart changes', () => {
    beforeEach(async () => {
      await start();
      jest.clearAllMocks();
    });

    it('waits before scheduling', async () => {
      cart().addItem(product(1));
      jest.advanceTimersByTime(499);
      await flushPromises();

      expect(scheduled()).toHaveLength(0);
    });

    it('combines rapid changes into one reminder', async () => {
      cart().addItem(product(1));
      cart().addItem(product(1));
      cart().addItem(product(2));
      await settle();

      expect(scheduled()).toHaveLength(1);
      expect(scheduled()[0][0].body).toContain('3 items');
    });

    it('schedules in the future', async () => {
      cart().addItem(product(1));
      await settle();

      const trigger = scheduled()[0][1] as { timestamp: number };

      expect(trigger.timestamp).toBeGreaterThan(Date.now());
    });

    it('replaces the reminder instead of stacking another', async () => {
      cart().addItem(product(1));
      await settle();
      cart().addItem(product(1));
      await settle();

      expect(scheduled()).toHaveLength(2);
      expect(scheduled().map(([notification]) => notification.id)).toEqual([
        'abandoned-cart',
        'abandoned-cart',
      ]);
    });

    it('does not schedule without permission', async () => {
      notifications.requestPermission.mockResolvedValueOnce({
        authorizationStatus: 0,
      } as never);

      cart().addItem(product(1));
      await settle();

      expect(scheduled()).toHaveLength(0);
    });

    it('survives a scheduling failure', async () => {
      notifications.createTriggerNotification.mockRejectedValueOnce(
        new Error('failed'),
      );
      cart().addItem(product(1));
      await settle();

      cart().addItem(product(1));
      await settle();

      expect(scheduled()).toHaveLength(2);
    });
  });

  describe('when the cart empties', () => {
    beforeEach(async () => {
      await start();
      cart().addItem(product(1));
      await settle();
      jest.clearAllMocks();
    });

    it('cancels after clearing the cart, including after a purchase', async () => {
      cart().clear();
      await flushPromises();

      expect(notifications.cancelNotification).toHaveBeenCalledWith(
        'abandoned-cart',
      );
    });

    it('cancels after removing the last item', async () => {
      cart().removeItem(1);
      await flushPromises();

      expect(notifications.cancelNotification).toHaveBeenCalledTimes(1);
    });

    it('keeps the reminder while items remain', async () => {
      cart().addItem(product(2));
      cart().removeItem(1);
      await settle();

      expect(notifications.cancelNotification).not.toHaveBeenCalled();
      expect(scheduled()).toHaveLength(1);
    });

    it('drops a schedule that has not started yet', async () => {
      cart().addItem(product(2));
      cart().clear();
      await settle();

      expect(scheduled()).toHaveLength(0);
    });

    it('cancels last if cleared during the permission prompt', async () => {
      const order: string[] = [];
      let allow: (settings: never) => void = () => undefined;
      notifications.requestPermission.mockImplementationOnce(
        () =>
          new Promise(resolve => {
            allow = resolve as (settings: never) => void;
          }),
      );
      notifications.createTriggerNotification.mockImplementationOnce(
        async () => {
          order.push('schedule');
          return 'id';
        },
      );
      notifications.cancelNotification.mockImplementationOnce(async () => {
        order.push('cancel');
      });

      cart().addItem(product(2));
      await settle();
      cart().clear();
      await flushPromises();
      expect(order).toEqual([]);

      allow({ authorizationStatus: 1 } as never);
      await flushPromises();

      expect(order).toEqual(['schedule', 'cancel']);
    });
  });

  it('stops reacting after being stopped', async () => {
    await start();
    stop();
    jest.clearAllMocks();

    cart().addItem(product(1));
    await settle();

    expect(scheduled()).toHaveLength(0);
  });
});
