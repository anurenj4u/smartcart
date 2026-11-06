import { StyleSheet, View } from 'react-native';
import { spacing } from '@/shared/theme';
import { AppText } from './AppText';
import { Button } from './Button';

type MessageViewProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function MessageView({
  title,
  description,
  actionLabel,
  onAction,
}: MessageViewProps) {
  return (
    <View style={styles.container}>
      <AppText variant="heading" style={styles.text}>
        {title}
      </AppText>
      {description ? (
        <AppText color="textMuted" style={styles.text}>
          {description}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  text: {
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.md,
  },
});
