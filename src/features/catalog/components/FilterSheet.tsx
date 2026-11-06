import { X } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  colors,
  radius,
  spacing,
  typography,
} from '@/shared/theme';
import { AppText, Button, Chip } from '@/shared/ui';
import type { ProductRefinements, ProductSort } from '../types';
import { DEFAULT_REFINEMENTS, parsePriceInput } from '../utils/refinements';

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating-desc', label: 'Top rated' },
];

const RATING_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: 'Any' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 4.5, label: '4.5+' },
];

type FilterSheetProps = {
  refinements: ProductRefinements;
  onApply: (refinements: ProductRefinements) => void;
  onClose: () => void;
};

const priceToText = (price: number | null) =>
  price === null ? '' : String(price);

function getPriceError(
  minPrice: number | null | undefined,
  maxPrice: number | null | undefined,
): string | null {
  if (minPrice === undefined || maxPrice === undefined) {
    return 'Enter prices as numbers, like 25 or 19.99.';
  }

  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    return 'Minimum price must be lower than the maximum.';
  }

  return null;
}

export function FilterSheet({
  refinements,
  onApply,
  onClose,
}: FilterSheetProps) {
  const insets = useSafeAreaInsets();
  const [sort, setSort] = useState(refinements.sort);
  const [minRating, setMinRating] = useState(refinements.minRating);
  const [minPriceText, setMinPriceText] = useState(
    priceToText(refinements.minPrice),
  );
  const [maxPriceText, setMaxPriceText] = useState(
    priceToText(refinements.maxPrice),
  );

  const minPrice = parsePriceInput(minPriceText);
  const maxPrice = parsePriceInput(maxPriceText);
  const priceError = getPriceError(minPrice, maxPrice);

  const handleReset = () => {
    setSort(DEFAULT_REFINEMENTS.sort);
    setMinRating(DEFAULT_REFINEMENTS.minRating);
    setMinPriceText('');
    setMaxPriceText('');
  };

  const handleApply = () => {
    if (minPrice !== undefined && maxPrice !== undefined) {
      onApply({ sort, minPrice, maxPrice, minRating });
    }
  };

  return (
    <Modal
      animationType="slide"
      navigationBarTranslucent
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible
    >
      <KeyboardAvoidingView behavior="padding" style={styles.overlay}>
        <Pressable
          accessibilityLabel="Close sort and filter"
          onPress={onClose}
          style={styles.backdrop}
        />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.header}>
            <AppText variant="heading">Sort and filter</AppText>
            <Pressable
              accessibilityLabel="Close"
              accessibilityRole="button"
              hitSlop={spacing.md}
              onPress={onClose}
            >
              <X size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.section}>
              <AppText variant="label">Sort by</AppText>
              <View style={styles.chips}>
                {SORT_OPTIONS.map(option => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    selected={sort === option.value}
                    onPress={() => setSort(option.value)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <AppText variant="label">Price</AppText>
              <View style={styles.priceRow}>
                <TextInput
                  accessibilityLabel="Minimum price"
                  keyboardType="decimal-pad"
                  onChangeText={setMinPriceText}
                  placeholder="Min"
                  placeholderTextColor={colors.textMuted}
                  style={styles.priceInput}
                  value={minPriceText}
                />
                <AppText color="textMuted">to</AppText>
                <TextInput
                  accessibilityLabel="Maximum price"
                  keyboardType="decimal-pad"
                  onChangeText={setMaxPriceText}
                  placeholder="Max"
                  placeholderTextColor={colors.textMuted}
                  style={styles.priceInput}
                  value={maxPriceText}
                />
              </View>
              {priceError ? (
                <AppText variant="caption" color="danger">
                  {priceError}
                </AppText>
              ) : null}
            </View>

            <View style={styles.section}>
              <AppText variant="label">Minimum rating</AppText>
              <View style={styles.chips}>
                {RATING_OPTIONS.map(option => (
                  <Chip
                    key={option.label}
                    label={option.label}
                    selected={minRating === option.value}
                    onPress={() => setMinRating(option.value)}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <Button
              label="Reset"
              variant="secondary"
              onPress={handleReset}
              style={styles.action}
            />
            <Button
              label="Apply"
              disabled={priceError !== null}
              onPress={handleApply}
              style={styles.action}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    maxHeight: '85%',
    paddingTop: spacing.lg,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  body: {
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  priceInput: {
    ...typography.body,
    flex: 1,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  action: {
    flex: 1,
  },
});
