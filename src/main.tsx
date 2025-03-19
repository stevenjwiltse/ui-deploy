import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router';
import Signup from './pages/Signup';
import { KeycloakProvider } from './context/KeycloakContext';
import BarberSchedule from './pages/BarberSchedule';
import ScheduleManagementPage from './pages/BarberScheduleList';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <KeycloakProvider>
          <Routes>
            <Route index element= {<App />} />
            <Route path="signup" element= {<Signup />} />
            <Route path="barbers/:barberId/schedules" element= {<ScheduleManagementPage />} />
            <Route path="barbers/:barberId/schedules/new" element= {<BarberSchedule />} />
          </Routes>
        </KeycloakProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
