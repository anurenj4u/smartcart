import { Minus, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';

type QuantityStepperProps = {
  label: string;
  quantity: number;
  max: number;
  compact?: boolean;
  onChange: (quantity: number) => void;
};

export function QuantityStepper({
  label,
  quantity,
  max,
  compact = false,
  onChange,
}: QuantityStepperProps) {
  const isAtMax = quantity >= max;
  const buttonStyle = compact ? styles.compactButton : styles.button;

  return (
    <View style={styles.stepper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          quantity === 1 ? `Remove ${label}` : `Decrease ${label} quantity`
        }
        onPress={() => onChange(quantity - 1)}
        style={buttonStyle}
      >
        <Minus size={18} color={colors.primary} />
      </Pressable>
      <AppText
        variant="label"
        accessibilityLabel={`${label} quantity ${quantity}`}
        style={styles.quantity}
      >
        {quantity}
      </AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Increase ${label} quantity`}
        accessibilityState={{ disabled: isAtMax }}
        disabled={isAtMax}
        onPress={() => onChange(quantity + 1)}
        style={[buttonStyle, isAtMax && styles.disabled]}
      >
        <Plus size={18} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.35,
  },
  quantity: {
    minWidth: 28,
    paddingHorizontal: spacing.xs,
    textAlign: 'center',
  },
});
