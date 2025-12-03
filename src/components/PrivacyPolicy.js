import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const PrivacyPolicy = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.state?.scrollTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 5, borderRadius: 3 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Privacy Policy
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Last updated: {new Date().getFullYear()}
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          FloodPrediction (“we”, “our”, “us”) is committed to protecting your
          privacy. This Privacy Policy explains how we collect, use, and protect
          your information when you use our website and services.
        </Typography>

        {/* Section */}
        <Typography variant="h5" fontWeight="600" sx={{ mt: 4, mb: 1 }}>
          Information We Collect
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          We only collect the following information through Google OAuth:
        </Typography>

        <List sx={{ listStyle: "disc", pl: 4 }}>
          {[
            "Your name",
            "Your email address",
            "Your Google profile picture (optional)",
          ].map((item, idx) => (
            <ListItem key={idx} sx={{ display: "list-item", p: 0 }}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>

        <Typography variant="body1" sx={{ mt: 2 }}>
          We do <strong>not</strong> collect passwords, phone numbers, or any
          sensitive personal information.
        </Typography>

        {/* Section */}
        <Typography variant="h5" fontWeight="600" sx={{ mt: 4, mb: 1 }}>
          How We Use Your Information
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Your information is used only for:
        </Typography>

        <List sx={{ listStyle: "disc", pl: 4 }}>
          {[
            "User authentication",
            "Providing personalized predictions or features",
            "Improving the user experience",
          ].map((item, idx) => (
            <ListItem key={idx} sx={{ display: "list-item", p: 0 }}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>

        {/* Section */}
        <Typography variant="h5" fontWeight="600" sx={{ mt: 4, mb: 1 }}>
          Data Storage & Security
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Your information is stored securely on our servers. We do not share,
          sell, or transfer your data to any third party.
        </Typography>

        {/* Section */}
        <Typography variant="h5" fontWeight="600" sx={{ mt: 4, mb: 1 }}>
          Third-Party Services
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          We use Google OAuth for login and authentication.
        </Typography>

        {/* Section */}
        <Typography variant="h5" fontWeight="600" sx={{ mt: 4, mb: 1 }}>
          Your Rights
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          You may request deletion of your account or data at any time by
          emailing:
        </Typography>

        <Typography variant="body1" fontWeight="bold">
          sarathi062023@gmail.com
        </Typography>

        {/* Section */}
        <Typography variant="h5" fontWeight="600" sx={{ mt: 4, mb: 1 }}>
          Changes to This Policy
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          We may update this Privacy Policy periodically. Updated versions will
          always be available on this page.
        </Typography>

        {/* Section */}
        <Typography variant="h5" fontWeight="600" sx={{ mt: 4, mb: 1 }}>
          Contact Us
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          If you have any questions, you can contact us at:
        </Typography>

        <Typography variant="body1" fontWeight="bold">
          sarathi062023@gmail.com
        </Typography>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;
