import { Heart } from 'lucide-react-native';
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, radius, spacing } from '@/shared/theme';
import { useIsWishlisted, useWishlistStore } from '../store/wishlistStore';
import type { WishlistProduct } from '../types';

type WishlistButtonProps = {
  product: WishlistProduct;
  style?: StyleProp<ViewStyle>;
};

export function WishlistButton({ product, style }: WishlistButtonProps) {
  const isWishlisted = useIsWishlisted(product.id);
  const toggle = useWishlistStore(state => state.toggle);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        isWishlisted
          ? `Remove ${product.title} from wishlist`
          : `Add ${product.title} to wishlist`
      }
      accessibilityState={{ selected: isWishlisted }}
      hitSlop={spacing.xs}
      onPress={() => toggle(product)}
      style={[styles.button, style]}
    >
      <Heart
        size={20}
        color={isWishlisted ? colors.danger : colors.text}
        fill={isWishlisted ? colors.danger : 'transparent'}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
});
