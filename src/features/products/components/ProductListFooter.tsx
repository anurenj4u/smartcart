import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/shared/theme';
import { AppText, Button } from '@/shared/ui';

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
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
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
