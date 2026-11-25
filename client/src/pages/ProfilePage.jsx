import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  GraduationCap,
  Target,
  Code,
  Sparkles,
  Check,
  Github,
  Linkedin,
  Save,
  Globe
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: profile?.college || '',
    degree: profile?.degree || '',
    branch: profile?.branch || '',
    currentYear: profile?.currentYear || '3rd Year',
    graduationYear: profile?.graduationYear || 2026,
    skills: profile?.skills?.join(', ') || '',
    programmingLanguages: profile?.programmingLanguages?.join(', ') || '',
    areasOfInterest: profile?.areasOfInterest?.join(', ') || '',
    targetRole: profile?.targetRole || '',
    preparationGoals: profile?.preparationGoals || '',
    currentPreparationLevel: profile?.currentPreparationLevel || 'Intermediate',
    bio: profile?.bio || '',
    github: profile?.socialLinks?.github || '',
    linkedin: profile?.socialLinks?.linkedin || '',
    leetcode: profile?.socialLinks?.leetcode || ''
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: user?.name || '',
        college: profile.college || '',
        degree: profile.degree || '',
        branch: profile.branch || '',
        currentYear: profile.currentYear || '3rd Year',
        graduationYear: profile.graduationYear || 2026,
        skills: profile.skills?.join(', ') || '',
        programmingLanguages: profile.programmingLanguages?.join(', ') || '',
        areasOfInterest: profile.areasOfInterest?.join(', ') || '',
        targetRole: profile.targetRole || '',
        preparationGoals: profile.preparationGoals || '',
        currentPreparationLevel: profile.currentPreparationLevel || 'Intermediate',
        bio: profile.bio || '',
        github: profile.socialLinks?.github || '',
        linkedin: profile.socialLinks?.linkedin || '',
        leetcode: profile.socialLinks?.leetcode || ''
      });
    }
  }, [profile, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const payload = {
        name: formData.name,
        college: formData.college,
        degree: formData.degree,
        branch: formData.branch,
        currentYear: formData.currentYear,
        graduationYear: Number(formData.graduationYear),
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        programmingLanguages: formData.programmingLanguages.split(',').map(s => s.trim()).filter(Boolean),
        areasOfInterest: formData.areasOfInterest.split(',').map(s => s.trim()).filter(Boolean),
        targetRole: formData.targetRole,
        preparationGoals: formData.preparationGoals,
        currentPreparationLevel: formData.currentPreparationLevel,
        bio: formData.bio,
        socialLinks: {
          github: formData.github,
          linkedin: formData.linkedin,
          leetcode: formData.leetcode
        }
      };

      const res = await api.updateProfile(payload);
      if (res.success) {
        setSuccess(true);
        refreshProfile();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1E6EE] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E879A9]/15 text-[#C65B89] border border-[#E879A9]/30 mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Student Dossier</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#30263A]">Student Profile</h1>
          <p className="text-sm text-[#817487] mt-1">
            Maintain your academic credentials, skill tags, and career objectives.
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-[#F1E6EE]">
        {/* Avatar & Summary Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-[#F1E6EE] mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#E879A9] to-[#C65B89] flex items-center justify-center font-black text-2xl text-[#FFF9FC] shadow-glow flex-shrink-0">
            {formData.name ? formData.name.slice(0, 2).toUpperCase() : 'ST'}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold text-[#30263A]">{formData.name || 'Student Name'}</h2>
            <p className="text-xs text-[#C65B89] font-medium mt-0.5">{formData.targetRole || 'Software Development Engineer'}</p>
            <p className="text-xs text-[#817487] mt-1">{formData.college} • {formData.branch}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-[#FB7185]/15 border border-[#FB7185]/30 text-[#FB7185] text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Profile successfully updated and synchronized!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Academic Info */}
          <div>
            <h3 className="text-xs font-bold text-[#C65B89] uppercase tracking-wider mb-4 border-b border-[#F1E6EE] pb-2">
              Academic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#817487] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>
              <div>
                <label className="block text-[#817487] font-semibold mb-1">College / University</label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>
              <div>
                <label className="block text-[#817487] font-semibold mb-1">Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>
              <div>
                <label className="block text-[#817487] font-semibold mb-1">Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>
              <div>
                <label className="block text-[#817487] font-semibold mb-1">Current Year</label>
                <select
                  name="currentYear"
                  value={formData.currentYear}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input bg-[#FFFFFF]"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>
              <div>
                <label className="block text-[#817487] font-semibold mb-1">Graduation Year</label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>
            </div>
          </div>

          {/* Technical Profile */}
          <div>
            <h3 className="text-xs font-bold text-[#C65B89] uppercase tracking-wider mb-4 border-b border-[#F1E6EE] pb-2">
              Technical Profile & Target
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#817487] font-semibold mb-1">Target Role</label>
                <input
                  type="text"
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>
              <div>
                <label className="block text-[#817487] font-semibold mb-1">Programming Languages (comma-separated)</label>
                <input
                  type="text"
                  name="programmingLanguages"
                  value={formData.programmingLanguages}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>
              <div>
                <label className="block text-[#817487] font-semibold mb-1">Technical Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>
              <div>
                <label className="block text-[#817487] font-semibold mb-1">Preparation Goals</label>
                <textarea
                  rows={2}
                  name="preparationGoals"
                  value={formData.preparationGoals}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl glass-input"
                />
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div>
            <h3 className="text-xs font-bold text-[#C65B89] uppercase tracking-wider mb-4 border-b border-[#F1E6EE] pb-2">
              Coding & Professional Profiles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#817487] font-semibold mb-1 flex items-center space-x-1">
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Profile</span>
                </label>
                <input
                  type="text"
                  name="github"
                  placeholder="https://github.com/username"
                  value={formData.github}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>
              <div>
                <label className="block text-[#817487] font-semibold mb-1 flex items-center space-x-1">
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn URL</span>
                </label>
                <input
                  type="text"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>
              <div>
                <label className="block text-[#817487] font-semibold mb-1 flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>LeetCode Profile</span>
                </label>
                <input
                  type="text"
                  name="leetcode"
                  placeholder="https://leetcode.com/username"
                  value={formData.leetcode}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F1E6EE] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl font-bold text-[#30263A] bg-[#E879A9] hover:from-[#C65B89] shadow-glow flex items-center space-x-2 text-xs transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
