import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Skeleton from "@mui/material/Skeleton";
import { useState } from "react";
import PageError from "../../components/PageError";
import { useProducts } from "../../hooks/useProducts";
import type { ApiError } from "../../types/ApiError";
import { useFilteredProducts } from "../../hooks/useFilteredProducts";
import ProductCardHome from "./components/ProductCardHome";
import CategoryMenu from "./components/CategoryMenu";

type SortOption =
  | "title-asc"
  | "title-desc"
  | "price-asc"
  | "price-desc"
  | "category";

export default function Home() {
  const [sort, setSort] = useState<SortOption>("title-asc");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Products
  const {
    productsQuery: { data: products, isLoading, error, refetch },
  } = useProducts();

  const filteredProducts = useFilteredProducts(
    products,
    sort,
    selectedCategory,
  );

  return (
    <Box sx={{ display: "flex", gap: 3 }}>
      {/* Filter sidebar */}
      <CategoryMenu
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main content */}
      <Box sx={{ flex: 1 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          mb={3}
          gap={2}
        >
          <Typography variant="h4" fontWeight="bold">
            Products
          </Typography>

          <Stack direction="row" gap={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="sort-label">Sort by</InputLabel>
              <Select
                labelId="sort-label"
                value={sort}
                label="Sort by"
                onChange={(e) => setSort(e.target.value as SortOption)}
              >
                <MenuItem value="title-asc">Title (A-Z)</MenuItem>
                <MenuItem value="title-desc">Title (Z-A)</MenuItem>
                <MenuItem value="price-asc">
                  Price (Lowest &rarr; Highest)
                </MenuItem>
                <MenuItem value="price-desc">
                  Price (Highest &rarr; Lowest)
                </MenuItem>
                <MenuItem value="category">Category</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {isLoading && (
          <Grid container spacing={3}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} key={i}>
                <Skeleton variant="rectangular" height={280} />
              </Grid>
            ))}
          </Grid>
        )}

        {error && (
          <PageError
            message={(error as ApiError)?.message || ""}
            onRetry={refetch}
          />
        )}

        {!isLoading && !error && (
          <Paper
            elevation={3}
            sx={{
              bgcolor: "#f3f4f8",
              p: 3,
              borderRadius: 3,
              minHeight: 400,
            }}
          >
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <ProductCardHome product={product} />
              ))}

              {filteredProducts.length === 0 && !isLoading && (
                <Grid size={12}>
                  <Typography
                    align="center"
                    color="text.secondary"
                    sx={{ py: 6 }}
                  >
                    No products found.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
