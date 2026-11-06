import { Star } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';

type ProductRatingProps = {
  rating: number;
};

export function ProductRating({ rating }: ProductRatingProps) {
  return (
    <View style={styles.row}>
      <Star size={14} color={colors.rating} fill={colors.rating} />
      <AppText variant="caption" color="textMuted">
        {rating.toFixed(1)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
