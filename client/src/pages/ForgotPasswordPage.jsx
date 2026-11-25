import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Sparkles, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.forgotPassword(email);
      if (res.devResetUrl) {
        setDevResetUrl(res.devResetUrl);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Unable to process reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E879A9] to-[#A78BFA] flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black text-[#30263A]">
            Prep<span className="text-[#E879A9]">AI</span>
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold text-[#30263A]">Reset Password</h2>
        <p className="mt-2 text-sm text-[#817487]">
          Enter your registered email to receive recovery instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-card border border-[#F1E6EE]">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[#E6F5EE] text-[#3B8A66] mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#30263A]">Recovery Email Dispatched</h3>
              <p className="text-xs text-[#817487] mt-2">
                We've sent password reset instructions to <span className="text-[#30263A] font-mono font-semibold">{email}</span>.
              </p>
              {devResetUrl && (
                <div className="mt-4 p-3 rounded-xl bg-[#FFF0E8] border border-[#F2B86B]/40 text-left">
                  <p className="text-[11px] font-bold text-[#A86F24] mb-1">Dev Mode (SMTP not configured):</p>
                  <Link
                    to={devResetUrl}
                    className="text-xs font-semibold text-[#C65B89] underline break-all"
                  >
                    Click here to reset password →
                  </Link>
                </div>
              )}
              <Link
                to="/login"
                className="mt-6 inline-block w-full py-2.5 rounded-xl font-semibold text-white bg-[#E879A9] text-xs hover:bg-[#C65B89]"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-[#E87979]/10 border border-[#E87979]/30 flex items-center space-x-2 text-[#B54545] text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#817487] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A99EAD]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white bg-[#E879A9] hover:bg-[#C65B89] shadow-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Sending link...' : 'Send Reset Link'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="text-center pt-4 border-t border-[#F1E6EE]">
                <Link to="/login" className="text-xs font-semibold text-[#C65B89] hover:underline">
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
