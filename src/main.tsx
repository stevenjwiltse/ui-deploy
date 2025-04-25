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
import PrivateRoute from './PrivateRoute';
import Booking from './pages/Booking';
import AppointmentConfirmation from './pages/AppointmentConfirmation';
import { MeProvider } from './context/MeContext';
import ProfileInfo from './pages/ProfileInfo';
import { SnackBarProvider } from './context/SnackbarContext';
import UpdatePassword from './pages/UpdatePassword';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <KeycloakProvider>
          <MeProvider>
            <SnackBarProvider>
              <Routes>
                <Route index element={<App />} />
                <Route path="about" element={<AboutUsPage />} />
                <Route path="appointments/:appointmentId/confirm" element={<PrivateRoute roles={[]} children={<AppointmentConfirmation />} />} />
                <Route path="book-appointment" element={<PrivateRoute roles={[]} children={<Booking />} />} />
                <Route path="profile" element={<PrivateRoute roles={[]} children={<ProfileInfo />} />} />
                <Route path="profile/update-password" element={<PrivateRoute roles={[]} children={<UpdatePassword />} />} />
                <Route path="services" element={<Services />} />
                <Route path="signup" element={<Signup />} />
                <Route path="schedules" element={<PrivateRoute roles={["barber"]} children={<ScheduleManagementPage />} />} />
                <Route path="schedules/new" element={<PrivateRoute roles={["barber"]} children={<BarberSchedule />} />} />
                <Route path="schedules/:scheduleId" element={<PrivateRoute roles={["barber"]} children={<BarberSchedule />} />} />
              </Routes>
            </SnackBarProvider>
          </MeProvider>
        </KeycloakProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
