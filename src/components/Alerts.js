import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  WaterDrop as WaterDropIcon,
  Cloud as CloudIcon,
  Warning as WarningIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

import "leaflet/dist/leaflet.css";
import axios from "axios";

// Tab Panel Component
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};
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
const Alerts = ({ tabValue, darkMode }) => {
  const theme = {
    bgcolor: darkMode ? "#1a1a2e" : "#f5f5f5",
    paper: darkMode ? "#16213e" : "#ffffff",
    text: darkMode ? "#eaeaea" : "#000000",
    border: darkMode ? "#0f3460" : "#e0e0e0",
    accent: darkMode ? "#e94560" : "#1976d2",
  };
  return (
    <TabPanel value={tabValue} index={3}>
      <Grid container spacing={2}>
        {/* Alert Statistics */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: theme.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Alert Statistics (Pub/Sub Pipeline)
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2">Total Published:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {STATIC_DATA.alertsStats.totalPublished}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2">Acknowledged:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {STATIC_DATA.alertsStats.acknowledged} (
                  {(
                    (STATIC_DATA.alertsStats.acknowledged /
                      STATIC_DATA.alertsStats.totalPublished) *
                    100
                  ).toFixed(1)}
                  %)
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2">Retried:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {STATIC_DATA.alertsStats.retried}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Failed:</Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#f44336" }}
                >
                  {STATIC_DATA.alertsStats.failed} (
                  {(
                    (STATIC_DATA.alertsStats.failed /
                      STATIC_DATA.alertsStats.totalPublished) *
                    100
                  ).toFixed(2)}
                  %)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Channel Delivery */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: theme.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Channel Delivery Metrics
              </Typography>
              <Divider sx={{ my: 1 }} />
              {STATIC_DATA.channels.map((channel) => (
                <Box
                  key={channel.name}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">{channel.name}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {channel.count}
                    </Typography>
                    {channel.status === "healthy" ? (
                      <CheckCircleIcon
                        sx={{ color: "#4caf50", fontSize: 18 }}
                      />
                    ) : (
                      <WarningIcon sx={{ color: "#ff9800", fontSize: 18 }} />
                    )}
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Alert Rules */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: theme.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Alert Rules & Escalation Matrix
              </Typography>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: theme.accent,
                      "& th": { color: "white" },
                    }}
                  >
                    <TableCell>Condition</TableCell>
                    <TableCell>Topic</TableCell>
                    <TableCell>Channels</TableCell>
                    <TableCell>Escalation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {STATIC_DATA.alertRules.map((rule, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{rule.condition}</TableCell>
                      <TableCell sx={{ fontSize: "0.85rem" }}>
                        {rule.topic}
                      </TableCell>
                      <TableCell>{rule.channels}</TableCell>
                      <TableCell>{rule.escalation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default Alerts;
