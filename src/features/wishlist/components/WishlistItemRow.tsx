import { Star } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { AddToCartButton } from '@/features/cart';
import { colors, radius, spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { formatCents } from '@/shared/utils/money';
import { getProductPricing } from '@/shared/utils/pricing';
import type { WishlistProduct } from '../types';
import { WishlistButton } from './WishlistButton';

const IMAGE_SIZE = 88;

type WishlistItemRowProps = {
  item: WishlistProduct;
  onPress: () => void;
};

export function WishlistItemRow({ item, onPress }: WishlistItemRowProps) {
  const { listCents, finalCents, hasDiscount } = getProductPricing(item);

  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ${item.title}`}
          onPress={onPress}
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
        <WishlistButton product={item} />
      </View>
      <AddToCartButton product={item} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  product: {
    flex: 1,
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
});
