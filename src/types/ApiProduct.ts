import type { ApiCategory } from "./ApiCategory";

export type ApiProduct = {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: ApiCategory;
  images: string[];
  creationAt?: string;
  updatedAt?: string;
};
