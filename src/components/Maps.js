// src/components/Maps.js
import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import { MapContainer, TileLayer, Circle, Popup, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

/* ----------------- Simple TabPanel (local) ----------------- */
const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
  </div>
);

/* ----------------- API base ----------------- */
const API_BASE_URL = process.env.REACT_APP_DEP_API_URL || "";

/* ----------------- Helper to extract lat/lng ----------------- */
/* Matches your sample: loc.coordinates = { lat, lng } */
const getLatLng = (loc) => {
  if (!loc) return null;

  // 1) loc.coordinates = { lat, lng } (your sample)
  if (
    loc.coordinates &&
    typeof loc.coordinates === "object" &&
    !Array.isArray(loc.coordinates)
  ) {
    const lat = Number(loc.coordinates.lat);
    const lng = Number(loc.coordinates.lng);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) return [lat, lng];
  }

  // 2) loc.lat & loc.lng (fallback)
  if (loc.lat !== undefined && loc.lng !== undefined) {
    const lat = Number(loc.lat);
    const lng = Number(loc.lng);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) return [lat, lng];
  }

  // 3) GeoJSON geometry: [lng, lat]
  if (loc.geometry && Array.isArray(loc.geometry.coordinates)) {
    const [lng, lat] = loc.geometry.coordinates;
    const latN = Number(lat);
    const lngN = Number(lng);
    if (!Number.isNaN(latN) && !Number.isNaN(lngN)) return [latN, lngN];
  }

  // 4) coordinates as array [lat, lng]
  if (Array.isArray(loc.coordinates)) {
    const [a, b] = loc.coordinates;
    const aN = Number(a);
    const bN = Number(b);
    if (!Number.isNaN(aN) && !Number.isNaN(bN)) return [aN, bN];
  }

  return null;
};

