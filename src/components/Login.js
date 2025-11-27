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
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_DEP_API_URL || "";

function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState(""); // "" | "admin" | "user"
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Admin form state
  const [adminCredentials, setAdminCredentials] = useState({
    email: "",
    password: "",
  });

  const handleGoogleLogin = () => {
    // Redirect user to backend Google OAuth route
    window.location.href = `${BACKEND_URL}/api/login/auth/google`;
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminCredentials),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        // Store admin token/session
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("userRole", "admin");
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid admin credentials");
      }
    } catch (err) {
      setError("Failed to connect to server");
      console.error("Admin login error:", err);
    }
  };

  const handleInputChange = (e) => {
    setAdminCredentials({
      ...adminCredentials,
      [e.target.name]: e.target.value,
    });
  };

  // Initial selection screen
  if (!loginType) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          padding: 2,
        }}
      >
        <Card
          sx={{
            maxWidth: 450,
            width: "100%",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              fontWeight="bold"
            >
              Welcome to Flood Prediction AI
            </Typography>
            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Choose your login method
            </Typography>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<AdminPanelSettings />}
              onClick={() => setLoginType("admin")}
              sx={{
                mb: 2,
                py: 1.5,
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#1565c0" },
              }}
            >
              Admin Login
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={() => setLoginType("user")}
              sx={{
                py: 1.5,
                borderColor: "#1976d2",
                color: "#1976d2",
                "&:hover": {
                  borderColor: "#1565c0",
                  bgcolor: "rgba(25, 118, 210, 0.04)",
                },
              }}
            >
              User Login
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Admin login form
  if (loginType === "admin") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          padding: 2,
        }}
      >
        <Card
          sx={{
            maxWidth: 450,
            width: "100%",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <AdminPanelSettings
                sx={{ fontSize: 40, color: "#1976d2", mr: 1 }}
              />
              <Typography variant="h4" fontWeight="bold">
                Admin Login
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter your admin credentials to continue
            </Typography>

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
                type="email"
                value={adminCredentials.email}
                onChange={handleInputChange}
                required
                margin="normal"
                autoComplete="email"
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
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Sign In as Admin
              </Button>

              <Button
                fullWidth
                variant="text"
                onClick={() => setLoginType("")}
                sx={{ color: "text.secondary" }}
              >
                Back to login options
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // User Google login
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            fontWeight="bold"
          >
            Welcome to Sarathi
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Sign in with your Google account to continue
          </Typography>

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{
              py: 1.5,
              bgcolor: "#4285f4",
              "&:hover": { bgcolor: "#357ae8" },
              textTransform: "none",
              fontSize: "16px",
            }}
          >
            Continue with Google
          </Button>

          <Divider sx={{ my: 3 }} />

          <Button
            fullWidth
            variant="text"
            onClick={() => setLoginType("")}
            sx={{ color: "text.secondary" }}
          >
            Back to login options
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
