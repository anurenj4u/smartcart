import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import type { ProductReview } from '../types';
import { ProductRating } from './ProductRating';

type ProductReviewsProps = {
  reviews: ProductReview[];
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export function ProductReviews({ reviews }: ProductReviewsProps) {
  return (
    <View style={styles.list}>
      {reviews.map((review, index) => (
        <View
          key={`${index}-${review.reviewerName}-${review.date}`}
          style={styles.review}
        >
          <View style={styles.header}>
            <AppText variant="label" style={styles.name}>
              {review.reviewerName}
            </AppText>
            <ProductRating rating={review.rating} />
          </View>
          <AppText>{review.comment}</AppText>
          <AppText variant="caption" color="textMuted">
            {formatDate(review.date)}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  review: {
    gap: spacing.xs,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
  },
});
