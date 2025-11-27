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
  WaterDrop as WaterDropIcon,
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

const Home = () => {
  const navigate = useNavigate();
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

  // Simulated counter animation on mount
  useEffect(() => {
    // You can add counter animation or fetch real stats here
  }, []);

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
      {/* ========== NAVIGATION BAR ========== */}
      {/* <Box
        component="nav"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #e0e0e0",
          py: 2
        }}
      > */}
      {/* <Container maxWidth="xl"> */}
      {/* <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}> */}
      {/* Logo */}
      {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WaterDropIcon sx={{ fontSize: 32, color: "#1976d2" }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: { xs: "none", sm: "block" }
                }}
              >
                Flood Prediction AI
              </Typography>
            </Box> */}

      {/* <Box sx={{ display: "flex", gap: 2 }}> */}
      {/* <Button
                variant="contained"
                onClick={() => navigate("/dashboard")}
                sx={{
                  textTransform: "none",
                  background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                  fontWeight: 600,
                  px: 3,
                  boxShadow: "0 4px 12px rgba(30, 64, 175, 0.3)"
                }}
              >
                View Dashboard
              </Button> */}
      {/* </Box> */}
      {/* </Box> */}
      {/* </Container> */}
      {/* </Box> */}

      {/* ========== HERO SECTION ========== */}
      {/* This is the most important section - captures attention immediately [71][78][84] */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%)",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Left: Text Content */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Status Badge */}
                <Chip
                  icon={<CheckCircleIcon />}
                  label="AI-Powered Prediction System"
                  color="primary"
                  sx={{ mb: 2, fontWeight: 600 }}
                />
                {/* Main Headline - Most critical element [78][84] */}
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
                {/* CTA Buttons - Clear call to action [71][80] */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
                {/* Trust Indicators */}
                {/* <Box sx={{ mt: 4, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e40af" }}>
                      94.7%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Accuracy Rate
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e40af" }}>
                      15+
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Locations Monitored
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e40af" }}>
                      24/7
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Real-time Monitoring
                    </Typography>
                  </Box>
                </Box> */}
              </motion.div>
            </Grid>

            {/* Right: Visual/Illustration */}
            {/* <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              > */}
            {/* <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: 300, md: 450 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                > */}
            {/* Placeholder for hero image/illustration [71][78] */}
            {/* You can replace this with an actual illustration or screenshot */}
            {/* <Paper
                    elevation={8}
                    sx={{
                      width: "90%",
                      height: "90%",
                      borderRadius: 4,
                      background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  > */}
            {/* Simulated dashboard preview */}
            {/* <Box sx={{ textAlign: "center", color: "white", p: 4 }}>
                      <WaterDropIcon sx={{ fontSize: 120, opacity: 0.3 }} />
                      <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>
                        Dashboard Preview
                      </Typography>
                    </Box> */}

            {/* Floating cards for visual interest */}
            {/* <Paper
                      sx={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        p: 2,
                        bgcolor: "white",
                        borderRadius: 2,
                        boxShadow: 4
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <WarningIcon color="error" />
                        <Typography variant="body2" fontWeight={600}>
                          2 Active Alerts
                        </Typography>
                      </Box>
                    </Paper>

                    <Paper
                      sx={{
                        position: "absolute",
                        bottom: 20,
                        left: 20,
                        p: 2,
                        bgcolor: "white",
                        borderRadius: 2,
                        boxShadow: 4
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CloudIcon color="primary" />
                        <Typography variant="body2" fontWeight={600}>
                          Heavy Rainfall
                        </Typography>
                      </Box>
                    </Paper> */}
            {/* </Paper> */}
            {/* </Box> */}
            {/* </motion.div> */}
            {/* </Grid> */}
          </Grid>
        </Container>
      </Box>

      {/* ========== STATISTICS SECTION ========== */}
      {/* Live metrics build credibility [80][83] */}
      {/* <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={6} md={3}>
            <Card elevation={0} sx={{ textAlign: "center", bgcolor: "#f8fafc", p: 3 }}>
              <LocationIcon sx={{ fontSize: 48, color: "#3b82f6", mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: "#1e40af" }}>
                {stats.locationsMonitored}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Locations Monitored
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card elevation={0} sx={{ textAlign: "center", bgcolor: "#f8fafc", p: 3 }}>
              <AssessmentIcon sx={{ fontSize: 48, color: "#3b82f6", mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: "#1e40af" }}>
                {stats.predictionsToday}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Predictions Today
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card elevation={0} sx={{ textAlign: "center", bgcolor: "#f8fafc", p: 3 }}>
              <NotificationsIcon sx={{ fontSize: 48, color: "#ef4444", mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: "#dc2626" }}>
                {stats.alertsSent}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Alerts Sent
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card elevation={0} sx={{ textAlign: "center", bgcolor: "#f8fafc", p: 3 }}>
              <TrendingUpIcon sx={{ fontSize: 48, color: "#10b981", mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: "#059669" }}>
                {stats.accuracyRate}%
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Accuracy Rate
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container> */}

      {/* ========== FEATURES SECTION ========== */}
      {/* Showcase key capabilities [73][76][80] */}
      <Box sx={{ bgcolor: "#f8fafc", py: 10 }}>
        <Container maxWidth="lg">
          {/* Section Header */}
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="overline"
              sx={{
                color: "#3b82f6",
                fontWeight: 700,
                fontSize: "1rem",
                mb: 1,
              }}
            >
              FEATURES
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: "2rem", md: "2.75rem" },
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

          {/* Feature Cards */}
          <Grid container spacing={4}>
            {/* Feature 1 */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <SpeedIcon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Real-Time Monitoring
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  Continuous tracking of weather conditions, rainfall levels,
                  and dam releases with updates every 5 minutes.
                </Typography>
              </Card>
            </Grid>

            {/* Feature 2 */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <AssessmentIcon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  AI-Powered Predictions
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  LSTM neural networks analyze historical patterns and current
                  data to forecast flood risks up to 7 days in advance.
                </Typography>
              </Card>
            </Grid>

            {/* Feature 3 */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Instant Alerts
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  Automatic notifications for high-risk situations with detailed
                  location-specific warnings and recommended actions.
                </Typography>
              </Card>
            </Grid>

            {/* Feature 4 */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <LocationIcon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Interactive Maps
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  Visual representation of flood risk zones with color-coded
                  markers and detailed location information.
                </Typography>
              </Card>
            </Grid>

            {/* Feature 5 */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Historical Analytics
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  Access to historical data trends, patterns, and insights to
                  improve long-term planning and preparedness.
                </Typography>
              </Card>
            </Grid>

            {/* Feature 6 */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Reliable & Secure
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  Built with enterprise-grade security and 99.9% uptime to
                  ensure critical information is always available.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ========== HOW IT WORKS SECTION ========== */}
      {/* Step-by-step process visualization [80][84] */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="overline"
            sx={{ color: "#3b82f6", fontWeight: 700, fontSize: "1rem", mb: 1 }}
          >
            HOW IT WORKS
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: "2rem", md: "2.75rem" },
            }}
          >
            Three Simple Steps
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Our intelligent system works around the clock to keep you informed
            and prepared.
          </Typography>
        </Box>

        <Grid container spacing={6} alignItems="center">
          {/* Step 1 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  mx: { xs: "auto", md: 0 },
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ color: "white", fontWeight: 700 }}
                >
                  1
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Data Collection
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ lineHeight: 1.7 }}
              >
                System continuously collects weather data, rainfall
                measurements, and dam release information from multiple sources
                including OpenWeather API and sensor networks.
              </Typography>
            </Box>
          </Grid>

          {/* Step 2 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  mx: { xs: "auto", md: 0 },
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ color: "white", fontWeight: 700 }}
                >
                  2
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                AI Analysis
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ lineHeight: 1.7 }}
              >
                LSTM neural networks process the data, identify patterns, and
                generate flood risk predictions with confidence scores for each
                monitored location.
              </Typography>
            </Box>
          </Grid>

          {/* Step 3 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  mx: { xs: "auto", md: 0 },
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ color: "white", fontWeight: 700 }}
                >
                  3
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Alerts & Visualization
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ lineHeight: 1.7 }}
              >
                Results are displayed on interactive dashboards with color-coded
                risk zones. Critical alerts are sent automatically to
                authorities and residents in affected areas.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ========== CALL TO ACTION SECTION ========== */}
      {/* Strong CTA before footer [71][80][83] */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
          py: 10,
          color: "white",
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of users who trust Flood Prediction AI to keep
              their communities safe from flood disasters.
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="outlined"
                size="large"
                sx={{
                  textTransform: "none",
                  borderColor: "white",
                  color: "white",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ========== FOOTER ========== */}
      {/* Professional footer with links and social [73][76] */}
      <Box sx={{ bgcolor: "#0f172a", color: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Brand */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <WaterDropIcon sx={{ fontSize: 30 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Flood Prediction AI
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{ opacity: 0.8, maxWidth: 300, lineHeight: 1.6 }}
              >
                AI-powered flood forecasting system built to protect communities
                with accurate, real-time predictions.
              </Typography>
            </Grid>

            {/* Links */}
            {/* <Grid item xs={12} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Company
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button color="inherit" sx={{ justifyContent: "flex-start" }}>
                  About
                </Button>
                <Button color="inherit" sx={{ justifyContent: "flex-start" }}>
                  Contact
                </Button>
                <Button color="inherit" sx={{ justifyContent: "flex-start" }}>
                  Careers
                </Button>
              </Box>
            </Grid> */}

            <Grid item xs={12} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Legal
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  color="inherit"
                  sx={{ justifyContent: "flex-start" }}
                  onClick={() => navigate("/privacy-policy")}
                >
                  Privacy Policy
                </Button>
                <Button
                  color="inherit"
                  sx={{ justifyContent: "flex-start" }}
                  onClick={() => navigate("/terms-of-service")}
                >
                  Terms of Service
                </Button>
              
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
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
