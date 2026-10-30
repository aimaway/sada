import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './shared/context';
import { DemoProvider } from './shared/DemoContext';
import { ToastProvider } from './shared/notify';
import { DemoToggle } from './components/DemoToggle';

// ─── Code-splitting helpers (React.lazy + named-export interop) ───
// Every screen is loaded on demand: the initial bundle only contains the
// landing page + login. Chunks are cached by the service worker afterwards.
const lazyNamed = (factory: () => Promise<Record<string, any>>, name: string): React.LazyExoticComponent<any> =>
  React.lazy(async () => ({ default: (await factory())[name] }));
const P = (el: React.ReactNode) => (
  <Suspense
    fallback={
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-8 w-8 rounded-full border-3 border-blue-600 border-t-transparent" />
      </div>
    }
  >
    {el}
  </Suspense>
);

// Landing — kept in the main chunk (first paint / SEO)
import LandingPage from './landing/LandingPage';

// Customer
const CustomerLogin = lazyNamed(() => import('./customer/CustomerApp'), 'CustomerLogin');
const CustomerWaiting = lazyNamed(() => import('./customer/CustomerApp'), 'CustomerWaiting');
const CustomerRate = lazyNamed(() => import('./customer/CustomerApp'), 'CustomerRate');
const CustomerHistory = lazyNamed(() => import('./customer/CustomerApp'), 'CustomerHistory');
const NotificationsScreen = lazyNamed(() => import('./customer/NotificationsApp'), 'NotificationsScreen');
const CustomerProfileSetup = lazyNamed(() => import('./customer/CustomerProfileSetup'), 'CustomerProfileSetup');
const MaintenanceDashboard = lazyNamed(() => import('./customer/MaintenanceApp'), 'MaintenanceDashboard');
const ShopScreen = lazyNamed(() => import('./customer/MaintenanceApp'), 'ShopScreen');
const MaintenanceLogScreen = lazyNamed(() => import('./customer/MaintenanceApp'), 'MaintenanceLogScreen');
const RemindersScreen = lazyNamed(() => import('./customer/MaintenanceApp'), 'RemindersScreen');
const LegalDocumentsScreen = lazyNamed(() => import('./customer/LegalDocumentsApp'), 'LegalDocumentsScreen');
const NegotiationScreen = lazyNamed(() => import('./customer/NegotiationApp'), 'NegotiationScreen');
const MechanicProfileScreen = lazyNamed(() => import('./customer/OffersAndProfile'), 'MechanicProfileScreen');
const IfixAssistantPage = lazyNamed(() => import('./ifix/IfixAssistantPage'), 'IfixAssistantPage');
const IfixOffersScreen = lazyNamed(() => import('./ifix/OffersScreen'), 'OffersScreen');
const ProviderInbox = lazyNamed(() => import('./ifix/ProviderInbox'), 'ProviderInbox');
const RequestOfferDetail = lazyNamed(() => import('./ifix/RequestOfferDetail'), 'RequestOfferDetail');
const LiveTrackingScreen = lazyNamed(() => import('./customer/TrackingAndPayment'), 'LiveTrackingScreen');
const PaymentScreen = lazyNamed(() => import('./customer/TrackingAndPayment'), 'PaymentScreen');
const OrdersTab = lazyNamed(() => import('./customer/TrackingAndPayment'), 'OrdersTab');
const MessagesTab = lazyNamed(() => import('./customer/TabsAndProfile'), 'MessagesTab');
const ProfileScreen = lazyNamed(() => import('./customer/TabsAndProfile'), 'ProfileScreen');
const AIAssistantScreen = lazyNamed(() => import('./customer/SmartFeatures'), 'AIAssistantScreen');
const WarningLightScanner = lazyNamed(() => import('./customer/SmartFeatures'), 'WarningLightScanner');
const MechanicWalletScreen = lazyNamed(() => import('./customer/BusinessFeatures'), 'MechanicWalletScreen');
const AntiBypassingScreen = lazyNamed(() => import('./customer/BusinessFeatures'), 'AntiBypassingScreen');
const LocalSpecificsScreen = lazyNamed(() => import('./customer/BusinessFeatures'), 'LocalSpecificsScreen');

