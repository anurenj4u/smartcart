import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { colors, spacing } from '@/shared/theme';
import { AppText, Chip } from '@/shared/ui';
import { useCategories } from '../hooks/useCategories';

type CategoryBarProps = {
  selected: string | null;
  onSelect: (slug: string | null) => void;
};

export function CategoryBar({ selected, onSelect }: CategoryBarProps) {
  const { data: categories, isPaused, isPending, refetch } = useCategories();

  if (isPending && isPaused) {
    return (
      <View style={styles.status}>
        <AppText variant="caption" color="textMuted">
          Categories will load when you reconnect.
        </AppText>
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={styles.status}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!categories) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => refetch()}
        style={styles.status}
      >
        <AppText variant="caption" color="textMuted">
          Couldn't load categories. Tap to retry.
        </AppText>
      </Pressable>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={styles.bar}
      contentContainerStyle={styles.content}
    >
      <Chip
        label="All"
        selected={selected === null}
        onPress={() => onSelect(null)}
      />
      {categories.map(category => (
        <Chip
          key={category.slug}
          label={category.name}
          selected={selected === category.slug}
          onPress={() => onSelect(category.slug)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexGrow: 0,
  },
  content: {
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  status: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
