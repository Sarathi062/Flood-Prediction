import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const TermsOfService = () => {
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
          To use certain features, you must authenticate using Google OAuth. You
          are responsible for maintaining the security of your account.
        </Typography>

        {/* SECTION */}
        <Typography variant="h5" fontWeight={600} sx={{ mt: 4, mb: 1 }}>
          Prediction Disclaimer
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          FloodPrediction provides predictions based on available data and
          models. These predictions are for informational purposes only. We do
          not guarantee accuracy, and we are not responsible for damages
          resulting from reliance on our predictions.
        </Typography>

        {/* SECTION */}
        <Typography variant="h5" fontWeight={600} sx={{ mt: 4, mb: 1 }}>
          Intellectual Property
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          All content, branding, and code on FloodPrediction is the property of
          the developer and may not be copied or reproduced without permission.
        </Typography>

        {/* SECTION */}
        <Typography variant="h5" fontWeight={600} sx={{ mt: 4, mb: 1 }}>
          Limitation of Liability
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We are not liable for any direct or indirect damages caused by the use
          of our service, including inaccurate predictions.
        </Typography>

        {/* SECTION */}
        <Typography variant="h5" fontWeight={600} sx={{ mt: 4, mb: 1 }}>
          Changes to These Terms
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We may update these Terms of Service at any time. Updated versions
          will be posted on this page.
        </Typography>

        {/* SECTION */}
        <Typography variant="h5" fontWeight={600} sx={{ mt: 4, mb: 1 }}>
          Contact Us
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          If you have questions about these terms, contact us at:
        </Typography>

        <Typography variant="body1" fontWeight="bold">
          sarathi062023@gmail.com
        </Typography>
      </Paper>
    </Container>
  );
};

export default TermsOfService;