// Mechanic
const MechanicLogin = lazyNamed(() => import('./mechanic/MechanicApp'), 'MechanicLogin');
const MechanicActiveJob = lazyNamed(() => import('./mechanic/MechanicApp'), 'MechanicActiveJob');
const MechanicWallet = lazyNamed(() => import('./mechanic/MechanicApp'), 'MechanicWallet');
const MechanicEarnings = lazyNamed(() => import('./mechanic/MechanicApp'), 'MechanicEarnings');
const MechanicProfileSetup = lazyNamed(() => import('./mechanic/MechanicProfileSetup'), 'MechanicProfileSetup');

// Seller
const SellerLogin = lazyNamed(() => import('./seller/SellerApp'), 'SellerLogin');
const SellerSettings = lazyNamed(() => import('./seller/SellerApp'), 'SellerSettings');

// Admin
const AdminLogin = lazyNamed(() => import('./admin/AdminApp'), 'AdminLogin');
const AdminDashboard = lazyNamed(() => import('./admin/AdminApp'), 'AdminDashboard');
const AdminVerification = lazyNamed(() => import('./admin/AdminApp'), 'AdminVerification');
const AdminRequests = lazyNamed(() => import('./admin/AdminApp'), 'AdminRequests');
const AdminUsers = lazyNamed(() => import('./admin/AdminApp'), 'AdminUsers');
const AdminSettingsPage = lazyNamed(() => import('./admin/AdminApp'), 'AdminSettingsPage');
const AdminDisputes = lazyNamed(() => import('./admin/AdminApp'), 'AdminDisputes');
const AdminAudit = lazyNamed(() => import('./admin/AdminApp'), 'AdminAudit');

// Phase 2 Components
const UrgentRequestFlow = lazyNamed(() => import('./components/phase2/UrgentRequestFlow'), 'UrgentRequestFlow');
const PrePurchaseInspection = lazyNamed(() => import('./components/phase2/PrePurchaseInspection'), 'PrePurchaseInspection');
const OnBehalfRequest = lazyNamed(() => import('./components/phase2/OnBehalfRequest'), 'OnBehalfRequest');
const MechanicPublicProfile = lazyNamed(() => import('./components/phase2/MechanicPublicProfile'), 'MechanicPublicProfile');
const MechanicDashboard = lazyNamed(() => import('./components/phase2/MechanicDashboard'), 'MechanicDashboard');
const RecurringPlansDashboard = lazyNamed(() => import('./components/phase2/RecurringPlansDashboard'), 'RecurringPlansDashboard');
const BeneficiaryShareLink = lazyNamed(() => import('./components/phase2/BeneficiaryShareLink'), 'BeneficiaryShareLink');
const InspectionReportView = lazyNamed(() => import('./components/phase2/InspectionReportView'), 'InspectionReportView');

// Enhanced Components
const CustomerDashboard = lazyNamed(() => import('./components/CustomerDashboard'), 'CustomerDashboard');
const CustomerPersonalInfo = lazyNamed(() => import('./components/CustomerPersonalInfo'), 'CustomerPersonalInfo');
const MechanicStoreScreen = lazyNamed(() => import('./components/MechanicStore'), 'MechanicStoreScreen');
const SellerPartnershipsScreen = lazyNamed(() => import('./components/SellerPartnershipsScreen'), 'SellerPartnershipsScreen');
const ClientWallet = lazyNamed(() => import('./components/ClientWallet'), 'ClientWallet');
const DocumentsManager = lazyNamed(() => import('./components/DocumentsManager'), 'DocumentsManager');
const MechanicProfileEnhanced = lazyNamed(() => import('./components/MechanicProfileEnhanced'), 'MechanicProfileEnhanced');
const TunerProfile = lazyNamed(() => import('./components/TunerProfile'), 'TunerProfile');
const SellerPublicProfile = lazyNamed(() => import('./components/SellerPublicProfile'), 'SellerPublicProfile');
const ExplainProblem = lazyNamed(() => import('./components/ExplainProblem'), 'ExplainProblem');
const DiagnosticRequest = lazyNamed(() => import('./components/DiagnosticRequest'), 'DiagnosticRequest');
const MaintenanceRequest = lazyNamed(() => import('./components/MaintenanceRequest'), 'MaintenanceRequest');
const TunerLogin = lazyNamed(() => import('./components/TunerLogin'), 'TunerLogin');
const TunerRegistration = lazyNamed(() => import('./components/TunerRegistration'), 'TunerRegistration');
const TunerProfileEdit = lazyNamed(() => import('./components/TunerProfileEdit'), 'TunerProfileEdit');
const TunerServices = lazyNamed(() => import('./components/TunerServices'), 'TunerServices');
const TunerNotifications = lazyNamed(() => import('./components/TunerNotifications'), 'TunerNotifications');
const TunerPaymentMethods = lazyNamed(() => import('./components/TunerPaymentMethods'), 'TunerPaymentMethods');
const TunerWalletRecharge = lazyNamed(() => import('./components/TunerWalletRecharge'), 'TunerWalletRecharge');
const TunerGalleryUpload = lazyNamed(() => import('./components/TunerGalleryUpload'), 'TunerGalleryUpload');
const TunerRequestsMap = lazyNamed(() => import('./components/TunerRequestsMap'), 'TunerRequestsMap');
const MechanicPlans = lazyNamed(() => import('./components/MechanicPlans'), 'MechanicPlans');
const SellerPlans = lazyNamed(() => import('./components/SellerPlans'), 'SellerPlans');
const TunerPlans = lazyNamed(() => import('./components/TunerPlans'), 'TunerPlans');
const CustomerProfileComplete = lazyNamed(() => import('./components/CustomerProfileComplete'), 'CustomerProfileComplete');
const CustomerVehicles = lazyNamed(() => import('./components/CustomerVehicles'), 'CustomerVehicles');
const CustomerAddresses = lazyNamed(() => import('./components/CustomerAddresses'), 'CustomerAddresses');
const CustomerPaymentMethods = lazyNamed(() => import('./components/CustomerPaymentMethods'), 'CustomerPaymentMethods');
const CustomerNotifications = lazyNamed(() => import('./components/CustomerNotifications'), 'CustomerNotifications');
const CustomerTransactions = lazyNamed(() => import('./components/CustomerTransactions'), 'CustomerTransactions');
const CustomerReviews = lazyNamed(() => import('./components/CustomerReviews'), 'CustomerReviews');
const CustomerFavorites = lazyNamed(() => import('./components/CustomerFavorites'), 'CustomerFavorites');
const CustomerLanguage = lazyNamed(() => import('./components/CustomerLanguage'), 'CustomerLanguage');
const CustomerSecurity = lazyNamed(() => import('./components/CustomerSecurity'), 'CustomerSecurity');
const CustomerHelp = lazyNamed(() => import('./components/CustomerHelp'), 'CustomerHelp');
const CustomerContact = lazyNamed(() => import('./components/CustomerContact'), 'CustomerContact');
const CustomerTerms = lazyNamed(() => import('./components/CustomerTerms'), 'CustomerTerms');
const MechanicProfileComplete = lazyNamed(() => import('./components/MechanicProfileComplete'), 'MechanicProfileComplete');
const MechanicPersonalInfo = lazyNamed(() => import('./components/MechanicPersonalInfo'), 'MechanicPersonalInfo');
const MechanicServices = lazyNamed(() => import('./components/MechanicServices'), 'MechanicServices');
const MechanicServiceArea = lazyNamed(() => import('./components/MechanicServiceArea'), 'MechanicServiceArea');
const MechanicPricing = lazyNamed(() => import('./components/MechanicPricing'), 'MechanicPricing');
const MechanicVerification = lazyNamed(() => import('./components/MechanicVerification'), 'MechanicVerification');
const MechanicStats = lazyNamed(() => import('./components/MechanicStats'), 'MechanicStats');
const MechanicReviews = lazyNamed(() => import('./components/MechanicReviews'), 'MechanicReviews');
const MechanicPayouts = lazyNamed(() => import('./components/MechanicPayouts'), 'MechanicPayouts');
const MechanicNotifications = lazyNamed(() => import('./components/MechanicNotifications'), 'MechanicNotifications');
const MechanicVisibility = lazyNamed(() => import('./components/MechanicVisibility'), 'MechanicVisibility');
const GiftPlans = lazyNamed(() => import('./components/GiftPlans'), 'GiftPlans');
const NewRequestEnhanced = lazyNamed(() => import('./components/NewRequestEnhanced'), 'NewRequestEnhanced');
const RoleSelectionLogin = lazyNamed(() => import('./components/RoleSelectionLogin'), 'RoleSelectionLogin');

