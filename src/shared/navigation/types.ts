import type { NavigatorScreenParams } from '@react-navigation/native';

export type ShopStackParamList = {
  ProductList: undefined;
  ProductDetails: { productId: number };
};

export type RootTabParamList = {
  ShopTab: NavigatorScreenParams<ShopStackParamList>;
  WishlistTab: undefined;
  CartTab: undefined;
  OrdersTab: undefined;
};
