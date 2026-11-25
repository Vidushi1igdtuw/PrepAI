import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useProctoring } from '../hooks/useProctoring';
import { ProctorHUD } from '../components/proctor/ProctorHUD';
import { SystemCheckModal } from '../components/proctor/SystemCheckModal';
import {
  Video,
  Bot,
  Clock,
  ShieldCheck,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export const MockInterviewPage = () => {
  const [inInterview, setInInterview] = useState(false);
  const [interviewSession, setInterviewSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(900);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Voice Q&A states
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const [showSystemCheck, setShowSystemCheck] = useState(false);
  const proctor = useProctoring({
    isExamActive: inInterview,
    onViolation: (v) => console.warn('[Interview Proctor Notice]', v.message)
  });

  const [config, setConfig] = useState({
    company: 'Google',
    role: 'Software Development Engineer',
    interviewType: 'Technical',
    difficulty: 'Medium',
    durationMinutes: 15
  });

  // Countdown timer
  useEffect(() => {
    let timer;
    if (inInterview && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [inInterview, timeLeft]);

  // Speak question aloud via Web Speech API
  const speakQuestion = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.98;
    utterance.pitch = 1.02;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Speak automatically when question changes during active interview
  useEffect(() => {
    if (inInterview && interviewSession?.questions?.[currentQuestionIndex]) {
      const qText = interviewSession.questions[currentQuestionIndex].question;
      speakQuestion(qText);
    }
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [inInterview, currentQuestionIndex, interviewSession]);

  // Toggle Speech-to-Text microphone for answering verbally
  const toggleVoiceAnswer = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your answer.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript + ' ';
        }
      }
      if (transcript.trim()) {
        setCurrentAnswer((prev) => (prev ? `${prev.trim()} ${transcript.trim()}` : transcript.trim()));
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSystemVerifiedAndStart = async () => {
    setShowSystemCheck(false);
    setLoading(true);
    try {
      const res = await api.startInterview(config);
      if (res.success) {
        setInterviewSession(res.interview);
        setInInterview(true);
        setCurrentQuestionIndex(0);
        setCurrentAnswer('');
        setAnswers([]);
        setTimeLeft(config.durationMinutes * 60);
        setEvaluation(null);
      }
    } catch (err) {
      console.error('Failed to start interview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    stopListening();
    const updatedAnswers = [
      ...answers.filter(a => a.questionIndex !== currentQuestionIndex),
      { questionIndex: currentQuestionIndex, answer: currentAnswer }
    ];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < interviewSession.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      const existing = updatedAnswers.find(a => a.questionIndex === currentQuestionIndex + 1);
      setCurrentAnswer(existing ? existing.answer : '');
    } else {
      handleSubmitInterview(updatedAnswers);
    }
  };

  const handleSubmitInterview = async (finalAnswers = answers) => {
    stopListening();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setLoading(true);
    try {
      const merged = [
        ...finalAnswers.filter(a => a.questionIndex !== currentQuestionIndex),
        ...(currentAnswer.trim() ? [{ questionIndex: currentQuestionIndex, answer: currentAnswer }] : [])
      ];
      const res = await api.submitInterview(interviewSession._id, merged);
      if (res.success) {
        setEvaluation(res.interview);
        setInInterview(false);
      }
    } catch (err) {
      console.error('Error submitting interview:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      {inInterview && (
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
            <span>Voice-Enabled • Non-Repeating Company Questions</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#30263A]">AI Mock Interview Arena</h1>
          <p className="text-xs text-[#817487] mt-0.5">
            AI asks company-specific questions verbally, listens to your spoken response, and evaluates your answer.
          </p>
        </div>
      </div>

      {/* State 1: Configuration */}
      {!inInterview && !evaluation && (
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-[#F1E6EE] shadow-card">
          <h2 className="text-lg font-bold text-[#30263A] mb-1">Interview Setup & Company Bar</h2>
          <p className="text-xs text-[#817487] mb-5">
            Every attempt serves fresh, non-repeating questions tailored to the selected company.
          </p>

          <div className="space-y-5 text-xs">
            <div>
              <label className="block font-bold text-[#817487] uppercase mb-2">Target Company</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Deloitte'].map((comp) => (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => setConfig({ ...config, company: comp })}
                    className={`py-2.5 px-2.5 rounded-xl font-bold transition-all border ${
                      config.company === comp
                        ? 'bg-[#FCE7F3] border-[#E879A9] text-[#C65B89] shadow-sm'
                        : 'bg-[#FFF9FC] border-[#F1E6EE] text-[#817487] hover:text-[#30263A]'
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#817487] mb-1.5">Job Role</label>
                <select
                  value={config.role}
                  onChange={(e) => setConfig({ ...config, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                >
                  <option value="Software Development Engineer">Software Development Engineer (SDE-1)</option>
                  <option value="Frontend Engineer">Frontend Engineer (React)</option>
                  <option value="Backend Engineer">Backend Engineer (Systems)</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#817487] mb-1.5">Interview Round</label>
                <select
                  value={config.interviewType}
                  onChange={(e) => setConfig({ ...config, interviewType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                >
                  <option value="Technical">Technical (Algorithms & System Design)</option>
                  <option value="DSA-focused">DSA-focused (Complexity & Data Structures)</option>
                  <option value="Core CS subjects">Core CS (DBMS, OS, Networks)</option>
                  <option value="HR">Behavioral (STAR Response Format)</option>
                  <option value="Mixed">Mixed Round</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowSystemCheck(true)}
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-[#E879A9] hover:bg-[#C65B89] shadow-glow flex items-center justify-center space-x-2 transition-all"
              >
                <Video className="w-4 h-4" />
                <span>Verify Environment & Begin Voice Interview</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* State 2: Active Voice Interview */}
      {inInterview && interviewSession && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: AI Interviewer */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-[#F1E6EE] shadow-card">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-[#EDE9FE] border border-[#A78BFA]/30 flex items-center justify-center text-[#7C3AED] ${isSpeaking ? 'animate-pulse ring-2 ring-[#E879A9]' : ''}`}>
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#30263A]">{interviewSession.company} AI Interviewer</h3>
                  <p className="text-[10px] text-[#C65B89] font-semibold">
                    {isSpeaking ? 'Speaking question aloud...' : interviewSession.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-3">
                <button
                  type="button"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold border flex items-center justify-center space-x-1.5 ${
                    voiceEnabled ? 'bg-[#FCE7F3] border-[#F9D5E5] text-[#C65B89]' : 'bg-[#FFF9FC] border-[#F1E6EE] text-[#817487]'
                  }`}
                >
                  {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{voiceEnabled ? 'AI Voice On' : 'AI Voice Muted'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => speakQuestion(interviewSession.questions[currentQuestionIndex].question)}
                  className="py-2 px-3 rounded-xl text-[11px] font-bold bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#DDD6FE] flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repeat</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#F1E6EE] flex items-center justify-between text-xs shadow-card">
              <span className="text-[#817487] flex items-center space-x-1.5 font-semibold">
                <Clock className="w-4 h-4 text-[#F2B86B]" />
                <span>Remaining Time</span>
              </span>
              <span className="font-mono font-bold text-[#30263A] text-sm">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Right Column: Question & Verbal/Text Answer */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-[#F1E6EE] shadow-card">
              <div className="flex items-center justify-between border-b border-[#F1E6EE] pb-3 mb-4 text-xs">
                <span className="font-bold text-[#C65B89]">
                  Question {currentQuestionIndex + 1} of {interviewSession.questions.length}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] font-bold text-[10px] uppercase">
                  {interviewSession.questions[currentQuestionIndex].type}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#EDE9FE]/40 border border-[#EDE9FE] mb-5">
                <h3 className="text-base font-bold text-[#30263A] leading-relaxed">
                  {interviewSession.questions[currentQuestionIndex].question}
                </h3>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#817487]">
                    Your Answer (Speak using Mic or Type):
                  </label>
                  <button
                    type="button"
                    onClick={toggleVoiceAnswer}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                      isListening
                        ? 'bg-[#E87979] text-white animate-pulse'
                        : 'bg-[#FCE7F3] text-[#C65B89] border border-[#F9D5E5] hover:bg-[#F9D5E5]'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isListening ? 'Stop Listening' : 'Answer Verbally (Mic)'}</span>
                  </button>
                </div>

                <textarea
                  rows={7}
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Click 'Answer Verbally (Mic)' to speak your response, or type your explanation here..."
                  className="w-full p-3.5 rounded-xl glass-input text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#F1E6EE] text-xs">
                <button
                  type="button"
                  onClick={() => handleSubmitInterview()}
                  className="font-semibold text-[#E87979] hover:underline"
                >
                  End & Evaluate Now
                </button>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#E879A9] hover:bg-[#C65B89] shadow-glow flex items-center space-x-1.5"
                >
                  <span>
                    {loading ? 'Evaluating...' : currentQuestionIndex < interviewSession.questions.length - 1
                      ? 'Next Question →'
                      : 'Submit for AI Evaluation'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* State 3: Evaluation Scorecard */}
      {evaluation && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-8 rounded-2xl bg-white border border-[#F1E6EE] shadow-card text-center">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E6F5EE] text-[#3B8A66]">
              AI Evaluation Completed
            </span>
            <h2 className="text-2xl font-black text-[#30263A] mt-2">Interview Scorecard</h2>
            <p className="text-xs text-[#817487] mt-0.5">{evaluation.company} • {evaluation.role}</p>

            <div className="my-6">
              <div className="w-28 h-28 rounded-full border-4 border-[#E879A9] flex flex-col items-center justify-center mx-auto bg-[#FFF9FC]">
                <span className="text-3xl font-black text-[#30263A]">{evaluation.overallScore}</span>
                <span className="text-[10px] text-[#817487] uppercase font-bold">Overall / 100</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto my-6 text-xs">
              <div className="p-3 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE]">
                <p className="text-[#817487] text-[10px] font-semibold">Technical</p>
                <p className="text-lg font-bold text-[#30263A] mt-1">{evaluation.evaluation?.technicalAccuracy || 75}%</p>
              </div>
              <div className="p-3 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE]">
                <p className="text-[#817487] text-[10px] font-semibold">Communication</p>
                <p className="text-lg font-bold text-[#30263A] mt-1">{evaluation.evaluation?.communication || 80}%</p>
              </div>
              <div className="p-3 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE]">
                <p className="text-[#817487] text-[10px] font-semibold">Problem Solving</p>
                <p className="text-lg font-bold text-[#30263A] mt-1">{evaluation.evaluation?.problemSolving || 75}%</p>
              </div>
              <div className="p-3 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE]">
                <p className="text-[#817487] text-[10px] font-semibold">Integrity</p>
                <p className="text-lg font-bold text-[#3B8A66] mt-1">{proctor.integrityScore}%</p>
              </div>
            </div>

            {evaluation.evaluation?.feedback && (
              <div className="p-4 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE] text-left text-xs text-[#30263A] mb-6">
                <p className="font-bold text-[#C65B89] mb-1">AI Feedback Summary:</p>
                <p className="text-[#817487] leading-relaxed">{evaluation.evaluation.feedback}</p>
              </div>
            )}

            <button
              onClick={() => setEvaluation(null)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#E879A9] hover:bg-[#C65B89] shadow-glow"
            >
              Take Another Interview (Fresh Questions)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
