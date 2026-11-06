import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ShopStackParamList } from '@/shared/navigation/types';
import { MessageView } from '@/shared/ui';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductList'>;

export function ProductListScreen({ navigation }: Props) {
  return (
    <MessageView
      title="Products"
      actionLabel="View a product"
      onAction={() => navigation.navigate('ProductDetails', { productId: 1 })}
    />
  );
}
