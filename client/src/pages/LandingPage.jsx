import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import {
  Sparkles,
  Bot,
  Video,
  Code2,
  BookOpen,
  FileText,
  Map,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Mic,
  TrendingUp
} from 'lucide-react';

export const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const features = [
    {
      icon: Bot,
      title: 'AI Study Assistant',
      desc: 'Context-aware tutoring powered by Llama 3.2 for DSA, DBMS, OS, Networks, and placement doubts.',
      bg: 'bg-[#FCE7F3]',
      color: 'text-[#C65B89]'
    },
    {
      icon: Video,
      title: 'Voice Mock Interviews',
      desc: 'AI interviewer asks company-authentic questions aloud, listens to your spoken answer, and evaluates it.',
      bg: 'bg-[#EDE9FE]',
      color: 'text-[#7C3AED]'
    },
    {
      icon: Code2,
      title: 'Company Mock OA Arena',
      desc: '3 curated OAs each for Google, Amazon, Microsoft, Infosys, TCS & Deloitte with real code test-case grading.',
      bg: 'bg-[#FFF0E8]',
      color: 'text-[#C27838]'
    },
    {
      icon: FileText,
      title: 'AI Notes & Flashcards',
      desc: 'Synthesize any CS topic or chat session into structured revision notes and interactive flashcards.',
      bg: 'bg-[#FCE7F3]',
      color: 'text-[#C65B89]'
    },
    {
      icon: Map,
      title: 'Personalized Roadmap',
      desc: 'Weekly placement milestones tailored to your target role, current level, and graduation timeline.',
      bg: 'bg-[#EDE9FE]',
      color: 'text-[#7C3AED]'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      desc: 'Track true assessment scores, interview readiness, and subject mastery with zero fabricated metrics.',
      bg: 'bg-[#E6F5EE]',
      color: 'text-[#3B8A66]'
    }
  ];

  const faqs = [
    {
      q: 'How does the AI Mock Interview work?',
      a: 'PrepAI selects non-repeating, company-specific questions, speaks them aloud using voice synthesis, captures your spoken or typed response, and evaluates technical accuracy and communication.'
    },
    {
      q: 'Are the Mock OA coding problems actually compiled and tested?',
      a: 'Yes! Your code is executed against structured sample and hidden test cases using our sandboxed runner and Judge0 CE compiler across JavaScript, Python, C++, Java, Go, and Rust.'
    },
    {
      q: 'Do interview questions repeat if I practice the same company twice?',
      a: 'No. PrepAI tracks every question you have already answered for each company in MongoDB so every new session serves fresh questions.'
    },
    {
      q: 'Is my study progress and chat history saved?',
      a: 'Yes, all conversations, notes, roadmaps, interview scorecards, and OA results are persisted securely per student account.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF9FC] text-[#30263A]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-22 pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column */}
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FCE7F3] border border-[#F9D5E5] text-[#C65B89] text-xs font-bold tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your Personal AI Learning Companion</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#30263A] leading-[1.15]">
              Your Journey to Success Starts with{' '}
              <span className="bg-[#FCE7F3] text-[#C65B89] px-2.5 py-0.5 rounded-2xl inline-block">
                Smarter Preparation.
              </span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-[#817487] leading-relaxed max-w-xl">
              Learn smarter, practice confidently, and achieve your career goals with your personal AI-powered learning companion.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="px-6 py-3 rounded-2xl text-sm font-bold text-white bg-[#E879A9] hover:bg-[#C65B89] shadow-glow transition-all flex items-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="px-6 py-3 rounded-2xl text-sm font-bold text-[#30263A] bg-white border border-[#F1E6EE] hover:border-[#F9D5E5] hover:bg-[#FFF9FC] transition-all"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-xs font-semibold text-[#817487]">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#65B891]" />
                <span>18 Company OAs</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#65B891]" />
                <span>Voice AI Interviews</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#65B891]" />
                <span>Real Code Execution</span>
              </span>
            </div>
          </div>

          {/* Right Column: Soft Pastel Workspace Preview + Floating Cards */}
          <div className="relative">
            <div className="bg-white rounded-3xl border border-[#F1E6EE] p-6 shadow-soft-lg">
              <div className="flex items-center justify-between pb-4 border-b border-[#F1E6EE]">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#F9D5E5]" />
                  <div className="w-3 h-3 rounded-full bg-[#EDE9FE]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFF0E8]" />
                </div>
                <span className="text-[11px] font-semibold text-[#A99EAD]">PrepAI Student Workspace</span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-2xl bg-[#FFF9FC] border border-[#F1E6EE] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] flex items-center justify-center text-[#C65B89]">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#30263A]">AI Study Assistant</p>
                      <p className="text-[11px] text-[#817487]">Explaining DBMS 2NF & BCNF with examples</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#E6F5EE] text-[#3B8A66] text-[10px] font-bold">
                    Online
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-[#EDE9FE]/50 border border-[#EDE9FE]">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-4 h-4 text-[#7C3AED]" />
                      <span className="text-[10px] font-bold text-[#7C3AED]">Readiness</span>
                    </div>
                    <p className="text-2xl font-extrabold text-[#30263A]">85%</p>
                    <p className="text-[11px] text-[#817487]">Preparation Progress</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFF0E8]/80 border border-[#FFE2D1]">
                    <div className="flex items-center justify-between mb-2">
                      <Mic className="w-4 h-4 text-[#C27838]" />
                      <span className="text-[10px] font-bold text-[#C27838]">Voice AI</span>
                    </div>
                    <p className="text-2xl font-extrabold text-[#30263A]">Google</p>
                    <p className="text-[11px] text-[#817487]">Mock Interview Ready</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#F1E6EE] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#65B891]" />
                    <span className="text-xs font-semibold text-[#30263A]">Proctored OA • Test Cases Passed</span>
                  </div>
                  <span className="text-xs font-bold text-[#C65B89]">6/6 ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why PrepAI / Features */}
      <section id="features" className="py-12 bg-white border-y border-[#F1E6EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C65B89] bg-[#FCE7F3] px-3 py-1 rounded-full">
              Everything You Need
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#30263A]">
              One Platform. Every Step of Your Preparation.
            </h2>
            <p className="mt-2 text-sm text-[#817487]">
              Designed like a calm, focused study workspace — combining AI tutoring, real company OAs, and voice interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#FFF9FC] border border-[#F1E6EE] glass-panel-hover"
                >
                  <div className={`w-11 h-11 rounded-xl ${f.bg} ${f.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#30263A] mb-2">{f.title}</h3>
                  <p className="text-xs text-[#817487] leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-7">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#30263A]">How PrepAI Works</h2>
          <p className="mt-1.5 text-sm text-[#817487]">Three focused steps from syllabus confusion to placement confidence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '01', title: 'Set Your Target Role', desc: 'Complete your student profile with your degree, skills, and target companies.' },
            { step: '02', title: 'Learn & Synthesize', desc: 'Ask the AI Study Assistant anything, generate structured notes, and follow your roadmap.' },
            { step: '03', title: 'Practice Under Real Conditions', desc: 'Take company-specific OAs with live test cases and voice-enabled AI mock interviews.' }
          ].map((item) => (
            <div key={item.step} className="p-6 rounded-2xl bg-white border border-[#F1E6EE] shadow-card">
              <span className="inline-block px-3 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-extrabold mb-3">
                Step {item.step}
              </span>
              <h3 className="text-base font-bold text-[#30263A] mb-2">{item.title}</h3>
              <p className="text-xs text-[#817487] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-10 bg-white border-t border-[#F1E6EE]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-[#30263A] text-center mb-6">Frequently Asked Questions</h2>
          <div className="space-y-2.5">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-[#F1E6EE] bg-[#FFF9FC] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-bold text-[#30263A]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#C65B89] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-[#817487] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA & Footer */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-[#FCE7F3] via-white to-[#EDE9FE] border border-[#F1E6EE] p-6 sm:p-8 text-center shadow-soft">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#30263A]">
            Ready to elevate your placement preparation?
          </h2>
          <p className="mt-2 text-sm text-[#817487] max-w-lg mx-auto">
            Prepare. Practice. Progress. Start using PrepAI today with real-time tracking and company-authentic rounds.
          </p>
          <div className="mt-6">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-[#E879A9] hover:bg-[#C65B89] shadow-glow transition-all"
            >
              <span>Create Free Student Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-[#F1E6EE] bg-white text-center text-xs text-[#817487]">
        © {new Date().getFullYear()} PrepAI — Prepare. Practice. Progress. Built for students.
      </footer>
    </div>
  );
};
