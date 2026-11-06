import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View } from 'react-native';
import { getErrorMessage } from '@/shared/api';
import type { ShopStackParamList } from '@/shared/navigation/types';
import { spacing } from '@/shared/theme';
import { AppText, LoadingView, MessageView } from '@/shared/ui';
import { ProductPrice } from '../components/ProductPrice';
import { ProductRating } from '../components/ProductRating';
import { useProduct } from '../hooks/useProduct';
import { getStockLabel } from '../utils/stock';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductDetails'>;

export function ProductDetailsScreen({ route }: Props) {
  const {
    data: product,
    error,
    isPending,
    refetch,
  } = useProduct(route.params.productId);

  if (isPending) {
    return <LoadingView />;
  }

  if (!product) {
    return (
      <MessageView
        title="Couldn't load this product"
        description={getErrorMessage(error)}
        actionLabel="Try again"
        onAction={() => refetch()}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.summary}>
        {product.brand ? (
          <AppText variant="label" color="textMuted">
            {product.brand}
          </AppText>
        ) : null}
        <AppText variant="title">{product.title}</AppText>
        <ProductRating rating={product.rating} />
        <ProductPrice product={product} size="large" />
        <AppText
          variant="label"
          color={product.stock === 0 ? 'danger' : 'primary'}
        >
          {getStockLabel(product.stock)}
        </AppText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  summary: {
    gap: spacing.sm,
    padding: spacing.lg,
  },
});
