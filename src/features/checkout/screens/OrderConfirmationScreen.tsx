import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CircleCheck } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useOrder } from '@/features/orders';
import type {
  CartStackNavigation,
  CartStackParamList,
} from '@/shared/navigation/types';
import { colors, radius, spacing } from '@/shared/theme';
import { AppText, Button, MessageView } from '@/shared/ui';
import { formatCents } from '@/shared/utils/money';

type Props = NativeStackScreenProps<CartStackParamList, 'OrderConfirmation'> & {
  navigation: CartStackNavigation;
};

export function OrderConfirmationScreen({ navigation, route }: Props) {
  const order = useOrder(route.params.orderId);

  const goToOrders = () => navigation.navigate('OrdersTab');
  const goToShop = () =>
    navigation.navigate('ShopTab', { screen: 'ProductList' });

  if (!order) {
    return (
      <MessageView
        title="Order not found"
        actionLabel="Continue shopping"
        onAction={goToShop}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <CircleCheck size={64} color={colors.primary} />
      <AppText variant="title" style={styles.centered}>
        Order placed
      </AppText>
      <AppText color="textMuted" style={styles.centered}>
        Thanks, {order.shipping.fullName}. This was a demo order, so no payment
        was taken.
      </AppText>

      <View style={styles.card}>
        <View style={styles.row}>
          <AppText color="textMuted">Order number</AppText>
          <AppText variant="label">{order.id}</AppText>
        </View>
        <View style={styles.row}>
          <AppText color="textMuted">Items</AppText>
          <AppText variant="label">{order.itemCount}</AppText>
        </View>
        <View style={styles.row}>
          <AppText color="textMuted">Total</AppText>
          <AppText variant="heading">{formatCents(order.totalCents)}</AppText>
        </View>
        <View style={styles.address}>
          <AppText color="textMuted">Shipping to</AppText>
          <AppText>{order.shipping.address}</AppText>
          <AppText>
            {order.shipping.city}, {order.shipping.postalCode}
          </AppText>
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="View my orders" onPress={goToOrders} />
        <Button
          label="Continue shopping"
          variant="secondary"
          onPress={goToShop}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  centered: {
    textAlign: 'center',
  },
  card: {
    alignSelf: 'stretch',
    gap: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  address: {
    gap: spacing.xs,
  },
  actions: {
    alignSelf: 'stretch',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
