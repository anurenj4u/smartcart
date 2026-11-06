import { Star } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { formatCents } from '@/shared/utils/money';
import type { ProductSummary } from '../types';
import { getProductPricing } from '../utils/pricing';

type ProductCardProps = {
  product: ProductSummary;
  onPress: () => void;
};

export function ProductCard({ product, onPress }: ProductCardProps) {
  const { listCents, finalCents, hasDiscount } = getProductPricing(product);
  const isOutOfStock = product.stock === 0;
  const rating = product.rating.toFixed(1);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${product.title}, ${formatCents(
        finalCents,
      )}, rated ${rating} out of 5`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image
        source={{ uri: product.thumbnail }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.body}>
        <AppText variant="label" numberOfLines={2} style={styles.title}>
          {product.title}
        </AppText>
        <View style={styles.priceRow}>
          <AppText variant="heading">{formatCents(finalCents)}</AppText>
          {hasDiscount ? (
            <AppText
              variant="caption"
              color="textMuted"
              style={styles.listPrice}
            >
              {formatCents(listCents)}
            </AppText>
          ) : null}
        </View>
        <View style={styles.metaRow}>
          <View style={styles.rating}>
            <Star
              size={14}
              color={colors.rating}
              fill={colors.rating}
            />
            <AppText variant="caption" color="textMuted">
              {rating}
            </AppText>
          </View>
          {isOutOfStock ? (
            <AppText variant="caption" color="danger">
              Out of stock
            </AppText>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

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
  body: {
    gap: spacing.xs,
    padding: spacing.md,
  },
  title: {
    minHeight: 36,
  },
  priceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    columnGap: spacing.sm,
  },
  listPrice: {
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
