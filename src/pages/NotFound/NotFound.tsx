import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NotFound() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f9fafb"
      px={2}
    >
      <Paper elevation={3} sx={{ p: 6, borderRadius: 3, maxWidth: 500 }}>
        <Stack spacing={3} textAlign="center">
          <Typography variant="h2" fontWeight="bold" color="primary">
            404
          </Typography>

          <Typography variant="h5" fontWeight={600}>
            Page Not Found
          </Typography>

          <Typography variant="body1" color="text.secondary">
            The page you're looking for doesn't exist or has been moved.
          </Typography>

          <Button
            variant="contained"
            component={RouterLink}
            to="/"
            size="large"
          >
            Go Back to Home
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
