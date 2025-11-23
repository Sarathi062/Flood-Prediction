import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import WaterDropIcon from "@mui/icons-material/WaterDrop";

export default function Nav() {
    const navigate = useNavigate();

    return (
        <Box
            component="nav"
            sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                bgcolor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid #e0e0e0",
                py: 2,
            }}
        >
            <Container maxWidth="xl">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {/* Logo */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <WaterDropIcon sx={{ fontSize: 32, color: "#1976d2" }} />
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                display: { xs: "none", sm: "block" },
                                cursor: "pointer"
                            }}
                            onClick={() => navigate("/Flood-Prediction")}
                        >
                            FloodGuard AI
                        </Typography>
                    </Box>

                    {/* CTA Buttons */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/dashboard")}
                            sx={{
                                textTransform: "none",
                                background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                                fontWeight: 600,
                                px: 3,
                                boxShadow: "0 4px 12px rgba(30, 64, 175, 0.3)",
                            }}
                        >
                            View Dashboard
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
