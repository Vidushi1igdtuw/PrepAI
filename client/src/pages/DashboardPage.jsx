import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Sparkles,
  Bot,
  Video,
  Code2,
  FileText,
  Map,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Flame,
  Calendar,
  BookOpen
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export const DashboardPage = () => {
  const { user, profile } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const analyticsRes = await api.getAnalyticsOverview();
        if (analyticsRes.success) {
          setAnalytics(analyticsRes);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-2 border-[#E879A9] border-t-transparent animate-spin" />
      </div>
    );
  }

  const stats = analytics?.stats || {
    overallScore: 0,
    streakCount: 0,
    questionsSolved: 0,
    mockInterviewsCompleted: 0,
    avgInterviewScore: 0,
    mockOACompleted: 0,
    avgAssessmentScore: 0,
    learningHours: 0,
    roadmapCompletion: 0
  };

  const weeklyData = analytics?.weeklyData || [
    { day: 'Mon', hours: 0, questions: 0 },
    { day: 'Tue', hours: 0, questions: 0 },
    { day: 'Wed', hours: 0, questions: 0 },
    { day: 'Thu', hours: 0, questions: 0 },
    { day: 'Fri', hours: 0, questions: 0 },
    { day: 'Sat', hours: 0, questions: 0 },
    { day: 'Sun', hours: 0, questions: 0 }
  ];

  const topicScores = analytics?.topicScores || [];
  const recentActivities = analytics?.recentActivities || [];

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner */}
      <div className="rounded-2xl bg-white border border-[#F1E6EE] p-6 sm:p-7 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-[#FCE7F3] text-[#C65B89] mb-2.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#30263A]">
            Hello, {user?.name || 'Student'}! ✨
          </h1>
          <p className="text-xs sm:text-sm text-[#817487] mt-1 max-w-xl">
            Let's make today count. Your next milestone toward <span className="text-[#C65B89] font-semibold">{profile?.targetRole || 'SDE-1'}</span> is closer than you think.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            to="/mock-oa"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#C65B89] bg-[#FCE7F3] hover:bg-[#F9D5E5] transition-colors flex items-center space-x-1.5"
          >
            <Code2 className="w-4 h-4" />
            <span>Company OA</span>
          </Link>
          <Link
            to="/mock-interview"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#E879A9] hover:bg-[#C65B89] shadow-glow transition-colors flex items-center space-x-1.5"
          >
            <Video className="w-4 h-4" />
            <span>Voice Interview</span>
          </Link>
        </div>
      </div>

      {/* 2. Four Key Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#F1E6EE] shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#817487]">Overall Progress</span>
            <div className="w-8 h-8 rounded-xl bg-[#FCE7F3] text-[#C65B89] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#30263A]">{stats.overallScore}%</p>
          <p className="text-[11px] text-[#817487] mt-1">Readiness Index</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#F1E6EE] shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#817487]">Learning Streak</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0E8] text-[#C27838] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#30263A]">{stats.streakCount} Days</p>
          <p className="text-[11px] text-[#817487] mt-1">{stats.learningHours}h study time</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#F1E6EE] shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#817487]">Questions Solved</span>
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#30263A]">{stats.questionsSolved}</p>
          <p className="text-[11px] text-[#817487] mt-1">{stats.mockOACompleted} OAs completed</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#F1E6EE] shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#817487]">Interviews Completed</span>
            <div className="w-8 h-8 rounded-xl bg-[#E6F5EE] text-[#3B8A66] flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#30263A]">{stats.mockInterviewsCompleted}</p>
          <p className="text-[11px] text-[#817487] mt-1">Avg: {stats.avgInterviewScore}/100</p>
        </div>
      </div>

      {/* 3. Wide AI Study Assistant Feature Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FCE7F3]/70 via-white to-[#EDE9FE]/70 border border-[#F1E6EE] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#F9D5E5] flex items-center justify-center text-[#C65B89] shadow-sm flex-shrink-0">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C65B89] bg-white px-2.5 py-0.5 rounded-full border border-[#F9D5E5]">
              Llama 3.2 Powered
            </span>
            <h2 className="text-lg font-extrabold text-[#30263A] mt-1">Meet Your AI Study Assistant</h2>
            <p className="text-xs text-[#817487] mt-0.5 max-w-lg">
              Have doubts? Need step-by-step explanations or instant revision notes? Your personal AI teacher is always ready to help.
            </p>
          </div>
        </div>

        <Link
          to="/ai-study"
          className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-[#E879A9] hover:bg-[#C65B89] shadow-glow transition-all flex items-center space-x-2 flex-shrink-0"
        >
          <span>Start Learning</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4. Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { to: '/mock-interview', icon: Video, label: 'Start Mock Interview', bg: 'bg-[#FCE7F3]', color: 'text-[#C65B89]' },
          { to: '/mock-oa', icon: Code2, label: 'Practice Mock OA', bg: 'bg-[#EDE9FE]', color: 'text-[#7C3AED]' },
          { to: '/ai-study', icon: FileText, label: 'Generate AI Notes', bg: 'bg-[#FFF0E8]', color: 'text-[#C27838]' },
          { to: '/study-material', icon: BookOpen, label: 'Study Material', bg: 'bg-[#E6F5EE]', color: 'text-[#3B8A66]' },
          { to: '/roadmap', icon: Map, label: 'View Roadmap', bg: 'bg-[#FCE7F3]', color: 'text-[#C65B89]' }
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.to}
              className="p-4 rounded-2xl bg-white border border-[#F1E6EE] glass-panel-hover text-center group"
            >
              <div className={`w-9 h-9 mx-auto rounded-xl ${action.bg} ${action.color} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#30263A] block">{action.label}</span>
            </Link>
          );
        })}
      </div>

      {/* 5. Charts: Weekly Activity & Subject Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-[#F1E6EE] shadow-card">
          <h3 className="text-sm font-bold text-[#30263A] mb-0.5">Weekly Learning Activity</h3>
          <p className="text-[11px] text-[#817487] mb-4">Hours studied and questions solved from your real sessions</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1E6EE" />
                <XAxis dataKey="day" stroke="#817487" fontSize={11} />
                <YAxis stroke="#817487" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F1E6EE', borderRadius: '0.75rem', color: '#30263A', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="hours" name="Hours" stroke="#E879A9" strokeWidth={2.5} dot={{ r: 4, fill: '#E879A9' }} />
                <Line type="monotone" dataKey="questions" name="Questions" stroke="#A78BFA" strokeWidth={2.5} dot={{ r: 4, fill: '#A78BFA' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#F1E6EE] shadow-card">
          <h3 className="text-sm font-bold text-[#30263A] mb-0.5">Subject-wise Progress</h3>
          <p className="text-[11px] text-[#817487] mb-4">Calculated from completed OAs</p>
          <div className="h-56">
            {topicScores.some(t => t.score > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicScores} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} stroke="#817487" fontSize={10} />
                  <YAxis dataKey="subject" type="category" stroke="#817487" fontSize={10} width={70} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F1E6EE', borderRadius: '0.75rem', fontSize: '11px' }}
                  />
                  <Bar dataKey="score" fill="#E879A9" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <Sparkles className="w-7 h-7 text-[#E879A9] mb-2 opacity-60" />
                <p className="text-xs font-semibold text-[#30263A]">No OA data yet</p>
                <p className="text-[11px] text-[#817487] mt-1">Complete a Mock OA to see your subject mastery breakdown.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Recent Activity */}
      <div className="p-5 rounded-2xl bg-white border border-[#F1E6EE] shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-[#30263A]">Recent Activities</h3>
            <p className="text-[11px] text-[#817487]">Live log from your study, OA, and interview sessions</p>
          </div>
          <Link to="/analytics" className="text-xs font-semibold text-[#C65B89] hover:underline">
            View Full Analytics →
          </Link>
        </div>

        <div className="space-y-2 text-xs">
          {recentActivities.length > 0 ? (
            recentActivities.slice(0, 5).map((act, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE] flex items-center justify-between">
                <span className="font-medium text-[#30263A] truncate max-w-xl">{act.title}</span>
                <span className="text-[10px] text-[#A99EAD] font-mono flex-shrink-0">
                  {new Date(act.timestamp).toLocaleDateString()} • {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#817487] text-center py-6">
              No activities recorded yet. Start by asking the AI Study Assistant or taking a Mock OA!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
