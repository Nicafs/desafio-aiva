import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

type Props = {
  message?: string;
  onRetry?: () => void;
};

export default function PageError({ message, onRetry }: Props) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        bgcolor: "#fff3f3",
        border: "1px solid #ffbdbd",
      }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 48 }} />

      <Typography variant="h6" color="error" align="center">
        An error occurred while loading data.
      </Typography>

      {message && (
        <Typography variant="body2" color="text.secondary" align="center">
          {message}
        </Typography>
      )}

      {onRetry && (
        <Button variant="contained" color="error" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Paper>
  );
}
