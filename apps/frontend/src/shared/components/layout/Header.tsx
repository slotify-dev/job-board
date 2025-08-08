import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../modules/auth/hooks/useAuth';

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.email || 'User';
  };

  const getUserDashboardRoute = () => {
    if (!user) return '/';
    return user.role === 'employer'
      ? '/dashboard/employer'
      : '/dashboard/job-seeker';
  };

  return (
    <header className="bg-white shadow-sm border-b border-primary-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold text-black hover:text-primary-700 transition-colors"
          >
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JB</span>
            </div>
            <span>JobBoard</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-primary-600 hover:text-black transition-colors font-medium"
            >
              Browse Jobs
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={getUserDashboardRoute()}
                  className="text-primary-600 hover:text-black transition-colors font-medium"
                >
                  Dashboard
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-primary-600 hover:text-black transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {getUserDisplayName().charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium">{getUserDisplayName()}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-primary-200 z-50">
                      <div className="py-2">
                        <Link
                          to={getUserDashboardRoute()}
                          className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/me/profile"
                          className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Profile Settings
                        </Link>
                        <hr className="my-1 border-primary-200" />
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleLogout();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/auth/login"
                  className="text-primary-600 hover:text-black transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link to="/auth/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-primary-600 hover:text-black transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-primary-200 py-4">
            <nav className="space-y-2">
              <Link
                to="/"
                className="block text-primary-600 hover:text-black transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Jobs
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to={getUserDashboardRoute()}
                    className="block text-primary-600 hover:text-black transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/me/profile"
                    className="block text-primary-600 hover:text-black transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <div className="pt-2 border-t border-primary-200 mt-2">
                    <div className="text-sm text-primary-500 mb-2">
                      Signed in as {getUserDisplayName()}
                    </div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="block text-red-600 hover:text-red-800 transition-colors font-medium py-2"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2 pt-2 border-t border-primary-200 mt-2">
                  <Link
                    to="/auth/login"
                    className="block text-primary-600 hover:text-black transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="block btn-primary text-center py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
