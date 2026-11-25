import React, { useState } from 'react';
import {
  Camera,
  Monitor,
  ShieldCheck,
  CheckCircle2,
  X,
  Play
} from 'lucide-react';

export const SystemCheckModal = ({
  isOpen,
  onClose,
  onVerified,
  proctorState
}) => {
  const {
    systemCheckStatus,
    requestCameraAndMic,
    requestScreenShare,
    enterFullscreen
  } = proctorState;

  const [requestingCam, setRequestingCam] = useState(false);
  const [requestingScreen, setRequestingScreen] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);

  if (!isOpen) return null;

  const handleCameraCheck = async () => {
    setRequestingCam(true);
    await requestCameraAndMic();
    setRequestingCam(false);
  };

  const handleScreenCheck = async () => {
    setRequestingScreen(true);
    await requestScreenShare();
    setRequestingScreen(false);
  };

  const allChecksPassed =
    systemCheckStatus.camera &&
    systemCheckStatus.microphone &&
    systemCheckStatus.screenShare &&
    agreedToRules;

  const handleStartExam = async () => {
    await enterFullscreen();
    onVerified();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#30263A]/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#F1E6EE] rounded-2xl w-full max-w-xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F1E6EE] flex items-center justify-between bg-[#FFF9FC]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FCE7F3] flex items-center justify-center text-[#C65B89] border border-[#F9D5E5]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#30263A]">Proctoring & Environment Check</h2>
              <p className="text-[11px] text-[#817487]">Quick hardware verification before starting your timed session</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#817487] hover:text-[#30263A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostic Items */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-[#817487]">
            To simulate a real-world proctored assessment, PrepAI verifies your camera, ambient noise via microphone, and screen sharing.
          </p>

          <div className="space-y-3">
            {/* 1. Camera & Mic */}
            <div className="p-3.5 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#FCE7F3] flex items-center justify-center text-[#C65B89]">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#30263A]">Camera & Microphone (Noise Check)</h4>
                  <p className="text-[11px] text-[#817487]">Used for face presence & ambient room noise monitoring</p>
                </div>
              </div>

              {systemCheckStatus.camera && systemCheckStatus.microphone ? (
                <span className="flex items-center space-x-1 text-[#3B8A66] text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleCameraCheck}
                  disabled={requestingCam}
                  className="px-3.5 py-1.5 rounded-lg bg-[#E879A9] hover:bg-[#C65B89] text-white text-xs font-semibold transition-colors"
                >
                  {requestingCam ? 'Requesting...' : 'Enable Access'}
                </button>
              )}
            </div>

            {/* 2. Screen Share */}
            <div className="p-3.5 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#30263A]">Screen Share Authorization</h4>
                  <p className="text-[11px] text-[#817487]">Ensures single-window assessment integrity</p>
                </div>
              </div>

              {systemCheckStatus.screenShare ? (
                <span className="flex items-center space-x-1 text-[#3B8A66] text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sharing</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleScreenCheck}
                  disabled={requestingScreen}
                  className="px-3.5 py-1.5 rounded-lg bg-[#E879A9] hover:bg-[#C65B89] text-white text-xs font-semibold transition-colors"
                >
                  {requestingScreen ? 'Sharing...' : 'Share Screen'}
                </button>
              )}
            </div>

            {/* 3. Honor Code Policy */}
            <div className="p-3.5 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE]">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToRules}
                  onChange={(e) => setAgreedToRules(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#E879A9] border-[#F1E6EE] focus:ring-[#E879A9]"
                />
                <div className="text-[11px] text-[#817487] leading-relaxed">
                  <strong className="text-[#30263A] block font-semibold">Assessment Discipline Agreement:</strong>
                  I agree to remain in full-screen mode, stay in a quiet room, and avoid switching browser tabs during the session.
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FFF9FC] border-t border-[#F1E6EE] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#817487] hover:text-[#30263A]"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!allChecksPassed}
            onClick={handleStartExam}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#E879A9] hover:bg-[#C65B89] shadow-glow flex items-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Proctored Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
