import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  type ListRenderItem,
} from 'react-native';
import {
  CategoryBar,
  FilterButton,
  FilterSheet,
  SearchBar,
  useProductFilters,
} from '@/features/catalog';
import { getErrorMessage } from '@/shared/api';
import type { ShopStackParamList } from '@/shared/navigation/types';
import { colors, spacing } from '@/shared/theme';
import { AppText, MessageView } from '@/shared/ui';
import { ProductCard } from '../components/ProductCard';
import { ProductListFooter } from '../components/ProductListFooter';
import { ProductListSkeleton } from '../components/ProductSkeletons';
import { useProducts } from '../hooks/useProducts';
import type { ProductSummary } from '../types';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductList'>;

const INITIAL_ITEMS = 6;
const ITEMS_PER_BATCH = 6;
const WINDOW_SIZE = 7;

const getItemKey = (product: ProductSummary) => String(product.id);

export function ProductListScreen({ navigation }: Props) {
  const {
    filters,
    refinements,
    searchText,
    setSearchText,
    setCategory,
    setRefinements,
    activeRefinementCount,
    hasActiveFilters,
    reset,
  } = useProductFilters();
  const {
    data: products,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    isPaused,
    isPending,
    isPlaceholderData,
    isRefetchError,
    refetch,
    refresh,
  } = useProducts(filters);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const listRef = useRef<FlatList<ProductSummary>>(null);

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [filters]);

  const openProduct = useCallback(
    (productId: number) => navigation.navigate('ProductDetails', { productId }),
    [navigation],
  );

  const renderItem = useCallback<ListRenderItem<ProductSummary>>(
    ({ item }) => (
      <View style={styles.cell}>
        <ProductCard product={item} onPress={openProduct} />
      </View>
    ),
    [openProduct],
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
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
    if (isPaused && (isPending || isPlaceholderData)) {
      return (
        <MessageView
          title="You're offline"
          description="These products aren't saved yet. They'll load when you reconnect."
        />
      );
    }

    if (isPending) {
      return <ProductListSkeleton />;
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
        keyExtractor={getItemKey}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
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
            isLoading={isFetchingNextPage && !isPaused}
            isOffline={isFetchingNextPage && isPaused}
            hasError={isFetchNextPageError}
            onRetry={() => fetchNextPage()}
          />
        }
        ListEmptyComponent={
          <MessageView
            title="No products found"
            description="Try a different search, category or filter."
            actionLabel={hasActiveFilters ? 'Clear filters' : undefined}
            onAction={reset}
          />
        }
        renderItem={renderItem}
        initialNumToRender={INITIAL_ITEMS}
        maxToRenderPerBatch={ITEMS_PER_BATCH}
        windowSize={WINDOW_SIZE}
        removeClippedSubviews
      />
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.searchRow}>
        <SearchBar value={searchText} onChangeText={setSearchText} />
        <FilterButton
          activeCount={activeRefinementCount}
          onPress={() => setIsFilterSheetOpen(true)}
        />
      </View>
      <CategoryBar selected={filters.category} onSelect={setCategory} />
      <View style={styles.results}>{renderResults()}</View>
      {isFilterSheetOpen ? (
        <FilterSheet
          refinements={refinements}
          onApply={next => {
            setRefinements(next);
            setIsFilterSheetOpen(false);
          }}
          onClose={() => setIsFilterSheetOpen(false)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
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
