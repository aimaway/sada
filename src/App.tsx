import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './shared/context';
import { DemoProvider } from './shared/DemoContext';
import { DemoToggle } from './components/DemoToggle';

// Landing
import LandingPage from './landing/LandingPage';

// Customer
import { CustomerLogin, CustomerWaiting, CustomerRate, CustomerHistory } from './customer/CustomerApp';
import { NotificationsScreen } from './customer/NotificationsApp';
import { CustomerProfileSetup } from './customer/CustomerProfileSetup';
import { MaintenanceDashboard, ShopScreen, MaintenanceLogScreen, RemindersScreen } from './customer/MaintenanceApp';
import { LegalDocumentsScreen } from './customer/LegalDocumentsApp';
import { NegotiationScreen } from './customer/NegotiationApp';
import { OffersScreen, MechanicProfileScreen } from './customer/OffersAndProfile';
import { IfixAssistantPage } from './ifix/IfixAssistantPage';
import { OffersScreen as IfixOffersScreen } from './ifix/OffersScreen';
import { ProviderInbox } from './ifix/ProviderInbox';
import { RequestOfferDetail } from './ifix/RequestOfferDetail';
import { LiveTrackingScreen, PaymentScreen, OrdersTab } from './customer/TrackingAndPayment';
import { MessagesTab, ProfileScreen } from './customer/TabsAndProfile';
import { AIAssistantScreen, WarningLightScanner } from './customer/SmartFeatures';
import { MechanicWalletScreen, AntiBypassingScreen, LocalSpecificsScreen } from './customer/BusinessFeatures';

// Mechanic
import { MechanicLogin, MechanicRequestDetail, MechanicActiveJob, MechanicWallet, MechanicEarnings, MechanicShop } from './mechanic/MechanicApp';
import { MechanicProfileSetup } from './mechanic/MechanicProfileSetup';
import { MechanicProfileDetail, MechanicProfileSettings } from './mechanic/MechanicProfileDetail';

// Seller
import { SellerLogin, SellerPartnerships, SellerSettings } from './seller/SellerApp';

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
import { MechanicProfileComplete } from './components/MechanicProfileComplete';
import { MechanicPersonalInfo } from './components/MechanicPersonalInfo';
import { MechanicServices } from './components/MechanicServices';
import { MechanicServiceArea } from './components/MechanicServiceArea';
import { MechanicPricing } from './components/MechanicPricing';
import { MechanicVerification } from './components/MechanicVerification';
import { MechanicStats } from './components/MechanicStats';
import { MechanicReviews } from './components/MechanicReviews';
import { MechanicPayouts } from './components/MechanicPayouts';
import { MechanicNotifications } from './components/MechanicNotifications';
import { MechanicVisibility } from './components/MechanicVisibility';
import { GiftPlans } from './components/GiftPlans';
import { NewRequestEnhanced } from './components/NewRequestEnhanced';
import { RoleSelectionLogin } from './components/RoleSelectionLogin';

// Addendum Components - Phase A to F
import { ProviderDirectory } from './components/ProviderDirectory';
import { ProviderPortal } from './components/ProviderPortal';
import { JobManagement } from './components/JobManagement';
import { ClientPortal } from './components/ClientPortal';
import { ChoosePlan } from './components/ChoosePlan';

