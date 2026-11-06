import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootTabParamList } from '@/shared/navigation/types';

export const navigationRef = createNavigationContainerRef<RootTabParamList>();

let shouldOpenCart = false;

export function openCart(): void {
  if (navigationRef.isReady()) {
    shouldOpenCart = false;
    navigationRef.navigate('CartTab', { screen: 'Cart' });
  } else {
    shouldOpenCart = true;
  }
}

export function handleNavigationReady(): void {
  if (shouldOpenCart) {
    openCart();
  }
}
