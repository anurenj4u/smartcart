import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, View } from 'react-native';
import type { ShopStackParamList } from '@/shared/navigation/types';
import { spacing } from '@/shared/theme';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductList'>;

export function ProductListScreen({ navigation }: Props) {
  const { data: products } = useProducts();

  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={styles.content}
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
    padding: spacing.xs,
  },
  cell: {
    width: '50%',
    padding: spacing.xs,
  },
});
