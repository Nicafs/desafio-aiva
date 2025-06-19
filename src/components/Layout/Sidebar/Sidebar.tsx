import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import SignalCellularAltOutlinedIcon from "@mui/icons-material/SignalCellularAltOutlined";
import { NavLink, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Home", icon: <HomeOutlinedIcon />, path: "/home" },
  { label: "Products", icon: <LocalMallOutlinedIcon />, path: "/products" },
  { label: "Users", icon: <SignalCellularAltOutlinedIcon />, path: "/users" },
];

type SidebarProps = {
  collapsed: boolean;
};

const Sidebar = ({ collapsed }: SidebarProps) => {
  const location = useLocation();
  const width = collapsed ? 70 : 250;

  return (
    <Box
      component="nav"
      sx={{
        width,
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        transition: "width 0.3s",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <Box sx={{ p: 2 }}>
        {!collapsed && (
          <Typography variant="h6" noWrap>
            AIVA Challenge
          </Typography>
        )}
      </Box>

      <Divider />

      <List
        component="nav"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        {menuItems.map(({ label, icon, path }) => {
          const selected = location.pathname.startsWith(path);
          return (
            <ListItemButton
              key={label}
              component={NavLink}
              to={path}
              selected={selected}
              sx={{
                borderRadius: 2,
                mx: 1,
                "&.Mui-selected": {
                  bgcolor: "primary.light",
                  color: "common.white",
                  "& .MuiListItemIcon-root": {
                    color: "common.white",
                  },
                },
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? "auto" : 2,
                  justifyContent: "center",
                  transition: "margin 0.3s",
                }}
              >
                {icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={label}
                  sx={{
                    opacity: collapsed ? 0 : 1,
                    transition: "opacity 0.3s",
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        {!collapsed && (
          <Typography variant="caption" color="text.secondary">
            © 2025 AIVA
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;
