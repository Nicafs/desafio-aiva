import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";

type LoadingProps = {
  message?: string;
  fullscreen?: boolean;
};

export default function Loading({
  message = "Loading...",
  fullscreen = false,
}: LoadingProps) {
  return (
    <Fade in>
      <Box
        sx={{
          position: fullscreen ? "fixed" : "relative",
          top: fullscreen ? 0 : "auto",
          left: fullscreen ? 0 : "auto",
          width: fullscreen ? "100vw" : "100%",
          height: fullscreen ? "100vh" : "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: fullscreen ? 1300 : "auto",
          bgcolor: fullscreen ? "rgba(255,255,255,0.7)" : "transparent",
          backdropFilter: fullscreen ? "blur(4px)" : "none",
        }}
      >
        <Paper
          elevation={fullscreen ? 3 : 0}
          sx={{
            p: 4,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            bgcolor: fullscreen ? "background.paper" : "transparent",
            boxShadow: fullscreen ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
          }}
        >
          <CircularProgress
            size={56}
            thickness={4}
            sx={{
              color: "primary.main",
            }}
          />
          <Typography variant="h6" color="text.secondary">
            {message}
          </Typography>
        </Paper>
      </Box>
    </Fade>
  );
}
