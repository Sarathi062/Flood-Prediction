import { useEffect, useRef, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useUser } from "../hooks/useUser";
import RegionSelector from "./RegionSelector";
import { useLocation } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_DEP_API_URL;

/* ======================================================
   Risk Color (same as Admin Dashboard)
====================================================== */

const getRiskColor = (risk) => {
  if (risk === "Safe") return "#4caf50";
  if (risk === "Warning") return "#ff9800";
  if (risk === "Red Alert") return "#f44336";
  return "#9e9e9e";
};

/* ======================================================
   Distance Calculation
====================================================== */

const getDistance = (loc1, loc2) => {
  const R = 6371;

  const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((loc1.lat * Math.PI) / 180) *
      Math.cos((loc2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/* ======================================================
   USER DASHBOARD
====================================================== */

const UserDashboard = () => {
  const mapRef = useRef(null);

  const theme = useTheme();
  const location = useLocation();

  const { data: user } = useUser();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [floodPoints, setFloodPoints] = useState([]);

  const [selectedPoint, setSelectedPoint] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [liveAlert, setLiveAlert] = useState(null);

  const [mapLoading, setMapLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);

  const [selectedRegions, setSelectedRegions] = useState([]);

  /* ======================================================
     Scroll Navigation
  ====================================================== */

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  /* ======================================================
     Initialize Map
  ====================================================== */

  useEffect(() => {
    if (mapRef.current) return;

    const mapInstance = L.map("mapContainer", {
      center: [18.5204, 73.8567],
      zoom: 11,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(mapInstance);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance);

    mapRef.current = mapInstance;
    setMap(mapInstance);
  }, []);

  /* ======================================================
     Track User Location
  ====================================================== */

  useEffect(() => {
    if (!map) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setUserLocation(loc);

        if (map.userMarker) {
          map.userMarker.setLatLng([loc.lat, loc.lng]);
        } else {
          map.userMarker = L.circleMarker([loc.lat, loc.lng], {
            radius: 8,
            color: "#1976d2",
            fillColor: "#1976d2",
            fillOpacity: 1,
          })
            .addTo(map)
            .bindPopup("You are here");
        }

        if (!map.initialViewSet) {
          map.setView([loc.lat, loc.lng], 13);
          map.initialViewSet = true;
          setMapLoading(false);
        }
      },
      () => setMapLoading(false),
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  /* ======================================================
     Fetch Flood Data
  ====================================================== */

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/predict-flood`, {
          credentials: "include",
        });

        const json = await res.json();

        setFloodPoints(json.data || []);
      } catch (err) {
        console.error(err);
      }

      setListLoading(false);
    };

    loadData();
  }, []);

  /* ======================================================
     Enrich Points
  ====================================================== */

  const enrichedPoints = useMemo(() => {
    if (!userLocation || floodPoints.length === 0) return [];

    return floodPoints.map((p) => ({
      ...p,
      distance: getDistance(userLocation, p.coordinates),
      risk: p.floodForecast?.[0]?.riskLevel || "Safe",
    }));
  }, [userLocation, floodPoints]);

  const nearestLocations = useMemo(
    () => [...enrichedPoints].sort((a, b) => a.distance - b.distance),
    [enrichedPoints]
  );

  const top6Locations = useMemo(
    () => nearestLocations.slice(0, 6),
    [nearestLocations]
  );

  /* ======================================================
     Plot Flood Zones (Admin Style Circles)
  ====================================================== */

  useEffect(() => {
    if (!map || enrichedPoints.length === 0) return;

    enrichedPoints.forEach((p) => {
      const color = getRiskColor(p.risk);

      L.circle([p.coordinates.lat, p.coordinates.lng], {
        radius: 700,
        color: color,
        fillColor: color,
        fillOpacity: 0.4,
        weight: 2,
      })
        .addTo(map)
        .on("click", () => {
          setSelectedPoint(p);
          setDialogOpen(true);
        })
        .bindPopup(`
          <b>${p.location}</b><br/>
          Risk: ${p.risk}<br/>
          Rainfall: ${p.floodForecast?.[0]?.rainfall || "N/A"} mm
        `);
    });
  }, [map, enrichedPoints]);

  /* ======================================================
     UI
  ====================================================== */

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
        gap: 2,
        p: 2,
      }}
    >
      {/* MAP */}

      <Paper
        sx={{
          flex: 1,
          height: isMobile ? "40vh" : "80vh",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {mapLoading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "rgba(255,255,255,0.6)",
              zIndex: 10,
            }}
          >
            <CircularProgress size={60} />
          </Box>
        )}

        <div id="mapContainer" style={{ height: "100%", width: "100%" }} />
      </Paper>

      {/* RIGHT PANEL */}

      <Paper
        sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          height: isDesktop ? "80vh" : "auto",
        }}
      >
        <RegionSelector user={user} />

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">
          🌧 Top 6 Nearest Flood Risk Locations
        </Typography>

        <Box sx={{ mt: 2 }}>
          {listLoading ? (
            <>
              <Skeleton height={40} />
              <Skeleton height={40} />
              <Skeleton height={40} />
            </>
          ) : (
            top6Locations.map((p, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1,
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    {p.location}
                  </Typography>

                  <Typography variant="caption">
                    {p.distance.toFixed(2)} km away
                  </Typography>
                </Box>

                <Chip
                  label={p.risk}
                  color={
                    p.risk === "Red Alert"
                      ? "error"
                      : p.risk === "Warning"
                      ? "warning"
                      : "success"
                  }
                />
              </Box>
            ))
          )}
        </Box>
      </Paper>

      {/* FORECAST POPUP */}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{selectedPoint?.location}</DialogTitle>

        <DialogContent>
          <Typography variant="subtitle2">Risk Level:</Typography>

          <Chip
            label={selectedPoint?.risk}
            color={
              selectedPoint?.risk === "Red Alert"
                ? "error"
                : selectedPoint?.risk === "Warning"
                ? "warning"
                : "success"
            }
          />

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2">7-Day Forecast:</Typography>

          {selectedPoint?.floodForecast?.map((day, i) => (
            <Typography key={i}>
              📅 {day.date} → {day.riskLevel}, Rainfall: {day.rainfall} mm
            </Typography>
          ))}
        </DialogContent>
      </Dialog>

      {/* LIVE ALERT */}

      <Snackbar
        open={Boolean(liveAlert)}
        autoHideDuration={6000}
        onClose={() => setLiveAlert(null)}
      >
        <Alert severity="warning" variant="filled">
          {liveAlert?.title}
          <br />
          {liveAlert?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserDashboard;