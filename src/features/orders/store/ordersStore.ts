import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { appStorage } from '@/shared/storage/appStorage';
import type { Order } from '../types';

type OrdersState = {
  orders: Order[];
  addOrder: (order: Order) => void;
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    set => ({
      orders: [],
      addOrder: order => set(({ orders }) => ({ orders: [order, ...orders] })),
    }),
    {
      name: 'orders',
      version: 1,
      storage: createJSONStorage(() => appStorage),
      partialize: ({ orders }) => ({ orders }),
    },
  ),
);

export function useOrder(orderId: string) {
  return useOrdersStore(state =>
    state.orders.find(order => order.id === orderId),
  );
}
