import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router';
import Signup from './pages/Signup';
import { KeycloakProvider } from './context/KeycloakContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <KeycloakProvider>
          <Routes>
            <Route index element= {<App />} />
            <Route path="signup" element= {<Signup />} />
          </Routes>
        </KeycloakProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
