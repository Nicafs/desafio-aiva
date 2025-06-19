import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth";
import { AuthService } from "../services/auth.services";

type Props = { open: boolean; onClose: () => void };

export default function SignInDialog({ open, onClose }: Props) {
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ email: string; password: string }>();

  const [errorMsg, setErrorMsg] = useState("");

  const mutation = useMutation({
    mutationFn: AuthService.login,
    onError: () => setErrorMsg("Invalid email or password"),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setErrorMsg("");

    const response = await mutation.mutateAsync(data);
    setTokens(response);

    // Agora, com o token salvo, chame a API de profile
    const user = await AuthService.profile();
    setUser(user);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sign In</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="E-mail"
              {...register("email", { required: true })}
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              {...register("password", { required: true })}
              fullWidth
            />
            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || mutation.status === "pending"}
          >
            Sign In
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
