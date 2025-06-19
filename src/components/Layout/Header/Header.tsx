import React, { useState, useCallback } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SignInDialog from "../../../auth/SignInDialog";
import { useAuthStore } from "../../../store/auth";

type HeaderProps = {
  onToggleSidebar: () => void;
};

export default function Header({ onToggleSidebar }: HeaderProps) {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget),
    [],
  );

  const handleClose = useCallback(() => setAnchorEl(null), []);

  const handleSignIn = useCallback(() => {
    setOpenDialog(true);
    handleClose();
  }, [handleClose]);

  const handleSignOut = useCallback(() => {
    signOut();
    handleClose();
  }, [signOut, handleClose]);

  return (
    <>
      <AppBar
        position="static"
        elevation={2}
        sx={{ backgroundColor: "#1e1e1e" }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onToggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 500 }}>
            AIVA Challenge
          </Typography>

          {user && (
            <Box mr={2}>
              <Typography variant="body1" color="grey.300">
                Welcome, <strong>{user.name}</strong>
              </Typography>
            </Box>
          )}

          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleMenu}
            aria-label="user menu"
          >
            {user ? (
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : "N"}
              </Avatar>
            ) : (
              <AccountCircle />
            )}
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 2,
                minWidth: 150,
              },
            }}
          >
            {!user ? (
              <MenuItem onClick={handleSignIn}>Sign In</MenuItem>
            ) : (
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      <SignInDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </>
  );
}
