import { useNavigation } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { CartSummary, useCartStore, useCartTotals } from '@/features/cart';
import type { CartStackNavigation } from '@/shared/navigation/types';
import { colors, radius, spacing } from '@/shared/theme';
import { AppText, MessageView } from '@/shared/ui';
import { formatCents } from '@/shared/utils/money';

const IMAGE_SIZE = 56;

export function CheckoutScreen() {
  const navigation = useNavigation<CartStackNavigation>();
  const items = useCartStore(state => state.items);
  const totals = useCartTotals();

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
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.section}>
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
      </View>

      <View style={styles.summary}>
        <CartSummary totals={totals} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    padding: spacing.md,
  },
  section: {
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
  summary: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
});
