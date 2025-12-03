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
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate, useLocation } from "react-router-dom";
const BACKEND_URL = process.env.REACT_APP_DEP_API_URL;

/* ============================================================
   Distance (Haversine)
============================================================ */
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

const iconUrlForRisk = {
  Safe: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  Watch: "https://cdn-icons-png.flaticon.com/512/190/190406.png",
  Warning: "https://cdn-icons-png.flaticon.com/512/190/190403.png",
};

const userIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/535/535239.png",
  iconSize: [32, 32],
});

/* ============================================================
   MAIN USER DASHBOARD
============================================================ */
const UserDashboard = () => {
  const mapRef = useRef(null);
  const theme = useTheme();
  const location = useLocation();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // >900px

  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [floodPoints, setFloodPoints] = useState([]);

  const [selectedPoint, setSelectedPoint] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [liveAlert, setLiveAlert] = useState(null);

  const [mapLoading, setMapLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);

  const [selectedRegions, setSelectedRegions] = useState([]);
  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 100); // small delay to ensure DOM is ready
      }
    }
  }, [location]);

  /* -----------------------------------------------------------
   1️⃣ Initialize Map
------------------------------------------------------------ */
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

  /* -----------------------------------------------------------
   2️⃣ Live user location tracking
------------------------------------------------------------ */
  useEffect(() => {
    if (!map) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);

        if (map.userMarker) {
          map.userMarker.setLatLng([loc.lat, loc.lng]);
        } else {
          map.userMarker = L.marker([loc.lat, loc.lng], { icon: userIcon })
            .addTo(map)
            .bindPopup("You are here");
        }

        if (!map.initialViewSet) {
          map.setView([loc.lat, loc.lng], 13);
          setMapLoading(false);
          map.initialViewSet = true;
        }
      },
      () => setMapLoading(false),
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  /* -----------------------------------------------------------
   3️⃣ Fetch flood point data
------------------------------------------------------------ */
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

  /* -----------------------------------------------------------
   4️⃣ Enrich with distance + risk
------------------------------------------------------------ */
  const enrichedPoints = useMemo(() => {
    if (!userLocation || floodPoints.length === 0) return [];
    return floodPoints.map((p) => ({
      ...p,
      distance: getDistance(userLocation, p.coordinates),
      risk: p.floodForecast[0].riskLevel,
    }));
  }, [userLocation, floodPoints]);

  // Sorted by distance
  const nearestLocations = useMemo(
    () => enrichedPoints.sort((a, b) => a.distance - b.distance),
    [enrichedPoints]
  );

  // Top 6 nearest
  const top6Locations = useMemo(
    () => nearestLocations.slice(0, 6),
    [nearestLocations]
  );

  // List of regions
  const regions = useMemo(() => {
    return [...new Set(floodPoints.map((p) => p.region))];
  }, [floodPoints]);

  /* -----------------------------------------------------------
   5️⃣ Plot Markers (runs once floodPoints available)
------------------------------------------------------------ */
  useEffect(() => {
    if (!map || enrichedPoints.length === 0) return;

    enrichedPoints.forEach((p) => {
      const icon = L.icon({
        iconUrl: iconUrlForRisk[p.risk],
        iconSize: [28, 28],
      });

      L.marker([p.coordinates.lat, p.coordinates.lng], { icon })
        .addTo(map)
        .on("click", () => {
          setSelectedPoint(p);
          setDialogOpen(true);
        });
    });
  }, [map, enrichedPoints]);

  /* -----------------------------------------------------------
   6️⃣ Live alert when entering flood region
------------------------------------------------------------ */
  useEffect(() => {
    if (!userLocation || enrichedPoints.length === 0) return;

    enrichedPoints.forEach((p) => {
      if (!selectedRegions.includes(p.region)) return;

      if (p.distance < 0.7 && p.risk !== "Safe") {
        setLiveAlert({
          title: `⚠ Flood Warning in ${p.region}`,
          message: `${p.location} (${p.risk})`,
        });
      }
    });
  }, [enrichedPoints, selectedRegions]);

  // const toggleRegion = (region) => {
  //   setSelectedRegions((prev) =>
  //     prev.includes(region)
  //       ? prev.filter((r) => r !== region)
  //       : [...prev, region]
  //   );
  // };

  /* -----------------------------------------------------------
   UI Layout
------------------------------------------------------------ */

  return (
    <Box
      id="dashboard"
      sx={{
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
        gap: 2,
        p: 2,
      }}
    >
      {/* LEFT: MAP */}
      <Paper
        sx={{
          flex: isDesktop ? 1 : "none",
          width: "100%",
          height: isMobile ? "40vh" : "80vh",
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          filter: mapLoading ? "blur(3px)" : "none",
          pointerEvents: mapLoading ? "none" : "auto",
        }}
      >
        {mapLoading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,255,255,0.6)",
              zIndex: 10,
            }}
          >
            <CircularProgress size={60} />
          </Box>
        )}

        <div id="mapContainer" style={{ height: "100%", width: "100%" }} />
      </Paper>

      {/* RIGHT: REGIONS + TOP 6 LIST */}
      <Paper
        sx={{
          flex: isDesktop ? 1 : "none",
          width: "100%",
          p: 2,
          borderRadius: 2,
          mt: isMobile ? 2 : 0,
          height: isDesktop ? "80vh" : "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" gutterBottom>
          📍 Select Regions for Alerts
        </Typography>

        {/* {regions.map((region, i) => ( */}
        <FormControlLabel
          // key={i}
          control={
            <Checkbox
            // onChange={() => toggleRegion(region)}
            />
          }
          label={"Pune"}
        />
        {/* ))} */}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          🌧 Top 6 Nearest Flood Risk Locations
        </Typography>

        <Box
          sx={{
            maxHeight: isDesktop ? "70vh" : "50vh",
            overflowY: "auto",
            filter: listLoading ? "blur(3px)" : "none",
            pointerEvents: listLoading ? "none" : "auto",
          }}
        >
          {listLoading ? (
            <>
              <Skeleton height={40} sx={{ mb: 1 }} />
              <Skeleton height={40} sx={{ mb: 1 }} />
              <Skeleton height={40} sx={{ mb: 1 }} />
            </>
          ) : (
            <>
              {top6Locations.map((p, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                      p.risk === "Warning"
                        ? "error"
                        : p.risk === "Watch"
                        ? "warning"
                        : "success"
                    }
                  />
                </Box>
              ))}
            </>
          )}
        </Box>
      </Paper>

      {/* POPUP */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{selectedPoint?.location}</DialogTitle>

        <DialogContent>
          <Typography variant="subtitle2">Risk Level:</Typography>
          <Chip
            label={selectedPoint?.risk}
            color={
              selectedPoint?.risk === "Warning"
                ? "error"
                : selectedPoint?.risk === "Watch"
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

      {/* ALERT */}
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
