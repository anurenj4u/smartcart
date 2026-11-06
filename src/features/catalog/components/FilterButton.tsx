import { SlidersHorizontal } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';

type FilterButtonProps = {
  activeCount: number;
  onPress: () => void;
};

export function FilterButton({ activeCount, onPress }: FilterButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        activeCount > 0
          ? `Sort and filter, ${activeCount} active`
          : 'Sort and filter'
      }
      onPress={onPress}
      style={styles.button}
    >
      <SlidersHorizontal size={20} color={colors.text} />
      {activeCount > 0 ? (
        <View style={styles.badge}>
          <AppText variant="caption" color="onPrimary">
            {activeCount}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  badge: {
    position: 'absolute',
    top: -spacing.xs,
    right: -spacing.xs,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
});
