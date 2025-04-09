import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import GuidePage from './pages/GuidePage';
import FaqPage from './pages/FaqPage';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/app" element={<AppPage />} />
              <Route path="/huong-dan" element={<GuidePage />} />
              <Route path="/faq" element={<FaqPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </Router>
    </HelmetProvider>
  );
}

export default App; 