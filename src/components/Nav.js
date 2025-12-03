import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";

import { useUser } from "../hooks/useUser";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

export default function Nav() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openMenu = Boolean(anchorEl);

  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const closeDrawerAndGo = (route) => {
    setDrawerOpen(false);
    navigate(route);
  };

  const handleLogout = async () => {
    setDrawerOpen(false); // 👈 close drawer on logout

    await axios.delete(
      `${process.env.REACT_APP_DEP_API_URL}/api/login/logout`,
      { withCredentials: true }
    );

    queryClient.removeQueries(["currentUser"]);
    queryClient.clear();

    navigate("/"); // 👈 go home after logout
  };
  const location = useLocation();

  return (
    <Box
      component="nav"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        bgcolor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e0e0e0",
        py: 1.5,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo + Brand */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
            onClick={() =>
              navigate("/", { state: { scrollTo: "home-section" } })
            }
          >
            <img
              src="favicon.ico"
              alt="Logo"
              style={{ width: 32, height: 32, borderRadius: 4 }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: { xs: "block", sm: "block" },
              }}
            >
              Flood Prediction AI
            </Typography>
          </Box>

          {/* DESKTOP */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            {!user ? (
              <Button
                variant="contained"
                onClick={() =>
                  navigate("/login", {
                    state: { backgroundLocation: location },
                  })
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  background:
                    "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                }}
              >
                Login
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={() => navigate("/dashboard")}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    background:
                      "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                  }}
                >
                  Dashboard
                </Button>

                <Tooltip title="Account settings">
                  <IconButton onClick={handleAvatarClick}>
                    <Avatar src={user?.photo} sx={{ width: 36, height: 36 }}>
                      {!user?.photo && user?.name?.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleMenuClose}
                >
                  <Box sx={{ p: 2, display: "flex", gap: 2 }}>
                    <Avatar src={user?.photo} />
                    <Box>
                      <Typography fontWeight={600}>{user?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          {/* MOBILE HAMBURGER */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon sx={{ fontSize: 30 }} />
          </IconButton>
        </Box>
      </Container>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 260, bgcolor: "#f8fafc" },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Menu
          </Typography>
        </Box>

        <Divider />

        <List>
          {!user ? (
            <>
              {/* LOGIN BUTTON */}
              <ListItem disablePadding>
                <ListItemButton onClick={() => closeDrawerAndGo("/login")}>
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              {/* PROFILE (non-functional placeholder) */}
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary={user?.name || "Profile"} />
                </ListItemButton>
              </ListItem>

              {/* DASHBOARD */}
              <ListItem disablePadding>
                <ListItemButton onClick={() => closeDrawerAndGo("/dashboard")}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>

              {/* LOGOUT */}
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </Box>
  );
}
