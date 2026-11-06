import { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { formatCents } from '@/shared/utils/money';
import type { Order } from '../types';

const IMAGE_SIZE = 48;

type OrderCardProps = {
  order: Order;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export const OrderCard = memo(function OrderCardView({
  order,
}: OrderCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppText variant="label">{order.id}</AppText>
        <AppText variant="caption" color="textMuted">
          {formatDate(order.placedAt)}
        </AppText>
      </View>

      {order.items.map(item => (
        <View key={item.productId} style={styles.item}>
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.itemDetails}>
            <AppText variant="label" numberOfLines={1}>
              {item.title}
            </AppText>
            <AppText variant="caption" color="textMuted">
              Qty {item.quantity} × {formatCents(item.unitCents)}
            </AppText>
          </View>
          <AppText variant="label">
            {formatCents(item.unitCents * item.quantity)}
          </AppText>
        </View>
      ))}

      <View style={styles.footer}>
        <AppText color="textMuted">
          {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
        </AppText>
        <AppText variant="heading">{formatCents(order.totalCents)}</AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  header: {
    gap: spacing.xs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
  },
  itemDetails: {
    flex: 1,
    gap: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
