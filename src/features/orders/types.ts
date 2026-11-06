export type OrderItem = {
  productId: number;
  title: string;
  thumbnail: string;
  unitCents: number;
  quantity: number;
};

export type OrderShipping = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
};

export type Order = {
  id: string;
  placedAt: string;
  items: OrderItem[];
  itemCount: number;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  shipping: OrderShipping;
};
