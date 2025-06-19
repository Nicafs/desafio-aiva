import { useState, useCallback } from "react";

export type UserFiltersType = {
  name: string;
  email: string;
  role: string;
};

const initialFilters: UserFiltersType = {
  name: "",
  email: "",
  role: "",
};

export const useUserFilters = () => {
  const [filters, setFilters] = useState<UserFiltersType>(initialFilters);

  const handleFilterChange = useCallback(
    (newFilters: Partial<UserFiltersType>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  return {
    filters,
    handleFilterChange,
    resetFilters,
  };
};
