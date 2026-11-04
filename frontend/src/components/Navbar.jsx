import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Search, User, Menu, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ searchTerm, onSearchChange, onOpenAuth }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  return (
    <header className="navbar-wrapper">
      <div className="container">
        <nav className="navbar">
          {/* Brand */}
          <Link to="/" className="brand-logo">
            <Compass size={32} />
            <span>Wanderlust</span>
          </Link>

          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search destinations, villas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <button className="search-btn" aria-label="Search">
              <Search size={16} />
            </button>
          </div>

          {/* Right Actions */}
          <div className="nav-actions">
            <Link to="/listings/new" className="host-link">
              Airbnb your home
            </Link>

            <div className="user-menu-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <Menu size={18} />
              <div style={{ background: '#717171', color: '#fff', borderRadius: '50%', padding: '3px' }}>
                <User size={16} />
              </div>

              {dropdownOpen && (
                <div className="user-dropdown" onClick={(e) => e.stopPropagation()}>
                  {user ? (
                    <>
                      <div className="dropdown-item bold">
                        Hello, {user.username}
                      </div>
                      <Link
                        to="/listings/new"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <PlusCircle size={16} /> Add New Listing
                        </span>
                      </Link>
                      <div className="dropdown-divider" />
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                        style={{ color: '#e02f3a', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="dropdown-item bold"
                        onClick={() => {
                          onOpenAuth('login');
                          setDropdownOpen(false);
                        }}
                      >
                        Log In
                      </button>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          onOpenAuth('signup');
                          setDropdownOpen(false);
                        }}
                      >
                        Sign Up
                      </button>
                      <div className="dropdown-divider" />
                      <Link
                        to="/listings/new"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Host an experience
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
