import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { formatCents } from '@/shared/utils/money';
import { getProductPricing } from '@/shared/utils/pricing';
import type { ProductSummary } from '../types';

type ProductPriceProps = {
  product: Pick<ProductSummary, 'price' | 'discountPercentage'>;
  size?: 'medium' | 'large';
};

export const ProductPrice = memo(function ProductPriceView({
  product,
  size = 'medium',
}: ProductPriceProps) {
  const { listCents, finalCents, hasDiscount } = getProductPricing(product);

  return (
    <View style={styles.row}>
      <AppText variant={size === 'large' ? 'title' : 'heading'}>
        {formatCents(finalCents)}
      </AppText>
      {hasDiscount ? (
        <AppText
          variant={size === 'large' ? 'body' : 'caption'}
          color="textMuted"
          style={styles.listPrice}
        >
          {formatCents(listCents)}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    columnGap: spacing.sm,
  },
  listPrice: {
    textDecorationLine: 'line-through',
  },
});
