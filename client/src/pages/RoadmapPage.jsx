import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Map,
  Sparkles,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  RefreshCw,
  Award,
  ChevronDown,
  ChevronUp,
  Target
} from 'lucide-react';

export const RoadmapPage = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [openWeeks, setOpenWeeks] = useState({ 1: true });

  const [config, setConfig] = useState({
    targetRole: 'Software Development Engineer',
    durationWeeks: 8,
    dailyStudyHours: 3,
    currentLevel: 'Intermediate',
    weakAreas: 'Dynamic Programming, Operating Systems'
  });

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    try {
      setLoading(true);
      const res = await api.getRoadmaps();
      if (res.success) {
        setRoadmap(res.roadmap);
        // Pre-open first two weeks
        setOpenWeeks({ 1: true, 2: true });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    if (!roadmap) return;
    try {
      const res = await api.toggleRoadmapTask(roadmap._id, taskId);
      if (res.success) {
        setRoadmap(res.roadmap);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegenerate = async (e) => {
    e.preventDefault();
    setRegenerating(true);
    try {
      const res = await api.createRoadmap({
        ...config,
        weakAreas: config.weakAreas.split(',').map(s => s.trim()).filter(Boolean)
      });
      if (res.success) {
        setRoadmap(res.roadmap);
        setShowConfig(false);
        setOpenWeeks({ 1: true, 2: true });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRegenerating(false);
    }
  };

  const toggleWeek = (weekNum) => {
    setOpenWeeks({ ...openWeeks, [weekNum]: !openWeeks[weekNum] });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#E879A9] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1E6EE] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E879A9]/15 text-[#C65B89] border border-[#E879A9]/30 mb-2">
            <Map className="w-3.5 h-3.5" />
            <span>AI Career Planner</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#30263A]">Personalized Preparation Roadmap</h1>
          <p className="text-sm text-[#817487] mt-1">
            Weekly milestones and daily tasks tailored for your role: <span className="text-[#C65B89] font-semibold">{roadmap?.targetRole}</span>
          </p>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#30263A] bg-[#FFF9FC] border border-[#F1E6EE] hover:border-[#E879A9] transition-all flex items-center space-x-2 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#C65B89]" />
          <span>{showConfig ? 'Close Settings' : 'Regenerate Roadmap'}</span>
        </button>
      </div>

      {/* Regeneration Configuration Drawer */}
      {showConfig && (
        <div className="p-6 rounded-2xl glass-panel border border-[#F1E6EE]">
          <h3 className="text-sm font-bold text-[#30263A] mb-4">Reconfigure Study Roadmap Parameters</h3>
          <form onSubmit={handleRegenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[#817487] mb-1 font-semibold">Target Job Role</label>
              <input
                type="text"
                required
                value={config.targetRole}
                onChange={(e) => setConfig({ ...config, targetRole: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="block text-[#817487] mb-1 font-semibold">Duration (Weeks)</label>
              <select
                value={config.durationWeeks}
                onChange={(e) => setConfig({ ...config, durationWeeks: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl glass-input bg-[#FFFFFF]"
              >
                <option value="4">4 Weeks (Crash Course)</option>
                <option value="8">8 Weeks (Standard Prep)</option>
                <option value="12">12 Weeks (Comprehensive)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#817487] mb-1 font-semibold">Daily Study Hours</label>
              <input
                type="number"
                min="1"
                max="12"
                value={config.dailyStudyHours}
                onChange={(e) => setConfig({ ...config, dailyStudyHours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl glass-input"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-[#817487] mb-1 font-semibold">Weak Areas to Prioritize</label>
              <input
                type="text"
                value={config.weakAreas}
                onChange={(e) => setConfig({ ...config, weakAreas: e.target.value })}
                placeholder="e.g. Dynamic Programming, Graphs, DBMS Normalization"
                className="w-full px-3 py-2 rounded-xl glass-input"
              />
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={regenerating}
                className="px-6 py-2.5 rounded-xl font-bold text-[#30263A] bg-[#E879A9] hover:from-[#C65B89] shadow-glow flex items-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{regenerating ? 'Regenerating...' : 'Generate New Custom Roadmap'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Progress Metric Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-[#F1E6EE] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-[#E879A9]/15 flex items-center justify-center text-[#C65B89] border border-[#E879A9]/30">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#30263A]">Overall Roadmap Progress</h3>
            <p className="text-xs text-[#817487] mt-0.5">
              {roadmap?.durationWeeks || 8} Weeks • {config.dailyStudyHours || 3} Hours / Day Target
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-[#30263A]">Completion</span>
            <span className="text-emerald-400">{roadmap?.completionPercentage || 0}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#FFF9FC] overflow-hidden border border-[#F1E6EE]">
            <div
              className="h-full bg-gradient-to-r from-[#E879A9] to-emerald-400 transition-all duration-500"
              style={{ width: `${roadmap?.completionPercentage || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Weekly Schedule Timeline */}
      <div className="space-y-4">
        {roadmap?.weeklySchedule?.map((week) => {
          const isOpen = openWeeks[week.weekNumber];
          const completedCount = week.tasks.filter(t => t.isCompleted).length;
          const isWeekFullyDone = completedCount === week.tasks.length;

          return (
            <div
              key={week.weekNumber}
              className={`rounded-2xl border transition-all ${
                isWeekFullyDone
                  ? 'bg-[#FFF9FC]/50 border-emerald-500/30'
                  : 'bg-[#FFF9FC] border-[#F1E6EE]'
              }`}
            >
              {/* Week Accordion Header */}
              <div
                onClick={() => toggleWeek(week.weekNumber)}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isWeekFullyDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#E879A9]/20 text-[#C65B89]'
                  }`}>
                    W{week.weekNumber}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#30263A]">{week.title}</h3>
                    <p className="text-xs text-[#817487] mt-0.5">{week.focus}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs text-[#817487] hidden sm:inline-block">
                    {completedCount} / {week.tasks.length} Done
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#817487]" /> : <ChevronDown className="w-4 h-4 text-[#817487]" />}
                </div>
              </div>

              {/* Tasks List */}
              {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t border-[#F1E6EE]/60 space-y-3">
                  {week.milestone && (
                    <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#F1E6EE] text-xs text-[#C65B89] flex items-center space-x-2">
                      <Award className="w-4 h-4 text-[#FBBF24] flex-shrink-0" />
                      <span><strong>Milestone:</strong> {week.milestone}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    {week.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(task.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          task.isCompleted
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-[#817487]'
                            : 'bg-[#FFFFFF] border-[#F1E6EE] text-[#30263A] hover:border-[#E879A9]/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 truncate">
                          {task.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#817487] flex-shrink-0" />
                          )}
                          <div className="truncate">
                            <p className={`text-xs font-semibold ${task.isCompleted ? 'line-through text-[#817487]' : 'text-[#30263A]'}`}>
                              {task.title}
                            </p>
                            <p className="text-[11px] text-[#817487] truncate">{task.description}</p>
                          </div>
                        </div>

                        <span className="text-[10px] text-[#817487] flex items-center space-x-1 flex-shrink-0 pl-2">
                          <Clock className="w-3 h-3 text-[#E879A9]" />
                          <span>~{task.estimatedHours}h</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
