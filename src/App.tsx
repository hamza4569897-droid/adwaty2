/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { CookieConsent } from './components/common/CookieConsent';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { initThirdPartyServices } from './utils/analytics';

// Code-split route bundles
const ToolPageWrapper = lazy(() =>
  import('./pages/ToolPageWrapper').then((m) => ({ default: m.ToolPageWrapper }))
);
const CalculatorsLandingPage = lazy(() =>
  import('./pages/CalculatorsLandingPage').then((m) => ({ default: m.CalculatorsLandingPage }))
);
const CalculatorPageWrapper = lazy(() =>
  import('./pages/CalculatorPageWrapper').then((m) => ({ default: m.CalculatorPageWrapper }))
);
const DevCalcTestsPage = lazy(() =>
  import('./pages/DevCalcTestsPage').then((m) => ({ default: m.DevCalcTestsPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const PricingPage = lazy(() =>
  import('./pages/PricingPage').then((m) => ({ default: m.PricingPage }))
);
const PrivacyPage = lazy(() =>
  import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage }))
);
const TermsPage = lazy(() =>
  import('./pages/TermsPage').then((m) => ({ default: m.TermsPage }))
);
const DisclaimerPage = lazy(() =>
  import('./pages/DisclaimerPage').then((m) => ({ default: m.DisclaimerPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
  </div>
);

export default function App() {
  useEffect(() => {
    initThirdPartyServices();
    window.addEventListener('cookie_consent_updated', initThirdPartyServices);
    return () => window.removeEventListener('cookie_consent_updated', initThirdPartyServices);
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/tools/:slug" element={<ToolPageWrapper />} />
                  <Route path="/calculators" element={<CalculatorsLandingPage />} />
                  <Route path="/calculators/:slug" element={<CalculatorPageWrapper />} />
                  
                  {/* Protected Dev Route - Accessible ONLY in development */}
                  {import.meta.env.DEV && (
                    <Route path="/dev/calc-tests" element={<DevCalcTestsPage />} />
                  )}

                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/disclaimer" element={<DisclaimerPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <CookieConsent />
          </div>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