// Addendum Components - Phase A to F
const ProviderDirectory = lazyNamed(() => import('./components/ProviderDirectory'), 'ProviderDirectory');
const ProviderPortal = lazyNamed(() => import('./components/ProviderPortal'), 'ProviderPortal');
const JobManagement = lazyNamed(() => import('./components/JobManagement'), 'JobManagement');
const ClientPortal = lazyNamed(() => import('./components/ClientPortal'), 'ClientPortal');
const ChoosePlan = lazyNamed(() => import('./components/ChoosePlan'), 'ChoosePlan');

// New Seller & Tuner Portal Pages
const NewSellerDashboard = lazyNamed(() => import('./pages/SellerDashboard'), 'SellerDashboard');
const NewTunerDashboard = lazyNamed(() => import('./pages/TunerDashboard'), 'TunerDashboard');
// Standard sidebar shell shared by ALL roles (customer, mechanic, seller, tuner)
import { PortalSidebar } from './components/PortalSidebar';
const SellerProductsPage = lazyNamed(() => import('./pages/seller/SellerProductsPage'), 'SellerProductsPage');
const SellerOrdersPage = lazyNamed(() => import('./pages/seller/SellerPortalPages'), 'SellerOrdersPage');
const SellerOrderDetailPage = lazyNamed(() => import('./pages/seller/SellerPortalPages'), 'SellerOrderDetailPage');
const SellerInventoryPage = lazyNamed(() => import('./pages/seller/SellerPortalPages'), 'SellerInventoryPage');
const SellerAnalyticsPage = lazyNamed(() => import('./pages/seller/SellerPortalPages'), 'SellerAnalyticsPage');
const SellerNewProductPage = lazyNamed(() => import('./pages/seller/SellerPortalPages'), 'SellerNewProductPage');
const TunerRequestsPage = lazyNamed(() => import('./pages/tuner/TunerPortalPages'), 'TunerRequestsPage');
const TunerProjectsPage = lazyNamed(() => import('./pages/tuner/TunerPortalPages'), 'TunerProjectsPage');
const TunerProjectDetailPage = lazyNamed(() => import('./pages/tuner/TunerPortalPages'), 'TunerProjectDetailPage');
const TunerCalendarPage = lazyNamed(() => import('./pages/tuner/TunerPortalPages'), 'TunerCalendarPage');
const TunerPortfolioPage = lazyNamed(() => import('./pages/tuner/TunerPortalPages'), 'TunerPortfolioPage');

