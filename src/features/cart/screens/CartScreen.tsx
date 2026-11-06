import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  View,
  type ListRenderItem,
} from 'react-native';
import type { CartStackNavigation } from '@/shared/navigation/types';
import { colors, spacing } from '@/shared/theme';
import { AppText, Button, MessageView } from '@/shared/ui';
import { CartItemRow } from '../components/CartItemRow';
import { CartSummary } from '../components/CartSummary';
import { useCartTotals } from '../hooks/useCartSelectors';
import { useCartStore } from '../store/cartStore';
import type { CartItem } from '../types';

const getItemKey = (item: CartItem) => String(item.productId);

export function CartScreen() {
  const navigation = useNavigation<CartStackNavigation>();
  const items = useCartStore(state => state.items);
  const clear = useCartStore(state => state.clear);
  const totals = useCartTotals();

  const openProduct = useCallback(
    (productId: number) =>
      navigation.navigate('ShopTab', {
        screen: 'ProductDetails',
        params: { productId },
        initial: false,
      }),
    [navigation],
  );

  const renderItem = useCallback<ListRenderItem<CartItem>>(
    ({ item }) => <CartItemRow item={item} onPress={openProduct} />,
    [openProduct],
  );

  const confirmClear = () => {
    Alert.alert('Clear your cart?', 'This removes every item from your cart.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear cart', style: 'destructive', onPress: clear },
    ]);
  };

  if (items.length === 0) {
    return (
      <MessageView
        title="Your cart is empty"
        description="Products you add will appear here."
        actionLabel="Browse products"
        onAction={() =>
          navigation.navigate('ShopTab', { screen: 'ProductList' })
        }
      />
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={items}
        keyExtractor={getItemKey}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        ListFooterComponent={
          <Pressable
            accessibilityRole="button"
            hitSlop={spacing.sm}
            onPress={confirmClear}
            style={styles.clear}
          >
            <AppText variant="label" color="danger">
              Clear cart
            </AppText>
          </Pressable>
        }
      />
      <View style={styles.footer}>
        <CartSummary totals={totals} />
        <Button
          label="Checkout"
          onPress={() => navigation.navigate('Checkout')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    gap: spacing.md,
    padding: spacing.md,
  },
  clear: {
    alignSelf: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  footer: {
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
