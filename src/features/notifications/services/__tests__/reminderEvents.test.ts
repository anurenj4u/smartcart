import notifee, { EventType, type Event } from '@notifee/react-native';
import {
  registerBackgroundReminderHandler,
  subscribeToReminderPress,
} from '../reminderEvents';

const notifications = notifee as jest.Mocked<typeof notifee>;
const reminderPress = {
  type: EventType.PRESS,
  detail: { notification: { id: 'abandoned-cart' } },
} as Event;

const flushPromises = () => new Promise<void>(resolve => setImmediate(resolve));

describe('reminder events', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('subscribeToReminderPress', () => {
    const start = async (onPress: () => void) => {
      subscribeToReminderPress(onPress);
      await flushPromises();
      return notifications.onForegroundEvent.mock.calls[0][0];
    };

    it('opens the cart when the reminder launched the app', async () => {
      notifications.getInitialNotification.mockResolvedValueOnce({
        notification: { id: 'abandoned-cart' },
      } as never);
      const onPress = jest.fn();

      await start(onPress);

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('ignores other notifications that launched the app', async () => {
      notifications.getInitialNotification.mockResolvedValueOnce({
        notification: { id: 'other' },
      } as never);
      const onPress = jest.fn();

      await start(onPress);

      expect(onPress).not.toHaveBeenCalled();
    });

    it('handles a normal launch', async () => {
      notifications.getInitialNotification.mockResolvedValueOnce(null as never);
      const onPress = jest.fn();

      await start(onPress);

      expect(onPress).not.toHaveBeenCalled();
    });

    it('opens the cart when pressed in the foreground', async () => {
      notifications.getInitialNotification.mockResolvedValueOnce(null as never);
      const onPress = jest.fn();
      const handler = await start(onPress);

      handler(reminderPress);

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('ignores dismissals and other notifications', async () => {
      notifications.getInitialNotification.mockResolvedValueOnce(null as never);
      const onPress = jest.fn();
      const handler = await start(onPress);

      handler({ ...reminderPress, type: EventType.DISMISSED });
      handler({
        type: EventType.PRESS,
        detail: { notification: { id: 'other' } },
      } as Event);

      expect(onPress).not.toHaveBeenCalled();
    });

    it('returns the unsubscribe function', () => {
      const unsubscribe = jest.fn();
      notifications.onForegroundEvent.mockReturnValueOnce(unsubscribe);

      expect(subscribeToReminderPress(jest.fn())).toBe(unsubscribe);
    });
  });

  describe('registerBackgroundReminderHandler', () => {
    it('opens the cart when pressed in the background', async () => {
      const onPress = jest.fn();
      registerBackgroundReminderHandler(onPress);
      const handler = notifications.onBackgroundEvent.mock.calls[0][0];

      await handler(reminderPress);

      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });
});
