import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const DisclaimerModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 3,
          //   boxShadow: 24,
          border: "none",
          boxShadow: "none", // removes unwanted shadow
          userSelect: "none",
          p: 4,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Disclaimer
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          This platform is developed by <strong>SARATHI</strong>, a trusted
          organization focused on providing safe and reliable solutions.
          <br />
          <br />
          All information you share — such as email, analytics, and login
          details — is securely handled, encrypted, and never shared with third
          parties.
        </Typography>

        <Button fullWidth variant="contained" onClick={onClose}>
          I Understand
        </Button>
      </Box>
    </Modal>
  );
};

export default DisclaimerModal;
