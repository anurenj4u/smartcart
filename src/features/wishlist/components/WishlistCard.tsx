import { memo } from 'react';
import { Star } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { AddToCartButton } from '@/features/cart';
import { colors, radius, spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { formatCents } from '@/shared/utils/money';
import { getProductPricing } from '@/shared/utils/pricing';
import type { WishlistProduct } from '../types';
import { WishlistButton } from './WishlistButton';

type WishlistCardProps = {
  item: WishlistProduct;
  onPress: (productId: number) => void;
};

export const WishlistCard = memo(function WishlistCardView({
  item,
  onPress,
}: WishlistCardProps) {
  const { listCents, finalCents, hasDiscount } = getProductPricing(item);
  const discountPercent = Math.round(item.discountPercentage);

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${item.title}`}
        onPress={() => onPress(item.id)}
        style={({ pressed }) => [styles.product, pressed && styles.pressed]}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={[styles.image, item.stock === 0 && styles.unavailable]}
          resizeMode="contain"
        />
        {hasDiscount && discountPercent > 0 ? (
          <View style={styles.badge}>
            <AppText
              variant="caption"
              color="onPrimary"
              style={styles.badgeText}
            >
              -{discountPercent}%
            </AppText>
          </View>
        ) : null}
        <View style={styles.details}>
          <AppText variant="label" numberOfLines={2} style={styles.title}>
            {item.title}
          </AppText>
          <View style={styles.price}>
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
          <View style={styles.rating}>
            <Star size={14} color={colors.rating} fill={colors.rating} />
            <AppText variant="caption" color="textMuted">
              {item.rating.toFixed(1)}
            </AppText>
          </View>
        </View>
      </Pressable>
      <WishlistButton product={item} style={styles.wishlist} />
      <View style={styles.action}>
        <AddToCartButton product={item} compact />
      </View>
    </View>
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
  product: {
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surfaceMuted,
  },
  unavailable: {
    opacity: 0.45,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontWeight: '600',
  },
  wishlist: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  details: {
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  title: {
    minHeight: 36,
  },
  price: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    columnGap: spacing.sm,
  },
  listPrice: {
    textDecorationLine: 'line-through',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  action: {
    padding: spacing.md,
  },
});
