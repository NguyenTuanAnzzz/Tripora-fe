import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from '../pages/Register';
import OtpVerification from '../pages/OtpVerification';
import Login from '../pages/Login';
import Home from '../pages/Home';
import OAuth2RedirectHandler from '../pages/OAuth2RedirectHandler';
import ForgotPassword from '../pages/ForgotPassword';
import Profile from '../pages/Profile';
import RoleRoute from './RoleRoute';
import Destinations from '../pages/Destinations';
import TourList from '../pages/TourList';
import TourDetail from '../pages/TourDetail';
import AdminDashboard from '../pages/admin/AdminDashboard';
import DestinationManagement from '../pages/admin/DestinationManagement';
import CreateDestination from '../pages/admin/CreateDestination';
import DestinationDetail from '../pages/admin/DestinationDetail';
import TourManagement from '../pages/admin/TourManagement';
import CreateTour from '../pages/admin/CreateTour';
import UserManagement from '../pages/admin/UserManagement';
import CreateUser from '../pages/admin/CreateUser';
import UserDetail from '../pages/admin/UserDetail';
import StaffDashboard from '../pages/staff/StaffDashboard';
import EnterPhone from '../pages/EnterPhone';
import GlobalCheck from '../components/GlobalCheck';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <GlobalCheck />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp/:email" element={<OtpVerification />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/tours" element={<TourList />} />
        <Route path="/tours/:id" element={<TourDetail />} />

        <Route element={<RoleRoute allowedRoles={['CUSTOMER','ADMIN', 'STAFF']} />}>
          <Route path="/my-profile" element={<Profile />} />
          <Route path="/enter-phone" element={<EnterPhone />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={['ADMIN', 'STAFF']} />}>
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
        </Route>

  
        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/destinations" element={<DestinationManagement />} />
          <Route path="/admin/destinations/create" element={<CreateDestination />} />
          <Route path="/admin/destinations/:id" element={<DestinationDetail />} />
          <Route path="/admin/tours" element={<TourManagement />} />
          <Route path="/admin/tours/create" element={<CreateTour />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/users/create" element={<CreateUser />} />
          <Route path="/admin/users/:id" element={<UserDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
