import { useMemo } from "react";
import type { ApiProduct } from "../types/ApiProduct";

type SortOption =
  | "title-asc"
  | "title-desc"
  | "price-asc"
  | "price-desc"
  | "category";

export function useFilteredProducts(
  products: ApiProduct[] | undefined,
  sort: SortOption,
  selectedCategory: number | null,
) {
  return useMemo(() => {
    if (!products) return [];
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p?.category?.id === selectedCategory);
    }

    const sorters: Record<
      SortOption,
      (a: ApiProduct, b: ApiProduct) => number
    > = {
      "title-asc": (a, b) => a.title.localeCompare(b.title),
      "title-desc": (a, b) => b.title.localeCompare(a.title),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      category: (a, b) =>
        (a.category?.name || "").localeCompare(b.category?.name || ""),
    };

    return [...filtered].sort(sorters[sort]);
  }, [products, sort, selectedCategory]);
}
