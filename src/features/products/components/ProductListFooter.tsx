import { StyleSheet, View } from 'react-native';
import { spacing } from '@/shared/theme';
import { AppText, Button } from '@/shared/ui';
import { ProductListFooterSkeleton } from './ProductSkeletons';

type ProductListFooterProps = {
  isLoading: boolean;
  isOffline: boolean;
  hasError: boolean;
  onRetry: () => void;
};

export function ProductListFooter({
  isLoading,
  isOffline,
  hasError,
  onRetry,
}: ProductListFooterProps) {
  if (isLoading) {
    return <ProductListFooterSkeleton />;
  }

  if (isOffline) {
    return (
      <View style={styles.container}>
        <AppText color="textMuted">
          More products will load when you reconnect.
        </AppText>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.container}>
        <AppText color="textMuted">Couldn't load more products.</AppText>
        <Button label="Try again" variant="secondary" onPress={onRetry} />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
});
