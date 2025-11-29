import React, { useEffect, useState, useMemo } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Divider,
  LinearProgress,
  CircularProgress,
  Alert,
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

import axios from "axios";

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
  </div>
);

const ModelLSTM = ({ tabValue, darkMode }) => {
  const [evalData, setEvalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------------------
     THEME (always at top)
  ----------------------------*/
  const theme = {
    bgcolor: darkMode ? "#1a1a2e" : "#f5f5f5",
    paper: darkMode ? "#16213e" : "#ffffff",
    text: darkMode ? "#eaeaea" : "#000",
    border: darkMode ? "#0f3460" : "#e0e0e0",
    accent: darkMode ? "#e94560" : "#1976d2",
  };

  /* ---------------------------
     FETCH (always at top)
  ----------------------------*/
  useEffect(() => {
    const fetchEval = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_DEP_API_URL}/api/evaluation/runEvaluation`
        );
        setEvalData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEval();
  }, []);

  /* ---------------------------
     useMemo MUST ALWAYS RUN
     (cannot be inside conditions)
  ----------------------------*/
  const timelineData = useMemo(() => {
    if (!evalData) return [];
    return evalData.timeline.map((row) => ({
      time: new Date(row.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      actual: row.actualDischarge,
      predicted: row.predictedDischarge,
      probability: Number(row.releaseProbability * 100).toFixed(2),
    }));
  }, [evalData]);

  /* ---------------------------
     Now SAFE to conditionally return
  ----------------------------*/

  if (tabValue !== 1) {
    return <TabPanel value={tabValue} index={1}></TabPanel>;
  }

  if (loading) {
    return (
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Evaluating LSTM Model...</Typography>
        </Box>
      </TabPanel>
    );
  }

  if (error) {
    return (
      <TabPanel value={tabValue} index={1}>
        <Alert severity="error">{error}</Alert>
      </TabPanel>
    );
  }

  const data = evalData;

  /* -------------------------------------------
     UI BELOW THIS POINT
  -------------------------------------------*/
  return (
    <TabPanel value={tabValue} index={1}>
      <Grid container spacing={2}>
        {/* LSTM CONFIG */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: theme.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                LSTM Model Configuration
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Typography>
                <strong>Type:</strong> {data.modelInfo.type}
              </Typography>
              <Typography>
                <strong>Version:</strong> v{data.modelInfo.version}
              </Typography>
              <Typography>
                <strong>Seq Length:</strong> {data.modelInfo.sequenceLength}
              </Typography>
              <Typography>
                <strong>Trained At:</strong>{" "}
                {new Date(data.modelInfo.trainedAt).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2">Features:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {data.modelInfo.features.map((f) => (
                  <Chip key={f} label={f} size="small" variant="outlined" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* MODEL HEALTH */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: theme.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Model Health
              </Typography>
              <Divider sx={{ my: 1 }} />

              {/* Accuracy */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Accuracy</Typography>
                  <Typography>{data.metrics.accuracy.toFixed(2)}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={data.metrics.accuracy}
                />
              </Box>

              {/* RMSE */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>RMSE</Typography>
                  <Typography>{data.metrics.rmse.toFixed(2)}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(data.metrics.rmse / 20, 100)}
                />
              </Box>

              {/* Samples */}
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Evaluation Samples</Typography>
                  <Typography>{data.metrics.totalSamples}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* TIMELINE CHART */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: theme.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actual vs Predicted Discharge
              </Typography>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <RTooltip />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#f44336"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke={theme.accent}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* PROBABILITY BAR CHART */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: theme.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Release Probability (%)
              </Typography>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <RTooltip />
                  <Bar dataKey="probability" fill={theme.accent} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* CONFUSION MATRIX */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: theme.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Confusion Matrix
              </Typography>

              <Grid container spacing={2}>
                {Object.entries(data.metrics.confusionMatrix).map(([k, v]) => (
                  <Grid item xs={6} sm={3} key={k}>
                    <Card
                      sx={{ p: 2, textAlign: "center", bgcolor: theme.bgcolor }}
                    >
                      <Typography variant="caption">{k}</Typography>
                      <Typography variant="h5">{v}</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default ModelLSTM;
