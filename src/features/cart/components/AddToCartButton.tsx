import { StyleSheet, View } from 'react-native';
import { spacing } from '@/shared/theme';
import { AppText, Button } from '@/shared/ui';
import { useCartItemQuantity } from '../hooks/useCartSelectors';
import { useCartStore } from '../store/cartStore';
import type { CartProduct } from '../types';
import { QuantityStepper } from './QuantityStepper';

const COMPACT_HEIGHT = 40;

type AddToCartButtonProps = {
  product: CartProduct;
  compact?: boolean;
};

export function AddToCartButton({
  product,
  compact = false,
}: AddToCartButtonProps) {
  const quantity = useCartItemQuantity(product.id);
  const addItem = useCartStore(state => state.addItem);
  const setQuantity = useCartStore(state => state.setQuantity);
  const buttonStyle = compact ? styles.compactButton : undefined;

  if (product.stock === 0) {
    return (
      <Button
        label="Out of stock"
        disabled
        onPress={() => undefined}
        style={buttonStyle}
      />
    );
  }

  if (quantity === 0) {
    return (
      <Button
        label="Add to cart"
        onPress={() => addItem(product)}
        style={buttonStyle}
      />
    );
  }

  return (
    <View style={compact ? styles.compactInCart : styles.inCart}>
      {compact ? null : (
        <AppText variant="label" color="primary">
          In your cart
        </AppText>
      )}
      <QuantityStepper
        label={product.title}
        quantity={quantity}
        max={product.stock}
        compact={compact}
        onChange={next => setQuantity(product.id, next)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inCart: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  compactButton: {
    minHeight: COMPACT_HEIGHT,
    paddingHorizontal: spacing.sm,
  },
  compactInCart: {
    minHeight: COMPACT_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
