import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z
    .number({ invalid_type_error: "Price is required" })
    .min(0, "Price cannot be negative"),
  description: z.string().min(1, "Description is required"),
  images: z.array(z.string().url("Invalid URL")).min(1, "Image is required"),
  categoryId: z
    .number({ invalid_type_error: "Category is required" })
    .min(1, "Category is required"),
});

export type ProductFormData = z.infer<typeof productSchema>;
