import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  BrainCircuit,
  Target,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area
} from 'recharts';

export const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.getAnalyticsOverview();
      if (res.success) {
        setData(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#E879A9] border-t-transparent animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const topicScores = data?.topicScores || [];
  const weeklyData = data?.weeklyData || [];
  const monthlyTrend = data?.monthlyTrend || [];
  const strengths = data?.strengths || [];
  const weaknesses = data?.weaknesses || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1E6EE] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E879A9]/15 text-[#C65B89] border border-[#E879A9]/30 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Telemetry & Performance Index</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#30263A]">Progress Analytics</h1>
          <p className="text-sm text-[#817487] mt-1">
            Data-backed insights derived from your actual mock tests, interview rounds, and algorithmic problem submissions.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE]">
          <span className="text-xs text-[#817487] flex items-center justify-between">
            <span>Overall Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{stats.overallScore}%</p>
          <span className="text-[10px] text-[#817487]">Comprehensive Index</span>
        </div>

        <div className="p-4 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE]">
          <span className="text-xs text-[#817487] flex items-center justify-between">
            <span>Streak Count</span>
            <Flame className="w-4 h-4 text-[#FBBF24]" />
          </span>
          <p className="text-2xl font-black text-[#FBBF24] mt-1">{stats.streakCount} Days</p>
          <span className="text-[10px] text-[#817487]">Daily Consistency</span>
        </div>

        <div className="p-4 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE]">
          <span className="text-xs text-[#817487] flex items-center justify-between">
            <span>Problems Solved</span>
            <CheckCircle2 className="w-4 h-4 text-[#E879A9]" />
          </span>
          <p className="text-2xl font-black text-[#30263A] mt-1">{stats.questionsSolved}</p>
          <span className="text-[10px] text-[#817487]">Verified Correct</span>
        </div>

        <div className="p-4 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE]">
          <span className="text-xs text-[#817487] flex items-center justify-between">
            <span>Mock Interviews</span>
            <Award className="w-4 h-4 text-[#C65B89]" />
          </span>
          <p className="text-2xl font-black text-[#30263A] mt-1">{stats.mockInterviewsCompleted}</p>
          <span className="text-[10px] text-[#C65B89]">Avg: {stats.avgInterviewScore}/100</span>
        </div>

        <div className="p-4 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE]">
          <span className="text-xs text-[#817487] flex items-center justify-between">
            <span>Mock OA Scores</span>
            <Target className="w-4 h-4 text-[#38BDF8]" />
          </span>
          <p className="text-2xl font-black text-[#30263A] mt-1">{stats.avgAssessmentScore}%</p>
          <span className="text-[10px] text-[#38BDF8]">{stats.mockOACompleted} Cleared</span>
        </div>

        <div className="p-4 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE]">
          <span className="text-xs text-[#817487] flex items-center justify-between">
            <span>Study Hours</span>
            <Clock className="w-4 h-4 text-[#C65B89]" />
          </span>
          <p className="text-2xl font-black text-[#30263A] mt-1">{stats.learningHours}h</p>
          <span className="text-[10px] text-[#817487]">Time on Platform</span>
        </div>
      </div>

      {/* Main Charts: Weekly Effort & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass-panel border border-[#F1E6EE]">
          <h3 className="text-base font-bold text-[#30263A] mb-1">Weekly Learning Activity</h3>
          <p className="text-xs text-[#817487] mb-4">Hours invested vs questions answered</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#817487" fontSize={11} />
                <YAxis stroke="#817487" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFF9FC', borderColor: '#F1E6EE', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Bar dataKey="hours" name="Study Hours" fill="#E879A9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="questions" name="Questions Solved" fill="#34D399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-[#F1E6EE]">
          <h3 className="text-base font-bold text-[#30263A] mb-1">Monthly Preparation Trajectory</h3>
          <p className="text-xs text-[#817487] mb-4">Preparation index score trend over the past 4 weeks</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E879A9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#E879A9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#817487" fontSize={11} />
                <YAxis stroke="#817487" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFF9FC', borderColor: '#F1E6EE', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#C65B89" fillOpacity={1} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Radar Chart + Strengths/Weaknesses Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 p-6 rounded-2xl glass-panel border border-[#F1E6EE]">
          <h3 className="text-base font-bold text-[#30263A] mb-1">Topic Radar</h3>
          <p className="text-xs text-[#817487] mb-4">Mastery breakdown across domains</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={topicScores}>
                <PolarGrid stroke="#F1E6EE" />
                <PolarAngleAxis dataKey="subject" stroke="#817487" fontSize={10} />
                <PolarRadiusAxis stroke="#F1E6EE" angle={30} domain={[0, 100]} />
                <Radar name="Mastery" dataKey="score" stroke="#E879A9" fill="#E879A9" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Strengths Card */}
          <div className="p-6 rounded-2xl bg-[#FFF9FC] border border-[#F1E6EE] flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 text-sm font-bold mb-3">
                <CheckCircle2 className="w-5 h-5" />
                <span>Identified Strengths</span>
              </div>
              <p className="text-xs text-[#817487] mb-4">
                Domains where you consistently score above batch average on first attempts.
              </p>
              <ul className="space-y-2 text-xs">
                {strengths.map((str, i) => (
                  <li key={i} className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#F1E6EE] text-[#30263A] flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[10px] text-emerald-400 mt-4">✓ Placement-ready topics</p>
          </div>

          {/* Weaknesses Card */}
          <div className="p-6 rounded-2xl bg-[#FFF9FC] border border-[#F1E6EE] flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-[#FBBF24] text-sm font-bold mb-3">
                <AlertTriangle className="w-5 h-5" />
                <span>Priority Revision Areas</span>
              </div>
              <p className="text-xs text-[#817487] mb-4">
                Recommended focus topics for your next study assistant sessions and mock OAs.
              </p>
              <ul className="space-y-2 text-xs">
                {weaknesses.map((w, i) => (
                  <li key={i} className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#F1E6EE] text-[#30263A] flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#FBBF24] flex-shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[10px] text-[#FBBF24] mt-4">⚠️ Focus on these to elevate overall score</p>
          </div>
        </div>
      </div>
    </div>
  );
};
