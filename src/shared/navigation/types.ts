import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type ShopStackParamList = {
  ProductList: undefined;
  ProductDetails: { productId: number };
};

export type CartStackParamList = {
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
};

export type RootTabParamList = {
  ShopTab: NavigatorScreenParams<ShopStackParamList>;
  WishlistTab: undefined;
  CartTab: NavigatorScreenParams<CartStackParamList>;
  OrdersTab: undefined;
};

export type CartStackNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<CartStackParamList>,
  BottomTabNavigationProp<RootTabParamList>
>;
