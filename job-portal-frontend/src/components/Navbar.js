import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link to="/" className="navbar-brand">Job Portal</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/jobs" className="nav-link">Jobs</Link>
                </li>
                <li className="nav-item">
                  <Link to="/applications" className="nav-link">My Applications</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-3" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
