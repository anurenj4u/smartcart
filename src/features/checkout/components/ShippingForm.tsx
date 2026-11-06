import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import type { ShippingDetails, ShippingErrors } from '../types';

type FieldConfig = {
  name: keyof ShippingDetails;
  label: string;
  inputProps: TextInputProps;
};

const FIELDS: FieldConfig[] = [
  {
    name: 'fullName',
    label: 'Full name',
    inputProps: { autoCapitalize: 'words', autoComplete: 'name' },
  },
  {
    name: 'address',
    label: 'Street address',
    inputProps: { autoCapitalize: 'words', autoComplete: 'street-address' },
  },
  {
    name: 'city',
    label: 'City',
    inputProps: { autoCapitalize: 'words' },
  },
  {
    name: 'postalCode',
    label: 'Postal code',
    inputProps: { autoCapitalize: 'characters', autoComplete: 'postal-code' },
  },
];

type ShippingFormProps = {
  values: ShippingDetails;
  errors: ShippingErrors;
  onChange: (name: keyof ShippingDetails, value: string) => void;
};

export function ShippingForm({ values, errors, onChange }: ShippingFormProps) {
  return (
    <View style={styles.form}>
      {FIELDS.map(({ name, label, inputProps }) => (
        <View key={name} style={styles.field}>
          <AppText variant="label">{label}</AppText>
          <TextInput
            {...inputProps}
            accessibilityLabel={label}
            autoCorrect={false}
            onChangeText={value => onChange(name, value)}
            returnKeyType="next"
            style={[styles.input, errors[name] && styles.inputError]}
            value={values[name]}
          />
          {errors[name] ? (
            <AppText variant="caption" color="danger">
              {errors[name]}
            </AppText>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  input: {
    ...typography.body,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    color: colors.text,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  inputError: {
    borderColor: colors.danger,
  },
});
