import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';

export function setupOnlineTracking() {
  onlineManager.setEventListener(setOnline =>
    NetInfo.addEventListener(({ isConnected, isInternetReachable }) => {
      setOnline(isConnected !== false && isInternetReachable !== false);
    }),
  );
}

export function useIsOnline(): boolean {
  return useSyncExternalStore(
    listener => onlineManager.subscribe(listener),
    () => onlineManager.isOnline(),
  );
}
