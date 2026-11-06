import { getCartTotals, useCartStore } from '@/features/cart';
import { scheduleCartReminder } from './reminderScheduler';

const SYNC_DEBOUNCE_MS = 500;

export function startCartReminderSync(): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const unsubscribe = useCartStore.subscribe((state, previous) => {
    if (state.items === previous.items) {
      return;
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      const { itemCount } = getCartTotals(useCartStore.getState().items);

      if (itemCount > 0) {
        scheduleCartReminder(itemCount).catch(() => undefined);
      }
    }, SYNC_DEBOUNCE_MS);
  });

  return () => {
    clearTimeout(timer);
    unsubscribe();
  };
}
