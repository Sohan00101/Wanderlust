import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import ListingDetail from './pages/ListingDetail';
import NewListing from './pages/NewListing';
import EditListing from './pages/EditListing';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const handleOpenAuth = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleCloseAuth = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onOpenAuth={handleOpenAuth}
          />

          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home searchTerm={searchTerm} />} />
              <Route
                path="/listings/:id"
                element={<ListingDetail onOpenAuth={handleOpenAuth} />}
              />
              <Route
                path="/listings/:id/edit"
                element={<EditListing onOpenAuth={handleOpenAuth} />}
              />
              <Route
                path="/listings/new"
                element={<NewListing onOpenAuth={handleOpenAuth} />}
              />
            </Routes>
          </main>

          <Footer />

          {authModal.isOpen && (
            <AuthModal
              initialMode={authModal.mode}
              onClose={handleCloseAuth}
            />
          )}
        </div>
      </Router>
    </AuthProvider>
  );
}
