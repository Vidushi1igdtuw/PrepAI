import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Menu, X, ArrowRight, User } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#F1E6EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E879A9] to-[#A78BFA] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#30263A]">
                Prep<span className="text-[#E879A9]">AI</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium text-[#817487] hover:text-[#C65B89] transition-colors">
              Home
            </a>
            <a href="#features" className="text-sm font-medium text-[#817487] hover:text-[#C65B89] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-[#817487] hover:text-[#C65B89] transition-colors">
              How It Works
            </a>
            <a href="#faq" className="text-sm font-medium text-[#817487] hover:text-[#C65B89] transition-colors">
              About & FAQ
            </a>
          </div>

          {/* Desktop Auth CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-[#C65B89] bg-[#FCE7F3] border border-[#F9D5E5] hover:bg-[#F9D5E5]/60 transition-all flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard ({user?.name?.split(' ')[0]})</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs font-medium text-[#817487] hover:text-[#30263A] px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#817487] hover:text-[#30263A] transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#E879A9] hover:bg-[#C65B89] shadow-glow transition-all flex items-center space-x-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#817487] hover:text-[#30263A] hover:bg-[#FCE7F3]/50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#F1E6EE] px-4 pt-3 pb-6 space-y-2">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[#817487] hover:text-[#C65B89] rounded-lg">
            Features
          </a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[#817487] hover:text-[#C65B89] rounded-lg">
            How It Works
          </a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[#817487] hover:text-[#C65B89] rounded-lg">
            FAQ
          </a>
          <div className="pt-3 border-t border-[#F1E6EE] space-y-2">
            {isAuthenticated ? (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full text-center block px-4 py-2.5 rounded-xl font-semibold text-white bg-[#E879A9]">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center block px-4 py-2 text-sm font-semibold text-[#817487]">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center block px-4 py-2.5 rounded-xl font-semibold text-white bg-[#E879A9]">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
