import { memo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { WishlistButton } from '@/features/wishlist';
import { colors, radius, spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { formatCents } from '@/shared/utils/money';
import { getProductPricing } from '@/shared/utils/pricing';
import type { ProductSummary } from '../types';
import { ProductPrice } from './ProductPrice';
import { ProductRating } from './ProductRating';

type ProductCardProps = {
  product: ProductSummary;
  onPress: (productId: number) => void;
};

export const ProductCard = memo(function ProductCardView({
  product,
  onPress,
}: ProductCardProps) {
  const { finalCents } = getProductPricing(product);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${product.title}, ${formatCents(
        finalCents,
      )}, rated ${product.rating.toFixed(1)} out of 5`}
      onPress={() => onPress(product.id)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image
        source={{ uri: product.thumbnail }}
        style={styles.image}
        resizeMode="contain"
      />
      <WishlistButton product={product} style={styles.wishlist} />
      <View style={styles.body}>
        <AppText variant="label" numberOfLines={2}>
          {product.title}
        </AppText>
        <ProductPrice product={product} />
        <View style={styles.metaRow}>
          <ProductRating rating={product.rating} />
          {product.stock === 0 ? (
            <AppText variant="caption" color="danger">
              Out of stock
            </AppText>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surfaceMuted,
  },
  wishlist: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  body: {
    gap: spacing.xs,
    padding: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
});
