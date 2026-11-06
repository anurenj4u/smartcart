export type CartProduct = {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  stock: number;
};

export type CartItem = {
  productId: number;
  title: string;
  thumbnail: string;
  listCents: number;
  unitCents: number;
  stock: number;
  quantity: number;
};
