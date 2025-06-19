import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductsService } from "../services/products.service";
import type { ApiProduct } from "../types/ApiProduct";

export function useProducts() {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: ProductsService.getAll,
  });

  const getByIdProduct = useMutation({
    mutationFn: ProductsService.getById,
  });

  const createProduct = useMutation({
    mutationFn: ({ product }: { product: Partial<ApiProduct> }) =>
      ProductsService.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: ({
      id,
      product,
    }: {
      id: number;
      product: Partial<ApiProduct>;
    }) => ProductsService.update(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const removeProduct = useMutation({
    mutationFn: ({ id }: { id: number }) => ProductsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    productsQuery,
    getByIdProduct,
    createProduct,
    updateProduct,
    removeProduct,
  };
}