/* ----------------- Small default SVG icon to avoid missing assets ----------------- */
const DefaultIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><circle cx="12" cy="10" r="5" fill="#1976d2"/></svg>`
    ),
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

/* ----------------- Maps component ----------------- */
const Maps = ({
  tabValue = 0,
  locations = [],
  setSelectedStation,
  setForecastDialogOpen,
  getRiskColor = (level) => {
    if (!level) return "#bdbdbd";
    if (level === "Safe") return "#4caf50";
    if (level === "Warning") return "#ff9800";
    if (level === "Red Alert") return "#f44336";
    return "#bdbdbd";
  },
  loading = false,
  setLoading,
  setLocations,
  setAlerts,
  setLastUpdate,
  setSnackbar,
}) => {
  const [localLoading, setLocalLoading] = useState(false);
  const isLoading = typeof loading === "boolean" ? loading : localLoading;
  const mapRef = useRef(null);

  /* Fetch predictions from API and populate state via provided setters */
  const fetchPredictions = async () => {
    if (setLoading) setLoading(true);
    else setLocalLoading(true);

    try {
      const res = await axios.get(`${API_BASE_URL}/api/predict-flood`, {
        withCredentials: true,
      });

      // sample shows data under res.data.data
      const dataArray = res?.data?.data ?? res?.data ?? [];

      if (Array.isArray(dataArray)) {
        setLocations?.(dataArray);

        // Build alerts defensively
        const allAlerts = [];
        dataArray.forEach((loc) => {
          const ff = Array.isArray(loc.floodForecast) ? loc.floodForecast : [];
          ff.forEach((forecast) => {
            if (["Red Alert", "Warning", "Safe"].includes(forecast.riskLevel)) {
              allAlerts.push({
                id: `${loc.location ?? loc.name}-${forecast.date}`,
                location: loc.location ?? loc.name,
                date: forecast.date,
                riskLevel: forecast.riskLevel,
              });
            }
          });
        });
        setAlerts?.(allAlerts.slice(-5).reverse());
      } else {
        console.warn("predict-flood returned non-array data:", dataArray);
        setLocations?.([]);
      }
      setLastUpdate?.(new Date());
    } catch (err) {
      console.error("fetchPredictions error:", err);
      setSnackbar?.({ open: true, message: "Failed to fetch predictions" });
      setLocations?.([]);
    } finally {
      if (setLoading) setLoading(false);
      else setLocalLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
    // poll every 5 minutes (optional); remove if parent handles polling
    const interval = setInterval(fetchPredictions, 5 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Fit map bounds when locations change */
  useEffect(() => {
    if (!mapRef.current || !Array.isArray(locations) || locations.length === 0)
      return;
    const latLngs = locations.map((l) => getLatLng(l)).filter(Boolean);
    if (latLngs.length > 0) {
      try {
        mapRef.current.fitBounds(latLngs, { padding: [40, 40] });
      } catch (e) {
        console.warn("fitBounds failed:", e);
      }
    }
  }, [locations]);

  const safeLocations = Array.isArray(locations) ? locations : [];

  return (
    <TabPanel value={tabValue} index={4}>
      <Paper sx={{ p: 2, height: 600 }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <MapContainer
            center={[18.5204, 73.8567]}
            zoom={12}
            style={{ height: "100%", width: "100%", borderRadius: 8 }}
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* Show a default marker when no locations returned */}
            {safeLocations.length === 0 && (
              <Marker position={[18.5204, 73.8567]} icon={DefaultIcon}>
                <Popup>
                  <Typography>No location data available</Typography>
                </Popup>
              </Marker>
            )}

            {safeLocations.map((loc, idx) => {
              // From your sample: coordinates: { lat: Number, lng: Number }
              const latLng = getLatLng(loc);
              const name = loc.location ?? loc.name ?? `Station ${idx + 1}`;
              // Flood forecast first day may give today's risk; fallback to unknown
              const todayForecast =
                Array.isArray(loc.floodForecast) && loc.floodForecast.length > 0
                  ? loc.floodForecast[0]
                  : null;
              const risk =
                todayForecast?.riskLevel ?? loc.riskLevel ?? "Unknown";

              // defensive values for display
              const discharge =
                todayForecast?.estimatedDischarge ??
                loc.currentDischarge ??
                "N/A";
              const rainfall24h =
                todayForecast?.rainfall ?? loc.rainfall24h ?? "N/A";
              const prob = todayForecast?.releaseProbability ?? 0;

              // If coords missing, show fallback Marker at center with note
              if (!latLng) {
                return (
                  <Marker
                    key={`fallback-${idx}`}
                    position={[18.5204, 73.8567]}
                    icon={DefaultIcon}
                  >
                    <Popup>
                      <Typography variant="subtitle1">{name}</Typography>
                      <Typography variant="body2">
                        Coordinates not available
                      </Typography>
                    </Popup>
                  </Marker>
                );
              }

              const [lat, lng] = latLng;
              const color = getRiskColor(risk);

              return (
                <Circle
                  key={`${name}-${idx}`}
                  center={[lat, lng]}
                  radius={700}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.4,
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedStation?.(loc);
                      // open forecast dialog if parent uses this pattern
                      setForecastDialogOpen?.(true);
                    },
                  }}
                >
                  <Popup>
                    <Box sx={{ minWidth: 220 }}>
                      <Typography variant="h6" gutterBottom>
                        {name}
                      </Typography>

                      <Typography variant="body2">
                        <strong>Risk Today:</strong>{" "}
                        <Chip
                          label={String(risk)}
                          size="small"
                          color={
                            risk === "Safe"
                              ? "success"
                              : risk === "Warning"
                              ? "warning"
                              : risk === "Red Alert"
                              ? "error"
                              : "default"
                          }
                          sx={{ ml: 1 }}
                        />
                      </Typography>

                      <Typography variant="body2">
                        <strong>Discharge:</strong>{" "}
                        {discharge === "N/A" ? "N/A" : String(discharge)}
                      </Typography>

                      <Typography variant="body2">
                        <strong>Rainfall (24h):</strong> {String(rainfall24h)}
                      </Typography>

                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        Probability: {Math.round((Number(prob) || 0) * 100)}%
                      </Typography>

                      <Box sx={{ mt: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedStation?.(loc);
                            setForecastDialogOpen?.(true);
                          }}
                        >
                          View Forecast
                        </Button>
                      </Box>
                    </Box>
                  </Popup>
                </Circle>
              );
            })}
          </MapContainer>
        )}
      </Paper>
    </TabPanel>
  );
};

export default Maps;
