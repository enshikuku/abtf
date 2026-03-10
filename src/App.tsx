import React from 'react';
import { RouterProvider, useRouter } from './components/RouterContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExhibitorRegistrationPage } from './pages/ExhibitorRegistrationPage';
import { SponsorRegistrationPage } from './pages/SponsorRegistrationPage';
import { BoothSelectionPage } from './pages/BoothSelectionPage';
import { InvoicePreviewPage } from './pages/InvoicePreviewPage';
import { PaymentProofPage } from './pages/PaymentProofPage';
import { ContactPage } from './pages/ContactPage';
function AppContent() {
  const { currentPage } = useRouter();
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'exhibitor-registration':
        return <ExhibitorRegistrationPage />;
      case 'sponsor-registration':
        return <SponsorRegistrationPage />;
      case 'booth-selection':
        return <BoothSelectionPage />;
      case 'invoice-preview':
        return <InvoicePreviewPage />;
      case 'payment-proof':
        return <PaymentProofPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };
  return (
    <div className="min-h-screen bg-white font-inter text-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">{renderPage()}</main>
      <Footer />
    </div>);

}
export function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>);

}