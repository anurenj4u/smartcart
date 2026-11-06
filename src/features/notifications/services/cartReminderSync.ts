import { getCartTotals, useCartStore } from '@/features/cart';
import { cancelCartReminder, scheduleCartReminder } from './reminderScheduler';

const SYNC_DEBOUNCE_MS = 500;

export function startCartReminderSync(): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: Promise<void> = Promise.resolve();

  const enqueue = (operation: () => Promise<void>) => {
    pending = pending.then(operation).catch(() => undefined);
  };

  const getItemCount = () =>
    getCartTotals(useCartStore.getState().items).itemCount;

  if (getItemCount() === 0) {
    enqueue(cancelCartReminder);
  }

  const unsubscribe = useCartStore.subscribe((state, previous) => {
    if (state.items === previous.items) {
      return;
    }

    clearTimeout(timer);

    if (state.items.length === 0) {
      enqueue(cancelCartReminder);
      return;
    }

    timer = setTimeout(() => {
      enqueue(() => scheduleCartReminder(getItemCount()));
    }, SYNC_DEBOUNCE_MS);
  });

  return () => {
    clearTimeout(timer);
    unsubscribe();
  };
}
