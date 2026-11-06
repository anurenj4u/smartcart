import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { CategoryBar } from '@/features/catalog';
import { getErrorMessage } from '@/shared/api';
import type { ShopStackParamList } from '@/shared/navigation/types';
import { colors, spacing } from '@/shared/theme';
import { AppText, LoadingView, MessageView } from '@/shared/ui';
import { ProductCard } from '../components/ProductCard';
import { ProductListFooter } from '../components/ProductListFooter';
import { useProducts } from '../hooks/useProducts';
import type { ProductSummary } from '../types';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductList'>;

export function ProductListScreen({ navigation }: Props) {
  const [category, setCategory] = useState<string | null>(null);
  const {
    data: products,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    isPending,
    isPlaceholderData,
    isRefetchError,
    refetch,
  } = useProducts(category);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const listRef = useRef<FlatList<ProductSummary>>(null);

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [category]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleEndReached = () => {
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      !isFetchNextPageError &&
      !isPlaceholderData
    ) {
      fetchNextPage();
    }
  };

  const renderResults = () => {
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
        ref={listRef}
        data={products}
        numColumns={2}
        keyExtractor={item => String(item.id)}
        style={isPlaceholderData && styles.updating}
        contentContainerStyle={styles.content}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          isRefetchError && !isRefreshing ? (
            <AppText color="danger" style={styles.notice}>
              Couldn't refresh products. Showing saved results.
            </AppText>
          ) : undefined
        }
        ListFooterComponent={
          <ProductListFooter
            isLoading={isFetchingNextPage}
            hasError={isFetchNextPageError}
            onRetry={() => fetchNextPage()}
          />
        }
        ListEmptyComponent={
          <MessageView
            title="No products found"
            description="Try a different category."
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
  };

  return (
    <View style={styles.screen}>
      <CategoryBar selected={category} onSelect={setCategory} />
      <View style={styles.results}>{renderResults()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  results: {
    flex: 1,
  },
  updating: {
    opacity: 0.5,
  },
  content: {
    flexGrow: 1,
    padding: spacing.xs,
  },
  cell: {
    width: '50%',
    padding: spacing.xs,
  },
  notice: {
    padding: spacing.sm,
    textAlign: 'center',
  },
});
