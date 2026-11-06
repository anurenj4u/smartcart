import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { FlatList, StyleSheet } from 'react-native';
import type { RootTabParamList } from '@/shared/navigation/types';
import { spacing } from '@/shared/theme';
import { MessageView } from '@/shared/ui';
import { WishlistItemRow } from '../components/WishlistItemRow';
import { useWishlistStore } from '../store/wishlistStore';

export function WishlistScreen() {
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const items = useWishlistStore(state => state.items);

  if (items.length === 0) {
    return (
      <MessageView
        title="Your wishlist is empty"
        description="Tap the heart on a product to save it here."
        actionLabel="Browse products"
        onAction={() =>
          navigation.navigate('ShopTab', { screen: 'ProductList' })
        }
      />
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <WishlistItemRow
          item={item}
          onPress={() =>
            navigation.navigate('ShopTab', {
              screen: 'ProductDetails',
              params: { productId: item.id },
              initial: false,
            })
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
    padding: spacing.md,
  },
});
