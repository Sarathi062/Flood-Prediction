import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ============================================================
   🔴 STATIC FLOOD LOCATIONS (replace with API later)
============================================================ */
const STATIC_FLOOD_POINTS = [
  {
    id: "mulshi",
    name: "Mulshi Dam",
    lat: 18.7298,
    lng: 73.6462,
    risk: "Warning",
    floodProbability: 0.82,
    rainfallNext7: [18, 24, 19, 12, 10, 9, 8],
  },
  {
    id: "khadakwasla",
    name: "Khadakwasla Dam",
    lat: 18.3534,
    lng: 73.8341,
    risk: "Watch",
    floodProbability: 0.64,
    rainfallNext7: [12, 18, 11, 10, 9, 8, 7],
  },
  {
    id: "panshet",
    name: "Panshet Dam",
    lat: 18.2245,
    lng: 74.0267,
    risk: "Safe",
    floodProbability: 0.22,
    rainfallNext7: [8, 9, 7, 6, 5, 4, 4],
  },
];

/* ============================================================
   🧭 DISTANCE CALCULATION (Haversine Formula)
============================================================ */
const getDistance = (loc1, loc2) => {
  const R = 6371; // Earth radius (km)
  const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((loc1.lat * Math.PI) / 180) *
      Math.cos((loc2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/* ============================================================
   🗺️ MAP COMPONENT
============================================================ */
const Maps = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [notifyPrefs, setNotifyPrefs] = useState([]); // selected location ids

  /* -----------------------------------------------------------
     1️⃣ INITIALIZE MAP
  ------------------------------------------------------------ */
  useEffect(() => {
    if (mapRef.current) return; // prevent duplicate map

    const mapInstance = L.map("mapContainer", {
      center: [18.5204, 73.8567], // Pune fallback
      zoom: 11,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance);

    mapRef.current = mapInstance;
    setMap(mapInstance);
  }, []);

  /* -----------------------------------------------------------
     2️⃣ GET USER LOCATION & ADD MARKER
  ------------------------------------------------------------ */
  useEffect(() => {
    if (!map) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);

        L.marker([loc.lat, loc.lng], {
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/535/535239.png",
            iconSize: [32, 32],
          }),
        })
          .addTo(map)
          .bindPopup("<b>You are here</b>")
          .openPopup();

        map.setView([loc.lat, loc.lng], 13);
      },
      () => console.log("Location access denied")
    );
  }, [map]);

  /* -----------------------------------------------------------
     3️⃣ PLOT ALL FLOOD POINT MARKERS
  ------------------------------------------------------------ */
  useEffect(() => {
    if (!map) return;

    STATIC_FLOOD_POINTS.forEach((point) => {
      L.marker([point.lat, point.lng])
        .addTo(map)
        .on("click", () => {
          setSelectedPoint(point);
          setDialogOpen(true);
        });
    });
  }, [map]);

  /* -----------------------------------------------------------
     4️⃣ CALCULATE NEAREST FLOOD LOCATIONS
  ------------------------------------------------------------ */
  const nearestLocations = userLocation
    ? STATIC_FLOOD_POINTS.map((p) => ({
        ...p,
        distance: getDistance(userLocation, { lat: p.lat, lng: p.lng }),
      })).sort((a, b) => a.distance - b.distance)
    : [];

  /* -----------------------------------------------------------
     5️⃣ HANDLE NOTIFICATION TOGGLE
  ------------------------------------------------------------ */
  const toggleNotification = (id) => {
    if (notifyPrefs.includes(id)) {
      setNotifyPrefs((prev) => prev.filter((x) => x !== id));
    } else {
      setNotifyPrefs((prev) => [...prev, id]);
    }
  };
 
  return (
    <Box sx={{ p: 2 }}>
      {/* =======================
          🗺️ THE MAP UI
      ========================== */}
      <Paper sx={{ height: "500px", borderRadius: 2, overflow: "hidden" }}>
        <div id="mapContainer" style={{ height: "100%", width: "100%" }}></div>
      </Paper>

      {/* =======================
          📌 NEAREST FLOOD LOCATIONS
      ========================== */}
      {userLocation && (
        <Paper sx={{ mt: 3, p: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            ⚠️ Nearest Flood-Prone Locations
          </Typography>

          {nearestLocations.map((p) => (
            <Box
              key={p.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{p.name}</Typography>
                <Typography variant="caption" color="textSecondary">
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
        </Paper>
      )}

      {/* =======================
          🔍 FLOOD POINT POPUP
      ========================== */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{selectedPoint?.name}</DialogTitle>

        <DialogContent>
          {/* Risk Level */}
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            Risk Level:
          </Typography>
          <Chip
            label={selectedPoint?.risk}
            color={
              selectedPoint?.risk === "Warning"
                ? "error"
                : selectedPoint?.risk === "Watch"
                ? "warning"
                : "success"
            }
            sx={{ mb: 2 }}
          />

          {/* Probability */}
          <Typography>
            Flood Probability:{" "}
            {(selectedPoint?.floodProbability * 100).toFixed(1)}%
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Rainfall Next 7 Days */}
          <Typography variant="subtitle2">Rainfall Next 7 Days:</Typography>
          {selectedPoint?.rainfallNext7.map((r, i) => (
            <Typography key={i}>
              Day {i + 1}: {r} mm
            </Typography>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* Notification Toggle */}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Receive Alerts for This Location?
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={notifyPrefs.includes(selectedPoint?.id)}
                onChange={() => toggleNotification(selectedPoint?.id)}
              />
            }
            label="Enable notifications"
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Maps;
