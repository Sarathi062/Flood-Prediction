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

const Home = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { data: user, isLoading, isError } = useUser();

  // State for live statistics (can connect to real API)
  const [stats, setStats] = useState({
    locationsMonitored: 15,
    predictionsToday: 342,
    alertsSent: 28,
    accuracyRate: 94.7,
  });
  const features = [
    {
      id: 1,
      title: "Real-Time Monitoring",
      description:
        "Continuous tracking of weather conditions, rainfall levels, and dam releases with updates every 5 minutes.",
      iconBg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      icon: <SpeedIcon sx={{ fontSize: 32, color: "white" }} />,
    },
    {
      id: 2,
      title: "AI-Powered Predictions",
      description:
        "LSTM neural networks analyze historical patterns and current data to forecast flood risks up to 7 days in advance.",
      iconBg: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      icon: <AssessmentIcon sx={{ fontSize: 32, color: "white" }} />,
    },
    {
      id: 3,
      title: "Instant Alerts",
      description:
        "Automatic notifications for high-risk situations with detailed location-specific warnings and recommended actions.",
      iconBg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      icon: <NotificationsIcon sx={{ fontSize: 32, color: "white" }} />,
    },
    {
      id: 4,
      title: "Interactive Maps",
      description:
        "Visual representation of flood risk zones with color-coded markers and detailed location information.",
      iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      icon: <LocationIcon sx={{ fontSize: 32, color: "white" }} />,
    },
    {
      id: 5,
      title: "Historical Analytics",
      description:
        "Access to historical data trends, patterns, and insights to improve long-term planning and preparedness.",
      iconBg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      icon: <TrendingUpIcon sx={{ fontSize: 32, color: "white" }} />,
    },
    {
      id: 6,
      title: "Reliable & Secure",
      description:
        "Built with enterprise-grade security and 99.9% uptime to ensure critical information is always available.",
      iconBg: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      icon: <SecurityIcon sx={{ fontSize: 32, color: "white" }} />,
    },
  ];

  // Simulated counter animation on mount
  useEffect(() => {
    // You can add counter animation or fetch real stats here
  }, []);

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const arrowVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    show: {
      scaleY: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }} id="home-section">
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%)",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(4, 99, 250, 0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Chip
                  icon={<CheckCircleIcon />}
                  label="AI-Powered Prediction System"
                  color="primary"
                  sx={{ mb: 2, fontWeight: 600 }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    fontWeight: 800,
                    lineHeight: 1.2,
                    mb: 2,
                    color: "#1e293b",
                  }}
                >
                  Predict Floods Before{" "}
                  <Box
                    component="span"
                    sx={{
                      background:
                        "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    They Strike
                  </Box>
                </Typography>
                {/* Subheadline */}
                <Typography
                  variant="h6"
                  sx={{
                    color: "#64748b",
                    mb: 4,
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                >
                  Advanced machine learning models analyze real-time weather
                  data, dam releases, and rainfall patterns to provide accurate
                  flood predictions for Pune and surrounding areas.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    mb: 5,
                    mt: 3,
                  }}
                >
                  {!user && (
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate("/login")}
                      sx={{
                        textTransform: "none",
                        background:
                          "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        fontSize: "1.1rem",
                        boxShadow: "0 8px 24px rgba(30, 64, 175, 0.3)",
                        "&:hover": {
                          boxShadow: "0 12px 32px rgba(30, 64, 175, 0.4)",
                        },
                      }}
                    >
                      Get Started
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      document
                        .getElementById("features-section")
                        ?.scrollIntoView({
                          behavior: "smooth",
                        });
                    }}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      borderWidth: 2,
                      "&:hover": {
                        borderWidth: 2,
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "#f8fafc", py: 10 }} id="features-section">
        <Container maxWidth="lg">
          {/* Section Header */}
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="overline"
              sx={{
                color: "#3b82f6",
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: 2,
              }}
            >
              FEATURES
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "2.75rem" },
                mb: 2,
              }}
            >
              Why Choose Flood Prediction AI?
            </Typography>

            <Typography
              variant="h6"
              color="textSecondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Our advanced system combines machine learning, real-time data, and
              intelligent forecasting to keep communities safe.
            </Typography>
          </Box>

          {/* Auto-Fill Responsive Cards */}
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 5,
            }}
          >
            {features.map((item) => (
              <Card
                key={item.id}
                elevation={0}
                sx={{
                  p: 4,
                  border: "1px solid #e2e8f0",
                  height: "100%",
                  borderRadius: 3,
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 10px 22px rgba(0,0,0,0.1)",
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    background: item.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  {item.icon}
                </Box>

                {/* Title */}
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                  {item.title}
                </Typography>

                {/* Description */}
                <Typography variant="body1" color="textSecondary">
                  {item.description}
                </Typography>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 12 }} id="system-section">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="overline"
            sx={{ color: "#3b82f6", fontWeight: 700, letterSpacing: 2 }}
          >
            SYSTEM ARCHITECTURE
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: "2rem", md: "2.75rem" },
            }}
          >
            End-to-End Flood Prediction Pipeline
          </Typography>

          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ maxWidth: 700, mx: "auto" }}
          >
            A 4-layer architecture designed for accuracy, reliability, and
            scalability.
          </Typography>
        </Box>

        {/* ============ Layer 1 ============ */}
        <motion.div
          variants={stepVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
        >
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={1}>
              1. Data Collection Layer
            </Typography>
            <Typography color="text.secondary">
              Collects rainfall, satellite, weather, and dam release data.
            </Typography>
          </Card>
        </motion.div>

        {/* Arrow 1 */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            width: "4px",
            height: "50px", // fixed height for perfect alignment
            margin: "10px auto",
            transformOrigin: "top",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Line */}
          <Box
            sx={{
              width: "4px",
              height: "70px", // line part
              background: "linear-gradient(180deg,#3b82f6,#2563eb)",
              borderRadius: "4px",
            }}
          />

          {/* Arrowhead */}
          <Box
            sx={{
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "14px solid #2563eb",
              mt: "-1px", // snug fit
            }}
          />
        </motion.div>

        {/* ============ Layer 2 ============ */}
        <motion.div
          variants={stepVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
        >
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={1}>
              2. Data Storage & Preprocessing
            </Typography>
            <Typography color="text.secondary">
              Cleans, normalizes and structures input for model training.
            </Typography>
          </Card>
        </motion.div>

        {/* Arrow 2 */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            width: "4px",
            height: "50px", // fixed height for perfect alignment
            margin: "10px auto",
            transformOrigin: "top",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Line */}
          <Box
            sx={{
              width: "4px",
              height: "70px", // line part
              background: "linear-gradient(180deg,#3b82f6,#2563eb)",
              borderRadius: "4px",
            }}
          />

          {/* Arrowhead */}
          <Box
            sx={{
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "14px solid #2563eb",
              mt: "-1px", // snug fit
            }}
          />
        </motion.div>

        {/* ============ Layer 3 ============ */}
        <motion.div
          variants={stepVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
        >
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={1}>
              3. Modeling Layer (LSTM Pipeline)
            </Typography>
            <Typography color="text.secondary">
              LSTM neural networks generate future flood risk predictions.
            </Typography>
          </Card>
        </motion.div>

        {/* Arrow 3 */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            width: "4px",
            height: "50px", // fixed height for perfect alignment
            margin: "10px auto",
            transformOrigin: "top",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Line */}
          <Box
            sx={{
              width: "4px",
              height: "70px", // line part
              background: "linear-gradient(180deg,#3b82f6,#2563eb)",
              borderRadius: "4px",
            }}
          />

          {/* Arrowhead */}
          <Box
            sx={{
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "14px solid #2563eb",
              mt: "-1px", // snug fit
            }}
          />
        </motion.div>

        {/* ============ Layer 4 ============ */}
        <motion.div
          variants={stepVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
        >
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={1}>
              4. Application Layer
            </Typography>
            <Typography color="text.secondary">
              REST APIs, dashboards, alerts & visualization tools for end-users.
            </Typography>
          </Card>
        </motion.div>
      </Container>

      <Box
        sx={{
          background: "linear-gradient(135deg, #1040b0ff 0%, #1e293b 100%)",
          py: 10,
          color: "white",
        }}
        id="cloud-section"
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: 2,
                color: "#38bdf8",
              }}
            >
              CLOUD DEPLOYMENT ARCHITECTURE
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.9rem", md: "2.7rem" },
                mb: 2,
              }}
            >
              Powered by Scalable Cloud Infrastructure
            </Typography>

            <Typography
              variant="h6"
              sx={{
                opacity: 0.8,
                maxWidth: 700,
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Flood Prediction AI is deployed on a reliable and secure AWS
              architecture ensuring high availability, fast performance, and
              smooth continuous deployment.
            </Typography>
          </Box>

          {/* CLOUD CARDS SECTION */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 4,
            }}
          >
            {/* AWS AMPLIFY CARD */}
            <Box
              sx={{
                p: 4,
                borderRadius: 3,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  background: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                AWS Amplify (Frontend)
              </Typography>
              <Typography
                variant="body1"
                sx={{ opacity: 0.8, lineHeight: 1.6 }}
              >
                The React-based frontend is deployed using{" "}
                <strong>AWS Amplify</strong>, enabling CI/CD integration, global
                CDN caching, fast static hosting, and auto builds for every
                commit pushed to GitHub.
              </Typography>
            </Box>

            {/* AWS LIGHTSAIL CARD */}
            <Box
              sx={{
                p: 4,
                borderRadius: 3,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  background: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                AWS Lightsail (Backend API)
              </Typography>
              <Typography
                variant="body1"
                sx={{ opacity: 0.8, lineHeight: 1.6 }}
              >
                The Node.js/Express backend is hosted on{" "}
                <strong>AWS Lightsail</strong>, offering a cost-effective
                VPS-like environment with auto snapshots, server monitoring,
                static IP, and secure firewall configurations.
              </Typography>
            </Box>

            {/* OPTIONAL: S3 */}
            <Box
              sx={{
                p: 4,
                borderRadius: 3,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  background: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                MongoDB (Model & Data Storage)
              </Typography>
              <Typography
                variant="body1"
                sx={{ opacity: 0.8, lineHeight: 1.6 }}
              >
                Flood model files, data backups, logs, and historical records
                can be stored securely with <strong>MongoDB</strong> for
                durability, scalability, and lifecycle automation.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "#0f172a", color: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={12}>
            {/* BRAND SECTION */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
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
                    document.getElementById("home-section")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  Home
                </Button>
                <Button
                  color="inherit"
                  sx={{ justifyContent: "flex-start", margin: 0, padding: 0 }}
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  sx={{ justifyContent: "flex-start", margin: 0, padding: 0 }}
                  onClick={() => {
                    document.getElementById("system-section")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  System Architecture
                </Button>
                <Button
                  color="inherit"
                  sx={{ justifyContent: "flex-start", margin: 0, padding: 0 }}
                  onClick={() => {
                    document.getElementById("cloud-section")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
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
                  color="inherit"
                  size="large"
                  sx={{ margin: 0, padding: 0 }}
                >
                  <GitHubIcon />
                </IconButton>
                <IconButton
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
    </Box>
  );
};

export default Home;
