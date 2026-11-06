const LOW_STOCK_THRESHOLD = 5;

export function getStockLabel(stock: number): string {
  if (stock === 0) {
    return 'Out of stock';
  }

  return stock <= LOW_STOCK_THRESHOLD ? `Only ${stock} left` : 'In stock';
}
