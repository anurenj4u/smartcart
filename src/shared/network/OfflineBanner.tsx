import { WifiOff } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { useIsOnline } from './online';

export function OfflineBanner() {
  const isOnline = useIsOnline();

  if (isOnline) {
    return null;
  }

  return (
    <View accessibilityRole="alert" style={styles.banner}>
      <WifiOff size={16} color={colors.onPrimary} />
      <AppText variant="label" color="onPrimary">
        You're offline. Showing saved products.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.text,
  },
});
