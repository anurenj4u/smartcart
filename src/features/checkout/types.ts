export type ShippingDetails = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
};

export type ShippingErrors = Partial<Record<keyof ShippingDetails, string>>;
