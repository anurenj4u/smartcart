import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { CartSummary, useCartStore, useCartTotals } from '@/features/cart';
import type { CartStackNavigation } from '@/shared/navigation/types';
import { colors, radius, spacing } from '@/shared/theme';
import { AppText, Button, MessageView } from '@/shared/ui';
import { formatCents } from '@/shared/utils/money';
import { ShippingForm } from '../components/ShippingForm';
import { getOrderErrorMessage, usePlaceOrder } from '../hooks/usePlaceOrder';
import type { ShippingDetails, ShippingErrors } from '../types';
import { validateShipping } from '../utils/validateShipping';

const IMAGE_SIZE = 56;

const EMPTY_SHIPPING: ShippingDetails = {
  fullName: '',
  address: '',
  city: '',
  postalCode: '',
};

export function CheckoutScreen() {
  const navigation = useNavigation<CartStackNavigation>();
  const headerHeight = useHeaderHeight();
  const items = useCartStore(state => state.items);
  const totals = useCartTotals();
  const placeOrder = usePlaceOrder();
  const [shipping, setShipping] = useState(EMPTY_SHIPPING);
  const [errors, setErrors] = useState<ShippingErrors>({});

  const handleChange = (name: keyof ShippingDetails, value: string) => {
    setShipping(current => ({ ...current, [name]: value }));
    setErrors(current => ({ ...current, [name]: undefined }));
  };

  const handlePlaceOrder = () => {
    if (placeOrder.isPending) {
      return;
    }

    const nextErrors = validateShipping(shipping);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      placeOrder.mutate(
        { items, shipping },
        {
          onSuccess: order =>
            navigation.replace('OrderConfirmation', { orderId: order.id }),
        },
      );
    }
  };

  if (placeOrder.isSuccess) {
    return null;
  }

  if (items.length === 0) {
    return (
      <MessageView
        title="Your cart is empty"
        description="Add a product before checking out."
        actionLabel="Back to cart"
        onAction={() => navigation.popTo('Cart')}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <AppText variant="heading">Order summary</AppText>
          {items.map(item => (
            <View key={item.productId} style={styles.item}>
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.image}
                resizeMode="contain"
              />
              <View style={styles.itemDetails}>
                <AppText variant="label" numberOfLines={2}>
                  {item.title}
                </AppText>
                <AppText variant="caption" color="textMuted">
                  Qty {item.quantity} × {formatCents(item.unitCents)}
                </AppText>
              </View>
              <AppText variant="label">
                {formatCents(item.unitCents * item.quantity)}
              </AppText>
            </View>
          ))}
          <CartSummary totals={totals} />
        </View>

        <View style={styles.card}>
          <AppText variant="heading">Shipping details</AppText>
          <ShippingForm
            values={shipping}
            errors={errors}
            onChange={handleChange}
          />
        </View>

        <AppText variant="caption" color="textMuted" style={styles.note}>
          This is a demo checkout. No payment is taken and nothing is shipped.
        </AppText>
      </ScrollView>

      <View style={styles.footer}>
        {placeOrder.isError ? (
          <AppText color="danger" style={styles.note}>
            {getOrderErrorMessage(placeOrder.error)}
          </AppText>
        ) : null}
        <Button
          label={`Place order · ${formatCents(totals.totalCents)}`}
          loading={placeOrder.isPending}
          onPress={handlePlaceOrder}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: spacing.lg,
    padding: spacing.md,
  },
  card: {
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
  },
  itemDetails: {
    flex: 1,
    gap: spacing.xs,
  },
  note: {
    textAlign: 'center',
  },
  footer: {
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
