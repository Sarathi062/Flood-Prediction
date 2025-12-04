import { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Snackbar, Alert, Typography, Button, Box } from "@mui/material";
import { useSubscribeRegion } from "../hooks/useRegionSubscriptions";
import { useUser } from "../hooks/useUser";

const AVAILABLE_REGIONS = [{ id: "pune", label: "Pune" }];

// 🔥 Normalize backend data (because your backend returns [ ["pune"], ["pune"] ])
const normalizeRegions = (arr) => {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr.flatMap((item) => (Array.isArray(item) ? item : [item])))];
};

const RegionSelector = () => {
  const { mutate: saveRegions, isPending } = useSubscribeRegion();
  const { data: user1 } = useUser();

  const [selected, setSelected] = useState([]);
  const [originalSelected, setOriginalSelected] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  // ✔ Load existing regions from user1
  useEffect(() => {
    if (user1?.subscribedRegions) {
      const normalized = normalizeRegions(user1.subscribedRegions);
      setSelected(normalized);
      setOriginalSelected(normalized);
    }
  }, [user1]);

  const toggleRegion = (regionId) => {
    if (!editMode) return;

    setValidationError("");

    setSelected((prev) =>
      prev.includes(regionId)
        ? prev.filter((r) => r !== regionId)
        : [...prev, regionId]
    );
  };

  // Validate at least 1 region
  const validateSelection = () => {
    if (selected.length === 0) {
      setValidationError("Please select at least one region");
      return false;
    }
    return true;
  };

  // Save handler
  const handleSave = () => {
    if (!validateSelection()) return;

    saveRegions(
      { regions: selected },
      {
        onSuccess: () => {
          setOriginalSelected(selected);
          setSnackbarMessage("Regions updated successfully.");
          setSnackbarOpen(true);
          setEditMode(false);
        },
        onError: () => {
          setSnackbarMessage("Failed to save regions. Try again.");
          setSnackbarOpen(true);
        },
      }
    );
  };

  // Cancel handler
  const handleCancel = () => {
    setSelected(originalSelected);
    setEditMode(false);
    setValidationError("");
  };

  const selectedCount = selected.length;

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">📍 Select Regions for Alerts</Typography>

        {!editMode && (
          <Button variant="text" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        )}
      </Box>

      {/* Regions */}
      <Box sx={{ opacity: editMode ? 1 : 0.6, transition: "0.3s" }}>
        {AVAILABLE_REGIONS.map((region) => {
          const isChecked = selected.includes(region.id);

          return (
            <FormControlLabel
              key={region.id}
              control={
                <Checkbox
                  checked={isChecked}
                  disabled={!editMode || isPending}
                  onChange={() => toggleRegion(region.id)}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="body2">{region.label}</Typography>
                  {isChecked && (
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{ color: "success.main", fontWeight: 600 }}
                    >
                      ✓
                    </Typography>
                  )}
                </Box>
              }
            />
          );
        })}
      </Box>

      {/* Validation */}
      {validationError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {validationError}
        </Alert>
      )}

      {/* View Mode Messages */}
      {!editMode && (
        <>
          {selectedCount > 0 ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Alerts enabled for {selectedCount} region
              {selectedCount > 1 ? "s" : ""}.
            </Alert>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No regions selected. Click Edit to choose regions.
            </Alert>
          )}
        </>
      )}

      {/* Edit Mode Buttons */}
      {editMode && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            mt: 2,
          }}
        >
          <Button variant="outlined" onClick={handleCancel} disabled={isPending}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isPending || selected.length === 0}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          variant="filled"
          severity={snackbarMessage.includes("Failed") ? "error" : "success"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RegionSelector;
