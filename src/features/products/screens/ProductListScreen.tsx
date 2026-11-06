import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, View } from 'react-native';
import { getErrorMessage } from '@/shared/api';
import type { ShopStackParamList } from '@/shared/navigation/types';
import { spacing } from '@/shared/theme';
import { LoadingView, MessageView } from '@/shared/ui';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductList'>;

export function ProductListScreen({ navigation }: Props) {
  const { data: products, error, isPending, refetch } = useProducts();

  if (isPending) {
    return <LoadingView />;
  }

  if (!products) {
    return (
      <MessageView
        title="Couldn't load products"
        description={getErrorMessage(error)}
        actionLabel="Try again"
        onAction={() => refetch()}
      />
    );
  }

  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        <MessageView
          title="No products found"
          description="Check back soon for new arrivals."
        />
      }
      renderItem={({ item }) => (
        <View style={styles.cell}>
          <ProductCard
            product={item}
            onPress={() =>
              navigation.navigate('ProductDetails', { productId: item.id })
            }
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: spacing.xs,
  },
  cell: {
    width: '50%',
    padding: spacing.xs,
  },
});
