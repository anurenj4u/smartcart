import { StyleSheet, View } from 'react-native';
import { spacing } from '@/shared/theme';
import { AppText, Button } from '@/shared/ui';
import { useCartItemQuantity } from '../hooks/useCartSelectors';
import { useCartStore } from '../store/cartStore';
import type { CartProduct } from '../types';
import { QuantityStepper } from './QuantityStepper';

type AddToCartButtonProps = {
  product: CartProduct;
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const quantity = useCartItemQuantity(product.id);
  const addItem = useCartStore(state => state.addItem);
  const setQuantity = useCartStore(state => state.setQuantity);

  if (product.stock === 0) {
    return <Button label="Out of stock" disabled onPress={() => undefined} />;
  }

  if (quantity === 0) {
    return <Button label="Add to cart" onPress={() => addItem(product)} />;
  }

  return (
    <View style={styles.inCart}>
      <AppText variant="label" color="primary">
        In your cart
      </AppText>
      <QuantityStepper
        label={product.title}
        quantity={quantity}
        max={product.stock}
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
});
