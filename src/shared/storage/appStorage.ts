import { createMMKV } from 'react-native-mmkv';

const mmkv = createMMKV({ id: 'smartcart' });

export const appStorage = {
  getItem: (key: string): string | null => mmkv.getString(key) ?? null,
  setItem: (key: string, value: string): void => mmkv.set(key, value),
  removeItem: (key: string): void => {
    mmkv.remove(key);
  },
};
