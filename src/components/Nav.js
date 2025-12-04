import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
} from "@mui/material";
import NotificationDrawer from "./NotificationDrawer";
import AlertProfileModal from "./AlertProfileModal";

import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";

import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

const BACKEND_URL = process.env.REACT_APP_DEP_API_URL;

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openMenu = Boolean(anchorEl);
  const openNotif = Boolean(notifAnchor);

  const unseenCount = user?.notifications?.filter((n) => !n.seen)?.length || 0;

  /* 🔔 Mark Notifications as Seen */
  const markAsSeen = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/user/mark-seen`,
        {},
        { withCredentials: true }
      );
      queryClient.invalidateQueries(["currentUser"]);
    } catch (err) {
      console.error("Error marking as seen:", err);
    }
  };
  const handleLogout = async () => {
    setDrawerOpen(false);

    await axios.delete(`${BACKEND_URL}/api/login/logout`, {
      withCredentials: true,
    });

    queryClient.removeQueries(["currentUser"]);
    navigate("/");

    // 🔥 Scroll to top after navigation
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
          {/* 🔵 LOGO */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/");
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
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
                  background: "linear-gradient(135deg, #1e40af, #3b82f6)",
                }}
              >
                Login
              </Button>
            ) : (
              <>
                {/* 🔔 NOTIFICATION BELL */}
                {/* <IconButton
                  color="inherit"
                  onClick={(e) => {
                    setNotifAnchor(e.currentTarget);
                    markAsSeen();
                  }}
                >
                  <Badge badgeContent={unseenCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton> */}
                <IconButton
                  color="inherit"
                  onClick={() => {
                    setNotifDrawerOpen(true);
                    markAsSeen();
                  }}
                >
                  <Badge badgeContent={unseenCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* ℹ NOTIFICATION DROPDOWN */}
                {/* <Menu
                  anchorEl={notifAnchor}
                  open={openNotif}
                  onClose={() => setNotifAnchor(null)}
                >
                  <Typography sx={{ p: 2, fontWeight: 600 }}>
                    Notifications
                  </Typography>
                  <Divider />

                  {user?.notifications?.length === 0 && (
                    <MenuItem>No notifications</MenuItem>
                  )}
                  {user?.notifications?.map((n) => (
                    <MenuItem
                      key={n.id}
                      onClick={() => {
                        setNotifAnchor(null);
                        if (n.id === "complete-alert-profile") {
                          navigate("/dashboard", {
                            state: { openAlertForm: true },
                          });
                        }
                      }}
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderRadius: "12px",
                        mb: 1,
                        alignItems: "flex-start",
                        bgcolor: n.seen ? "#F9FAFB" : "rgba(59,130,246,0.1)",
                        transition: "0.2s",
                        "&:hover": {
                          bgcolor: n.seen ? "#F3F4F6" : "rgba(59,130,246,0.18)",
                        },
                      }}
                    >
                      <Box>
                        <Typography fontWeight={700} fontSize="15px">
                          {n.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ color: "#4B5563", mt: 0.5, lineHeight: 1.4 }}
                        >
                          {n.message}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{ color: "#6B7280", display: "block", mt: 0.6 }}
                        >
                          {new Date(n.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Menu> */}

                {/* DASHBOARD BUTTON */}
                <Button
                  variant="contained"
                  onClick={() => navigate("/dashboard")}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    background: "linear-gradient(135deg, #1e40af, #3b82f6)",
                  }}
                >
                  Dashboard
                </Button>

                {/* USER MENU */}
                <Tooltip title="Account settings">
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <Avatar src={user?.photo} sx={{ width: 36, height: 36 }}>
                      {!user?.photo && user?.name?.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={() => setAnchorEl(null)}
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
          {user ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                display: { xs: "flex", md: "none" },
              }}
            >
              <IconButton
                color="inherit"
                sx={{ display: { xs: "flex", md: "none" } }}
                onClick={() => {
                  setNotifDrawerOpen(true);
                  markAsSeen();
                }}
              >
                <Badge badgeContent={unseenCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              {/* MOBILE MENU */}
              <IconButton
                sx={{ display: { xs: "flex", md: "none" } }}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon sx={{ fontSize: 30 }} />
              </IconButton>
            </Box>
          ) : (
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
                background: "linear-gradient(135deg, #1e40af, #3b82f6)",
                display: { xs: "flex", md: "none" },
              }}
            >
              Login
            </Button>
          )}
        </Box>

        {/* DRAWER */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{ sx: { width: 260, bgcolor: "#f8fafc" } }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              Menu
            </Typography>
          </Box>

          <Divider />

          <List>
            {!user ? (
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/login")}>
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate("/dashboard");
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                </ListItem>

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

        <NotificationDrawer
          open={notifDrawerOpen}
          onClose={() => setNotifDrawerOpen(false)}
          notifications={user?.notifications || []}
          onCompleteProfile={() => {
            setNotifDrawerOpen(false);
            setAlertModalOpen(true); // open form
          }}
        />

        {/* 📝 ALERT PROFILE FORM MODAL */}
        <AlertProfileModal
          open={alertModalOpen}
          onClose={() => setAlertModalOpen(false)}
        />
      </Container>
    </Box>
  );
}
