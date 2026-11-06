import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  startCartReminderSync,
  subscribeToReminderPress,
} from '@/features/notifications';
import { openCart } from './navigation/navigationRef';
import { RootNavigator } from './navigation/RootNavigator';
import { QueryProvider } from './providers/QueryProvider';

function App() {
  useEffect(() => startCartReminderSync(), []);
  useEffect(() => subscribeToReminderPress(openCart), []);

  return (
    <QueryProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <RootNavigator />
      </SafeAreaProvider>
    </QueryProvider>
  );
}

export default App;
