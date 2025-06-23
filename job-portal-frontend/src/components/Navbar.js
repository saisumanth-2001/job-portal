import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  let role = null;
  let isVerified = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
      isVerified = decoded.is_verified ?? false;
    } catch (e) {
      console.error('Failed to decode token', e);
    }
  }

  const isLoggedIn = !!token;

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
                {/* Only Candidates can see Jobs */}
                {role === 'CAN' && (
                  <li className="nav-item">
                    <Link to="/jobs" className="nav-link">Jobs</Link>
                  </li>
                )}

                {/* Candidate: My Applications */}
                {role === 'CAN' && (
                  <li className="nav-item">
                    <Link to="/my-applications" className="nav-link">My Applications</Link>
                  </li>
                )}

                {/* Employer: My Jobs (only if verified) */}
                {role === 'EMP' && isVerified && (
                  <li className="nav-item">
                    <Link to="/my-jobs" className="nav-link">My Jobs</Link>
                  </li>
                )}

                {/* Employer: Waiting for approval */}
                {role === 'EMP' && !isVerified && (
                  <li className="nav-item nav-link text-warning">
                    Awaiting admin verification
                  </li>
                )}

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
