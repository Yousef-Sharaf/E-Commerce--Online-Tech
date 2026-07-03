export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  reviews?: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
  }[];
  availabilityStatus?: string;
  sku?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  tags?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

