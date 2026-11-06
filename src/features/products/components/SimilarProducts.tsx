import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { colors, spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { useSimilarProducts } from '../hooks/useSimilarProducts';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

const CARD_WIDTH = 168;

type SimilarProductsProps = {
  product: Product;
  onSelect: (productId: number) => void;
};

export function SimilarProducts({ product, onSelect }: SimilarProductsProps) {
  const { similarProducts, isPending, refetch } = useSimilarProducts(product);

  if (similarProducts?.length === 0) {
    return null;
  }

  const renderContent = () => {
    if (isPending) {
      return <ActivityIndicator color={colors.primary} style={styles.status} />;
    }

    if (!similarProducts) {
      return (
        <Pressable
          accessibilityRole="button"
          onPress={() => refetch()}
          style={styles.status}
        >
          <AppText variant="caption" color="textMuted">
            Couldn't load similar products. Tap to retry.
          </AppText>
        </Pressable>
      );
    }

    return (
      <FlatList
        data={similarProducts}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <ProductCard product={item} onPress={() => onSelect(item.id)} />
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.section}>
      <AppText variant="heading" style={styles.title}>
        Similar products
      </AppText>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  title: {
    paddingHorizontal: spacing.lg,
  },
  list: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: CARD_WIDTH,
  },
  status: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
