import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { radius, spacing } from '@/shared/theme';
import { AppText, Chip, Skeleton } from '@/shared/ui';
import { useCategories } from '../hooks/useCategories';

const CHIP_HEIGHT = 40;
const CHIP_WIDTHS = [56, 88, 112, 96, 104];

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
      <View accessibilityLabel="Loading categories" style={styles.loading}>
        {CHIP_WIDTHS.map((width, index) => (
          <Skeleton
            key={index}
            width={width}
            height={CHIP_HEIGHT}
            borderRadius={radius.pill}
          />
        ))}
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
  loading: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
    overflow: 'hidden',
  },
  status: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
