import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Layout } from '../components/layout/Layout';
import { Login } from '../pages/auth/Login';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Bookings } from '../pages/bookings/Bookings';
import { Rooms } from '../pages/rooms/Rooms';
import { Staff } from '../pages/staff/Staff';
import { Settings } from '../pages/settings/Settings';
import { Inventory } from '../pages/inventory/Inventory';
import { HotelList } from '../pages/owner/HotelList';
import { HotelProvider } from '../context/HotelContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ 
  children
}) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // In a real app, you'd check permissions here
  // For now, we'll just check if the route is /staff and if user is OWNER
  if (window.location.pathname === '/staff' && user?.role !== 'HOTEL_OWNER') {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
};

const HotelScopedRoutes: React.FC = () => {
  return (
    <HotelProvider>
      <Outlet />
    </HotelProvider>
  );
};

export const AppRouter: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Global Owner Routes */}
      <Route path="/owner/hotels" element={
        <ProtectedRoute>
          <HotelList />
        </ProtectedRoute>
      } />

      {/* Global Staff Management (Owner Only) */}
      <Route path="/staff" element={
        <ProtectedRoute>
          <Staff />
        </ProtectedRoute>
      } />
      
      {/* Hotel Scoped Routes */}
      <Route path="/hotel/:hotelId" element={<HotelScopedRoutes />}>
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="bookings" element={
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        } />
        <Route path="rooms" element={
          <ProtectedRoute>
            <Rooms />
          </ProtectedRoute>
        } />
        <Route path="inventory" element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        } />
        <Route path="settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="/" element={<Navigate to={user?.role === 'HOTEL_OWNER' ? "/owner/hotels" : (user?.hotelId ? `/hotel/${user.hotelId}/dashboard` : "/login")} replace />} />
      {/* Fallback for old bookmarks or stale HMR navigating to /dashboard */}
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
