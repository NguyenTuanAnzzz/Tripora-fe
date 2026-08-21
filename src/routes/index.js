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
import UserManagement from '../pages/admin/UserManagement';
import CreateUser from '../pages/admin/CreateUser';
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
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/users/create" element={<CreateUser />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
