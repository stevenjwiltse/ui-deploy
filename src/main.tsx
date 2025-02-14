import * as React from "react";
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
