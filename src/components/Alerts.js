import { useState } from "react";
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
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Chip,
  CircularProgress,
} from "@mui/material";

import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
} from "@mui/icons-material";

import axios from "axios";

// TabPanel
const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

// Static Data
const STATIC_DATA = {
  stations: ["Pune", "Kolhapur"],

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
  const [region, setRegion] = useState("");
  const [alertLevel, setAlertLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = {
    paper: darkMode ? "#16213e" : "#ffffff",
    accent: darkMode ? "#e94560" : "#1976d2",
  };

  const getLevelColor = (level) => {
    if (level === "GREEN") return "success";
    if (level === "ORANGE") return "warning";
    if (level === "RED") return "error";
    return "default";
  };

  const handleSendNotification = async () => {
    if (!region || !alertLevel || !subject || !message) {
      setSnackbar({
        open: true,
        message: "Please fill all fields",
        severity: "warning",
      });
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${process.env.REACT_APP_DEP_API_URL}/api/user/subscribe-region-mail`,
        {
          region,
          level: alertLevel,
          subject,
          message,
        },
        { withCredentials: true },
      );

      setSnackbar({
        open: true,
        message: "Alert sent successfully",
        severity: "success",
      });

      setRegion("");
      setAlertLevel("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to send alert",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TabPanel value={tabValue} index={3}>
      <Grid container spacing={3}>
        {/* Alert Statistics */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: theme.paper }}>
            <CardContent>
              <Typography variant="h6">Alert Statistics</Typography>
              <Divider sx={{ my: 1 }} />

              <Typography>
                Total Published: {STATIC_DATA.alertsStats.totalPublished}
              </Typography>

              <Typography>
                Acknowledged: {STATIC_DATA.alertsStats.acknowledged}
              </Typography>

              <Typography>
                Retried: {STATIC_DATA.alertsStats.retried}
              </Typography>

              <Typography color="error">
                Failed: {STATIC_DATA.alertsStats.failed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Channel Metrics */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: theme.paper }}>
            <CardContent>
              <Typography variant="h6">Channel Delivery</Typography>
              <Divider sx={{ my: 1 }} />

              {STATIC_DATA.channels.map((channel) => (
                <Box
                  key={channel.name}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>{channel.name}</Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {channel.count}

                    {channel.status === "healthy" ? (
                      <CheckCircleIcon sx={{ color: "green", fontSize: 18 }} />
                    ) : (
                      <WarningIcon sx={{ color: "orange", fontSize: 18 }} />
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
              <Typography variant="h6">Alert Rules & Escalation</Typography>

              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.accent }}>
                    <TableCell sx={{ color: "white" }}>Condition</TableCell>
                    <TableCell sx={{ color: "white" }}>Topic</TableCell>
                    <TableCell sx={{ color: "white" }}>Channels</TableCell>
                    <TableCell sx={{ color: "white" }}>Escalation</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {STATIC_DATA.alertRules.map((rule, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{rule.condition}</TableCell>
                      <TableCell>{rule.topic}</TableCell>
                      <TableCell>{rule.channels}</TableCell>
                      <TableCell>{rule.escalation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* SEND ALERT PANEL */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: theme.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Send Regional Flood Alert
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                {/* Region */}
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  >
                    {STATIC_DATA.stations.map((station) => (
                      <MenuItem key={station} value={station}>
                        {station}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Alert Level */}
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Alert Level"
                    value={alertLevel}
                    onChange={(e) => setAlertLevel(e.target.value)}
                  >
                    <MenuItem value="GREEN">Green (Safe)</MenuItem>
                    <MenuItem value="ORANGE">Orange (Warning)</MenuItem>
                    <MenuItem value="RED">Red (Danger)</MenuItem>
                  </TextField>
                </Grid>

                {/* Subject */}
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Email Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </Grid>

                {/* Message */}
                <Grid item xs={12}>
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    label="Alert Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Grid>

                {/* Preview */}
                {alertLevel && (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Alert Level Preview
                    </Typography>

                    <Chip
                      label={alertLevel}
                      color={getLevelColor(alertLevel)}
                      sx={{ fontWeight: "bold" }}
                    />
                  </Grid>
                )}

                {/* Send Button */}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={
                      loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <SendIcon />
                      )
                    }
                    onClick={handleSendNotification}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Alert Notification"}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </TabPanel>
  );
};

export default Alerts;
