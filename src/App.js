import './assets/scss/main.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './layouts';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PrivateRoute from './routes/PrivateRoute';
import React, { Suspense } from 'react';
import Loader from './components/Loader';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const theme = createTheme({
  typography: {
    fontFamily: "Nunito, sans-serif",
    h1: {
      fontSize: "30px",
      fontWeight: "700",
    },
    h2: {
      fontSize: "20px",
    },
    font24: {
      fontSize: "24px",
    },
    font22: {
      fontSize: "22px",
    },
    font20: {
      fontSize: "20px",
    },
    font16: {
      fontSize: "16px",
    },
    font14: {
      fontSize: "14px",
    },
    font12: {
      fontSize: "12px",
    },
    body: {
      fontSize: "14px",
    },
  },
  palette: {
    background: {
      default: "#fff",
    },
    primary: {
      main: "#4596F3",
    },
    secondary: {
      main: "#6c757d",
    },
    dark: {
      main: "#000",
    },
  },
});

const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Doctor = React.lazy(() => import('./pages/Doctor'));
const Notifications = React.lazy(() => import('./pages/Notifications'));
const AddDoctor = React.lazy(() => import('./components/doctor/AddDoctor'));
const ViewDoctor = React.lazy(() => import('./components/doctor/ViewDoctor'));
const CreateNotification = React.lazy(() => import('./components/CreateNotification'));
const Appointements = React.lazy(() => import('./pages/Appointments'));
const Calendar = React.lazy(() => import('./pages/Calendar'));
const Meeting = React.lazy(() => import('./pages/Meeting'));
const Settings = React.lazy(() => import('./pages/Settings'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route element={<Layout />}>
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/doctor" element={<Doctor />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/create-notification" element={<CreateNotification />} />
                  <Route path="/add-doctor" element={<AddDoctor />} />
                  <Route path='/view-doctor/:doctor_id' element={<ViewDoctor />} />
                  <Route path='/appointments' element={<Appointements />} />
                  <Route path='/calendar' element={<Calendar />} />
                  <Route path='/meeting/:room_name' element={<Meeting />} />
                  <Route path='/setting' element={Settings} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
