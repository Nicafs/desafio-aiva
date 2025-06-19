import * as z from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid e-mail"),
  password: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
