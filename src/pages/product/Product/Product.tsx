import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useState } from "react";
import ProductDetail from "../ProductDetail/ProductDetail";
import Loading from "../../../components/Loading";
import PageError from "../../../components/PageError";
import { useProducts } from "../../../hooks/useProducts";
import type { ApiProduct } from "../../../types/ApiProduct";
import ProductCard from "./components/ProductCard";

export default function ProductGrid() {
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(
    null,
  );

  // Products
  const {
    productsQuery: { data: products, isLoading, error, refetch },
    removeProduct,
  } = useProducts();

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedProduct(null);
  };

  const onEdit = useCallback((product: ApiProduct) => {
    setSelectedProduct(product);
    setOpenDetail(true);
  }, []);

  const onAdd = () => {
    setSelectedProduct(null);
    setOpenDetail(true);
  };

  const onDelete = useCallback(async (id: number) => {
    if (window.confirm("Do you really want to delete this product?")) {
      await removeProduct.mutate({ id });
    }
  }, []);

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => onAdd()}
        >
          Add
        </Button>
      </Stack>

      {isLoading && <Loading />}

      {error && <PageError message={error.message} onRetry={refetch} />}

      <Card
        sx={{
          bgcolor: "#f5f5f5",
          p: 3,
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{
            maxHeight: "calc(100vh - 242px)", // or another desired value
            overflowY: "auto",
          }}
        >
          {products?.map((product) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
              key={product.id}
            >
              <ProductCard
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
                isLoading={removeProduct.isPending}
              />
            </Grid>
          ))}
        </Grid>
      </Card>

      <ProductDetail
        open={openDetail}
        onClose={handleCloseDetail}
        product={selectedProduct}
        onSuccess={() => refetch()}
      />
    </Box>
  );
}
