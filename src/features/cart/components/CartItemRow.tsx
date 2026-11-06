import { memo } from 'react';
import { Trash2 } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { formatCents } from '@/shared/utils/money';
import { useCartStore } from '../store/cartStore';
import type { CartItem } from '../types';
import { QuantityStepper } from './QuantityStepper';

const IMAGE_SIZE = 88;

type CartItemRowProps = {
  item: CartItem;
  onPress: (productId: number) => void;
};

export const CartItemRow = memo(function CartItemRowView({
  item,
  onPress,
}: CartItemRowProps) {
  const setQuantity = useCartStore(state => state.setQuantity);
  const removeItem = useCartStore(state => state.removeItem);

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${item.title}`}
        onPress={() => onPress(item.productId)}
        style={styles.product}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.details}>
          <AppText variant="label" numberOfLines={2}>
            {item.title}
          </AppText>
          <AppText variant="caption" color="textMuted">
            {formatCents(item.unitCents)} each
          </AppText>
          <AppText variant="heading">
            {formatCents(item.unitCents * item.quantity)}
          </AppText>
        </View>
      </Pressable>
      <View style={styles.actions}>
        <QuantityStepper
          label={item.title}
          quantity={item.quantity}
          max={item.stock}
          onChange={next => setQuantity(item.productId, next)}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${item.title} from cart`}
          hitSlop={spacing.sm}
          onPress={() => removeItem(item.productId)}
          style={styles.remove}
        >
          <Trash2 size={18} color={colors.danger} />
          <AppText variant="label" color="danger">
            Remove
          </AppText>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  product: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
  },
  details: {
    flex: 1,
    gap: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  remove: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 44,
  },
});
