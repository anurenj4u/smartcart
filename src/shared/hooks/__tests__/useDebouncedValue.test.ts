import { act, renderHook } from '@testing-library/react-native';
import { useDebouncedValue } from '../useDebouncedValue';

const renderDebounced = (value: string) =>
  renderHook<string, { value: string }>(
    props => useDebouncedValue(props.value, 400),
    { initialProps: { value } },
  );

describe('useDebouncedValue', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('keeps the old value until the delay passes', () => {
    const { result, rerender } = renderDebounced('a');

    rerender({ value: 'ab' });
    act(() => jest.advanceTimersByTime(399));
    expect(result.current).toBe('a');

    act(() => jest.advanceTimersByTime(1));
    expect(result.current).toBe('ab');
  });

  it('restarts the delay on every change', () => {
    const { result, rerender } = renderDebounced('p');

    rerender({ value: 'ph' });
    act(() => jest.advanceTimersByTime(300));
    rerender({ value: 'pho' });
    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toBe('p');

    act(() => jest.advanceTimersByTime(100));
    expect(result.current).toBe('pho');
  });
});
