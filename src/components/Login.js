import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";

import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
} from "@mui/icons-material";

import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_DEP_API_URL || "";

function Login({ onClose }) {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [adminCredentials, setAdminCredentials] = useState({
    email: "",
    password: "",
  });

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/api/login/auth/google`;
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminCredentials),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("userRole", "admin");
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid admin credentials");
      }
    } catch (err) {
      setError("Failed to connect to server");
    }
  };

  const handleInputChange = (e) => {
    setAdminCredentials({
      ...adminCredentials,
      [e.target.name]: e.target.value,
    });
  };

  // Default login type selection
  if (!loginType) {
    return (
      <Card sx={{ maxWidth: 420, width: "100%", boxShadow: 4, borderRadius: 3, position: "relative" }}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, zIndex: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
            Welcome to Flood Prediction AI
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Choose your login method
          </Typography>

          <Button
            fullWidth
            variant="contained"
            startIcon={<AdminPanelSettings />}
            onClick={() => setLoginType("admin")}
            sx={{ mb: 2, py: 1.3 }}
          >
            Admin Login
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => setLoginType("user")}
            sx={{ py: 1.3 }}
          >
            User Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Admin login form
  if (loginType === "admin") {
    return (
      <Card sx={{ maxWidth: 420, width: "100%", boxShadow: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <AdminPanelSettings sx={{ fontSize: 38, color: "primary.main", mr: 1 }} />
            <Typography variant="h5" fontWeight="bold">Admin Login</Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleAdminLogin}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={adminCredentials.email}
              onChange={handleInputChange}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={adminCredentials.password}
              onChange={handleInputChange}
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button fullWidth type="submit" variant="contained" sx={{ mt: 3, py: 1.3 }}>
              Sign In as Admin
            </Button>

            <Button fullWidth variant="text" sx={{ mt: 1 }} onClick={() => setLoginType("")}>
              Back
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Google login
  return (
    <Card sx={{ maxWidth: 420, width: "100%", boxShadow: 4, borderRadius: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          Welcome to Flood Prediction AI
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Sign in with your Google account to continue
        </Typography>

        <Button
          fullWidth
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{ py: 1.3, bgcolor: "#4285f4", "&:hover": { bgcolor: "#357ae8" } }}
        >
          Continue with Google
        </Button>

        <Divider sx={{ my: 3 }} />

        <Button fullWidth variant="text" onClick={() => setLoginType("")}>
          Back
        </Button>
      </CardContent>
    </Card>
  );
}

export default Login;
