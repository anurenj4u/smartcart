import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/shared/theme';
import { Skeleton } from '@/shared/ui';

const IMAGE_SIZE_RATIO = 1;
const GRID_CARD_COUNT = 6;
const FOOTER_CARD_COUNT = 2;

export function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton borderRadius={0} height="auto" style={styles.image} />
      <View style={styles.body}>
        <Skeleton width="85%" height={14} />
        <Skeleton width="55%" height={20} />
        <Skeleton width="30%" height={12} />
      </View>
    </View>
  );
}

function SkeletonCells({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={styles.cell}>
          <ProductCardSkeleton />
        </View>
      ))}
    </>
  );
}

export function ProductListSkeleton() {
  return (
    <View accessibilityLabel="Loading products" style={styles.grid}>
      <SkeletonCells count={GRID_CARD_COUNT} />
    </View>
  );
}

export function ProductListFooterSkeleton() {
  return (
    <View accessibilityLabel="Loading more products" style={styles.footerGrid}>
      <SkeletonCells count={FOOTER_CARD_COUNT} />
    </View>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <View accessibilityLabel="Loading product" style={styles.details}>
      <Skeleton borderRadius={0} height="auto" style={styles.image} />
      <View style={styles.detailsBody}>
        <Skeleton width="35%" height={14} />
        <Skeleton width="80%" height={26} />
        <Skeleton width="20%" height={14} />
        <Skeleton width="50%" height={30} />
        <Skeleton width="25%" height={16} />
        <View style={styles.paragraph}>
          <Skeleton width="40%" height={20} />
          <Skeleton />
          <Skeleton />
          <Skeleton width="70%" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.xs,
  },
  footerGrid: {
    flexDirection: 'row',
  },
  cell: {
    width: '50%',
    padding: spacing.xs,
  },
  card: {
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  image: {
    aspectRatio: IMAGE_SIZE_RATIO,
  },
  body: {
    gap: spacing.sm,
    padding: spacing.md,
  },
  details: {
    flex: 1,
  },
  detailsBody: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  paragraph: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
