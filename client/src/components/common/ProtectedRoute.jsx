import React, { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Menu, Bell, Search } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/ai-study': 'AI Study Assistant & Notes',
  '/mock-interview': 'Mock Interview Arena',
  '/mock-oa': 'Mock OA Arena',
  '/study-material': 'Study Material Library',
  '/roadmap': 'Preparation Roadmap',
  '/analytics': 'Progress Analytics',
  '/profile': 'My Profile',
  '/settings': 'Account Settings'
};

export const ProtectedRoute = ({ children, requireOnboarding = true }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9FC] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#E879A9] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireOnboarding && user && !user.isOnboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (location.pathname === '/onboarding') {
    return children;
  }

  const pageTitle = PAGE_TITLES[location.pathname] || 'PrepAI Workspace';

  return (
    <div className="min-h-screen bg-[#FFF9FC] flex text-[#30263A]">
      <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

      <div className="flex-1 md:ml-64 transition-all duration-300 flex flex-col min-w-0">
        {/* Clean Pastel Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-md border-b border-[#F1E6EE] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-[#817487] hover:bg-[#FCE7F3] hover:text-[#C65B89]"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#30263A]">{pageTitle}</h2>
              <p className="text-[11px] text-[#A99EAD] hidden sm:block">
                PrepAI • {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/study-material"
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE] text-xs text-[#817487] hover:border-[#F9D5E5] transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-[#A99EAD]" />
              <span>Quick search topics...</span>
            </Link>

            <Link
              to="/analytics"
              className="p-2 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE] text-[#817487] hover:text-[#C65B89] hover:border-[#F9D5E5] transition-colors relative"
              title="View Analytics"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#E879A9]" />
            </Link>

            <Link
              to="/profile"
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FCE7F3] to-[#EDE9FE] border border-[#F9D5E5] flex items-center justify-center font-bold text-xs text-[#C65B89]"
              title={user?.name}
            >
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
