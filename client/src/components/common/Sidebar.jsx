import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  LayoutDashboard,
  Bot,
  Video,
  Code2,
  BookOpen,
  Map,
  BarChart3,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Cpu,
  X
} from 'lucide-react';

export const Sidebar = ({ mobileOpen = false, onCloseMobile }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.getAIStatus();
        if (res.success) {
          setAiStatus(res.status);
        }
      } catch {
        // quiet
      }
    };
    fetchStatus();
  }, []);

  const navGroups = [
    {
      label: 'MAIN',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'AI Study Assistant', path: '/ai-study', icon: Bot, badge: 'AI' },
      ]
    },
    {
      label: 'PREPARATION',
      items: [
        { name: 'Mock Interview', path: '/mock-interview', icon: Video, badge: 'Voice' },
        { name: 'Mock OA Arena', path: '/mock-oa', icon: Code2, badge: '18 OAs' },
        { name: 'Study Material', path: '/study-material', icon: BookOpen },
      ]
    },
    {
      label: 'MY JOURNEY',
      items: [
        { name: 'Preparation Roadmap', path: '/roadmap', icon: Map },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      ]
    },
    {
      label: 'ACCOUNT',
      items: [
        { name: 'My Profile', path: '/profile', icon: User },
        { name: 'Settings', path: '/settings', icon: Settings },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#30263A]/20 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-[#F1E6EE] transition-all duration-300 flex flex-col ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#F1E6EE]">
          <NavLink to="/dashboard" className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E879A9] to-[#A78BFA] flex-shrink-0 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="text-lg font-extrabold tracking-tight text-[#30263A]">
                  Prep<span className="text-[#E879A9]">AI</span>
                </span>
                <p className="text-[10px] text-[#817487] font-medium tracking-wide">
                  Prepare. Practice. Progress.
                </p>
              </div>
            )}
          </NavLink>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-[#817487] hover:text-[#C65B89] hover:bg-[#FCE7F3]/60 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-[#817487] hover:text-[#30263A]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-bold tracking-widest text-[#A99EAD] uppercase">
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => onCloseMobile && onCloseMobile()}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                          isActive
                            ? 'bg-[#FCE7F3] text-[#C65B89] shadow-sm'
                            : 'text-[#817487] hover:text-[#30263A] hover:bg-[#FFF9FC]'
                        }`
                      }
                      title={collapsed ? item.name : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={`w-4 h-4 flex-shrink-0 transition-colors ${
                              isActive ? 'text-[#C65B89]' : 'text-[#817487] group-hover:text-[#E879A9]'
                            }`}
                          />
                          {!collapsed && (
                            <div className="flex-1 flex items-center justify-between truncate">
                              <span className="truncate">{item.name}</span>
                              {item.badge && (
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                    isActive
                                      ? 'bg-white text-[#C65B89]'
                                      : 'bg-[#EDE9FE] text-[#7C3AED]'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* AI Engine Status */}
        {!collapsed && (
          <div className="px-3 py-2.5 mx-3 mb-2 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE] text-xs">
            <div className="flex items-center space-x-2 text-[11px] font-semibold text-[#30263A]">
              <Cpu className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>AI Companion</span>
              <span
                className={`w-2 h-2 rounded-full ml-auto ${
                  aiStatus?.ollamaAvailable ? 'bg-[#65B891]' : 'bg-[#E879A9]'
                }`}
              />
            </div>
            <p className="text-[10px] text-[#817487] mt-1 line-clamp-1">
              {aiStatus?.ollamaAvailable ? 'Local Ollama: Llama 3.2' : 'PrepAI Smart Engine'}
            </p>
          </div>
        )}

        {/* User Section & Logout */}
        <div className="p-3 border-t border-[#F1E6EE]">
          <div className="flex items-center justify-between">
            <NavLink to="/profile" className="flex items-center space-x-2.5 overflow-hidden group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FCE7F3] to-[#EDE9FE] border border-[#F9D5E5] flex items-center justify-center font-bold text-xs text-[#C65B89] flex-shrink-0">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
              </div>
              {!collapsed && (
                <div className="truncate text-left">
                  <p className="text-xs font-bold text-[#30263A] truncate group-hover:text-[#C65B89] transition-colors">
                    {user?.name || 'Student'}
                  </p>
                  <p className="text-[10px] text-[#817487] truncate">{user?.email || 'student@prepai.edu'}</p>
                </div>
              )}
            </NavLink>

            {!collapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-[#817487] hover:text-[#E87979] hover:bg-[#FCE7F3]/50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
