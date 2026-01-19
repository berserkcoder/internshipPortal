import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import '../styles/navbar.css';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          InternHub
        </Link>

        <div className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {!user ? (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-link">
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <span className="nav-user">
                  Welcome, {user.fullName}!
                </span>
              </li>
              {user.role === 'candidate' && (
                <>
                  <li className="nav-item">
                    <Link to="/jobs" className="nav-link">
                      Jobs
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/candidate/applications" className="nav-link">
                      Applications
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/candidate/resumes" className="nav-link">
                      Resumes
                    </Link>
                  </li>
                </>
              )}
              {user.role === 'recruiter' && (
                <>
                  <li className="nav-item">
                    <Link to="/recruiter/jobs" className="nav-link">
                      My Jobs
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/recruiter/post-job" className="nav-link">
                      Post Job
                    </Link>
                  </li>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <li className="nav-item">
                    <Link to="/admin/users" className="nav-link">
                      Users
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/jobs" className="nav-link">
                      Jobs
                    </Link>
                  </li>
                </>
              )}
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-logout">
                  <LogOut size={20} />
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
