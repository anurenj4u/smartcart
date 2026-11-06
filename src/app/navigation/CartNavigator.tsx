import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartScreen } from '@/features/cart';
import { CheckoutScreen, OrderConfirmationScreen } from '@/features/checkout';
import type { CartStackParamList } from '@/shared/navigation/types';

const Stack = createNativeStackNavigator<CartStackParamList>();

export function CartNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmationScreen}
        options={{ title: 'Order confirmed', headerBackVisible: false }}
      />
    </Stack.Navigator>
  );
}
