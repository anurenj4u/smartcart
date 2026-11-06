import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '@/shared/theme';

export function LoadingView() {
  return (
    <View style={styles.container} accessibilityLabel="Loading">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
