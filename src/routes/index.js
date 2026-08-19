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

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp/:email" element={<OtpVerification />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

     
        <Route element={<RoleRoute allowedRoles={['CUSTOMER','ADMIN', 'STAFF']} />}>
          <Route path="/my-profile" element={<Profile />} />
          <Route path="/destinations" element={<Destinations />} />
          
        </Route>

        <Route element={<RoleRoute allowedRoles={['ADMIN', 'STAFF']} />}>
       
        </Route>

  
        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
      
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
