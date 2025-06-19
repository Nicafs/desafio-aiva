import { useQuery } from "@tanstack/react-query";
import { CategoriesService } from "../services/categories.service";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: CategoriesService.getAll,
  });
}
