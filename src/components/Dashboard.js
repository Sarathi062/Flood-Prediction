import { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Card,
  CardContent,
  Box,
  Chip,
  Alert,
  Snackbar,
  Container,
  Divider,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
} from "@mui/material";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

import Predictions from "./Predictions";
import ModelLSTM from "./ModelLSTM";
import Alerts from "./Alerts";
import Maps from "./Maps";

// Leaflet marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Static data
const STATIC_DATA = {
  stations: [
    {
      location: "Mulshi Dam",
      coordinates: { lat: 18.7298, lng: 73.6462 },
      currentDischarge: 145.3,
      rainfall24h: 12.5,
      riskLevel: "Safe",
      floodForecast: [
        {
          date: "2025-11-11",
          rainfall: 18.2,
          estimatedDischarge: 168.7,
          releaseProbability: 0.52,
          riskLevel: "Watch",
        },
        {
          date: "2025-11-12",
          rainfall: 24.1,
          estimatedDischarge: 195.2,
          releaseProbability: 0.78,
          riskLevel: "Warning",
        },
        {
          date: "2025-11-13",
          rainfall: 15.3,
          estimatedDischarge: 172.5,
          releaseProbability: 0.65,
          riskLevel: "Watch",
        },
      ],
    },
    {
      location: "Khadakwasla Dam",
      coordinates: { lat: 18.3534, lng: 73.8341 },
      currentDischarge: 120.5,
      rainfall24h: 8.3,
      riskLevel: "Safe",
      floodForecast: [
        {
          date: "2025-11-11",
          rainfall: 14.1,
          estimatedDischarge: 142.3,
          releaseProbability: 0.38,
          riskLevel: "Safe",
        },
        {
          date: "2025-11-12",
          rainfall: 21.5,
          estimatedDischarge: 175.8,
          releaseProbability: 0.65,
          riskLevel: "Warning",
        },
        {
          date: "2025-11-13",
          rainfall: 18.9,
          estimatedDischarge: 165.2,
          releaseProbability: 0.58,
          riskLevel: "Watch",
        },
      ],
    },
    {
      location: "Panshet Dam",
      coordinates: { lat: 18.2245, lng: 74.0267 },
      currentDischarge: 98.4,
      rainfall24h: 6.2,
      riskLevel: "Safe",
      floodForecast: [
        {
          date: "2025-11-11",
          rainfall: 10.5,
          estimatedDischarge: 115.3,
          releaseProbability: 0.28,
          riskLevel: "Safe",
        },
        {
          date: "2025-11-12",
          rainfall: 19.2,
          estimatedDischarge: 152.6,
          releaseProbability: 0.55,
          riskLevel: "Warning",
        },
        {
          date: "2025-11-13",
          rainfall: 12.8,
          estimatedDischarge: 128.9,
          releaseProbability: 0.42,
          riskLevel: "Safe",
        },
      ],
    },
  ],
  kpis: {
    criticalStations: 1,
    alertsPublished: 1247,
    forecastSkill: 91.2,
    atRiskPopulation: "2.4M",
  },
  lstmConfig: {
    architecture: "2-Layer LSTM (128 units) → Dense → Quantile Heads",
    inputWindow: "72 hours (stride: 6h)",
    features: [
      "Rainfall (24h)",
      "Upstream Gauge",
      "Dam Outflow",
      "Soil Moisture",
      "NDVI",
    ],
    trainingSpan: "2020–2024",
    rmse: "8.34 cm",
    picp: "91.2%",
    leadTime: "±24h",
  },
  modelHealth: {
    dataCompleteness: 98.7,
    psi: 0.08,
    calibrationError: 3.2,
  },
  featureImportance: [
    { feature: "Rainfall (24h)", importance: 34 },
    { feature: "Upstream Gauge", importance: 28 },
    { feature: "Dam Outflow", importance: 20 },
    { feature: "Soil Moisture", importance: 12 },
    { feature: "NDVI", importance: 6 },
  ],
  dataQuality: [
    {
      source: "IMD (Rainfall)",
      lastUpdate: "2025-11-11 23:45",
      lagMin: 5,
      completeness: 99.8,
      status: "healthy",
    },
    {
      source: "CWC Gauges",
      lastUpdate: "2025-11-11 23:52",
      lagMin: 2,
      completeness: 98.5,
      status: "healthy",
    },
    {
      source: "Dam Telemetry",
      lastUpdate: "2025-11-11 23:50",
      lagMin: 3,
      completeness: 97.2,
      status: "warning",
    },
    {
      source: "Satellite (NDVI)",
      lastUpdate: "2025-11-11 12:00",
      lagMin: 720,
      completeness: 95.0,
      status: "info",
    },
  ],
  alertsStats: {
    totalPublished: 1247,
    acknowledged: 1198,
    retried: 42,
    failed: 7,
  },
  channels: [
    { name: "SMS", count: 487, status: "healthy" },
    { name: "WhatsApp", count: 523, status: "healthy" },
    { name: "Email", count: 198, status: "healthy" },
    { name: "IVR", count: 39, status: "warning" },
  ],
  alertRules: [
    {
      condition: "Pred >= Warning (6h Lead)",
      topic: "flood/alerts/maharashtra/pune/warning",
      channels: "SMS, Email",
      escalation: "District Authority",
    },
    {
      condition: "Pred >= Danger (3h Lead)",
      topic: "flood/alerts/maharashtra/pune/danger",
      channels: "SMS, WhatsApp, IVR",
      escalation: "State Control Room",
    },
    {
      condition: "Data Drift Detected",
      topic: "flood/system/model/drift",
      channels: "Email",
      escalation: "Ops Team + Retrain",
    },
  ],
};

