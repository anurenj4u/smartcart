import {
  CART_REMINDER_DELAY_MS,
  getReminderContent,
  getReminderTimestamp,
} from '../reminderPolicy';

describe('getReminderTimestamp', () => {
  it('schedules after the reminder delay', () => {
    expect(getReminderTimestamp(1000)).toBe(1000 + CART_REMINDER_DELAY_MS);
  });
});

describe('getReminderContent', () => {
  it('uses singular wording for one item', () => {
    expect(getReminderContent(1).body).toBe(
      'Your item is still waiting for you.',
    );
  });

  it('includes the count for several items', () => {
    expect(getReminderContent(3).body).toBe(
      'Your 3 items are still waiting for you.',
    );
  });
});
