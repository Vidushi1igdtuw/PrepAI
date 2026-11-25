import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Sparkles, ArrowRight, GraduationCap, Target, Code } from 'lucide-react';

export const OnboardingPage = () => {
  const { user, profile, setUser, setProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: profile?.college || '',
    degree: profile?.degree || 'B.Tech / B.E.',
    branch: profile?.branch || 'Computer Science & Engineering',
    currentYear: profile?.currentYear || '3rd Year',
    graduationYear: profile?.graduationYear || 2026,
    skills: profile?.skills?.join(', ') || 'Data Structures, Algorithms, SQL, React, Node.js',
    programmingLanguages: profile?.programmingLanguages?.join(', ') || 'C++, Python, JavaScript',
    areasOfInterest: profile?.areasOfInterest?.join(', ') || 'Full Stack Development, AI / ML, Systems',
    targetRole: profile?.targetRole || 'Software Development Engineer (SDE-1)',
    preparationGoals: profile?.preparationGoals || 'Crack Tier-1 product company campus placements in 6 months',
    currentPreparationLevel: profile?.currentPreparationLevel || 'Intermediate'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        programmingLanguages: formData.programmingLanguages.split(',').map(s => s.trim()).filter(Boolean),
        areasOfInterest: formData.areasOfInterest.split(',').map(s => s.trim()).filter(Boolean),
        graduationYear: Number(formData.graduationYear)
      };

      const res = await api.updateProfile(payload);
      if (res.success) {
        if (res.user) setUser(res.user);
        if (res.profile) setProfile(res.profile);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to complete profile onboarding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9FC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FCE7F3] border border-[#F9D5E5] text-[#C65B89] text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 2 of 2 — Personalize Your AI Companion</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#30263A]">Student Onboarding</h1>
          <p className="text-sm text-[#817487] mt-2">
            Tell PrepAI about your academic background and career goals. Your roadmap and mock interviews adapt to these settings.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#F1E6EE] shadow-card">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-[#E87979]/10 border border-[#E87979]/30 text-[#B54545] text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-[#C65B89] text-sm font-bold border-b border-[#F1E6EE] pb-2 mb-4">
                <GraduationCap className="w-4 h-4" />
                <span>Academic Information</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#817487] mb-1">Full Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3.5 py-2 rounded-xl glass-input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#817487] mb-1">College / University</label>
                  <input type="text" name="college" required placeholder="e.g. National Institute of Technology" value={formData.college} onChange={handleChange} className="w-full px-3.5 py-2 rounded-xl glass-input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#817487] mb-1">Degree</label>
                  <input type="text" name="degree" required value={formData.degree} onChange={handleChange} className="w-full px-3.5 py-2 rounded-xl glass-input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#817487] mb-1">Branch / Major</label>
                  <input type="text" name="branch" required value={formData.branch} onChange={handleChange} className="w-full px-3.5 py-2 rounded-xl glass-input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#817487] mb-1">Current Academic Year</label>
                  <select name="currentYear" value={formData.currentYear} onChange={handleChange} className="w-full px-3.5 py-2 rounded-xl glass-input text-sm">
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#817487] mb-1">Graduation Year</label>
                  <input type="number" name="graduationYear" required value={formData.graduationYear} onChange={handleChange} className="w-full px-3.5 py-2 rounded-xl glass-input text-sm" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 text-[#7C3AED] text-sm font-bold border-b border-[#F1E6EE] pb-2 mb-4">
                <Code className="w-4 h-4" />
                <span>Technical Skills & Proficiency</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#817487] mb-1">Programming Languages (Comma-separated)</label>
                  <input type="text" name="programmingLanguages" value={formData.programmingLanguages} onChange={handleChange} className="w-full px-3.5 py-2 rounded-xl glass-input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#817487] mb-1">Technical Skills (Comma-separated)</label>
                  <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full px-3.5 py-2 rounded-xl glass-input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#817487] mb-1">Areas of Interest (Comma-separated)</label>
                  <input type="text" name="areasOfInterest" value={formData.areasOfInterest} onChange={handleChange} className="w-full px-3.5 py-2 rounded-xl glass-input text-sm" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 text-[#C65B89] text-sm font-bold border-b border-[#F1E6EE] pb-2 mb-4">
                <Target className="w-4 h-4" />
                <span>Career Target & Goals</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#817487] mb-1">Target Job Role</label>
                  <input type="text" name="targetRole" required value={formData.targetRole} onChange={handleChange} className="w-full px-3.5 py-2 rounded-xl glass-input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#817487] mb-1">Current Preparation Level</label>
                  <select name="currentPreparationLevel" value={formData.currentPreparationLevel} onChange={handleChange} className="w-full px-3.5 py-2 rounded-xl glass-input text-sm">
                    <option value="Beginner">Beginner (Starting DSA/Foundations)</option>
                    <option value="Intermediate">Intermediate (Practicing Medium & Core CS)</option>
                    <option value="Advanced">Advanced (Company Mocks & System Design)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#817487] mb-1">Placement Preparation Goal</label>
                  <textarea rows={2} name="preparationGoals" value={formData.preparationGoals} onChange={handleChange} className="w-full px-3.5 py-2 rounded-xl glass-input text-sm" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-[#E879A9] hover:bg-[#C65B89] shadow-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Personalizing Platform...' : 'Complete Setup & Launch Dashboard'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
