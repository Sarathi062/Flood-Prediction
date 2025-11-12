// src/components/Predictions.js
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  Pagination,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------------- ForecastCard ---------------- */
const ForecastCard = ({ station, onCardClick, theme }) => {
  const name = station?.location ?? station?.name ?? "Unknown";
  const forecast = Array.isArray(station?.floodForecast) ? station.floodForecast : [];
  const today = forecast[0] ?? null;
  const risk = today?.riskLevel ?? station?.riskLevel ?? "Unknown";
  const discharge = today?.estimatedDischarge ?? station?.currentDischarge ?? "N/A";
  const rainfall24h = today?.rainfall ?? station?.rainfall24h ?? "N/A";

  return (
    <Card
      sx={{
        height: "100%",
        cursor: "pointer",
        transition: "0.24s",
        background: theme.paper,
        color: theme.text,
        border: `1px solid ${theme.border}`,
        "&:hover": { boxShadow: 4, transform: "translateY(-6px)" },
      }}
      onClick={() => onCardClick?.(station)}
      elevation={0}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ mb: 0.5 }}>
          {name}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            Discharge
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {String(discharge)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Rainfall (24h)
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {String(rainfall24h)}
          </Typography>
        </Box>

        <Chip
          label={String(risk)}
          color={risk === "Safe" ? "success" : risk === "Warning" ? "warning" : risk === "Red Alert" ? "error" : "default"}
          size="small"
          sx={{ mb: 1 }}
        />

        <Box sx={{ height: 110, width: "100%", mt: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <RTooltip />
              <Line type="monotone" dataKey="estimatedDischarge" stroke={theme.accent} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

/* ---------------- TabPanel ---------------- */
const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
  </div>
);

/* ---------------- Predictions (main) ---------------- */
const Predictions = ({
  tabValue = 0,
  locations = [],
  setSelectedStation,
  setForecastDialogOpen,
  darkMode = false,
}) => {
  const theme = {
    bgcolor: darkMode ? "#0f1724" : "#f5f5f5",
    paper: darkMode ? "#0b1220" : "#ffffff",
    text: darkMode ? "#e6eef8" : "#0f172a",
    border: darkMode ? "#122136" : "#e6eef8",
    accent: darkMode ? "#7dd3fc" : "#1976d2",
  };

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("risk"); // 'risk' | 'alpha'
  const [showAll, setShowAll] = useState(false);

  const riskPriority = (f) => {
    const r = (f?.floodForecast?.[0]?.riskLevel ?? f?.riskLevel ?? "").toString().toLowerCase();
    if (r.includes("red")) return 1;
    if (r.includes("warn")) return 2;
    if (r.includes("safe")) return 3;
    return 4;
  };

  const filteredLocations = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    const filtered = (locations || []).filter((loc) => {
      if (!q) return true;
      return (loc.location || loc.name || "").toString().toLowerCase().includes(q);
    });

    if (sortBy === "alpha") {
      filtered.sort((a, b) => (a.location || a.name || "").toString().localeCompare((b.location || b.name || "").toString()));
    } else {
      filtered.sort((a, b) => riskPriority(a) - riskPriority(b));
    }
    return filtered;
  }, [locations, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredLocations.length / rowsPerPage));
  const currentPageItems = showAll ? filteredLocations : filteredLocations.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  useEffect(() => {
    setPage(1);
  }, [search, rowsPerPage, sortBy]);

  return (
    <TabPanel value={tabValue} index={0}>
      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1, minWidth: 240 }}>
          <TextField
            size="small"
            placeholder="Search location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 220 }}
          />

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="sort-label">Sort</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              label="Sort"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="risk">Risk (High → Low)</MenuItem>
              <MenuItem value="alpha">Alphabetical</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 110 }}>
            <InputLabel id="page-size-label">Per page</InputLabel>
            <Select
              labelId="page-size-label"
              value={rowsPerPage}
              label="Per page"
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
            >
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={12}>12</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Box sx={{ ml: "auto", textAlign: "right", minWidth: 160 }}>
          <Box sx={{ fontSize: 13, color: "text.secondary" }}>
            Results: {filteredLocations.length}
          </Box>
          <Box>
            <IconButton size="small" onClick={() => setShowAll((s) => !s)} title="Toggle show all">
              {showAll ? "Paged" : "Show all"}
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxHeight: showAll ? "none" : 560, overflowY: showAll ? "visible" : "auto", pr: 1 }}>
        <Grid container spacing={2}>
          {currentPageItems.map((station) => (
            // Responsive: 1 column on mobile, 3 columns on md+ (laptop/desktop)
            <Grid item xs={12} sm={12} md={4} key={station.location ?? station.name}>
              <ForecastCard
                station={{
                  location: station.location ?? station.name ?? "Unknown",
                  currentDischarge: station.currentDischarge ?? station.floodForecast?.[0]?.estimatedDischarge ?? "N/A",
                  rainfall24h: station.rainfall24h ?? station.floodForecast?.[0]?.rainfall ?? "N/A",
                  riskLevel: station.floodForecast?.[0]?.riskLevel ?? station.riskLevel ?? "Unknown",
                  floodForecast: Array.isArray(station.floodForecast) ? station.floodForecast : [],
                }}
                onCardClick={(s) => {
                  setSelectedStation?.(station);
                  setForecastDialogOpen?.(true);
                }}
                theme={theme}
              />
            </Grid>
          ))}

          {currentPageItems.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
                No stations match your search.
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {!showAll && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </TabPanel>
  );
};

export default Predictions;
