export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (category: string | null) =>
    [...productKeys.lists(), category] as const,
  detail: (id: number) => [...productKeys.all, 'detail', id] as const,
};
