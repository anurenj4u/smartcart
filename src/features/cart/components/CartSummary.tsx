import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { formatCents } from '@/shared/utils/money';
import type { CartTotals } from '../utils/cartTotals';

type CartSummaryProps = {
  totals: CartTotals;
};

export const CartSummary = memo(function CartSummaryView({
  totals,
}: CartSummaryProps) {
  return (
    <View style={styles.summary}>
      <View style={styles.row}>
        <AppText color="textMuted">
          Subtotal ({totals.itemCount}{' '}
          {totals.itemCount === 1 ? 'item' : 'items'})
        </AppText>
        <AppText>{formatCents(totals.subtotalCents)}</AppText>
      </View>
      {totals.discountCents > 0 ? (
        <View style={styles.row}>
          <AppText color="textMuted">Discount</AppText>
          <AppText color="primary">
            -{formatCents(totals.discountCents)}
          </AppText>
        </View>
      ) : null}
      <View style={[styles.row, styles.total]}>
        <AppText variant="heading">Total</AppText>
        <AppText variant="heading">{formatCents(totals.totalCents)}</AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  summary: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  total: {
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