// New Seller & Tuner Portal Pages
import { SellerDashboard as NewSellerDashboard } from './pages/SellerDashboard';
import { TunerDashboard as NewTunerDashboard } from './pages/TunerDashboard';
// Standard sidebar shell shared by ALL roles (customer, mechanic, seller, tuner)
import { PortalSidebar } from './components/PortalSidebar';
import { SellerProductsPage } from './pages/seller/SellerProductsPage';
import {
  SellerOrdersPage,
  SellerOrderDetailPage,
  SellerInventoryPage,
  SellerAnalyticsPage,
  SellerNewProductPage,
} from './pages/seller/SellerPortalPages';
import {
  TunerRequestsPage,
  TunerProjectsPage,
  TunerProjectDetailPage,
  TunerCalendarPage,
  TunerPortfolioPage,
} from './pages/tuner/TunerPortalPages';

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

      {/* Public content pages */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* Customer */}
      <Route path="/customer/login" element={<CustomerLogin />} />
      <Route path="/customer/profile-setup" element={<ProtectedRoute role="customer"><CustomerProfileSetup /></ProtectedRoute>} />
      <Route path="/customer/home" element={<ProtectedRoute role="customer"><PortalSidebar title="Accueil client"><CustomerHomeEnhanced /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/notifications" element={<ProtectedRoute role="customer"><PortalSidebar title="Notifications"><NotificationsScreen /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/new-request" element={<ProtectedRoute role="customer"><PortalSidebar title="Nouvelle demande" backRoute="/customer/home"><NewRequestEnhanced /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/explain-problem" element={<ProtectedRoute role="customer"><PortalSidebar title="Expliquer mon problème" backRoute="/customer/home"><ExplainProblem /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/diagnostic" element={<ProtectedRoute role="customer"><PortalSidebar title="Demande de diagnostic" backRoute="/customer/home"><DiagnosticRequest /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/maintenance-request" element={<ProtectedRoute role="customer"><PortalSidebar title="Demande d'entretien" backRoute="/customer/home"><MaintenanceRequest /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/waiting" element={<ProtectedRoute role="customer"><CustomerWaiting /></ProtectedRoute>} />
      <Route path="/customer/offers" element={<ProtectedRoute role="customer"><PortalSidebar title="Offres reçues"><IfixOffersScreen /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/ifix" element={<ProtectedRoute role="customer"><PortalSidebar title="IFIX AI"><IfixAssistantPage /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/mechanic-profile/:id" element={<ProtectedRoute role="customer"><MechanicProfileScreen /></ProtectedRoute>} />
      <Route path="/customer/tracking" element={<ProtectedRoute role="customer"><PortalSidebar title="Suivi en direct"><LiveTrackingScreen /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/negotiation" element={<ProtectedRoute role="customer"><PortalSidebar title="Négociation" backRoute="/customer/offers"><NegotiationScreen /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/payment" element={<ProtectedRoute role="customer"><PortalSidebar title="Paiement"><PaymentScreen /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/rate" element={<ProtectedRoute role="customer"><PortalSidebar title="Notez votre mécanicien" backRoute="/customer/history"><CustomerRate /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/history" element={<ProtectedRoute role="customer"><PortalSidebar title="Historique"><CustomerHistory /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/orders" element={<ProtectedRoute role="customer"><PortalSidebar title="Mes commandes"><OrdersTab /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/messages" element={<ProtectedRoute role="customer"><PortalSidebar title="Messages"><MessagesTab /></PortalSidebar></ProtectedRoute>} />
      {/* Same standard sidebar shell for the customer profile */}
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute role="customer">
            <PortalSidebar title="Mon Profil">
              <CustomerProfileComplete />
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/customer/profile-old" element={<ProtectedRoute role="customer"><PortalSidebar title="Ancien profil"><ProfileScreen /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/maintenance" element={<ProtectedRoute role="customer"><PortalSidebar title="Entretien Auto"><MaintenanceDashboard /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/shop" element={<ProtectedRoute role="customer"><PortalSidebar title="Boutique Auto"><ShopScreen /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/maintenance-log" element={<ProtectedRoute role="customer"><PortalSidebar title="Carnet d'entretien"><MaintenanceLogScreen /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/reminders" element={<ProtectedRoute role="customer"><PortalSidebar title="Rappels"><RemindersScreen /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/documents" element={<ProtectedRoute role="customer"><PortalSidebar title="Documents légaux"><LegalDocumentsScreen /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/ai-assistant" element={<ProtectedRoute role="customer"><PortalSidebar title="Assistant IA"><AIAssistantScreen /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/warning-scanner" element={<ProtectedRoute role="customer"><PortalSidebar title="Scanner voyants"><WarningLightScanner /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/business/wallet" element={<ProtectedRoute role="customer"><PortalSidebar title="Portefeuille pro"><MechanicWalletScreen /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/business/anti-bypass" element={<ProtectedRoute role="customer"><PortalSidebar title="Anti-contournement"><AntiBypassingScreen /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/business/local" element={<ProtectedRoute role="customer"><PortalSidebar title="Spécificités locales"><LocalSpecificsScreen /></PortalSidebar></ProtectedRoute>} />

      {/* Mechanic */}
      <Route path="/mechanic/login" element={<MechanicLogin />} />
      <Route path="/mechanic/profile-setup" element={<ProtectedRoute role="mechanic"><MechanicProfileSetup /></ProtectedRoute>} />
      <Route path="/mechanic/home" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Tableau de bord"><MechanicDashboard /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/request/:id" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Détail de la demande" backRoute="/mechanic/inbox"><RequestOfferDetail /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/inbox" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Boîte de réception"><ProviderInbox /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/active-job" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Job actif"><MechanicActiveJob /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/wallet" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Portefeuille"><MechanicWallet /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/earnings" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Gains"><MechanicEarnings /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/shop" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Boutique pièces"><MechanicShop /></PortalSidebar></ProtectedRoute>} />

      {/* Seller */}
      <Route path="/seller/login" element={<SellerLogin />} />
      {/* Old seller dashboard now renders the NEW experience inside the standard sidebar */}
      <Route
        path="/seller/dashboard"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar>
              <NewSellerDashboard />
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/seller/partnerships" element={<ProtectedRoute role="seller"><PortalSidebar title="Partenariats"><SellerPartnerships /></PortalSidebar></ProtectedRoute>} />
      <Route path="/seller/settings" element={<ProtectedRoute role="seller"><PortalSidebar title="Réglages boutique"><SellerSettings /></PortalSidebar></ProtectedRoute>} />

      {/* Tuner */}
      <Route path="/tuner/login" element={<TunerLogin />} />
      <Route path="/tuner/register" element={<TunerRegistration />} />
      {/* Old tuner dashboard now renders the NEW experience inside the standard sidebar */}
      <Route
        path="/tuner/dashboard"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar>
              <NewTunerDashboard />
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/tuner/profile-edit" element={<ProtectedRoute role="tuner"><PortalSidebar title="Modifier mon profil" backRoute="/tuner/portal"><TunerProfileEdit /></PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/services" element={<ProtectedRoute role="tuner"><PortalSidebar title="Mes services"><TunerServices /></PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/notifications" element={<ProtectedRoute role="tuner"><PortalSidebar title="Notifications"><TunerNotifications /></PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/payment-methods" element={<ProtectedRoute role="tuner"><PortalSidebar title="Méthodes de paiement"><TunerPaymentMethods /></PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/wallet-recharge" element={<ProtectedRoute role="tuner"><PortalSidebar title="Portefeuille"><TunerWalletRecharge /></PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/gallery-upload" element={<ProtectedRoute role="tuner"><PortalSidebar title="Ajouter au portfolio" backRoute="/tuner/portfolio"><TunerGalleryUpload /></PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/requests-map" element={<ProtectedRoute role="tuner"><PortalSidebar title="Carte des demandes"><TunerRequestsMap /></PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/plans" element={<ProtectedRoute role="tuner"><PortalSidebar title="Abonnement tuner"><TunerPlans /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/plans" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Abonnement mécanicien"><MechanicPlans /></PortalSidebar></ProtectedRoute>} />
      <Route path="/seller/plans" element={<ProtectedRoute role="seller"><PortalSidebar title="Abonnement vendeur"><SellerPlans /></PortalSidebar></ProtectedRoute>} />

      {/* Customer Profile Complete - Sub-routes (same shell as the profile page) */}
      <Route path="/customer/profile/vehicles" element={<ProtectedRoute role="customer"><PortalSidebar title="Mon garage" backRoute="/customer/profile"><CustomerVehicles /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/addresses" element={<ProtectedRoute role="customer"><PortalSidebar title="Mes adresses" backRoute="/customer/profile"><CustomerAddresses /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/payment-methods" element={<ProtectedRoute role="customer"><PortalSidebar title="Méthodes de paiement" backRoute="/customer/profile"><CustomerPaymentMethods /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/notifications" element={<ProtectedRoute role="customer"><PortalSidebar title="Notifications" backRoute="/customer/profile"><CustomerNotifications /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/transactions" element={<ProtectedRoute role="customer"><PortalSidebar title="Transactions" backRoute="/customer/profile"><CustomerTransactions /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/reviews" element={<ProtectedRoute role="customer"><PortalSidebar title="Mes avis" backRoute="/customer/profile"><CustomerReviews /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/favorites" element={<ProtectedRoute role="customer"><PortalSidebar title="Favoris" backRoute="/customer/profile"><CustomerFavorites /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/language" element={<ProtectedRoute role="customer"><PortalSidebar title="Langue" backRoute="/customer/profile"><CustomerLanguage /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/security" element={<ProtectedRoute role="customer"><PortalSidebar title="Sécurité" backRoute="/customer/profile"><CustomerSecurity /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/help" element={<ProtectedRoute role="customer"><PortalSidebar title="Aide & contact" backRoute="/customer/profile"><CustomerHelp /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/contact" element={<ProtectedRoute role="customer"><PortalSidebar title="Contact" backRoute="/customer/profile"><CustomerContact /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/profile/terms" element={<ProtectedRoute role="customer"><PortalSidebar title="Conditions d'utilisation" backRoute="/customer/profile"><CustomerTerms /></PortalSidebar></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><PortalSidebar title="Console admin" autoShell={false}><AdminDashboard /></PortalSidebar></ProtectedRoute>} />
      <Route path="/admin/verification" element={<ProtectedRoute role="admin"><PortalSidebar title="File de vérification" autoShell={false}><AdminVerification /></PortalSidebar></ProtectedRoute>} />
      <Route path="/admin/requests" element={<ProtectedRoute role="admin"><PortalSidebar title="Demandes & Jobs" autoShell={false}><AdminRequests /></PortalSidebar></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><PortalSidebar title="Utilisateurs" autoShell={false}><AdminUsers /></PortalSidebar></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><PortalSidebar title="Paramètres plateforme" autoShell={false}><AdminSettingsPage /></PortalSidebar></ProtectedRoute>} />
      <Route path="/admin/disputes" element={<ProtectedRoute role="admin"><PortalSidebar title="Litiges" autoShell={false}><AdminDisputes /></PortalSidebar></ProtectedRoute>} />

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
      <Route path="/mechanic/dashboard" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Tableau de bord"><MechanicDashboard /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/public-profile" element={<ProtectedRoute role="mechanic"><MechanicPublicProfile /></ProtectedRoute>} />

      {/* Phase 2 - Recurring Plans & Invoices */}
      <Route path="/customer/recurring-plans" element={<ProtectedRoute role="customer"><PortalSidebar title="Plans récurrents"><RecurringPlansDashboard /></PortalSidebar></ProtectedRoute>} />

      {/* Enhanced Features */}
      <Route path="/customer/home-enhanced" element={<Navigate to="/customer/home" replace />} />
      <Route path="/customer/wallet" element={<ProtectedRoute role="customer"><PortalSidebar title="Mon portefeuille"><ClientWallet /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/documents-manage" element={<ProtectedRoute role="customer"><PortalSidebar title="Mes documents"><DocumentsManager /></PortalSidebar></ProtectedRoute>} />
      <Route path="/customer/portal" element={<ProtectedRoute role="customer"><PortalSidebar title="Espace client"><ClientPortal /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile-enhanced" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Profil pro"><MechanicProfileEnhanced /></PortalSidebar></ProtectedRoute>} />
      {/* Same standard sidebar shell for the mechanic profile */}
      <Route
        path="/mechanic/profile"
        element={
          <ProtectedRoute role="mechanic">
            <PortalSidebar title="Mon Profil Pro">
              <MechanicProfileComplete />
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/mechanic/profile/info" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Informations personnelles" backRoute="/mechanic/profile"><MechanicPersonalInfo /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/services" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Mes services" backRoute="/mechanic/profile"><MechanicServices /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/area" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Zone d'intervention" backRoute="/mechanic/profile"><MechanicServiceArea /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/pricing" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Tarifs" backRoute="/mechanic/profile"><MechanicPricing /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/verification" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Vérification" backRoute="/mechanic/profile"><MechanicVerification /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/stats" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Statistiques" backRoute="/mechanic/profile"><MechanicStats /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/reviews" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Avis clients" backRoute="/mechanic/profile"><MechanicReviews /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/payouts" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Paiements" backRoute="/mechanic/profile"><MechanicPayouts /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/notifications" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Notifications" backRoute="/mechanic/profile"><MechanicNotifications /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/profile/visibility" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Visibilité" backRoute="/mechanic/profile"><MechanicVisibility /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/portal" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Portail Pro"><ProviderPortal /></PortalSidebar></ProtectedRoute>} />
      <Route path="/mechanic/jobs" element={<ProtectedRoute role="mechanic"><PortalSidebar title="Mes jobs"><JobManagement /></PortalSidebar></ProtectedRoute>} />
      <Route path="/tuner/:slug" element={<TunerProfile />} />
      <Route path="/seller/:slug" element={<SellerPublicProfile />} />
      <Route path="/gift-plans" element={<GiftPlans />} />
      <Route path="/choose-plan" element={<ChoosePlan />} />

      {/* Full Seller Portal (canonical routes — deduplicated) */}
      <Route
        path="/seller/portal"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Tableau de bord vendeur">
              <NewSellerDashboard />
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
              <SellerProductsPage />
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/new"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Ajouter un produit" backRoute="/seller/products">
              <SellerNewProductPage />
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/orders"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Toutes les commandes">
              <SellerOrdersPage />
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/orders/:id"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Détail de la commande" backRoute="/seller/orders">
              <SellerOrderDetailPage />
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/inventory"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Stock & alertes">
              <SellerInventoryPage />
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/analytics"
        element={
          <ProtectedRoute role="seller">
            <PortalSidebar title="Statistiques de vente">
              <SellerAnalyticsPage />
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
              <NewTunerDashboard />
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
              <TunerRequestsPage />
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuner/projects"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Mes projets">
              <TunerProjectsPage />
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuner/projects/:id"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Détail du projet" backRoute="/tuner/projects">
              <TunerProjectDetailPage />
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuner/calendar"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Agenda">
              <TunerCalendarPage />
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuner/appointments/:id"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Agenda">
              <TunerCalendarPage />
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuner/portfolio"
        element={
          <ProtectedRoute role="tuner">
            <PortalSidebar title="Portfolio">
              <TunerPortfolioPage />
            </PortalSidebar>
          </ProtectedRoute>
        }
      />
      <Route path="/discover" element={<ProtectedRoute role="customer"><ProviderDirectory /></ProtectedRoute>} />

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
