import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { Heart, ReceiptText, ShoppingCart, Store } from 'lucide-react-native';
import { useCartItemCount } from '@/features/cart';
import { OrdersScreen } from '@/features/orders';
import { WishlistScreen } from '@/features/wishlist';
import type { RootTabParamList } from '@/shared/navigation/types';
import { colors } from '@/shared/theme';
import { CartNavigator } from './CartNavigator';
import { ShopNavigator } from './ShopNavigator';

const Tab = createBottomTabNavigator<RootTabParamList>();

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

type TabIconProps = { color: string; size: number };

const ShopIcon = ({ color, size }: TabIconProps) => (
  <Store color={color} size={size} />
);
const WishlistIcon = ({ color, size }: TabIconProps) => (
  <Heart color={color} size={size} />
);
const CartIcon = ({ color, size }: TabIconProps) => (
  <ShoppingCart color={color} size={size} />
);
const OrdersIcon = ({ color, size }: TabIconProps) => (
  <ReceiptText color={color} size={size} />
);

export function RootNavigator() {
  const cartItemCount = useCartItemCount();

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
        }}
      >
        <Tab.Screen
          name="ShopTab"
          component={ShopNavigator}
          options={{
            title: 'Shop',
            headerShown: false,
            tabBarIcon: ShopIcon,
          }}
        />
        <Tab.Screen
          name="WishlistTab"
          component={WishlistScreen}
          options={{ title: 'Wishlist', tabBarIcon: WishlistIcon }}
        />
        <Tab.Screen
          name="CartTab"
          component={CartNavigator}
          options={{
            title: 'Cart',
            headerShown: false,
            popToTopOnBlur: true,
            tabBarIcon: CartIcon,
            tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
            tabBarBadgeStyle: { backgroundColor: colors.primary },
          }}
        />
        <Tab.Screen
          name="OrdersTab"
          component={OrdersScreen}
          options={{ title: 'Orders', tabBarIcon: OrdersIcon }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