// Forecast Card Component
const ForecastCard = ({ station, onCardClick }) => (
  <Card
    sx={{
      height: "100%",
      cursor: "pointer",
      transition: "0.3s",
      "&:hover": { boxShadow: 4, transform: "translateY(-4px)" },
    }}
    onClick={() => onCardClick(station)}
  >
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {station.location}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="textSecondary">
          Discharge:
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {station.currentDischarge} m³/s
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Rainfall (24h):
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {station.rainfall24h} mm
        </Typography>
      </Box>
      <Chip
        label={station.riskLevel}
        color={
          station.riskLevel === "Safe"
            ? "success"
            : station.riskLevel === "Watch"
            ? "warning"
            : "error"
        }
        size="small"
        sx={{ mb: 1 }}
      />
      <Box sx={{ height: 120, width: 390, mt: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={station.floodForecast}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <RTooltip />
            <Line
              type="monotone"
              dataKey="estimatedDischarge"
              stroke="#1976d2"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </CardContent>
  </Card>
);

// Forecast Detail Dialog
const ForecastDetailDialog = ({ open, station, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>{station?.location} - 3-Day Forecast</DialogTitle>
    <DialogContent>
      {station?.floodForecast.map((day, idx) => (
        <Paper key={idx} sx={{ p: 2, mb: 1, bgcolor: "#f5f5f5" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {day.date}
            </Typography>
            <Chip
              label={day.riskLevel}
              size="small"
              color={
                day.riskLevel === "Safe"
                  ? "success"
                  : day.riskLevel === "Watch"
                  ? "warning"
                  : "error"
              }
            />
          </Box>
          <Typography variant="caption" display="block">
            Rainfall: {day.rainfall} mm
          </Typography>
          <Typography variant="caption" display="block">
            Discharge: {day.estimatedDischarge} m³/s
          </Typography>
          <Typography variant="caption" display="block">
            Release Probability: {(day.releaseProbability * 100).toFixed(1)}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={day.releaseProbability * 100}
            sx={{ mt: 1 }}
          />
        </Paper>
      ))}
    </DialogContent>
  </Dialog>
);

// Main Dashboard
const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState(STATIC_DATA.stations);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [selectedStation, setSelectedStation] = useState(null);
  const [forecastDialogOpen, setForecastDialogOpen] = useState(false);

  const getRiskColor = (level) => {
    switch (level) {
      case "Safe":
        return "#4caf50";
      case "Watch":
        return "#ff9800";
      case "Warning":
        return "#ff6f00";
      default:
        return "#f44336";
    }
  };

  const alertCount = locations.filter((loc) =>
    loc.floodForecast.some(
      (f) => f.riskLevel === "Warning" || f.riskLevel === "Danger"
    )
  ).length;

  const theme = {
    bgcolor: darkMode ? "#1a1a2e" : "#f5f5f5",
    paper: darkMode ? "#16213e" : "#ffffff",
    text: darkMode ? "#eaeaea" : "#000000",
    border: darkMode ? "#0f3460" : "#e0e0e0",
    accent: darkMode ? "#e94560" : "#1976d2",
  };

  return (
    <Box
      sx={{
        bgcolor: theme.bgcolor,
        minHeight: "100vh",
        color: theme.text,
        transition: "0.3s",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Alert Banner */}
        {alertCount > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>⚠️ Active Alert:</strong> {alertCount} station(s) showing
            Warning/Danger level forecasts
          </Alert>
        )}

        {/* Tabs */}
        <Paper
          sx={{ bgcolor: theme.paper, borderRadius: 2, overflow: "hidden" }}
        >
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: `1px solid ${theme.border}` }}
          >
            <Tab label="📊 Predictions" />
            <Tab label="🤖 Model & LSTM" />
            <Tab label="📡 Data Quality" />
            <Tab label="🚨 Alerts Ops" />
            <Tab label="🗺️ Map" />
          </Tabs>

          {/* Tab 1: Predictions */}

          <Predictions
            tabValue={tabValue}
            locations={locations}
            setSelectedStation={setSelectedStation}
            setForecastDialogOpen={setForecastDialogOpen}
          />
          {/* Tab 2: Model & LSTM */}
          <ModelLSTM
            tabValue={tabValue}
            locations={locations}
            setSelectedStation={setSelectedStation}
            setForecastDialogOpen={setForecastDialogOpen}
            darkMode={darkMode}
          />

          {/* Tab 4: Alerts Ops */}
          <Alerts
            tabValue={tabValue}
            locations={locations}
            setSelectedStation={setSelectedStation}
            setForecastDialogOpen={setForecastDialogOpen}
            loading={loading}
            getRiskColor={getRiskColor}
            darkMode={darkMode}
          />

          {/* Tab 5: Map */}
          <Maps
            tabValue={tabValue}
            locations={locations}
            setSelectedStation={setSelectedStation}
            setForecastDialogOpen={setForecastDialogOpen}
            loading={loading}
            getRiskColor={getRiskColor}
            darkMode={darkMode}
            setLocations={setLocations}
            setLoading={setLoading}
            setLastUpdate={setLastUpdate}
            setSnackbar={setSnackbar}
          />
        </Paper>
      </Container>

      {/* Forecast Dialog */}
      <ForecastDetailDialog
        open={forecastDialogOpen}
        station={selectedStation}
        onClose={() => setForecastDialogOpen(false)}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default Dashboard;
