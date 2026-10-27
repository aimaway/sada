import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './shared/context';
import { DemoProvider } from './shared/DemoContext';
import { DemoToggle } from './components/DemoToggle';

// Landing
import LandingPage from './landing/LandingPage';

// Customer
import { CustomerLogin, CustomerHome, CustomerNewRequest, CustomerWaiting, CustomerTracking, CustomerRate, CustomerHistory } from './customer/CustomerApp';
import { NotificationsScreen } from './customer/NotificationsApp';
import { CustomerProfileSetup } from './customer/CustomerProfileSetup';
import { MaintenanceDashboard, ShopScreen, MaintenanceLogScreen, RemindersScreen } from './customer/MaintenanceApp';
import { LegalDocumentsScreen } from './customer/LegalDocumentsApp';
import { NegotiationScreen } from './customer/NegotiationApp';
import { OffersScreen, MechanicProfileScreen } from './customer/OffersAndProfile';
import { LiveTrackingScreen, PaymentScreen, OrdersTab } from './customer/TrackingAndPayment';
import { MessagesTab, ProfileScreen } from './customer/TabsAndProfile';
import { AIAssistantScreen, WarningLightScanner } from './customer/SmartFeatures';
import { MechanicWalletScreen, AntiBypassingScreen, LocalSpecificsScreen } from './customer/BusinessFeatures';

// Mechanic
import { MechanicLogin, MechanicHome, MechanicRequestDetail, MechanicActiveJob, MechanicWallet, MechanicEarnings, MechanicShop } from './mechanic/MechanicApp';
import { MechanicProfileSetup } from './mechanic/MechanicProfileSetup';
import { MechanicProfileDetail, MechanicProfileSettings } from './mechanic/MechanicProfileDetail';

// Seller
import { SellerLogin, SellerDashboard, SellerProducts, SellerOrders, SellerPartnerships, SellerSettings } from './seller/SellerApp';

// Admin
import { AdminLogin, AdminDashboard, AdminVerification, AdminRequests, AdminUsers, AdminSettingsPage, AdminDisputes } from './admin/AdminApp';

// Phase 2 Components
import { UrgentRequestFlow } from './components/phase2/UrgentRequestFlow';
import { PrePurchaseInspection } from './components/phase2/PrePurchaseInspection';
import { OnBehalfRequest } from './components/phase2/OnBehalfRequest';
import { MechanicPublicProfile } from './components/phase2/MechanicPublicProfile';
import { MechanicDashboard } from './components/phase2/MechanicDashboard';
import { RecurringPlansDashboard } from './components/phase2/RecurringPlansDashboard';
import { BeneficiaryShareLink } from './components/phase2/BeneficiaryShareLink';
import { InspectionReportView } from './components/phase2/InspectionReportView';

// Enhanced Components
import { CustomerHomeEnhanced } from './components/CustomerHomeEnhanced';
import { ClientWallet } from './components/ClientWallet';
import { DocumentsManager } from './components/DocumentsManager';
import { MechanicProfileEnhanced } from './components/MechanicProfileEnhanced';
import { TunerProfile } from './components/TunerProfile';
import { SellerPublicProfile } from './components/SellerPublicProfile';
import { ExplainProblem } from './components/ExplainProblem';
import { DiagnosticRequest } from './components/DiagnosticRequest';
import { MaintenanceRequest } from './components/MaintenanceRequest';
import { TunerLogin } from './components/TunerLogin';
import { TunerRegistration } from './components/TunerRegistration';
import { TunerDashboard } from './components/TunerDashboard';
import { TunerProfileEdit } from './components/TunerProfileEdit';
import { TunerServices } from './components/TunerServices';
import { TunerNotifications } from './components/TunerNotifications';
import { TunerPaymentMethods } from './components/TunerPaymentMethods';
import { TunerWalletRecharge } from './components/TunerWalletRecharge';
import { TunerGalleryUpload } from './components/TunerGalleryUpload';
import { TunerRequestsMap } from './components/TunerRequestsMap';
import { MechanicPlans } from './components/MechanicPlans';
import { SellerPlans } from './components/SellerPlans';
import { TunerPlans } from './components/TunerPlans';
import { CustomerProfileComplete } from './components/CustomerProfileComplete';
import { CustomerVehicles } from './components/CustomerVehicles';
import { CustomerAddresses } from './components/CustomerAddresses';
import { CustomerPaymentMethods } from './components/CustomerPaymentMethods';
import { CustomerNotifications } from './components/CustomerNotifications';
import { CustomerTransactions } from './components/CustomerTransactions';
import { CustomerReviews } from './components/CustomerReviews';
import { CustomerFavorites } from './components/CustomerFavorites';
import { CustomerLanguage } from './components/CustomerLanguage';
import { CustomerSecurity } from './components/CustomerSecurity';
import { CustomerHelp } from './components/CustomerHelp';
import { CustomerContact } from './components/CustomerContact';
import { CustomerTerms } from './components/CustomerTerms';
import { GiftPlans } from './components/GiftPlans';
import { NewRequestEnhanced } from './components/NewRequestEnhanced';
import { RoleSelectionLogin } from './components/RoleSelectionLogin';

