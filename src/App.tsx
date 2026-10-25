import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './shared/context';

// Landing
import LandingPage from './landing/LandingPage';

// Customer
import { CustomerLogin, CustomerHome, CustomerNewRequest, CustomerWaiting, CustomerTracking, CustomerRate, CustomerHistory } from './customer/CustomerApp';
import { CustomerProfileSetup } from './customer/CustomerProfileSetup';
import { MaintenanceDashboard, ShopScreen, MaintenanceLogScreen, RemindersScreen } from './customer/MaintenanceApp';
import { LegalDocumentsScreen } from './customer/LegalDocumentsApp';
import { NegotiationScreen } from './customer/NegotiationApp';
import { OffersScreen, MechanicProfileScreen } from './customer/OffersAndProfile';
import { LiveTrackingScreen, PaymentScreen, OrdersTab } from './customer/TrackingAndPayment';
import { MessagesTab, ProfileScreen } from './customer/TabsAndProfile';
import { AIAssistantScreen, WarningLightScanner } from './customer/SmartFeatures';

// Mechanic
import { MechanicLogin, MechanicHome, MechanicRequestDetail, MechanicActiveJob, MechanicWallet, MechanicEarnings, MechanicShop } from './mechanic/MechanicApp';
import { MechanicProfileSetup } from './mechanic/MechanicProfileSetup';

// Seller
import { SellerLogin, SellerDashboard, SellerProducts, SellerOrders, SellerPartnerships, SellerSettings } from './seller/SellerApp';

// Admin
import { AdminLogin, AdminDashboard, AdminVerification, AdminRequests, AdminUsers, AdminSettingsPage, AdminDisputes } from './admin/AdminApp';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: string }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Customer */}
      <Route path="/customer/login" element={<CustomerLogin />} />
      <Route path="/customer/profile-setup" element={<ProtectedRoute role="customer"><CustomerProfileSetup /></ProtectedRoute>} />
      <Route path="/customer/home" element={<ProtectedRoute role="customer"><CustomerHome /></ProtectedRoute>} />
      <Route path="/customer/new-request" element={<ProtectedRoute role="customer"><CustomerNewRequest /></ProtectedRoute>} />
      <Route path="/customer/waiting" element={<ProtectedRoute role="customer"><CustomerWaiting /></ProtectedRoute>} />
      <Route path="/customer/offers" element={<ProtectedRoute role="customer"><OffersScreen /></ProtectedRoute>} />
      <Route path="/customer/mechanic-profile/:id" element={<ProtectedRoute role="customer"><MechanicProfileScreen /></ProtectedRoute>} />
      <Route path="/customer/tracking" element={<ProtectedRoute role="customer"><LiveTrackingScreen /></ProtectedRoute>} />
      <Route path="/customer/negotiation" element={<ProtectedRoute role="customer"><NegotiationScreen /></ProtectedRoute>} />
      <Route path="/customer/payment" element={<ProtectedRoute role="customer"><PaymentScreen /></ProtectedRoute>} />
      <Route path="/customer/rate" element={<ProtectedRoute role="customer"><CustomerRate /></ProtectedRoute>} />
      <Route path="/customer/history" element={<ProtectedRoute role="customer"><CustomerHistory /></ProtectedRoute>} />
      <Route path="/customer/orders" element={<ProtectedRoute role="customer"><OrdersTab /></ProtectedRoute>} />
      <Route path="/customer/messages" element={<ProtectedRoute role="customer"><MessagesTab /></ProtectedRoute>} />
      <Route path="/customer/profile" element={<ProtectedRoute role="customer"><ProfileScreen /></ProtectedRoute>} />
      <Route path="/customer/maintenance" element={<ProtectedRoute role="customer"><MaintenanceDashboard /></ProtectedRoute>} />
      <Route path="/customer/shop" element={<ProtectedRoute role="customer"><ShopScreen /></ProtectedRoute>} />
      <Route path="/customer/maintenance-log" element={<ProtectedRoute role="customer"><MaintenanceLogScreen /></ProtectedRoute>} />
      <Route path="/customer/reminders" element={<ProtectedRoute role="customer"><RemindersScreen /></ProtectedRoute>} />
      <Route path="/customer/documents" element={<ProtectedRoute role="customer"><LegalDocumentsScreen /></ProtectedRoute>} />
      <Route path="/customer/ai-assistant" element={<ProtectedRoute role="customer"><AIAssistantScreen /></ProtectedRoute>} />
      <Route path="/customer/warning-scanner" element={<ProtectedRoute role="customer"><WarningLightScanner /></ProtectedRoute>} />

      {/* Mechanic */}
      <Route path="/mechanic/login" element={<MechanicLogin />} />
      <Route path="/mechanic/profile-setup" element={<ProtectedRoute role="mechanic"><MechanicProfileSetup /></ProtectedRoute>} />
      <Route path="/mechanic/home" element={<ProtectedRoute role="mechanic"><MechanicHome /></ProtectedRoute>} />
      <Route path="/mechanic/request/:id" element={<ProtectedRoute role="mechanic"><MechanicRequestDetail /></ProtectedRoute>} />
      <Route path="/mechanic/active-job" element={<ProtectedRoute role="mechanic"><MechanicActiveJob /></ProtectedRoute>} />
      <Route path="/mechanic/wallet" element={<ProtectedRoute role="mechanic"><MechanicWallet /></ProtectedRoute>} />
      <Route path="/mechanic/earnings" element={<ProtectedRoute role="mechanic"><MechanicEarnings /></ProtectedRoute>} />
      <Route path="/mechanic/shop" element={<ProtectedRoute role="mechanic"><MechanicShop /></ProtectedRoute>} />

      {/* Seller */}
      <Route path="/seller/login" element={<SellerLogin />} />
      <Route path="/seller/dashboard" element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />
      <Route path="/seller/products" element={<ProtectedRoute role="seller"><SellerProducts /></ProtectedRoute>} />
      <Route path="/seller/orders" element={<ProtectedRoute role="seller"><SellerOrders /></ProtectedRoute>} />
      <Route path="/seller/partnerships" element={<ProtectedRoute role="seller"><SellerPartnerships /></ProtectedRoute>} />
      <Route path="/seller/settings" element={<ProtectedRoute role="seller"><SellerSettings /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/verification" element={<ProtectedRoute role="admin"><AdminVerification /></ProtectedRoute>} />
      <Route path="/admin/requests" element={<ProtectedRoute role="admin"><AdminRequests /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettingsPage /></ProtectedRoute>} />
      <Route path="/admin/disputes" element={<ProtectedRoute role="admin"><AdminDisputes /></ProtectedRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
