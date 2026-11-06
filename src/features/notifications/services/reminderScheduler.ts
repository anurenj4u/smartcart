import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  TriggerType,
} from '@notifee/react-native';
import { colors } from '@/shared/theme';
import {
  getReminderContent,
  getReminderTimestamp,
} from '../utils/reminderPolicy';

const REMINDER_ID = 'abandoned-cart';
const CHANNEL_ID = 'cart-reminders';

export async function scheduleCartReminder(itemCount: number): Promise<void> {
  const { authorizationStatus } = await notifee.requestPermission();

  if (authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
    return;
  }

  const channelId = await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Cart reminders',
    importance: AndroidImportance.HIGH,
  });

  await notifee.createTriggerNotification(
    {
      id: REMINDER_ID,
      ...getReminderContent(itemCount),
      android: {
        channelId,
        smallIcon: 'ic_notification',
        color: colors.primary,
        pressAction: { id: 'default' },
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: getReminderTimestamp(Date.now()),
    },
  );
}
