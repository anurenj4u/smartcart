import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductDetailsScreen, ProductListScreen } from '@/features/products';
import type { ShopStackParamList } from '@/shared/navigation/types';

const Stack = createNativeStackNavigator<ShopStackParamList>();

export function ShopNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ title: 'SmartCart' }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Product details' }}
      />
    </Stack.Navigator>
  );
}
