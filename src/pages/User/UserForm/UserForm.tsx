import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useUsers } from "../../../hooks/useUsers";
import type { ApiUser } from "../../../types/ApiUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserFormData } from "./schemaUser";

export default function UserForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const { createUser, updateUser, getByIdUser } = useUsers();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      avatar: "",
    },
  });

  const avatarUrl = watch("avatar");

  useEffect(() => {
    if (id) {
      getByIdUser.mutateAsync(Number(id)).then((user: ApiUser) => {
        reset({
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          avatar: user.avatar,
        });
      });
    }
  }, [id, reset]);

  const onSubmit = async (data: Partial<ApiUser>) => {
    try {
      if (isEdit) {
        await updateUser.mutateAsync({ id: data.id || 0, user: data });
      } else {
        await createUser.mutateAsync({ user: data });
      }
      navigate(-1); // only navigate if success
    } catch (e: any) {
      alert(
        e?.response?.data?.message?.join("\n") ||
          e?.message ||
          "Error saving user",
      );
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography data-testid="user-title" variant="h5" mb={2}>
        {isEdit ? "Edit User" : "New User"}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            error={!!errors.name}
            {...register("name", { required: true })}
            helperText={errors.name?.message}
            fullWidth
            required
            slotProps={{
              htmlInput: {
                "data-testid": "input-name",
              },
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            label="E-mail"
            type="email"
            error={!!errors.email}
            {...register("email", { required: true })}
            helperText={errors.email?.message}
            fullWidth
            required
            slotProps={{
              htmlInput: {
                "data-testid": "input-email",
              },
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            error={!!errors.password}
            {...register("password", { required: true })}
            helperText={errors.password?.message}
            fullWidth
            required
            slotProps={{
              htmlInput: {
                "data-testid": "input-password",
              },
              inputLabel: {
                shrink: true,
              },
              input: {
                endAdornment: (
                  <InputAdornment
                    position="end"
                    data-testid="btn-icon-password"
                  >
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label="Role"
            error={!!errors.role}
            {...register("role", { required: true })}
            helperText={errors.role?.message}
            fullWidth
            required
            slotProps={{
              htmlInput: {
                "data-testid": "input-role",
              },
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            label="Avatar (URL)"
            error={!!errors.avatar}
            {...register("avatar")}
            helperText={errors.avatar?.message}
            fullWidth
            slotProps={{
              htmlInput: {
                "data-testid": "input-avatar",
              },
              inputLabel: {
                shrink: true,
              },
            }}
          />

          {avatarUrl && (
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
                src={avatarUrl}
                alt="Avatar preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </Box>
          )}

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              data-testid="btn-cancel"
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              data-testid="btn-save"
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
}