// Content Pages
const ContactPage = lazyNamed(() => import('./pages/ContactPage'), 'ContactPage');
const AboutPage = lazyNamed(() => import('./pages/ContentPages'), 'AboutPage');
const FAQPage = lazyNamed(() => import('./pages/ContentPages'), 'FAQPage');
const TermsPage = lazyNamed(() => import('./pages/ContentPages'), 'TermsPage');
const PrivacyPage = lazyNamed(() => import('./pages/ContentPages'), 'PrivacyPage');

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
      <Route path="/login" element={P(<RoleSelectionLogin />)} />

      {/* Public content pages */}
      <Route path="/about" element={P(<AboutPage />)} />
      <Route path="/contact" element={P(<ContactPage />)} />
      <Route path="/faq" element={P(<FAQPage />)} />
      <Route path="/terms" element={P(<TermsPage />)} />
      <Route path="/privacy" element={P(<PrivacyPage />)} />

      {/* Customer */}
      <Route path="/customer/login" element={P(<CustomerLogin />)} />
      <Route path="/customer/profile-setup" element={<ProtectedRoute role="customer">P(<CustomerProfileSetup />)</ProtectedRoute>} />
      <Route path="/customer/home" element={<ProtectedRoute role="customer"><PortalSidebar title="Accueil client">P(<CustomerDashboard />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/notifications" element={<ProtectedRoute role="customer"><PortalSidebar title="Notifications">P(<NotificationsScreen />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/new-request" element={<ProtectedRoute role="customer"><PortalSidebar title="Nouvelle demande" backRoute="/customer/home">P(<NewRequestEnhanced />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/explain-problem" element={<ProtectedRoute role="customer"><PortalSidebar title="Expliquer mon problème" backRoute="/customer/home">P(<ExplainProblem />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/diagnostic" element={<ProtectedRoute role="customer"><PortalSidebar title="Demande de diagnostic" backRoute="/customer/home">P(<DiagnosticRequest />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/maintenance-request" element={<ProtectedRoute role="customer"><PortalSidebar title="Demande d'entretien" backRoute="/customer/home">P(<MaintenanceRequest />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/waiting" element={<ProtectedRoute role="customer">P(<CustomerWaiting />)</ProtectedRoute>} />
      <Route path="/customer/offers" element={<ProtectedRoute role="customer"><PortalSidebar title="Offres reçues">P(<IfixOffersScreen />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/ifix" element={<ProtectedRoute role="customer"><PortalSidebar title="IFIX AI">P(<IfixAssistantPage />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/mechanic-profile/:id" element={<ProtectedRoute role="customer">P(<MechanicProfileScreen />)</ProtectedRoute>} />
      <Route path="/customer/tracking" element={<ProtectedRoute role="customer"><PortalSidebar title="Suivi en direct">P(<LiveTrackingScreen />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/negotiation" element={<ProtectedRoute role="customer"><PortalSidebar title="Négociation" backRoute="/customer/offers">P(<NegotiationScreen />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/payment" element={<ProtectedRoute role="customer"><PortalSidebar title="Paiement">P(<PaymentScreen />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/rate" element={<ProtectedRoute role="customer"><PortalSidebar title="Notez votre mécanicien" backRoute="/customer/history">P(<CustomerRate />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/history" element={<ProtectedRoute role="customer"><PortalSidebar title="Historique">P(<CustomerHistory />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/orders" element={<ProtectedRoute role="customer"><PortalSidebar title="Mes commandes">P(<OrdersTab />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/messages" element={<ProtectedRoute role="customer"><PortalSidebar title="Messages">P(<MessagesTab />)</PortalSidebar></ProtectedRoute>} />
      {/* Same standard sidebar shell for the customer profile */}
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute role="customer">
            <PortalSidebar title="Mon Profil">
              P(<CustomerProfileComplete />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/customer/profile-old" element={<ProtectedRoute role="customer"><PortalSidebar title="Ancien profil">P(<ProfileScreen />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/maintenance" element={<ProtectedRoute role="customer"><PortalSidebar title="Entretien Auto">P(<MaintenanceDashboard />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/shop" element={<ProtectedRoute role="customer"><PortalSidebar title="Boutique Auto">P(<ShopScreen />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/maintenance-log" element={<ProtectedRoute role="customer"><PortalSidebar title="Carnet d'entretien">P(<MaintenanceLogScreen />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/reminders" element={<ProtectedRoute role="customer"><PortalSidebar title="Rappels">P(<RemindersScreen />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/documents" element={<ProtectedRoute role="customer"><PortalSidebar title="Documents légaux">P(<LegalDocumentsScreen />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/ai-assistant" element={<ProtectedRoute role="customer"><PortalSidebar title="Assistant IA">P(<AIAssistantScreen />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/warning-scanner" element={<ProtectedRoute role="customer"><PortalSidebar title="Scanner voyants">P(<WarningLightScanner />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/business/wallet" element={<ProtectedRoute role="customer"><PortalSidebar title="Portefeuille pro">P(<MechanicWalletScreen />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/business/anti-bypass" element={<ProtectedRoute role="customer"><PortalSidebar title="Anti-contournement">P(<AntiBypassingScreen />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/business/local" element={<ProtectedRoute role="customer"><PortalSidebar title="Spécificités locales">P(<LocalSpecificsScreen />)</PortalSidebar></ProtectedRoute>} />

      {/* Mechanic */}
      <Route path="/mechanic/login" element={P(<MechanicLogin />)} />
      <Route path="/mechanic/profile-setup" element={<ProtectedRoute role="mechanic">P(<MechanicProfileSetup />)</ProtectedRoute>} />
      <Route path="/mechanic/home" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Tableau de bord">P(<MechanicDashboard />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/request/:id" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Détail de la demande" backRoute="/mechanic/inbox">P(<RequestOfferDetail />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/inbox" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Boîte de réception">P(<ProviderInbox />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/active-job" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Job actif">P(<MechanicActiveJob />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/wallet" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Portefeuille">P(<MechanicWallet />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/earnings" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Gains">P(<MechanicEarnings />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/shop" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Boutique pièces">P(<MechanicStoreScreen />)</PortalSidebar></ProtectedRoute>} />

      {/* Seller */}
      <Route path="/seller/login" element={P(<SellerLogin />)} />
      {/* Old seller dashboard now renders the NEW experience inside the standard sidebar */}
      <Route
        path="/seller/dashboard"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar>
              P(<NewSellerDashboard />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/seller/partnerships" element={<ProtectedRoute role="seller"><PortalSidebar title="Partenariats">P(<SellerPartnershipsScreen />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/seller/settings" element={<ProtectedRoute role="seller"><PortalSidebar title="Réglages boutique">P(<SellerSettings />)</PortalSidebar></ProtectedRoute>} />

      {/* Tuner */}
      <Route path="/tuner/login" element={P(<TunerLogin />)} />
      <Route path="/tuner/register" element={P(<TunerRegistration />)} />
      {/* Old tuner dashboard now renders the NEW experience inside the standard sidebar */}
      <Route
        path="/tuner/dashboard"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar>
              P(<NewTunerDashboard />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/tuner/profile-edit" element={<ProtectedRoute role="tuner"><PortalSidebar title="Modifier mon profil" backRoute="/tuner/portal">P(<TunerProfileEdit />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/services" element={<ProtectedRoute role="tuner"><PortalSidebar title="Mes services">P(<TunerServices />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/notifications" element={<ProtectedRoute role="tuner"><PortalSidebar title="Notifications">P(<TunerNotifications />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/payment-methods" element={<ProtectedRoute role="tuner"><PortalSidebar title="Méthodes de paiement">P(<TunerPaymentMethods />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/wallet-recharge" element={<ProtectedRoute role="tuner"><PortalSidebar title="Portefeuille">P(<TunerWalletRecharge />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/gallery-upload" element={<ProtectedRoute role="tuner"><PortalSidebar title="Ajouter au portfolio" backRoute="/tuner/portfolio">P(<TunerGalleryUpload />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/requests-map" element={<ProtectedRoute role="tuner"><PortalSidebar title="Carte des demandes">P(<TunerRequestsMap />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/plans" element={<ProtectedRoute role="tuner"><PortalSidebar title="Abonnement tuner">P(<TunerPlans />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/plans" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Abonnement mécanicien">P(<MechanicPlans />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/seller/plans" element={<ProtectedRoute role="seller"><PortalSidebar title="Abonnement vendeur">P(<SellerPlans />)</PortalSidebar></ProtectedRoute>} />

      {/* Customer Profile Complete - Sub-routes (same shell as the profile page) */}
      <Route path="/customer/profile/vehicles" element={<ProtectedRoute role="customer"><PortalSidebar title="Mon garage" backRoute="/customer/profile">P(<CustomerVehicles />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/addresses" element={<ProtectedRoute role="customer"><PortalSidebar title="Mes adresses" backRoute="/customer/profile">P(<CustomerAddresses />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/payment-methods" element={<ProtectedRoute role="customer"><PortalSidebar title="Méthodes de paiement" backRoute="/customer/profile">P(<CustomerPaymentMethods />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/notifications" element={<ProtectedRoute role="customer"><PortalSidebar title="Notifications" backRoute="/customer/profile">P(<CustomerNotifications />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/transactions" element={<ProtectedRoute role="customer"><PortalSidebar title="Transactions" backRoute="/customer/profile">P(<CustomerTransactions />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/reviews" element={<ProtectedRoute role="customer"><PortalSidebar title="Mes avis" backRoute="/customer/profile">P(<CustomerReviews />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/favorites" element={<ProtectedRoute role="customer"><PortalSidebar title="Favoris" backRoute="/customer/profile">P(<CustomerFavorites />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/language" element={<ProtectedRoute role="customer"><PortalSidebar title="Langue" backRoute="/customer/profile">P(<CustomerLanguage />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/security" element={<ProtectedRoute role="customer"><PortalSidebar title="Sécurité" backRoute="/customer/profile">P(<CustomerSecurity />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/help" element={<ProtectedRoute role="customer"><PortalSidebar title="Aide & contact" backRoute="/customer/profile">P(<CustomerHelp />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/contact" element={<ProtectedRoute role="customer"><PortalSidebar title="Contact" backRoute="/customer/profile">P(<CustomerContact />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/terms" element={<ProtectedRoute role="customer"><PortalSidebar title="Conditions d'utilisation" backRoute="/customer/profile">P(<CustomerTerms />)</PortalSidebar></ProtectedRoute>} />
      {/* Sous-pages profile manquantes (restaient inaccessibles -> redirection accueil) */}
      <Route path="/customer/profile/info" element={<ProtectedRoute role="customer"><PortalSidebar title="Informations personnelles" backRoute="/customer/profile">P(<CustomerPersonalInfo />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/maintenance-history" element={<ProtectedRoute role="customer"><PortalSidebar title="Historique maintenance" backRoute="/customer/profile">P(<MaintenanceLogScreen />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/privacy" element={<ProtectedRoute role="customer"><PortalSidebar title="Confidentialité" backRoute="/customer/profile">P(<PrivacyPage />)</PortalSidebar></ProtectedRoute>} />
      {/* Alias garage */}
      <Route path="/customer/vehicles" element={<Navigate to="/customer/profile/vehicles" replace />} />

      {/* Admin */}
      <Route path="/admin/login" element={P(<AdminLogin />)} />
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><PortalSidebar title="Console admin" autoShell={false}>P(<AdminDashboard />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/admin/verification" element={<ProtectedRoute role="admin"><PortalSidebar title="File de vérification" autoShell={false}>P(<AdminVerification />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/admin/requests" element={<ProtectedRoute role="admin"><PortalSidebar title="Demandes & Jobs" autoShell={false}>P(<AdminRequests />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><PortalSidebar title="Utilisateurs" autoShell={false}>P(<AdminUsers />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><PortalSidebar title="Paramètres plateforme" autoShell={false}>P(<AdminSettingsPage />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/admin/disputes" element={<ProtectedRoute role="admin"><PortalSidebar title="Litiges" autoShell={false}>P(<AdminDisputes />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/admin/audit" element={<ProtectedRoute role="admin"><PortalSidebar title="Journal d'audit" autoShell={false}>P(<AdminAudit />)</PortalSidebar></ProtectedRoute>} />

      {/* Phase 2 - Two-Wheelers & Pros */}
      <Route path="/customer/urgent/motorcycle" element={<ProtectedRoute role="customer">{P(<UrgentRequestFlow {...({ vehicleType: "motorcycle" } as any)} />)}</ProtectedRoute>} />
      <Route path="/customer/urgent/scooter" element={<ProtectedRoute role="customer">{P(<UrgentRequestFlow {...({ vehicleType: "scooter" } as any)} />)}</ProtectedRoute>} />
      <Route path="/customer/urgent/ebike" element={<ProtectedRoute role="customer">{P(<UrgentRequestFlow {...({ vehicleType: "ebike" } as any)} />)}</ProtectedRoute>} />

      {/* Phase 2 - Pre-purchase Inspection */}
      <Route path="/customer/inspection/book" element={<ProtectedRoute role="customer">P(<PrePurchaseInspection />)</ProtectedRoute>} />
      <Route path="/inspection-report/:slug" element={P(<InspectionReportView />)} />

      {/* Phase 2 - On-behalf Request */}
      <Route path="/customer/on-behalf/new" element={<ProtectedRoute role="customer">P(<OnBehalfRequest />)</ProtectedRoute>} />
      <Route path="/on-behalf/:token" element={P(<BeneficiaryShareLink />)} />

      {/* Phase 2 - Mechanic Public Profile & Dashboard */}
      <Route path="/m/:slug" element={P(<MechanicPublicProfile />)} />
      <Route path="/mechanic/dashboard" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Tableau de bord">P(<MechanicDashboard />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/public-profile" element={<ProtectedRoute role="mechanic">P(<MechanicPublicProfile />)</ProtectedRoute>} />

      {/* Phase 2 - Recurring Plans & Invoices */}
      <Route path="/customer/recurring-plans" element={<ProtectedRoute role="customer"><PortalSidebar title="Plans récurrents">P(<RecurringPlansDashboard />)</PortalSidebar></ProtectedRoute>} />

      {/* Enhanced Features */}
      <Route path="/customer/home-enhanced" element={<Navigate to="/customer/home" replace />} />
      <Route path="/customer/wallet" element={<ProtectedRoute role="customer"><PortalSidebar title="Mon portefeuille">P(<ClientWallet />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/documents-manage" element={<ProtectedRoute role="customer"><PortalSidebar title="Mes documents">P(<DocumentsManager />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/portal" element={<ProtectedRoute role="customer"><PortalSidebar title="Espace client">P(<ClientPortal />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile-enhanced" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Profil pro">P(<MechanicProfileEnhanced />)</PortalSidebar></ProtectedRoute>} />
      {/* Same standard sidebar shell for the mechanic profile */}
      <Route
        path="/mechanic/profile"
        element={
          <ProtectedRoute role="mechanic">
            <PortalSidebar title="Mon Profil Pro">
              P(<MechanicProfileComplete />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/mechanic/profile/info" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Informations personnelles" backRoute="/mechanic/profile">P(<MechanicPersonalInfo />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/services" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Mes services" backRoute="/mechanic/profile">P(<MechanicServices />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/area" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Zone d'intervention" backRoute="/mechanic/profile">P(<MechanicServiceArea />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/pricing" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Tarifs" backRoute="/mechanic/profile">P(<MechanicPricing />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/verification" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Vérification" backRoute="/mechanic/profile">P(<MechanicVerification />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/stats" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Statistiques" backRoute="/mechanic/profile">P(<MechanicStats />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/reviews" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Avis clients" backRoute="/mechanic/profile">P(<MechanicReviews />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/payouts" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Paiements" backRoute="/mechanic/profile">P(<MechanicPayouts />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/notifications" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Notifications" backRoute="/mechanic/profile">P(<MechanicNotifications />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/visibility" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Visibilité" backRoute="/mechanic/profile">P(<MechanicVisibility />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/portal" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Portail Pro">P(<ProviderPortal />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/jobs" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Mes jobs">P(<JobManagement />)</PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/:slug" element={P(<TunerProfile />)} />
      <Route path="/seller/:slug" element={P(<SellerPublicProfile />)} />
      <Route path="/gift-plans" element={P(<GiftPlans />)} />
      <Route path="/choose-plan" element={P(<ChoosePlan />)} />

      {/* Full Seller Portal (canonical routes — deduplicated) */}
      <Route
        path="/seller/portal"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Tableau de bord vendeur">
              P(<NewSellerDashboard />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/seller/portal-new" element={<Navigate to="/seller/portal" replace />} />
      <Route
        path="/seller/products"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Mes produits">
              P(<SellerProductsPage />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/new"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Ajouter un produit" backRoute="/seller/products">
              P(<SellerNewProductPage />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/orders"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Toutes les commandes">
              P(<SellerOrdersPage />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/orders/:id"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Détail de la commande" backRoute="/seller/orders">
              P(<SellerOrderDetailPage />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/inventory"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Stock & alertes">
              P(<SellerInventoryPage />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/analytics"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Statistiques de vente">
              P(<SellerAnalyticsPage />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />

      {/* Full Tuner Portal (canonical routes — deduplicated) */}
      <Route
        path="/tuner/portal"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Tableau de bord tuner">
              P(<NewTunerDashboard />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/tuner/portal-new" element={<Navigate to="/tuner/portal" replace />} />
      <Route
        path="/tuner/requests"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Demandes reçues">
              P(<TunerRequestsPage />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuner/projects"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Mes projets">
              P(<TunerProjectsPage />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuner/projects/:id"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Détail du projet" backRoute="/tuner/projects">
              P(<TunerProjectDetailPage />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuner/calendar"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Agenda">
              P(<TunerCalendarPage />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuner/appointments/:id"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Agenda">
              P(<TunerCalendarPage />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuner/portfolio"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Portfolio">
              P(<TunerPortfolioPage />)
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/discover" element={<ProtectedRoute role="customer">P(<ProviderDirectory />)</ProtectedRoute>} />

      {/* Catch all — NotFound contextuel : un utilisateur authentifié n'est JAMAIS
          renvoyé vers la landing publique (ancien bug de redirection accueil). */}
      <Route path="*" element={<RoleAwareNotFound />} />
    </Routes>
  );
}

// Composant défini après App() via hoisting de fonction — utilisé dans les Routes.
function RoleAwareNotFound() {
  const { user } = useApp();
  const homeByRole: Record<string, string> = {
    customer: '/customer/home',
    mechanic: '/mechanic/home',
    seller: '/seller/portal',
    tuner: '/tuner/portal',
    admin: '/admin/dashboard',
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-3xl font-bold mb-4">404</div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Page introuvable</h1>
        <p className="text-sm text-slate-500 mb-6">
          La page demandée n'existe pas ou a été déplacée. Votre session est toujours active.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {user ? (
            <a
              href={homeByRole[user.role] || '/'}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              Retour à mon espace
            </a>
          ) : (
            <a
              href="/"
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              Retour à l'accueil TomoBily
            </a>
          )}
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
          >
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <DemoProvider>
          <AppProvider>
            <AppRoutes />
            <DemoToggle />
          </AppProvider>
        </DemoProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
