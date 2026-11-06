import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ShopStackParamList } from '@/shared/navigation/types';
import { MessageView } from '@/shared/ui';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductDetails'>;

export function ProductDetailsScreen({ route }: Props) {
  return <MessageView title={`Product ${route.params.productId}`} />;
}
