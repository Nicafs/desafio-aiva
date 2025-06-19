import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header onToggleSidebar={() => setCollapsed(!collapsed)} />

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar collapsed={collapsed} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            overflowY: "auto",
            p: 3,
            transition: "margin 0.3s",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
