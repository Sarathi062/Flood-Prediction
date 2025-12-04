import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Snackbar,
  Alert,
  FormHelperText,
} from "@mui/material";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

const BACKEND_URL = process.env.REACT_APP_DEP_API_URL;

export default function AlertProfileModal({ open, onClose }) {
  const queryClient = useQueryClient();

  const [phone, setPhone] = useState("");
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [successOpen, setSuccessOpen] = useState(false);

  // Validation error states
  const [phoneError, setPhoneError] = useState("");
  const [alertError, setAlertError] = useState("");

  const validate = () => {
    let valid = true;

    // PHONE VALIDATION — Must be 10 digits
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      setPhoneError("Enter a valid 10-digit phone number");
      valid = false;
    } else {
      setPhoneError("");
    }

    // AT LEAST ONE ALERT METHOD
    if (!smsEnabled && !emailEnabled) {
      setAlertError("Select at least one alert method (SMS or Email)");
      valid = false;
    } else {
      setAlertError("");
    }

    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await axios.post(
        `${BACKEND_URL}/api/user/alert-profile`,
        { phone, smsEnabled, emailEnabled },
        { withCredentials: true }
      );

      queryClient.invalidateQueries(["currentUser"]);

      setSuccessOpen(true);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>Complete Alert Profile</DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* PHONE FIELD */}
          <TextField
            label="Phone Number"
            fullWidth
            value={phone}
            error={Boolean(phoneError)}
            helperText={phoneError}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* SMS */}
          <FormControlLabel
            control={
              <Checkbox
                checked={smsEnabled}
                onChange={(e) => setSmsEnabled(e.target.checked)}
              />
            }
            label="Enable SMS Alerts"
          />

          {/* EMAIL */}
          <FormControlLabel
            control={
              <Checkbox
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
              />
            }
            label="Enable Email Alerts"
          />

          {/* ALERT METHOD ERROR */}
          {alertError && (
            <FormHelperText error sx={{ mt: -1 }}>
              {alertError}
            </FormHelperText>
          )}

          {/* SUBMIT BUTTON */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{ mt: 1 }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>

      {/* SUCCESS TOAST */}
      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert severity="success" variant="filled">
          Alert profile updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
