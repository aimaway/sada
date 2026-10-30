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
// Wrap a lazy screen in <Suspense>. IMPORTANT: this must be used as a JSX
// *component* — <P><Screen /></P> — never as a function call <P><Screen /></P>,
// which renders the literal text "P(" and an empty page.
const P = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-8 w-8 rounded-full border-3 border-blue-600 border-t-transparent" />
      </div>
    }
  >
    {children}
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
const AdminMetricsControl = lazyNamed(() => import('./admin/AdminApp'), 'AdminMetricsControl');

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
      <Route path="/login" element={<P><RoleSelectionLogin /></P>} />

      {/* Public content pages */}
      <Route path="/about" element={<P><AboutPage /></P>} />
      <Route path="/contact" element={<P><ContactPage /></P>} />
      <Route path="/faq" element={<P><FAQPage /></P>} />
      <Route path="/terms" element={<P><TermsPage /></P>} />
      <Route path="/privacy" element={<P><PrivacyPage /></P>} />

      {/* Customer */}
      <Route path="/customer/login" element={<P><CustomerLogin /></P>} />
      <Route path="/customer/profile-setup" element={<ProtectedRoute role="customer"><P><CustomerProfileSetup /></P></ProtectedRoute>} />
      <Route path="/customer/home" element={<ProtectedRoute role="customer"><PortalSidebar title="Accueil client"><P><CustomerDashboard /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/notifications" element={<ProtectedRoute role="customer"><PortalSidebar title="Notifications"><P><NotificationsScreen /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/new-request" element={<ProtectedRoute role="customer"><PortalSidebar title="Nouvelle demande" backRoute="/customer/home"><P><NewRequestEnhanced /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/explain-problem" element={<ProtectedRoute role="customer"><PortalSidebar title="Expliquer mon problème" backRoute="/customer/home"><P><ExplainProblem /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/diagnostic" element={<ProtectedRoute role="customer"><PortalSidebar title="Demande de diagnostic" backRoute="/customer/home"><P><DiagnosticRequest /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/maintenance-request" element={<ProtectedRoute role="customer"><PortalSidebar title="Demande d'entretien" backRoute="/customer/home"><P><MaintenanceRequest /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/waiting" element={<ProtectedRoute role="customer"><P><CustomerWaiting /></P></ProtectedRoute>} />
      <Route path="/customer/offers" element={<ProtectedRoute role="customer"><PortalSidebar title="Offres reçues"><P><IfixOffersScreen /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/ifix" element={<ProtectedRoute role="customer"><PortalSidebar title="IFIX AI"><P><IfixAssistantPage /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/mechanic-profile/:id" element={<ProtectedRoute role="customer"><P><MechanicProfileScreen /></P></ProtectedRoute>} />
      <Route path="/customer/tracking" element={<ProtectedRoute role="customer"><PortalSidebar title="Suivi en direct"><P><LiveTrackingScreen /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/negotiation" element={<ProtectedRoute role="customer"><PortalSidebar title="Négociation" backRoute="/customer/offers"><P><NegotiationScreen /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/payment" element={<ProtectedRoute role="customer"><PortalSidebar title="Paiement"><P><PaymentScreen /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/rate" element={<ProtectedRoute role="customer"><PortalSidebar title="Notez votre mécanicien" backRoute="/customer/history"><P><CustomerRate /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/history" element={<ProtectedRoute role="customer"><PortalSidebar title="Historique"><P><CustomerHistory /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/orders" element={<ProtectedRoute role="customer"><PortalSidebar title="Mes commandes"><P><OrdersTab /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/messages" element={<ProtectedRoute role="customer"><PortalSidebar title="Messages"><P><MessagesTab /></P></PortalSidebar></ProtectedRoute>} />
      {/* Same standard sidebar shell for the customer profile */}
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute role="customer">
            <PortalSidebar title="Mon Profil">
              <P><CustomerProfileComplete /></P>
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/customer/profile-old" element={<ProtectedRoute role="customer"><PortalSidebar title="Ancien profil"><P><ProfileScreen /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/maintenance" element={<ProtectedRoute role="customer"><PortalSidebar title="Entretien Auto"><P><MaintenanceDashboard /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/shop" element={<ProtectedRoute role="customer"><PortalSidebar title="Boutique Auto"><P><ShopScreen /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/maintenance-log" element={<ProtectedRoute role="customer"><PortalSidebar title="Carnet d'entretien"><P><MaintenanceLogScreen /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/reminders" element={<ProtectedRoute role="customer"><PortalSidebar title="Rappels"><P><RemindersScreen /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/documents" element={<ProtectedRoute role="customer"><PortalSidebar title="Documents légaux"><P><LegalDocumentsScreen /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/ai-assistant" element={<ProtectedRoute role="customer"><PortalSidebar title="Assistant IA"><P><AIAssistantScreen /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/warning-scanner" element={<ProtectedRoute role="customer"><PortalSidebar title="Scanner voyants"><P><WarningLightScanner /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/business/wallet" element={<ProtectedRoute role="customer"><PortalSidebar title="Portefeuille pro"><P><MechanicWalletScreen /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/business/anti-bypass" element={<ProtectedRoute role="customer"><PortalSidebar title="Anti-contournement"><P><AntiBypassingScreen /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/business/local" element={<ProtectedRoute role="customer"><PortalSidebar title="Spécificités locales"><P><LocalSpecificsScreen /></P></PortalSidebar></ProtectedRoute>} />

      {/* Mechanic */}
      <Route path="/mechanic/login" element={<P><MechanicLogin /></P>} />
      <Route path="/mechanic/profile-setup" element={<ProtectedRoute role="mechanic"><P><MechanicProfileSetup /></P></ProtectedRoute>} />
      <Route path="/mechanic/home" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Tableau de bord"><P><MechanicDashboard /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/request/:id" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Détail de la demande" backRoute="/mechanic/inbox"><P><RequestOfferDetail /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/inbox" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Boîte de réception"><P><ProviderInbox /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/active-job" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Job actif"><P><MechanicActiveJob /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/wallet" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Portefeuille"><P><MechanicWallet /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/earnings" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Gains"><P><MechanicEarnings /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/shop" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Boutique pièces"><P><MechanicStoreScreen /></P></PortalSidebar></ProtectedRoute>} />

      {/* Seller */}
      <Route path="/seller/login" element={<P><SellerLogin /></P>} />
      {/* Old seller dashboard now renders the NEW experience inside the standard sidebar */}
      <Route
        path="/seller/dashboard"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar>
              <P><NewSellerDashboard /></P>
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/seller/partnerships" element={<ProtectedRoute role="seller"><PortalSidebar title="Partenariats"><P><SellerPartnershipsScreen /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/seller/settings" element={<ProtectedRoute role="seller"><PortalSidebar title="Réglages boutique"><P><SellerSettings /></P></PortalSidebar></ProtectedRoute>} />

      {/* Tuner */}
      <Route path="/tuner/login" element={<P><TunerLogin /></P>} />
      <Route path="/tuner/register" element={<P><TunerRegistration /></P>} />
      {/* Old tuner dashboard now renders the NEW experience inside the standard sidebar */}
      <Route
        path="/tuner/dashboard"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar>
              <P><NewTunerDashboard /></P>
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/tuner/profile-edit" element={<ProtectedRoute role="tuner"><PortalSidebar title="Modifier mon profil" backRoute="/tuner/portal"><P><TunerProfileEdit /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/services" element={<ProtectedRoute role="tuner"><PortalSidebar title="Mes services"><P><TunerServices /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/notifications" element={<ProtectedRoute role="tuner"><PortalSidebar title="Notifications"><P><TunerNotifications /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/payment-methods" element={<ProtectedRoute role="tuner"><PortalSidebar title="Méthodes de paiement"><P><TunerPaymentMethods /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/wallet-recharge" element={<ProtectedRoute role="tuner"><PortalSidebar title="Portefeuille"><P><TunerWalletRecharge /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/gallery-upload" element={<ProtectedRoute role="tuner"><PortalSidebar title="Ajouter au portfolio" backRoute="/tuner/portfolio"><P><TunerGalleryUpload /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/requests-map" element={<ProtectedRoute role="tuner"><PortalSidebar title="Carte des demandes"><P><TunerRequestsMap /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/plans" element={<ProtectedRoute role="tuner"><PortalSidebar title="Abonnement tuner"><P><TunerPlans /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/plans" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Abonnement mécanicien"><P><MechanicPlans /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/seller/plans" element={<ProtectedRoute role="seller"><PortalSidebar title="Abonnement vendeur"><P><SellerPlans /></P></PortalSidebar></ProtectedRoute>} />

      {/* Customer Profile Complete - Sub-routes (same shell as the profile page) */}
      <Route path="/customer/profile/vehicles" element={<ProtectedRoute role="customer"><PortalSidebar title="Mon garage" backRoute="/customer/profile"><P><CustomerVehicles /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/addresses" element={<ProtectedRoute role="customer"><PortalSidebar title="Mes adresses" backRoute="/customer/profile"><P><CustomerAddresses /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/payment-methods" element={<ProtectedRoute role="customer"><PortalSidebar title="Méthodes de paiement" backRoute="/customer/profile"><P><CustomerPaymentMethods /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/notifications" element={<ProtectedRoute role="customer"><PortalSidebar title="Notifications" backRoute="/customer/profile"><P><CustomerNotifications /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/transactions" element={<ProtectedRoute role="customer"><PortalSidebar title="Transactions" backRoute="/customer/profile"><P><CustomerTransactions /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/reviews" element={<ProtectedRoute role="customer"><PortalSidebar title="Mes avis" backRoute="/customer/profile"><P><CustomerReviews /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/favorites" element={<ProtectedRoute role="customer"><PortalSidebar title="Favoris" backRoute="/customer/profile"><P><CustomerFavorites /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/language" element={<ProtectedRoute role="customer"><PortalSidebar title="Langue" backRoute="/customer/profile"><P><CustomerLanguage /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/security" element={<ProtectedRoute role="customer"><PortalSidebar title="Sécurité" backRoute="/customer/profile"><P><CustomerSecurity /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/help" element={<ProtectedRoute role="customer"><PortalSidebar title="Aide & contact" backRoute="/customer/profile"><P><CustomerHelp /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/contact" element={<ProtectedRoute role="customer"><PortalSidebar title="Contact" backRoute="/customer/profile"><P><CustomerContact /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/terms" element={<ProtectedRoute role="customer"><PortalSidebar title="Conditions d'utilisation" backRoute="/customer/profile"><P><CustomerTerms /></P></PortalSidebar></ProtectedRoute>} />
      {/* Alias : le bouton "Paramètres du compte" du tableau de bord client */}
      <Route path="/customer/profile/settings" element={<Navigate to="/customer/profile" replace />} />
      {/* Sous-pages profile manquantes (restaient inaccessibles -> redirection accueil) */}
      <Route path="/customer/profile/info" element={<ProtectedRoute role="customer"><PortalSidebar title="Informations personnelles" backRoute="/customer/profile"><P><CustomerPersonalInfo /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/maintenance-history" element={<ProtectedRoute role="customer"><PortalSidebar title="Historique maintenance" backRoute="/customer/profile"><P><MaintenanceLogScreen /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/privacy" element={<ProtectedRoute role="customer"><PortalSidebar title="Confidentialité" backRoute="/customer/profile"><P><PrivacyPage /></P></PortalSidebar></ProtectedRoute>} />
      {/* Alias garage */}
      <Route path="/customer/vehicles" element={<Navigate to="/customer/profile/vehicles" replace />} />
      {/* Alias des anciens liens internes qui n'avaient pas de route (-> 404) */}
      <Route path="/customer/requests" element={<Navigate to="/customer/offers" replace />} />
      <Route path="/customer/addresses" element={<Navigate to="/customer/profile/addresses" replace />} />
      <Route path="/customer/new-request-enhanced" element={<Navigate to="/customer/new-request" replace />} />
      <Route path="/customer/on-behalf" element={<Navigate to="/customer/on-behalf/new" replace />} />
      <Route path="/customer/inspections" element={<Navigate to="/customer/inspection/book" replace />} />
      {/* Alias : bouton "Voir les abonnements" de l'assistant IFIX */}
      <Route path="/customer/subscription" element={<Navigate to="/choose-plan" replace />} />

      {/* Admin */}
      <Route path="/admin/login" element={<P><AdminLogin /></P>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><P><AdminDashboard /></P></ProtectedRoute>} />
      <Route path="/admin/verification" element={<ProtectedRoute role="admin"><P><AdminVerification /></P></ProtectedRoute>} />
      <Route path="/admin/requests" element={<ProtectedRoute role="admin"><P><AdminRequests /></P></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><P><AdminUsers /></P></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><P><AdminSettingsPage /></P></ProtectedRoute>} />
      <Route path="/admin/disputes" element={<ProtectedRoute role="admin"><P><AdminDisputes /></P></ProtectedRoute>} />
      <Route path="/admin/audit" element={<ProtectedRoute role="admin"><P><AdminAudit /></P></ProtectedRoute>} />
      <Route path="/admin/metrics" element={<ProtectedRoute role="admin"><P><AdminMetricsControl /></P></ProtectedRoute>} />

      {/* Phase 2 - Two-Wheelers & Pros */}
      <Route path="/customer/urgent/motorcycle" element={<ProtectedRoute role="customer">{<P><UrgentRequestFlow {...({ vehicleType: "motorcycle" } as any)} /></P>}</ProtectedRoute>} />
      <Route path="/customer/urgent/scooter" element={<ProtectedRoute role="customer">{<P><UrgentRequestFlow {...({ vehicleType: "scooter" } as any)} /></P>}</ProtectedRoute>} />
      <Route path="/customer/urgent/ebike" element={<ProtectedRoute role="customer">{<P><UrgentRequestFlow {...({ vehicleType: "ebike" } as any)} /></P>}</ProtectedRoute>} />

      {/* Phase 2 - Pre-purchase Inspection */}
      <Route path="/customer/inspection/book" element={<ProtectedRoute role="customer"><P><PrePurchaseInspection /></P></ProtectedRoute>} />
      <Route path="/inspection-report/:slug" element={<P><InspectionReportView /></P>} />

      {/* Phase 2 - On-behalf Request */}
      <Route path="/customer/on-behalf/new" element={<ProtectedRoute role="customer"><P><OnBehalfRequest /></P></ProtectedRoute>} />
      <Route path="/on-behalf/:token" element={<P><BeneficiaryShareLink /></P>} />

      {/* Phase 2 - Mechanic Public Profile & Dashboard */}
      <Route path="/m/:slug" element={<P><MechanicPublicProfile /></P>} />
      <Route path="/mechanic/dashboard" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Tableau de bord"><P><MechanicDashboard /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/public-profile" element={<ProtectedRoute role="mechanic"><P><MechanicPublicProfile /></P></ProtectedRoute>} />

      {/* Phase 2 - Recurring Plans & Invoices */}
      <Route path="/customer/recurring-plans" element={<ProtectedRoute role="customer"><PortalSidebar title="Plans récurrents"><P><RecurringPlansDashboard /></P></PortalSidebar></ProtectedRoute>} />

      {/* Enhanced Features */}
      <Route path="/customer/home-enhanced" element={<Navigate to="/customer/home" replace />} />
      <Route path="/customer/wallet" element={<ProtectedRoute role="customer"><PortalSidebar title="Mon portefeuille"><P><ClientWallet /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/documents-manage" element={<ProtectedRoute role="customer"><PortalSidebar title="Mes documents"><P><DocumentsManager /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/portal" element={<ProtectedRoute role="customer"><PortalSidebar title="Espace client"><P><ClientPortal /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile-enhanced" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Profil pro"><P><MechanicProfileEnhanced /></P></PortalSidebar></ProtectedRoute>} />
      {/* Same standard sidebar shell for the mechanic profile */}
      <Route
        path="/mechanic/profile"
        element={
          <ProtectedRoute role="mechanic">
            <PortalSidebar title="Mon Profil Pro">
              <P><MechanicProfileComplete /></P>
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/mechanic/profile/info" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Informations personnelles" backRoute="/mechanic/profile"><P><MechanicPersonalInfo /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/services" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Mes services" backRoute="/mechanic/profile"><P><MechanicServices /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/area" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Zone d'intervention" backRoute="/mechanic/profile"><P><MechanicServiceArea /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/pricing" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Tarifs" backRoute="/mechanic/profile"><P><MechanicPricing /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/verification" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Vérification" backRoute="/mechanic/profile"><P><MechanicVerification /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/stats" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Statistiques" backRoute="/mechanic/profile"><P><MechanicStats /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/reviews" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Avis clients" backRoute="/mechanic/profile"><P><MechanicReviews /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/payouts" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Paiements" backRoute="/mechanic/profile"><P><MechanicPayouts /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/notifications" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Notifications" backRoute="/mechanic/profile"><P><MechanicNotifications /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/visibility" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Visibilité" backRoute="/mechanic/profile"><P><MechanicVisibility /></P></PortalSidebar></ProtectedRoute>} />
      {/* Sous-pages du profil mécanicien référencées par le menu "Mon Profil Pro" mais jamais déclarées
          (elles menaient au 404). Réutilisation des écrans partagés, comme côté client. */}
      <Route path="/mechanic/profile/security" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Sécurité du compte" backRoute="/mechanic/profile"><P><CustomerSecurity /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/help" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Centre d'aide" backRoute="/mechanic/profile"><P><CustomerHelp /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/contact" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Contact" backRoute="/mechanic/profile"><P><CustomerContact /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/terms" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Conditions & Confidentialité" backRoute="/mechanic/profile"><P><CustomerTerms /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/performance" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Métriques de performance" backRoute="/mechanic/profile"><P><MechanicStats /></P></PortalSidebar></ProtectedRoute>} />
      {/* Alias : "/mechanic/profile-settings" (MécanicProfileDetail) et "/mechanic/dashboard" → espace pro */}
      <Route path="/mechanic/profile-settings" element={<Navigate to="/mechanic/profile" replace />} />
      <Route path="/mechanic/portal" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Portail Pro"><P><ProviderPortal /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/jobs" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Mes jobs"><P><JobManagement /></P></PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/:slug" element={<P><TunerProfile /></P>} />
      <Route path="/seller/:slug" element={<P><SellerPublicProfile /></P>} />
      <Route path="/gift-plans" element={<P><GiftPlans /></P>} />
      <Route path="/choose-plan" element={<P><ChoosePlan /></P>} />

      {/* Full Seller Portal (canonical routes — deduplicated) */}
      <Route
        path="/seller/portal"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Tableau de bord vendeur">
              <P><NewSellerDashboard /></P>
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/seller/portal-new" element={<Navigate to="/seller/portal" replace />} />
      {/* Alias : "/seller/dashboard" (cible de SellerLogin) et anciens liens internes → portail officiel */}
      <Route path="/seller/dashboard" element={<Navigate to="/seller/portal" replace />} />
      <Route
        path="/seller/products"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Mes produits">
              <P><SellerProductsPage /></P>
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/new"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Ajouter un produit" backRoute="/seller/products">
              <P><SellerNewProductPage /></P>
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/orders"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Toutes les commandes">
              <P><SellerOrdersPage /></P>
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/orders/:id"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Détail de la commande" backRoute="/seller/orders">
              <P><SellerOrderDetailPage /></P>
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/inventory"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Stock & alertes">
              <P><SellerInventoryPage /></P>
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/analytics"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Statistiques de vente">
              <P><SellerAnalyticsPage /></P>
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
              <P><NewTunerDashboard /></P>
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
              <P><TunerRequestsPage /></P>
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuner/projects"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Mes projets">
              <P><TunerProjectsPage /></P>
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuner/projects/:id"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Détail du projet" backRoute="/tuner/projects">
              <P><TunerProjectDetailPage /></P>
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuner/calendar"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Agenda">
              <P><TunerCalendarPage /></P>
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuner/appointments/:id"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Agenda">
              <P><TunerCalendarPage /></P>
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuner/portfolio"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Portfolio">
              <P><TunerPortfolioPage /></P>
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      {/* ── Aliases & routes manquantes (audit complet des liens internes) ── */}
      // Seller : liens "Compte / Analyses" du portail (SellerDashboard)
      <Route path="/seller/profile" element={<Navigate to="/seller/settings" replace />} />
      <Route path="/seller/analytics-sales" element={<Navigate to="/seller/analytics" replace />} />
      // Tuner : même écran, route alias cohérente avec le reste du portail
      <Route path="/tuner/dashboard-legacy" element={<Navigate to="/tuner/portal" replace />} />
      // Mécanicien : diagnostic d'un job (JobManagement) → écran de diagnostic partagé
      <Route path="/provider/job/:id/diagnosis" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Diagnostic du job" backRoute="/mechanic/jobs"><P><DiagnosticRequest /></P></PortalSidebar></ProtectedRoute>} />
      // Client : messagerie avec un prestataire (TunerRequestsMap) → onglet messages
      <Route path="/customer/chat/:id" element={<ProtectedRoute role="customer"><PortalSidebar title="Messagerie" backRoute="/customer/home"><P><MessagesTab /></P></PortalSidebar></ProtectedRoute>} />
      // Publics : cartes de profil raccourcies du répertoire (ProviderDirectory)
      <Route path="/t/:slug" element={<Navigate to="/tuner/:slug" replace />} />
      <Route path="/s/:slug" element={<Navigate to="/seller/:slug" replace />} />

      <Route path="/discover" element={<ProtectedRoute role="customer"><P><ProviderDirectory /></P></ProtectedRoute>} />

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
