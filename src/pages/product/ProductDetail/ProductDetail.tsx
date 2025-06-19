import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useProducts } from "../../../hooks/useProducts";
import type { ApiProduct } from "../../../types/ApiProduct";
import { productSchema, type ProductFormData } from "./schemaProduct";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useCategories } from "../../../hooks/useCategories";

type ProductDetailProps = {
  open: boolean;
  onClose: () => void;
  product?: ApiProduct | null;
  onSuccess?: () => void;
};

export default function ProductDetail({
  open,
  onClose,
  product,
  onSuccess,
}: ProductDetailProps) {
  const isEdit = !!product;
  const { createProduct, updateProduct } = useProducts();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { isSubmitting, errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      price: 0,
      description: "",
      images: [""],
      categoryId: undefined,
    },
  });

  const imageUrl = watch("images.0");

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        price: product.price,
        description: product.description,
        images: [product.images?.[0] || ""],
        categoryId: 1,
      });
    } else {
      reset({
        title: "",
        price: 0,
        description: "",
        images: [""],
        categoryId: undefined,
      });
    }
    setErrorMessage(null);
  }, [product, reset]);

  const onSubmit = async (data: Partial<ApiProduct>) => {
    try {
      setErrorMessage(null);
      if (isEdit && product?.id) {
        await updateProduct.mutateAsync({ id: product.id, product: data });
      } else {
        await createProduct.mutateAsync({ product: data });
      }
      onClose();
      onSuccess?.();
    } catch (e: any) {
      setErrorMessage(
        e?.response?.data?.message?.join("\n") ||
          e?.message ||
          "Error saving product",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="dialog-product-title"
    >
      <DialogTitle id="dialog-product-title">
        {isEdit ? "Edit Product" : "New Product"}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Stack spacing={2}>
            {errorMessage && (
              <Alert data-testid="alert-error" severity="error">
                {errorMessage}
              </Alert>
            )}

            <TextField
              id="title"
              label="Title"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
              fullWidth
              required
              slotProps={{
                htmlInput: {
                  "data-testid": "input-title",
                },
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              id="price"
              label="Price"
              type="number"
              {...register("price", { valueAsNumber: true })}
              error={!!errors.price}
              helperText={errors.price?.message}
              fullWidth
              required
              inputProps={{ min: 0 }}
              slotProps={{
                htmlInput: {
                  "data-testid": "input-price",
                },
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              id="description"
              label="Description"
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              fullWidth
              multiline
              minRows={3}
              required
              slotProps={{
                htmlInput: {
                  "data-testid": "input-description",
                },
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              id="images"
              label="Image URL"
              {...register("images.0")}
              error={!!errors.images}
              helperText={errors.images?.message}
              fullWidth
              required
              slotProps={{
                htmlInput: {
                  "data-testid": "input-images",
                },
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            {imageUrl && (
              <Box
                sx={{
                  mt: 1,
                  p: 1,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <img
                  src={imageUrl}
                  alt="Product preview"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </Box>
            )}

            <FormControl
              fullWidth
              error={!!errors.categoryId}
              required
              aria-describedby="category-helper-text"
            >
              <InputLabel id="category-label">Category</InputLabel>
              <Controller
                name="categoryId"
                control={control}
                defaultValue={undefined}
                render={({ field }) => (
                  <Select
                    id="category"
                    labelId="category-label"
                    label="Category"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    data-testid="input-category"
                  >
                    {categories?.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText id="category-helper-text">
                {errors.categoryId?.message}
              </FormHelperText>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
