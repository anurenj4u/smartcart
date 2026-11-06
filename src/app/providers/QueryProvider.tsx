import { focusManager, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { AppState } from 'react-native';
import { queryClient } from '@/shared/api';

focusManager.setEventListener(setFocused => {
  const subscription = AppState.addEventListener('change', state => {
    setFocused(state === 'active');
  });

  return () => subscription.remove();
});

export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
