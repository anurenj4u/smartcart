/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/app/App';
import { openCart } from './src/app/navigation/navigationRef';
import { registerBackgroundReminderHandler } from './src/features/notifications';
import { name as appName } from './app.json';

registerBackgroundReminderHandler(openCart);

AppRegistry.registerComponent(appName, () => App);
