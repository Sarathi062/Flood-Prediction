import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
} from "@mui/material";

import {
  Cloud as CloudIcon,
  Warning as WarningIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
  LocationOn as LocationIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Optional: for animations
import { useUser } from "../hooks/useUser";
import CardActionArea from "@mui/material/CardActionArea";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ bgcolor: "#0f172a", color: "white", py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={12}>
          {/* BRAND SECTION */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <img
                src="favicon.ico"
                alt="Logo"
                style={{ width: 32, height: 32, borderRadius: 4 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Flood Prediction AI
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{ opacity: 0.8, maxWidth: 320, lineHeight: 1.6 }}
            >
              AI-powered flood forecasting system designed to safeguard
              communities through real-time predictions, alerts, and advanced
              analytics.
            </Typography>
          </Grid>

          {/* QUICK LINKS */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                color="inherit"
                sx={{ justifyContent: "flex-start", margin: 0, padding: 0 }}
                onClick={() => {
                  navigate("/");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                Home
              </Button>
              <Button
                color="inherit"
                sx={{ justifyContent: "flex-start", margin: 0, padding: 0 }}
                onClick={() =>
                  navigate("/dashboard", { state: { scrollTo: "dashboard" } })
                }
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                sx={{ justifyContent: "flex-start", margin: 0, padding: 0 }}
                onClick={() =>
                  navigate("/", { state: { scrollTo: "system-section" } })
                }
              >
                System Architecture
              </Button>
              <Button
                color="inherit"
                sx={{ justifyContent: "flex-start", margin: 0, padding: 0 }}
                onClick={() =>
                  navigate("/", { state: { scrollTo: "cloud-section" } })
                }
              >
                Cloud Setup
              </Button>
            </Box>
          </Grid>

          {/* LEGAL */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Legal
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                color="inherit"
                sx={{ justifyContent: "flex-start", margin: 0, padding: 0 }}
                onClick={() => navigate("/privacy-policy")}
              >
                Privacy Policy
              </Button>
              <Button
                color="inherit"
                sx={{ justifyContent: "flex-start", margin: 0, padding: 0 }}
                onClick={() => navigate("/terms-of-service")}
              >
                Terms of Service
              </Button>
            </Box>
          </Grid>

          {/* CONTACT */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Contact
            </Typography>

            <Typography sx={{ opacity: 0.8, mb: 1 }}>
              Email: sarathi062023@gmail.com
            </Typography>

            <Typography sx={{ opacity: 0.8, mb: 2 }}>
              Pune, Maharashtra, India
            </Typography>

            {/* Social Icons */}
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <IconButton
                component="a"
                href="https://github.com/Sarathi062"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                size="large"
                sx={{ margin: 0, padding: 0 }}
              >
                <GitHubIcon />
              </IconButton>

              <IconButton
                component="a"
                href="https://www.linkedin.com/in/yashrajdhamale/"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                size="large"
                sx={{ margin: 0, padding: 0 }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* DIVIDER */}
        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

        {/* BOTTOM COPYRIGHT BAR */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            textAlign: { xs: "center", md: "left" },
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © 2025 Flood Prediction AI — All rights reserved.
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Built with ❤️ by Team Sarathi
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
