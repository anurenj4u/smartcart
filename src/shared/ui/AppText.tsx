import { Text, type TextProps } from 'react-native';
import { colors, typography } from '@/shared/theme';

type AppTextProps = TextProps & {
  variant?: keyof typeof typography;
  color?: keyof typeof colors;
};

export function AppText({
  variant = 'body',
  color = 'text',
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      style={[typography[variant], { color: colors[color] }, style]}
      {...rest}
    />
  );
}