// Addendum Components - Phase A to F
import { ProviderDirectory } from './components/ProviderDirectory';
import { ProviderPortal } from './components/ProviderPortal';
import { JobManagement } from './components/JobManagement';
import { ClientPortal } from './components/ClientPortal';
import { ChoosePlan } from './components/ChoosePlan';

// Content Pages
import { ContactPage } from './pages/ContactPage';
import { AboutPage, CareersPage, BlogPage, FAQPage, TermsPage, PrivacyPage } from './pages/ContentPages';

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

      {/* Role Selection Login */}
      <Route path="/login" element={<RoleSelectionLogin />} />

      {/* Customer */}
      <Route path="/customer/login" element={<CustomerLogin />} />
      <Route path="/customer/profile-setup" element={<ProtectedRoute role="customer"><CustomerProfileSetup /></ProtectedRoute>} />
      <Route path="/customer/home" element={<ProtectedRoute role="customer"><CustomerHome /></ProtectedRoute>} />
      <Route path="/customer/notifications" element={<ProtectedRoute role="customer"><NotificationsScreen /></ProtectedRoute>} />
      <Route path="/customer/new-request" element={<ProtectedRoute role="customer"><NewRequestEnhanced /></ProtectedRoute>} />
      <Route path="/customer/new-request-enhanced" element={<ProtectedRoute role="customer"><NewRequestEnhanced /></ProtectedRoute>} />
      <Route path="/customer/explain-problem" element={<ProtectedRoute role="customer"><ExplainProblem /></ProtectedRoute>} />
      <Route path="/customer/diagnostic" element={<ProtectedRoute role="customer"><DiagnosticRequest /></ProtectedRoute>} />
      <Route path="/customer/maintenance-request" element={<ProtectedRoute role="customer"><MaintenanceRequest /></ProtectedRoute>} />
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
      <Route path="/customer/profile" element={<ProtectedRoute role="customer"><CustomerProfileComplete /></ProtectedRoute>} />
      <Route path="/customer/profile-old" element={<ProtectedRoute role="customer"><ProfileScreen /></ProtectedRoute>} />
      <Route path="/customer/maintenance" element={<ProtectedRoute role="customer"><MaintenanceDashboard /></ProtectedRoute>} />
      <Route path="/customer/shop" element={<ProtectedRoute role="customer"><ShopScreen /></ProtectedRoute>} />
      <Route path="/customer/maintenance-log" element={<ProtectedRoute role="customer"><MaintenanceLogScreen /></ProtectedRoute>} />
      <Route path="/customer/reminders" element={<ProtectedRoute role="customer"><RemindersScreen /></ProtectedRoute>} />
      <Route path="/customer/documents" element={<ProtectedRoute role="customer"><LegalDocumentsScreen /></ProtectedRoute>} />
      <Route path="/customer/ai-assistant" element={<ProtectedRoute role="customer"><AIAssistantScreen /></ProtectedRoute>} />
      <Route path="/customer/warning-scanner" element={<ProtectedRoute role="customer"><WarningLightScanner /></ProtectedRoute>} />
      <Route path="/customer/business/wallet" element={<ProtectedRoute role="customer"><MechanicWalletScreen /></ProtectedRoute>} />
      <Route path="/customer/business/anti-bypass" element={<ProtectedRoute role="customer"><AntiBypassingScreen /></ProtectedRoute>} />
      <Route path="/customer/business/local" element={<ProtectedRoute role="customer"><LocalSpecificsScreen /></ProtectedRoute>} />

      {/* Mechanic */}
      <Route path="/mechanic/login" element={<MechanicLogin />} />
      <Route path="/mechanic/profile-setup" element={<ProtectedRoute role="mechanic"><MechanicProfileSetup /></ProtectedRoute>} />
      <Route path="/mechanic/home" element={<ProtectedRoute role="mechanic"><MechanicHome /></ProtectedRoute>} />
      <Route path="/mechanic/profile" element={<ProtectedRoute role="mechanic"><MechanicProfileDetail /></ProtectedRoute>} />
      <Route path="/mechanic/profile-settings" element={<ProtectedRoute role="mechanic"><MechanicProfileSettings /></ProtectedRoute>} />
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

      {/* Tuner */}
      <Route path="/tuner/login" element={<TunerLogin />} />
      <Route path="/tuner/register" element={<TunerRegistration />} />
      <Route path="/tuner/dashboard" element={<ProtectedRoute role="tuner"><TunerDashboard /></ProtectedRoute>} />
      <Route path="/tuner/profile-edit" element={<ProtectedRoute role="tuner"><TunerProfileEdit /></ProtectedRoute>} />
      <Route path="/tuner/services" element={<ProtectedRoute role="tuner"><TunerServices /></ProtectedRoute>} />
      <Route path="/tuner/notifications" element={<ProtectedRoute role="tuner"><TunerNotifications /></ProtectedRoute>} />
      <Route path="/tuner/payment-methods" element={<ProtectedRoute role="tuner"><TunerPaymentMethods /></ProtectedRoute>} />
      <Route path="/tuner/wallet-recharge" element={<ProtectedRoute role="tuner"><TunerWalletRecharge /></ProtectedRoute>} />
      <Route path="/tuner/gallery-upload" element={<ProtectedRoute role="tuner"><TunerGalleryUpload /></ProtectedRoute>} />
      <Route path="/tuner/requests-map" element={<ProtectedRoute role="tuner"><TunerRequestsMap /></ProtectedRoute>} />
      <Route path="/tuner/plans" element={<ProtectedRoute role="tuner"><TunerPlans /></ProtectedRoute>} />
      <Route path="/mechanic/plans" element={<ProtectedRoute role="mechanic"><MechanicPlans /></ProtectedRoute>} />
      <Route path="/seller/plans" element={<ProtectedRoute role="seller"><SellerPlans /></ProtectedRoute>} />

      {/* Customer Profile Complete */}
      <Route path="/customer/profile" element={<ProtectedRoute role="customer"><CustomerProfileComplete /></ProtectedRoute>} />
      <Route path="/customer/profile/vehicles" element={<ProtectedRoute role="customer"><CustomerVehicles /></ProtectedRoute>} />
      <Route path="/customer/profile/addresses" element={<ProtectedRoute role="customer"><CustomerAddresses /></ProtectedRoute>} />
      <Route path="/customer/profile/payment-methods" element={<ProtectedRoute role="customer"><CustomerPaymentMethods /></ProtectedRoute>} />
      <Route path="/customer/profile/notifications" element={<ProtectedRoute role="customer"><CustomerNotifications /></ProtectedRoute>} />
      <Route path="/customer/profile/transactions" element={<ProtectedRoute role="customer"><CustomerTransactions /></ProtectedRoute>} />
      <Route path="/customer/profile/reviews" element={<ProtectedRoute role="customer"><CustomerReviews /></ProtectedRoute>} />
      <Route path="/customer/profile/favorites" element={<ProtectedRoute role="customer"><CustomerFavorites /></ProtectedRoute>} />
      <Route path="/customer/profile/language" element={<ProtectedRoute role="customer"><CustomerLanguage /></ProtectedRoute>} />
      <Route path="/customer/profile/security" element={<ProtectedRoute role="customer"><CustomerSecurity /></ProtectedRoute>} />
      <Route path="/customer/profile/help" element={<ProtectedRoute role="customer"><CustomerHelp /></ProtectedRoute>} />
      <Route path="/customer/profile/contact" element={<ProtectedRoute role="customer"><CustomerContact /></ProtectedRoute>} />
      <Route path="/customer/profile/terms" element={<ProtectedRoute role="customer"><CustomerTerms /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/verification" element={<ProtectedRoute role="admin"><AdminVerification /></ProtectedRoute>} />
      <Route path="/admin/requests" element={<ProtectedRoute role="admin"><AdminRequests /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettingsPage /></ProtectedRoute>} />
      <Route path="/admin/disputes" element={<ProtectedRoute role="admin"><AdminDisputes /></ProtectedRoute>} />

      {/* Phase 2 - Two-Wheelers & Pros */}
      <Route path="/customer/urgent/motorcycle" element={<ProtectedRoute role="customer"><UrgentRequestFlow vehicleType="motorcycle" /></ProtectedRoute>} />
      <Route path="/customer/urgent/scooter" element={<ProtectedRoute role="customer"><UrgentRequestFlow vehicleType="scooter" /></ProtectedRoute>} />
      <Route path="/customer/urgent/ebike" element={<ProtectedRoute role="customer"><UrgentRequestFlow vehicleType="ebike" /></ProtectedRoute>} />

      {/* Phase 2 - Pre-purchase Inspection */}
      <Route path="/customer/inspection/book" element={<ProtectedRoute role="customer"><PrePurchaseInspection /></ProtectedRoute>} />
      <Route path="/inspection-report/:slug" element={<InspectionReportView />} />

      {/* Phase 2 - On-behalf Request */}
      <Route path="/customer/on-behalf/new" element={<ProtectedRoute role="customer"><OnBehalfRequest /></ProtectedRoute>} />
      <Route path="/on-behalf/:token" element={<BeneficiaryShareLink />} />

      {/* Phase 2 - Mechanic Public Profile & Dashboard */}
      <Route path="/m/:slug" element={<MechanicPublicProfile />} />
      <Route path="/mechanic/dashboard" element={<ProtectedRoute role="mechanic"><MechanicDashboard /></ProtectedRoute>} />
      <Route path="/mechanic/public-profile" element={<ProtectedRoute role="mechanic"><MechanicPublicProfile /></ProtectedRoute>} />

      {/* Phase 2 - Recurring Plans & Invoices */}
      <Route path="/customer/recurring-plans" element={<ProtectedRoute role="customer"><RecurringPlansDashboard /></ProtectedRoute>} />

      {/* Enhanced Features */}
      <Route path="/customer/home-enhanced" element={<ProtectedRoute role="customer"><CustomerHomeEnhanced /></ProtectedRoute>} />
      <Route path="/customer/wallet" element={<ProtectedRoute role="customer"><ClientWallet /></ProtectedRoute>} />
      <Route path="/customer/documents-manage" element={<ProtectedRoute role="customer"><DocumentsManager /></ProtectedRoute>} />
      <Route path="/customer/portal" element={<ProtectedRoute role="customer"><ClientPortal /></ProtectedRoute>} />
      <Route path="/mechanic/profile-enhanced" element={<ProtectedRoute role="mechanic"><MechanicProfileEnhanced /></ProtectedRoute>} />
      <Route path="/mechanic/portal" element={<ProtectedRoute role="mechanic"><ProviderPortal /></ProtectedRoute>} />
      <Route path="/mechanic/jobs" element={<ProtectedRoute role="mechanic"><JobManagement /></ProtectedRoute>} />
      <Route path="/tuner/:slug" element={<TunerProfile />} />
      <Route path="/seller/:slug" element={<SellerPublicProfile />} />
      <Route path="/seller/portal" element={<ProtectedRoute role="seller"><ProviderPortal /></ProtectedRoute>} />
      <Route path="/gift-plans" element={<GiftPlans />} />
      <Route path="/choose-plan" element={<ChoosePlan />} />
      <Route path="/discover" element={<ProtectedRoute role="customer"><ProviderDirectory /></ProtectedRoute>} />
      <Route path="/customer/new-request-enhanced" element={<ProtectedRoute role="customer"><NewRequestEnhanced /></ProtectedRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DemoProvider>
        <AppProvider>
          <AppRoutes />
          <DemoToggle />
        </AppProvider>
      </DemoProvider>
    </BrowserRouter>
  );
}
