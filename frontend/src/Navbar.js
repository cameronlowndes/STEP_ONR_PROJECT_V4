import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Use the custom context hook
import './navbar.css';

const Navbar = () => {
  const { currentUser, logout, error } = useAuth(); // Access the context
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Local state for error
  const location = useLocation();
  const navigate = useNavigate();
  const logo = `${process.env.PUBLIC_URL}/image/logo.jpg`;

  const toggleSubMenu = () => setSubMenuOpen((prev) => !prev);
  const handleLogoutClick = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/'); // Redirect to homepage after logout
  };
  const cancelLogout = () => setShowLogoutModal(false);

  useEffect(() => {
    if (!currentUser) setSubMenuOpen(false);
  }, [currentUser]);

  // Handle error message display and auto-remove after 3 seconds
  useEffect(() => {
    if (error) {
      setErrorMessage(error); // Set error message to state
      const timer = setTimeout(() => {
        setErrorMessage(''); // Remove error message after 3 seconds
      }, 3000);

      // Clean up the timeout if component unmounts or error changes
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <img src={logo} alt="NovaMart Logo" className="navbar-logo-image" />
        </div>

        {/* Navigation Links */}
        <div className="navbar-title-container">
          <h1 className="navbar-title">NovaMart</h1>
          <nav>
            <ul className="navbar-nav-links">
              {['/', '/shop', '/about', '/CommunityPage'].map((path) => (
                <li key={path} className="navbar-nav-item">
                  <Link to={path} className={`navbar-nav-link ${location.pathname === path ? 'active' : ''}`}>
                    {path === '/' ? 'Home' : path.replace('/', '')}
                  </Link>
                </li>
              ))}
              <li className="navbar-nav-item navbar-login">
                {currentUser ? (
                  <>
                    <div className="navbar-user" onClick={toggleSubMenu} aria-haspopup="true" aria-expanded={isSubMenuOpen}>
                      <span className="navbar-welcome-text">Welcome, {currentUser.email}</span>
                      <span className="navbar-dropdown-indicator"> ▼</span>
                    </div>
                    {isSubMenuOpen && (
                      <ul className="navbar-submenu">
                        <li><Link to="/View-My-Details" className="navbar-submenu-link">View My Details</Link></li>
                        <li><Link to="/update-account" className="navbar-submenu-link">Update Account</Link></li>
                        {currentUser.role === 'admin' && (
                          <li><Link to="/admin-dashboard" className="navbar-submenu-link">Admin Dashboard</Link></li>
                        )}
                        <li><button className="navbar-submenu-link" onClick={handleLogoutClick}>Logout</button></li>
                      </ul>
                    )}
                  </>
                ) : (
                  <>
                    <Link to="/login" className="navbar-nav-link">Login</Link>
                    <Link to="/create-account" className="navbar-nav-link">Create Account</Link>
                  </>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <p>Are you sure you want to logout?</p>
            <button onClick={confirmLogout} className="logout-confirm-button">Yes</button>
            <button onClick={cancelLogout} className="logout-cancel-button">No</button>
          </div>
        </div>
      )}

      {/* Display error if login fails */}
      {errorMessage && <div className="navbar-error">{errorMessage}</div>}
    </header>
  );
};

export default Navbar;
