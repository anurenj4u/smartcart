import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { FlatList, StyleSheet, type ListRenderItem } from 'react-native';
import type { RootTabParamList } from '@/shared/navigation/types';
import { spacing } from '@/shared/theme';
import { MessageView } from '@/shared/ui';
import { OrderCard } from '../components/OrderCard';
import { useOrdersStore } from '../store/ordersStore';
import type { Order } from '../types';

const getOrderKey = (order: Order) => order.id;
const renderOrder: ListRenderItem<Order> = ({ item }) => (
  <OrderCard order={item} />
);

export function OrdersScreen() {
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const orders = useOrdersStore(state => state.orders);

  if (orders.length === 0) {
    return (
      <MessageView
        title="No orders yet"
        description="Orders you place will appear here."
        actionLabel="Browse products"
        onAction={() =>
          navigation.navigate('ShopTab', { screen: 'ProductList' })
        }
      />
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={getOrderKey}
      contentContainerStyle={styles.list}
      renderItem={renderOrder}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
    padding: spacing.md,
  },
});
