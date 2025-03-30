import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router';
import Signup from './pages/Signup';
import { KeycloakProvider } from './context/KeycloakContext';
import Services from './pages/Services';
import BarberSchedule from './pages/BarberSchedule';
import ScheduleManagementPage from './pages/BarberScheduleList';
import AboutUsPage from './pages/AboutUs';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <KeycloakProvider>
          <Routes>
            <Route index element= {<App />} />
            <Route path="about" element= {<AboutUsPage />} />
            <Route path="services" element= {<Services />} />
            <Route path="signup" element= {<Signup />} />
            <Route path="schedules" element= {<ScheduleManagementPage />} />
            <Route path="schedules/new" element= {<BarberSchedule />} />
          </Routes>
        </KeycloakProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
