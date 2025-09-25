import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Box,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Snackbar,
  Container,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  WaterDrop as WaterDropIcon,
  Cloud as CloudIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Dashboard = () => {
  // State Management
  const [currentData, setCurrentData] = useState({
    rainfall: 0,
    waterLevel: 0,
    riskLevel: "safe",
    confidence: 0,
    timestamp: new Date(),
    temperature: 0,
    humidity: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [floodZones, setFloodZones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // API Base URL - adjust according to your backend
  const API_BASE_URL = process.env.REACT_APP_API_URL || "";

  // Fetch current flood data
  const fetchCurrentData = async () => {
    try {
      console.log("Fetching current flood data...");
      const response = await axios.get(`${API_BASE_URL}/api/flood/current`);

      if (response.data) {
        setCurrentData(response.data);
        setLastUpdate(new Date());
        console.log("Current data updated:", response.data);
      }
    } catch (error) {
      console.error("Error fetching current data:", error);
      // Set fallback data for demo purposes
      setCurrentData({
        rainfall: 15.2,
        waterLevel: 12.5,
        riskLevel: "moderate",
        confidence: 87,
        timestamp: new Date(),
        temperature: 28.5,
        humidity: 78,
      });
    }
  };

  // Fetch historical data for charts
  const fetchChartData = async () => {
    try {
      console.log("Fetching chart data for last 6 hours...");
      const response = await axios.get(
        `${API_BASE_URL}/api/flood/history?hours=6`
      );

      if (response.data && response.data.length > 0) {
        setChartData(response.data);
        console.log(`Chart data loaded: ${response.data.length} records`);
      } else {
        // Fallback demo data
        const demoData = generateDemoChartData();
        setChartData(demoData);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      // Generate demo data for development
      const demoData = generateDemoChartData();
      setChartData(demoData);
    }
  };

  // Fetch flood monitoring zones
  const fetchFloodZones = async () => {
    try {
      console.log("Loading flood monitoring zones...");
      const response = await axios.get(`${API_BASE_URL}/api/flood/zones`);

      if (response.data && response.data.length > 0) {
        setFloodZones(response.data);
        console.log(`Zones loaded: ${response.data.length} zones`);
      } else {
        // Fallback demo zones for Pune
        const demoZones = generateDemoZones();
        setFloodZones(demoZones);
      }
    } catch (error) {
      console.error("Error fetching zones:", error);
      // Generate demo zones for development
      const demoZones = generateDemoZones();
      setFloodZones(demoZones);
    }
  };

  // Generate demo chart data (for development/demo)
  const generateDemoChartData = () => {
    const data = [];
    const now = new Date();

    for (let i = 35; i >= 0; i -= 5) {
      const time = new Date(now.getTime() - i * 60 * 1000);
      data.push({
        time: time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: time.toISOString(),
        rainfall: Math.max(0, 8 + Math.random() * 12 + Math.sin(i / 5) * 3),
        waterLevel: Math.max(0, 5 + Math.random() * 15 + Math.sin(i / 4) * 5),
        predicted: i < 10, // Last 10 minutes are predictions
      });
    }

    return data;
  };

  // Generate demo zones for Pune (for development/demo)
  const generateDemoZones = () => {
    return [
      {
        id: 1,
        name: "Pune Station",
        lat: 18.5284,
        lng: 73.8745,
        waterLevel: 8.2,
        riskLevel: "safe",
        confidence: 91,
        radius: 400,
        population: 45000,
      },
      {
        id: 2,
        name: "Kothrud",
        lat: 18.5074,
        lng: 73.8077,
        waterLevel: 25.8,
        riskLevel: "moderate",
        confidence: 87,
        radius: 500,
        population: 78000,
      },
      {
        id: 3,
        name: "Hadapsar",
        lat: 18.5089,
        lng: 73.9262,
        waterLevel: 35.2,
        riskLevel: "high",
        confidence: 76,
        radius: 600,
        population: 125000,
      },
      {
        id: 4,
        name: "Shivajinagar",
        lat: 18.5322,
        lng: 73.8503,
        waterLevel: 12.5,
        riskLevel: "moderate",
        confidence: 89,
        radius: 450,
        population: 65000,
      },
      {
        id: 5,
        name: "Deccan Gymkhana",
        lat: 18.5157,
        lng: 73.8507,
        waterLevel: 3.8,
        riskLevel: "safe",
        confidence: 94,
        radius: 350,
        population: 32000,
      },
    ];
  };

  // Request new prediction for a specific zone
  const requestNewPrediction = async (zone) => {
    try {
      setLoading(true);
      console.log(`Requesting new prediction for ${zone.name}`);

      const response = await axios.post(`${API_BASE_URL}/api/flood/predict`, {
        lat: zone.lat,
        lng: zone.lng,
      });

      if (response.data) {
        console.log("New prediction received:", response.data);
        showSnackbar(`Prediction updated for ${zone.name}`);

        // Refresh data
        await fetchCurrentData();
        await fetchFloodZones();
      }
    } catch (error) {
      console.error("Error requesting prediction:", error);
      showSnackbar("Error updating prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh function
  const handleRefresh = async () => {
    setLoading(true);
    console.log("Manual refresh triggered...");

    try {
      await Promise.all([
        fetchCurrentData(),
        fetchChartData(),
        fetchFloodZones(),
      ]);

      showSnackbar("Data refreshed successfully!");
    } catch (error) {
      showSnackbar("Error refreshing data");
    } finally {
      setLoading(false);
    }
  };

  // Show snackbar notification
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Get risk color for zones
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "safe":
        return "#4caf50"; // Green
      case "moderate":
        return "#ff9800"; // Orange
      case "high":
        return "#f44336"; // Red
      default:
        return "#9e9e9e"; // Gray
    }
  };

  // Get risk chip color
  const getRiskChipColor = (riskLevel) => {
    switch (riskLevel) {
      case "safe":
        return "success";
      case "moderate":
        return "warning";
      case "high":
        return "error";
      default:
        return "default";
    }
  };

  // Initialize component
  useEffect(() => {
    console.log("Dashboard initializing...");

    const initializeDashboard = async () => {
      setLoading(true);

      try {
        // Fetch all initial data
        await Promise.all([
          fetchCurrentData(),
          fetchChartData(),
          fetchFloodZones(),
        ]);

        console.log("Dashboard initialization complete");
      } catch (error) {
        console.error("Dashboard initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();

    // Set up real-time updates every 5 minutes
    console.log("Starting real-time updates every 5 minutes");
    const interval = setInterval(async () => {
      console.log("Auto-refreshing data...");
      await fetchCurrentData();
      await fetchFloodZones();
    }, 300000); // 5 minutes

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Check for high risk alerts
  useEffect(() => {
    if (currentData.riskLevel === "high" && currentData.waterLevel > 30) {
      const newAlert = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        message: `High flood risk detected: ${currentData.waterLevel}cm water level`,
        severity: "error",
        location: "Current Location",
      };

      setAlerts((prev) => [newAlert, ...prev.slice(0, 4)]); // Keep last 5 alerts
      showSnackbar("⚠️ HIGH FLOOD RISK DETECTED!");
    }
  }, [currentData.riskLevel, currentData.waterLevel]);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar
        position="static"
        sx={{ background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)" }}
      >
        <Toolbar>
          <WaterDropIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🌊 Flood Prediction Dashboard
          </Typography>

          {/* Header Metrics */}
          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Rainfall
              </Typography>
              <Typography variant="h6">
                {currentData.rainfall?.toFixed(1) || "0.0"} mm/hr
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Water Level
              </Typography>
              <Typography variant="h6">
                {currentData.waterLevel?.toFixed(1) || "0.0"} cm
              </Typography>
            </Box>

            <Chip
              label={currentData.riskLevel?.toUpperCase() || "UNKNOWN"}
              color={getRiskChipColor(currentData.riskLevel)}
              variant="filled"
            />

            <IconButton
              color="inherit"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshIcon />
            </IconButton>

            <IconButton color="inherit">
              <NotificationsIcon />
              {alerts.length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "red",
                    borderRadius: "50%",
                    width: 16,
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "white",
                  }}
                >
                  {alerts.length}
                </Box>
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        {/* Alerts Section */}
        {alerts.length > 0 && (
          <Alert severity="error" icon={<WarningIcon />} sx={{ mb: 2 }}>
            <strong>Active Alerts:</strong> {alerts[0]?.message}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Map Section */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 2, height: 500, width: 1000}}>
              <Typography variant="h6" gutterBottom>
                🗺️ Flood Risk Zones
              </Typography>

              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 400,
                    width: "100%"
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <MapContainer
                  center={[18.5204, 73.8567]} // Pune coordinates
                  zoom={12} // Closer zoom for city view
                  style={{ height: "430px", width: "100%", borderRadius: 8 }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />

                  {floodZones.map((zone) => (
                    <Circle
                      key={zone.id}
                      center={[zone.lat, zone.lng]}
                      radius={zone.radius || 500}
                      pathOptions={{
                        color: getRiskColor(zone.riskLevel),
                        fillColor: getRiskColor(zone.riskLevel),
                        fillOpacity: 0.4,
                        weight: 2,
                      }}
                    >
                      <Popup>
                        <Box sx={{ minWidth: 200 }}>
                          <Typography variant="h6" gutterBottom>
                            {zone.name}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Water Level:</strong> {zone.waterLevel} cm
                          </Typography>
                          <Typography variant="body2">
                            <strong>Risk Level:</strong>{" "}
                            <Chip
                              size="small"
                              label={zone.riskLevel}
                              color={getRiskChipColor(zone.riskLevel)}
                            />
                          </Typography>
                          <Typography variant="body2">
                            <strong>Confidence:</strong> {zone.confidence}%
                          </Typography>
                          {zone.population && (
                            <Typography variant="body2">
                              <strong>Population:</strong>{" "}
                              {zone.population.toLocaleString()}
                            </Typography>
                          )}
                          <Box sx={{ mt: 2 }}>
                            <button
                              onClick={() => requestNewPrediction(zone)}
                              disabled={loading}
                              style={{
                                padding: "8px 16px",
                                backgroundColor: "#1976d2",
                                color: "white",
                                border: "none",
                                borderRadius: 4,
                                cursor: loading ? "not-allowed" : "pointer",
                              }}
                            >
                              {loading ? "Updating..." : "Update Prediction"}
                            </button>
                          </Box>
                        </Box>
                      </Popup>
                    </Circle>
                  ))}
                </MapContainer>
              )}
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={2}>
              {/* Current Status Card */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📊 Current Status
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <CloudIcon sx={{ mr: 1, color: "#2196f3" }} />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Rainfall Intensity
                        </Typography>
                        <Typography variant="h6">
                          {currentData.rainfall?.toFixed(1) || "0.0"} mm/hr
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <WaterDropIcon sx={{ mr: 1, color: "#03a9f4" }} />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Water Level
                        </Typography>
                        <Typography variant="h6">
                          {currentData.waterLevel?.toFixed(1) || "0.0"} cm
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        Prediction Confidence
                      </Typography>
                      <Typography variant="h6">
                        {currentData.confidence || 0}%
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        Risk Level
                      </Typography>
                      <Chip
                        label={
                          currentData.riskLevel?.toUpperCase() || "UNKNOWN"
                        }
                        color={getRiskChipColor(currentData.riskLevel)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="caption" color="textSecondary">
                      Last updated: {lastUpdate.toLocaleTimeString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Chart Card */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📈 Rainfall vs Water Level (6 Hours)
                    </Typography>

                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value, name) => [
                            `${value.toFixed(1)}${
                              name === "rainfall" ? " mm/hr" : " cm"
                            }`,
                            name === "rainfall" ? "Rainfall" : "Water Level",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="rainfall"
                          stackId="1"
                          stroke="#2196f3"
                          fill="#e3f2fd"
                          name="rainfall"
                        />
                        <Area
                          type="monotone"
                          dataKey="waterLevel"
                          stackId="2"
                          stroke="#f44336"
                          fill="#ffebee"
                          name="waterLevel"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Alerts Card */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      🚨 Recent Alerts
                    </Typography>

                    {alerts.length === 0 ? (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        No active alerts
                      </Typography>
                    ) : (
                      alerts.slice(0, 3).map((alert, index) => (
                        <Alert
                          key={alert.id}
                          severity={alert.severity}
                          sx={{ mb: 1, fontSize: "0.875rem" }}
                        >
                          <Typography variant="caption" display="block">
                            {alert.timestamp} - {alert.location}
                          </Typography>
                          <Typography variant="body2">
                            {alert.message}
                          </Typography>
                        </Alert>
                      ))
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Legend Card */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      🎨 Risk Zone Legend
                    </Typography>

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            backgroundColor: "#4caf50",
                          }}
                        />
                        <Typography variant="body2">Safe (&lt;5cm)</Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            backgroundColor: "#ff9800",
                          }}
                        />
                        <Typography variant="body2">
                          Moderate Risk (5-30cm)
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            backgroundColor: "#f44336",
                          }}
                        />
                        <Typography variant="body2">
                          High Risk (&gt;30cm)
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default Dashboard;
