import notifee, { EventType, type Event } from '@notifee/react-native';
import { CART_REMINDER_ID } from './reminderScheduler';

function isReminderPress({ type, detail }: Event): boolean {
  return (
    type === EventType.PRESS && detail.notification?.id === CART_REMINDER_ID
  );
}

export function registerBackgroundReminderHandler(onPress: () => void): void {
  notifee.onBackgroundEvent(async event => {
    if (isReminderPress(event)) {
      onPress();
    }
  });
}

export function subscribeToReminderPress(onPress: () => void): () => void {
  notifee.getInitialNotification().then(initial => {
    if (initial?.notification?.id === CART_REMINDER_ID) {
      onPress();
    }
  });

  return notifee.onForegroundEvent(event => {
    if (isReminderPress(event)) {
      onPress();
    }
  });
}
