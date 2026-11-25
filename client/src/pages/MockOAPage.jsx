import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useProctoring } from '../hooks/useProctoring';
import { ProctorHUD } from '../components/proctor/ProctorHUD';
import { SystemCheckModal } from '../components/proctor/SystemCheckModal';
import {
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  Flag,
  Award,
  Terminal,
  ShieldCheck,
  Building2
} from 'lucide-react';

const COMPANIES = [
  { id: 'Google', desc: 'Graphs, DP, Trees & System Scaling' },
  { id: 'Amazon', desc: 'Arrays, Greedy, Leadership & Cloud' },
  { id: 'Microsoft', desc: 'Strings, OS Virtual Memory & DBMS' },
  { id: 'Infosys', desc: 'Programming Logic, SQL & Aptitude' },
  { id: 'TCS', desc: 'TCS NQT Coding, Percentages & OOP' },
  { id: 'Deloitte', desc: 'NLA Arrays, SQL Joins & Reasoning' }
];

export const MockOAPage = () => {
  const [inAssessment, setInAssessment] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const [selectedOaSet, setSelectedOaSet] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1200);
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeInputs, setCodeInputs] = useState({});
  const [testResults, setTestResults] = useState(null);
  const [runningCode, setRunningCode] = useState(false);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showSystemCheck, setShowSystemCheck] = useState(false);
  const proctor = useProctoring({
    isExamActive: inAssessment,
    onViolation: (v) => console.warn('[Proctor Notice]', v.message)
  });

  const handleSystemVerifiedAndStart = async () => {
    setShowSystemCheck(false);
    setLoading(true);
    try {
      const res = await api.getAssessmentQuestions({
        company: selectedCompany,
        oaSet: selectedOaSet
      });
      if (res.success && res.questions.length > 0) {
        setQuestions(res.questions);
        setCurrentIndex(0);
        setAnswers({});
        setTimeLeft(1200);
        setResult(null);
        setTestResults(null);

        const initialCodes = {};
        res.questions.forEach(q => {
          if (q.type === 'coding') {
            initialCodes[q._id] = q.starterCode?.javascript || `function ${q.functionName || 'solve'}() {\n  // Write your solution here\n}\n`;
          }
        });
        setCodeInputs(initialCodes);
        setInAssessment(true);
      }
    } catch (err) {
      console.error('Failed to load assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (inAssessment && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [inAssessment, timeLeft]);

  const handleSelectOption = (qId, optionLabel) => {
    setAnswers({
      ...answers,
      [qId]: { ...(answers[qId] || {}), studentAnswer: optionLabel }
    });
  };

  const handleToggleMarkReview = (qId) => {
    setAnswers({
      ...answers,
      [qId]: {
        ...(answers[qId] || {}),
        isMarkedForReview: !(answers[qId]?.isMarkedForReview || false)
      }
    });
  };

  const handleRunAndCheckTests = async (qId) => {
    setRunningCode(true);
    setTestResults(null);
    try {
      const code = codeInputs[qId] || '';
      const res = await api.runTestCases({
        questionId: qId,
        code,
        language: codeLanguage
      });
      setTestResults(res);
      setAnswers({
        ...answers,
        [qId]: { ...(answers[qId] || {}), studentAnswer: code }
      });
    } catch (err) {
      setTestResults({
        allPassed: false,
        status: 'Execution Error',
        output: err.message,
        results: []
      });
    } finally {
      setRunningCode(false);
    }
  };

  const handleSubmitAssessment = async () => {
    setLoading(true);
    setSubmitError('');
    try {
      const formattedAnswers = questions.map(q => {
        const ans = answers[q._id];
        return {
          questionId: q._id,
          studentAnswer: q.type === 'coding' ? (codeInputs[q._id] || '') : (ans?.studentAnswer || ''),
          language: q.type === 'coding' ? codeLanguage : undefined,
          isMarkedForReview: ans?.isMarkedForReview || false
        };
      });

      const res = await api.submitAssessment({
        title: `${selectedCompany} OA #${selectedOaSet}`,
        company: selectedCompany,
        category: selectedCompany,
        answers: formattedAnswers,
        timeTakenSeconds: 1200 - timeLeft
      });

      if (res.success) {
        setResult(res.assessment);
        setInAssessment(false);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setSubmitError(err.message || 'Failed to submit OA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="space-y-6">
      {inAssessment && (
        <ProctorHUD
          cameraStream={proctor.cameraStream}
          screenStream={proctor.screenStream}
          audioLevel={proctor.audioLevel}
          noiseStatus={proctor.noiseStatus}
          faceStatus={proctor.faceStatus}
          isFullscreen={proctor.isFullscreen}
          violations={proctor.violations}
          integrityScore={proctor.integrityScore}
          onEnterFullscreen={proctor.enterFullscreen}
        />
      )}

      <SystemCheckModal
        isOpen={showSystemCheck}
        onClose={() => setShowSystemCheck(false)}
        onVerified={handleSystemVerifiedAndStart}
        proctorState={proctor}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1E6EE] pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold px-3 py-1 rounded-full bg-[#FCE7F3] text-[#C65B89] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>18 Real-World Company OAs • Automated Test-Case Grading</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#30263A]">Mock OA Arena</h1>
          <p className="text-xs text-[#817487] mt-0.5">
            Select a company and choose from 3 curated Online Assessments with live code execution & test verification.
          </p>
        </div>

        {inAssessment && (
          <div className="flex items-center space-x-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#F1E6EE] flex items-center space-x-2 text-xs font-mono font-bold text-[#30263A] shadow-sm">
              <Clock className="w-4 h-4 text-[#F2B86B]" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={handleSubmitAssessment}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#E87979] hover:bg-[#D15B5B] transition-colors"
            >
              Finish OA
            </button>
          </div>
        )}
      </div>

      {/* State 1: Choose Company & 3 OA Sets */}
      {!inAssessment && !result && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#817487] mb-3">1. Select Target Company</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
              {COMPANIES.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompany(comp.id)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                    selectedCompany === comp.id
                      ? 'bg-[#FCE7F3]/70 border-[#E879A9] shadow-sm'
                      : 'bg-white border-[#F1E6EE] hover:border-[#F9D5E5]'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1.5">
                    <Building2 className={`w-4 h-4 ${selectedCompany === comp.id ? 'text-[#C65B89]' : 'text-[#A99EAD]'}`} />
                    <h3 className="font-bold text-[#30263A] text-sm">{comp.id}</h3>
                  </div>
                  <p className="text-[11px] text-[#817487]">{comp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#817487] mb-3">2. Select {selectedCompany} OA Paper (3 Sets Available)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              {[1, 2, 3].map((oaNum) => (
                <button
                  key={oaNum}
                  type="button"
                  onClick={() => setSelectedOaSet(oaNum)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedOaSet === oaNum
                      ? 'bg-[#EDE9FE]/70 border-[#A78BFA] shadow-sm'
                      : 'bg-white border-[#F1E6EE] hover:border-[#EDE9FE]'
                  }`}
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#7C3AED] border border-[#EDE9FE]">
                    {selectedCompany} OA #{oaNum}
                  </span>
                  <h4 className="font-bold text-[#30263A] mt-2">Assessment Set {oaNum}</h4>
                  <p className="text-[11px] text-[#817487] mt-0.5">Coding + Technical/Aptitude MCQs</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#F1E6EE] shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs">
              <h4 className="font-bold text-[#30263A]">Ready for {selectedCompany} — OA #{selectedOaSet}</h4>
              <p className="text-[#817487] mt-0.5">
                Includes webcam, ambient noise check, screen share, and automated test-case verification.
              </p>
            </div>
            <button
              onClick={() => setShowSystemCheck(true)}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#E879A9] hover:bg-[#C65B89] shadow-glow flex items-center space-x-2 flex-shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify & Start OA #{selectedOaSet}</span>
            </button>
          </div>
        </div>
      )}

      {/* State 2: Active Timed Proctored OA */}
      {inAssessment && currentQ && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-[#F1E6EE] shadow-card">
              <div className="flex items-center justify-between border-b border-[#F1E6EE] pb-3 mb-4">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-bold text-[#C65B89]">Question {currentIndex + 1} of {questions.length}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FFF9FC] border border-[#F1E6EE] text-[#817487]">{currentQ.difficulty}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] font-semibold">{currentQ.topic}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleMarkReview(currentQ._id)}
                  className={`text-xs flex items-center space-x-1 px-3 py-1 rounded-lg border transition-all ${
                    answers[currentQ._id]?.isMarkedForReview
                      ? 'bg-[#FFF0E8] text-[#A86F24] border-[#F2B86B]'
                      : 'bg-[#FFF9FC] text-[#817487] border-[#F1E6EE]'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{answers[currentQ._id]?.isMarkedForReview ? 'Marked' : 'Mark Review'}</span>
                </button>
              </div>

              <h2 className="text-base font-bold text-[#30263A] mb-2">{currentQ.title}</h2>
              {submitError && (
                <div className="mb-4 p-3 rounded-xl bg-[#FCE7F3] border border-[#E87979] text-xs text-[#B54545] font-semibold">
                  {submitError}
                </div>
              )}
              <div className="text-xs text-[#30263A] leading-relaxed mb-5 whitespace-pre-wrap">
                {currentQ.description}
              </div>

              {/* Sample Test Cases preview for coding */}
              {currentQ.type === 'coding' && currentQ.sampleTestCases?.length > 0 && (
                <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentQ.sampleTestCases.map((tc, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE] text-[11px] font-mono">
                      <p className="font-bold text-[#C65B89] mb-1">Sample Case {i + 1}</p>
                      <p className="text-[#817487]">Input: <span className="text-[#30263A]">{tc.input}</span></p>
                      <p className="text-[#817487]">Expected: <span className="text-[#3B8A66] font-bold">{tc.output}</span></p>
                    </div>
                  ))}
                </div>
              )}

              {/* MCQ Options */}
              {currentQ.type === 'mcq' && (
                <div className="space-y-2.5">
                  {currentQ.options?.map((opt) => {
                    const isSelected = answers[currentQ._id]?.studentAnswer === opt.label;
                    return (
                      <div
                        key={opt.label}
                        onClick={() => handleSelectOption(currentQ._id, opt.label)}
                        className={`p-3.5 rounded-xl cursor-pointer border flex items-center space-x-3 text-xs transition-all ${
                          isSelected
                            ? 'bg-[#FCE7F3] border-[#E879A9] text-[#30263A] font-semibold'
                            : 'bg-[#FFF9FC] border-[#F1E6EE] text-[#817487] hover:text-[#30263A]'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-[#E879A9] text-white' : 'bg-white border border-[#F1E6EE]'
                        }`}>
                          {opt.label}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Clean White Code Editor */}
              {currentQ.type === 'coding' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs bg-[#FFF9FC] p-2.5 rounded-xl border border-[#F1E6EE]">
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-[#C65B89]" />
                      <select
                        value={codeLanguage}
                        onChange={(e) => {
                          const lang = e.target.value;
                          setCodeLanguage(lang);
                          if (currentQ.starterCode?.[lang]) {
                            setCodeInputs({ ...codeInputs, [currentQ._id]: currentQ.starterCode[lang] });
                          }
                        }}
                        className="bg-white text-[#30263A] px-2.5 py-1 rounded-lg text-xs border border-[#F1E6EE] font-semibold"
                      >
                        <option value="javascript">JavaScript (Automated Test Cases)</option>
                        <option value="python">Python 3 (Judge0 Compiler)</option>
                        <option value="cpp">C++ (GCC Judge0)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleRunAndCheckTests(currentQ._id)}
                      disabled={runningCode}
                      className="px-4 py-1.5 rounded-lg bg-[#65B891] hover:bg-[#4FA37C] text-white text-xs font-bold flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{runningCode ? 'Running Tests...' : 'Run & Check Code'}</span>
                    </button>
                  </div>

                  <textarea
                    rows={11}
                    value={codeInputs[currentQ._id] || ''}
                    onChange={(e) => setCodeInputs({ ...codeInputs, [currentQ._id]: e.target.value })}
                    className="w-full p-4 rounded-xl font-mono text-xs glass-input leading-relaxed bg-white"
                    spellCheck={false}
                  />

                  {/* Real Test Case Results */}
                  {testResults && (
                    <div className="p-4 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE] text-xs space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-[#F1E6EE]">
                        <span className={`font-bold ${testResults.allPassed ? 'text-[#3B8A66]' : 'text-[#B54545]'}`}>
                          {testResults.status}
                        </span>
                        {testResults.executionTimeMs !== undefined && testResults.executionTimeMs !== null && (
                          <span className="text-[11px] text-[#817487] font-mono">{testResults.executionTimeMs} ms</span>
                        )}
                      </div>

                      {testResults.results?.length > 0 ? (
                        <div className="space-y-2">
                          {testResults.results.map((r) => (
                            <div key={r.testCase} className={`p-2.5 rounded-lg border font-mono text-[11px] ${
                              r.passed ? 'bg-[#E6F5EE]/60 border-[#65B891]/40' : 'bg-[#FCE7F3]/50 border-[#E87979]/40'
                            }`}>
                              <div className="flex items-center justify-between font-bold mb-1">
                                <span className="flex items-center space-x-1.5">
                                  {r.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-[#3B8A66]" /> : <XCircle className="w-3.5 h-3.5 text-[#B54545]" />}
                                  <span>Test Case {r.testCase}: {r.passed ? 'Passed' : 'Failed'}</span>
                                </span>
                                <span className="text-[10px] text-[#817487]">{r.executionTimeMs} ms</span>
                              </div>
                              <p className="text-[#817487]">Expected: <span className="text-[#30263A]">{r.expected}</span></p>
                              <p className="text-[#817487]">Your Output: <span className={r.passed ? 'text-[#3B8A66]' : 'text-[#B54545]'}>{r.actual}</span></p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <pre className="text-[#30263A] whitespace-pre-wrap font-mono text-[11px]">{testResults.output}</pre>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Prev / Next */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#F1E6EE] text-xs">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => { setCurrentIndex(currentIndex - 1); setTestResults(null); }}
                  className="px-4 py-2 rounded-xl font-semibold bg-[#FFF9FC] border border-[#F1E6EE] text-[#817487] hover:text-[#30263A] disabled:opacity-40"
                >
                  Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => { setCurrentIndex(currentIndex + 1); setTestResults(null); }}
                    className="px-5 py-2 rounded-xl font-bold text-white bg-[#E879A9] hover:bg-[#C65B89]"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitAssessment}
                    disabled={loading}
                    className="px-6 py-2 rounded-xl font-bold text-white bg-[#65B891] hover:bg-[#4FA37C]"
                  >
                    {loading ? 'Grading...' : 'Submit Final OA'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Palette */}
          <div>
            <div className="p-4 rounded-2xl bg-white border border-[#F1E6EE] shadow-card">
              <h4 className="text-xs font-bold text-[#30263A] mb-3">Question Palette</h4>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const ans = answers[q._id];
                  const isCurrent = idx === currentIndex;
                  const isAttempted = !!ans?.studentAnswer;
                  const isMarked = ans?.isMarkedForReview;

                  let bg = 'bg-[#FFF9FC] text-[#817487] border-[#F1E6EE]';
                  if (isMarked) bg = 'bg-[#FFF0E8] text-[#A86F24] border-[#F2B86B]';
                  else if (isAttempted) bg = 'bg-[#E6F5EE] text-[#3B8A66] border-[#65B891]';

                  return (
                    <button
                      key={q._id}
                      onClick={() => { setCurrentIndex(idx); setTestResults(null); }}
                      className={`h-8 rounded-lg text-xs font-bold border ${bg} ${
                        isCurrent ? 'ring-2 ring-[#E879A9]' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* State 3: Result */}
      {result && (
        <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-white border border-[#F1E6EE] shadow-card text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-[#FCE7F3] text-[#C65B89] mx-auto flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#30263A]">{result.title} — Results</h2>
          <p className="text-4xl font-black text-[#C65B89]">{result.percentage}%</p>

          <div className="grid grid-cols-4 gap-3 text-xs max-w-lg mx-auto">
            <div className="p-3 rounded-xl bg-[#E6F5EE]">
              <p className="text-[#3B8A66] font-bold text-lg">{result.correctCount}</p>
              <p className="text-[#817487] text-[10px]">Correct</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FCE7F3]">
              <p className="text-[#B54545] font-bold text-lg">{result.incorrectCount}</p>
              <p className="text-[#817487] text-[10px]">Incorrect</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE]">
              <p className="text-[#30263A] font-bold text-lg">{result.unattemptedCount}</p>
              <p className="text-[#817487] text-[10px]">Skipped</p>
            </div>
            <div className="p-3 rounded-xl bg-[#EDE9FE]">
              <p className="text-[#7C3AED] font-bold text-lg">{Math.round((result.timeTakenSeconds || 0) / 60)}m</p>
              <p className="text-[#817487] text-[10px]">Time</p>
            </div>
          </div>

          <button
            onClick={() => setResult(null)}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#E879A9] hover:bg-[#C65B89]"
          >
            Back to Company OAs
          </button>
        </div>
      )}
    </div>
  );
};
