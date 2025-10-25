// src/App.js
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Nav/>
      <Routes>
        <Route path="/Flood-Prediction" element={<Home />} />
        <Route path="/Flood-Prediction/dashboard" element={<Dashboard />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
