import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PostsProvider } from './context/PostsContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AccountingLayout from './pages/admin/AccountingLayout';
import Inventory from './pages/admin/Inventory';
import Quotes from './pages/admin/Quotes';
import QuoteEditor from './pages/admin/QuoteEditor';
import Reports from './pages/admin/Reports';
import PrintSettings from './pages/admin/PrintSettings';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import './App.css';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black transition-colors duration-300 w-full">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
            <Route path="/products/:id" element={<PageTransition><ProductDetails /></PageTransition>} />
            <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/admin-login" element={<PageTransition><AdminLogin /></PageTransition>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <PageTransition><AdminDashboard /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/accounting"
              element={
                <ProtectedRoute>
                  <AccountingLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Inventory />} /> {/* Default to inventory for now */}
              <Route path="inventory" element={<Inventory />} />
              <Route path="quotes" element={<Quotes />} />
              <Route path="quotes/new" element={<QuoteEditor />} />
              <Route path="quotes/:id" element={<QuoteEditor />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<PrintSettings />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <PostsProvider>
            <SettingsProvider>
              <Router>
                <ScrollToTop />
                <AppLayout />
              </Router>
            </SettingsProvider>
          </PostsProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
