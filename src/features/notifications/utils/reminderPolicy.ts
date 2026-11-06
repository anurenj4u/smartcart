export const CART_REMINDER_DELAY_MS = __DEV__ ? 60 * 1000 : 2 * 60 * 60 * 1000;

export function getReminderTimestamp(now: number): number {
  return now + CART_REMINDER_DELAY_MS;
}

export function getReminderContent(itemCount: number) {
  return {
    title: 'You left something in your cart',
    body:
      itemCount === 1
        ? 'Your item is still waiting for you.'
        : `Your ${itemCount} items are still waiting for you.`,
  };
}
