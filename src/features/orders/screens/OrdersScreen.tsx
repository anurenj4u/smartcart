import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { FlatList, StyleSheet } from 'react-native';
import type { RootTabParamList } from '@/shared/navigation/types';
import { spacing } from '@/shared/theme';
import { MessageView } from '@/shared/ui';
import { OrderCard } from '../components/OrderCard';
import { useOrdersStore } from '../store/ordersStore';

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
      keyExtractor={order => order.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <OrderCard order={item} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
    padding: spacing.md,
  },
});
