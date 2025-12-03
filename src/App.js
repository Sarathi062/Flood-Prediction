import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import UserDashboard from "./components/UserDashboard";
import Login from "./components/Login";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import ProtectedRoute from "./components/ProtectedRoute";
import { useUser } from "./hooks/useUser";
import DisclaimerModal from "./components/DisclaimerModal";

import { Modal, Box } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500 },
      },
    },
  },
});

function App() {
  const { data: user } = useUser();
  const admin = false;
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Detect if login modal should be open
  const isLoginRoute = location.pathname === "/login";
  useEffect(() => {
    const seen = localStorage.getItem("seenDisclaimer");

    if (!seen) {
      setShowDisclaimer(true);
      localStorage.setItem("seenDisclaimer", "true");
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DisclaimerModal
        open={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
      />

      <Nav />

      {/* Base Routes */}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Home remains background even at /login */}
        <Route path="/login" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user && <UserDashboard />}
              {admin && <Dashboard />}
            </ProtectedRoute>
          }
        />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>

      {/* LOGIN MODAL */}
      <Modal
        open={isLoginRoute}
        onClose={() => navigate("/")} // close returns home
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ outline: "none" }}>
          <Login onClose={() => navigate("/")} />
        </Box>
      </Modal>

      <Footer />
    </ThemeProvider>
  );
}

export default App;
