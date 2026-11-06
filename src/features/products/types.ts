export type ProductSummary = {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
};

export type ProductReview = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
};

export type Product = ProductSummary & {
  description: string;
  category: string;
  brand?: string;
  tags: string[];
  images: string[];
  availabilityStatus: string;
  shippingInformation: string;
  warrantyInformation: string;
  returnPolicy: string;
  reviews: ProductReview[];
};

export type ProductsPage = {
  products: ProductSummary[];
  total: number;
  skip: number;
  limit: number;
};
