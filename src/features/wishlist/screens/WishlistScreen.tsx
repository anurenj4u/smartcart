import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { Heart } from 'lucide-react-native';
import { useCallback } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import type { RootTabParamList } from '@/shared/navigation/types';
import { colors, radius, spacing } from '@/shared/theme';
import { AppText, Button } from '@/shared/ui';
import { WishlistCard } from '../components/WishlistCard';
import { useWishlistStore } from '../store/wishlistStore';
import type { WishlistProduct } from '../types';

const EMPTY_ICON_SIZE = 96;

const getItemKey = (item: WishlistProduct) => String(item.id);

export function WishlistScreen() {
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const items = useWishlistStore(state => state.items);

  const openProduct = useCallback(
    (productId: number) =>
      navigation.navigate('ShopTab', {
        screen: 'ProductDetails',
        params: { productId },
        initial: false,
      }),
    [navigation],
  );

  const renderItem = useCallback<ListRenderItem<WishlistProduct>>(
    ({ item }) => (
      <View style={styles.cell}>
        <WishlistCard item={item} onPress={openProduct} />
      </View>
    ),
    [openProduct],
  );

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Heart size={40} color={colors.primary} />
        </View>
        <AppText variant="title" style={styles.centered}>
          Your wishlist is empty
        </AppText>
        <AppText color="textMuted" style={styles.centered}>
          Tap the heart on any product to save it for later.
        </AppText>
        <Button
          label="Browse products"
          onPress={() =>
            navigation.navigate('ShopTab', { screen: 'ProductList' })
          }
          style={styles.emptyAction}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      numColumns={2}
      keyExtractor={getItemKey}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <AppText color="textMuted" style={styles.count}>
          {items.length} saved {items.length === 1 ? 'item' : 'items'}
        </AppText>
      }
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.xs,
  },
  count: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  cell: {
    width: '50%',
    padding: spacing.xs,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  emptyIcon: {
    width: EMPTY_ICON_SIZE,
    height: EMPTY_ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
  },
  centered: {
    textAlign: 'center',
  },
  emptyAction: {
    marginTop: spacing.lg,
  },
});
