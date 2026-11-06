import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { focusManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import type { PropsWithChildren } from 'react';
import { AppState } from 'react-native';
import { queryClient } from '@/shared/api';
import { setupOnlineTracking } from '@/shared/network/online';
import { appStorage } from '@/shared/storage/appStorage';

const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const CACHE_VERSION = '1';

const persister = createSyncStoragePersister({
  storage: appStorage,
  key: 'query-cache',
  throttleTime: 1000,
});

setupOnlineTracking();

focusManager.setEventListener(setFocused => {
  const subscription = AppState.addEventListener('change', state => {
    setFocused(state === 'active');
  });

  return () => subscription.remove();
});

export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: CACHE_MAX_AGE_MS,
        buster: CACHE_VERSION,
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
