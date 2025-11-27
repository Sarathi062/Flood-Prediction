import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "../hooks/useUser";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

export default function Nav() {
  const navigate = useNavigate();
  const { data: user, isLoading, isError, logout } = useUser();
  const queryClient = useQueryClient();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    await axios.delete(
      `${process.env.REACT_APP_DEP_API_URL}/api/login/logout`,
      { withCredentials: true }
    );

    // Delete cookie from browser (backend already did this)

    queryClient.removeQueries(["currentUser"]);
    queryClient.clear(); // clears all cached queries

    navigate("/");
  };

  return (
    <Box
      component="nav"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        bgcolor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e0e0e0",
        py: 2,
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
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WaterDropIcon sx={{ fontSize: 32, color: "#1976d2" }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: { xs: "none", sm: "block" },
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              Flood Prediction AI
            </Typography>
          </Box>

          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/dashboard")}
                sx={{
                  textTransform: "none",
                  background:
                    "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                  fontWeight: 600,
                  px: 3,
                  boxShadow: "0 4px 12px rgba(30, 64, 175, 0.3)",
                }}
              >
                View Dashboard
              </Button>

              {/* Profile avatar button */}
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleProfileClick}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  <Avatar
                    src={user?.photo || ""}
                    alt={user?.name || "Profile"}
                    sx={{ width: 36, height: 36 }}
                  >
                    {!user?.photo && (user?.name ? user?.name.charAt(0) : "")}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 4,
                  sx: {
                    mt: 1.5,
                    minWidth: 220,
                    borderRadius: 2,
                  },
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Box
                  sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Avatar
                    src={user?.photo || ""}
                    alt={user?.name || "Profile"}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {user?.name || "User"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email || ""}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
