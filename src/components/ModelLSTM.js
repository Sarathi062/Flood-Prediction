import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Divider,
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
} from "recharts";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

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

// Tab Panel Component
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

const ModelLSTM = ({ tabValue, locations, darkMode }) => {
  const theme = {
    bgcolor: darkMode ? "#1a1a2e" : "#f5f5f5",
    paper: darkMode ? "#16213e" : "#ffffff",
    text: darkMode ? "#eaeaea" : "#000000",
    border: darkMode ? "#0f3460" : "#e0e0e0",
    accent: darkMode ? "#e94560" : "#1976d2",
  };
  return (
    <TabPanel value={tabValue} index={1}>
      <Grid container spacing={2}>
        {/* LSTM Config */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: theme.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                LSTM Model Configuration
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Architecture:</strong>{" "}
                {STATIC_DATA.lstmConfig.architecture}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Input Window:</strong>{" "}
                {STATIC_DATA.lstmConfig.inputWindow}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Training Span:</strong>{" "}
                {STATIC_DATA.lstmConfig.trainingSpan}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Features:</strong>
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {STATIC_DATA.lstmConfig.features.map((f) => (
                  <Chip key={f} label={f} size="small" variant="outlined" />
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>RMSE:</strong> {STATIC_DATA.lstmConfig.rmse}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>PICP (Coverage):</strong> {STATIC_DATA.lstmConfig.picp}
              </Typography>
              <Typography variant="body2">
                <strong>Lead Time:</strong> {STATIC_DATA.lstmConfig.leadTime}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Model Health */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: theme.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Model Health & Drift
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">Data Completeness</Typography>
                  <Typography variant="body2">
                    {STATIC_DATA.modelHealth.dataCompleteness}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={STATIC_DATA.modelHealth.dataCompleteness}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">PSI (Drift)</Typography>
                  <Typography variant="body2">
                    {STATIC_DATA.modelHealth.psi}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(STATIC_DATA.modelHealth.psi * 100, 100)}
                />
              </Box>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">Calibration Error</Typography>
                  <Typography variant="body2">
                    ±{STATIC_DATA.modelHealth.calibrationError}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={100 - STATIC_DATA.modelHealth.calibrationError}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Feature Importance Chart */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: theme.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Feature Importance (SHAP)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={STATIC_DATA.featureImportance}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="feature"
                    type="category"
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <RTooltip />
                  <Bar dataKey="importance" fill={theme.accent} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Forecast with Intervals */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: theme.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                72-Hour Forecast (Primary Station)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={locations[0]?.floodForecast || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="estimatedDischarge"
                    stroke={theme.accent}
                    strokeWidth={2}
                    name="Median Forecast"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default ModelLSTM;
