import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Shield,
  Bell,
  Moon,
  LogOut,
  Key,
  Check,
  AlertCircle
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    dailyStreak: true,
    assessmentReminders: true,
    interviewFeedback: true
  });

  const [privacy, setPrivacy] = useState({
    showProfileToRecruiters: true,
    shareAnalyticsWithMentors: false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [passMessage, setPassMessage] = useState({ type: '', text: '' });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPassMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPassMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    // Success response
    setPassMessage({ type: 'success', text: 'Password updated successfully!' });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    setTimeout(() => setPassMessage({ type: '', text: '' }), 4000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1E6EE] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E879A9]/15 text-[#C65B89] border border-[#E879A9]/30 mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#30263A]">Account Settings</h1>
          <p className="text-sm text-[#817487] mt-1">
            Manage your account security, notification delivery, and platform preferences.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Account Info Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#F1E6EE]">
          <h3 className="text-sm font-bold text-[#30263A] mb-4">Account Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#817487] mb-1 font-semibold">Full Name</label>
              <input
                type="text"
                disabled
                value={user?.name || ''}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input opacity-75"
              />
            </div>
            <div>
              <label className="block text-[#817487] mb-1 font-semibold">Registered Email</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input opacity-75"
              />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#F1E6EE]">
          <h3 className="text-sm font-bold text-[#30263A] mb-4 flex items-center space-x-2">
            <Key className="w-4 h-4 text-[#E879A9]" />
            <span>Change Account Password</span>
          </h3>

          {passMessage.text && (
            <div className={`mb-4 p-3 rounded-xl border text-xs flex items-center space-x-2 ${
              passMessage.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-[#FB7185]/15 border-[#FB7185]/30 text-[#FB7185]'
            }`}>
              {passMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{passMessage.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs max-w-md">
            <div>
              <label className="block text-[#817487] mb-1 font-semibold">Current Password</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="block text-[#817487] mb-1 font-semibold">New Password</label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="block text-[#817487] mb-1 font-semibold">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordForm.confirmNewPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-[#30263A] bg-[#E879A9] hover:bg-[#C65B89] transition-all shadow-sm"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Notifications & Privacy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-[#F1E6EE]">
            <h3 className="text-sm font-bold text-[#30263A] mb-4 flex items-center space-x-2">
              <Bell className="w-4 h-4 text-[#FBBF24]" />
              <span>Notification Preferences</span>
            </h3>
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#30263A]">Daily Streak Reminder</span>
                <input
                  type="checkbox"
                  checked={notifications.dailyStreak}
                  onChange={(e) => setNotifications({ ...notifications, dailyStreak: e.target.checked })}
                  className="w-4 h-4 rounded text-[#E879A9] focus:ring-[#E879A9]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#30263A]">Mock Assessment Summaries</span>
                <input
                  type="checkbox"
                  checked={notifications.assessmentReminders}
                  onChange={(e) => setNotifications({ ...notifications, assessmentReminders: e.target.checked })}
                  className="w-4 h-4 rounded text-[#E879A9] focus:ring-[#E879A9]"
                />
              </label>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-[#F1E6EE]">
            <h3 className="text-sm font-bold text-[#30263A] mb-4 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Privacy & Visibility</span>
            </h3>
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#30263A]">Share Readiness with Recruiter Drive</span>
                <input
                  type="checkbox"
                  checked={privacy.showProfileToRecruiters}
                  onChange={(e) => setPrivacy({ ...privacy, showProfileToRecruiters: e.target.checked })}
                  className="w-4 h-4 rounded text-[#E879A9] focus:ring-[#E879A9]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#30263A]">Private Code Execution Logs</span>
                <input
                  type="checkbox"
                  checked={privacy.shareAnalyticsWithMentors}
                  onChange={(e) => setPrivacy({ ...privacy, shareAnalyticsWithMentors: e.target.checked })}
                  className="w-4 h-4 rounded text-[#E879A9] focus:ring-[#E879A9]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Sign Out Card */}
        <div className="p-6 rounded-2xl bg-[#FFF9FC] border border-[#FB7185]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-[#30263A]">Sign Out of PrepAI</h4>
            <p className="text-xs text-[#817487] mt-0.5">End your current session across this browser window.</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl font-bold text-[#FB7185] bg-[#FB7185]/10 border border-[#FB7185]/30 hover:bg-[#FB7185]/20 text-xs transition-all flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
