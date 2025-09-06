export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Purchase {
  id: string;
  product: Product;
  purchaseDate: Date;
  price: number;
}

export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
  'Toys',
  'Furniture',
  'Automotive',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];