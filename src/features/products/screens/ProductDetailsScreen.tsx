import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AddToCartButton } from '@/features/cart';
import { WishlistButton } from '@/features/wishlist';
import { getErrorMessage } from '@/shared/api';
import type { ShopStackParamList } from '@/shared/navigation/types';
import { colors, spacing } from '@/shared/theme';
import { AppText, LoadingView, MessageView } from '@/shared/ui';
import { ImageGallery } from '../components/ImageGallery';
import { ProductPrice } from '../components/ProductPrice';
import { ProductRating } from '../components/ProductRating';
import { ProductReviews } from '../components/ProductReviews';
import { SimilarProducts } from '../components/SimilarProducts';
import { useProduct } from '../hooks/useProduct';
import { getStockLabel } from '../utils/stock';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductDetails'>;

export function ProductDetailsScreen({ navigation, route }: Props) {
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

  const images =
    product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ImageGallery images={images} title={product.title} />

        <View style={styles.summary}>
          {product.brand ? (
            <AppText variant="label" color="textMuted">
              {product.brand}
            </AppText>
          ) : null}
          <View style={styles.titleRow}>
            <AppText variant="title" style={styles.title}>
              {product.title}
            </AppText>
            <WishlistButton product={product} />
          </View>
          <ProductRating rating={product.rating} />
          <ProductPrice product={product} size="large" />
          <AppText
            variant="label"
            color={product.stock === 0 ? 'danger' : 'primary'}
          >
            {getStockLabel(product.stock)}
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText variant="heading">Description</AppText>
          <AppText>{product.description}</AppText>
        </View>

        <View style={styles.section}>
          <AppText variant="heading">Delivery and returns</AppText>
          <AppText>{product.shippingInformation}</AppText>
          <AppText>{product.warrantyInformation}</AppText>
          <AppText>{product.returnPolicy}</AppText>
        </View>

        {product.reviews.length > 0 ? (
          <View style={styles.section}>
            <AppText variant="heading">Reviews</AppText>
            <ProductReviews reviews={product.reviews} />
          </View>
        ) : null}

        <SimilarProducts
          product={product}
          onSelect={productId =>
            navigation.push('ProductDetails', { productId })
          }
        />
      </ScrollView>
      <View style={styles.footer}>
        <AddToCartButton product={product} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  content: {
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  title: {
    flex: 1,
  },
  summary: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  section: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
});
