import React, { useEffect } from "react";
import { Container, Box, Typography, List, ListItem, ListItemText } from "@mui/material";

const TermsOfService = () => {
  // Scroll top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box sx={{ backgroundColor: "white", py: 6 }}>
      <Container maxWidth="md">
        
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Terms of Service
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Last updated: {new Date().getFullYear()}
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Welcome to <strong>FloodPrediction</strong>. By accessing or using our
          website or services, you agree to the following Terms of Service.
        </Typography>

        {/* SECTION */}
        <Typography variant="h5" fontWeight={600} sx={{ mt: 4, mb: 1 }}>
          Use of the Service
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          You agree to use our website responsibly and legally. You must not:
        </Typography>

        <List sx={{ listStyle: "disc", pl: 4 }}>
          {[
            "Misuse or manipulate prediction data",
            "Attempt to access restricted systems",
            "Use the service for harmful or illegal activities",
          ].map((item, idx) => (
            <ListItem key={idx} sx={{ display: "list-item", p: 0 }}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>

        {/* SECTION */}
        <Typography variant="h5" fontWeight={600} sx={{ mt: 4, mb: 1 }}>
          Account Requirements
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          To use certain features, you must authenticate using Google OAuth.
        </Typography>

        {/* SECTION */}
        <Typography variant="h5" fontWeight={600} sx={{ mt: 4, mb: 1 }}>
          Prediction Disclaimer
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          FloodPrediction provides predictions based on models...
        </Typography>

        {/* SECTION */}
        <Typography variant="h5" fontWeight={600} sx={{ mt: 4, mb: 1 }}>
          Intellectual Property
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          All content and code on FloodPrediction is the property of the developer.
        </Typography>

        {/* SECTION */}
        <Typography variant="h5" fontWeight={600} sx={{ mt: 4, mb: 1 }}>
          Contact Us
        </Typography>
        <Typography variant="body1">sarathi062023@gmail.com</Typography>

      </Container>
    </Box>
  );
};

export default TermsOfService;
