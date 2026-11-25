import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Monitor,
  AlertTriangle,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Volume2
} from 'lucide-react';

export const ProctorHUD = ({
  cameraStream,
  screenStream,
  audioLevel,
  noiseStatus = 'quiet',
  faceStatus = 'detected',
  isFullscreen,
  violations,
  integrityScore,
  onEnterFullscreen
}) => {
  const videoRef = useRef(null);
  const [minimized, setMinimized] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [toastViolation, setToastViolation] = useState(null);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  // Show violation toast briefly (4 seconds) then auto-dismiss
  useEffect(() => {
    if (violations.length > 0) {
      setToastViolation(violations[0]);
      const t = setTimeout(() => setToastViolation(null), 4000);
      return () => clearTimeout(t);
    }
  }, [violations]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2 pointer-events-auto">
      {/* Subtle auto-dismissing Violation Alert Toast */}
      {toastViolation && (
        <div className="max-w-xs p-3 rounded-2xl bg-white border border-[#E87979] text-[#30263A] shadow-lg text-xs flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-[#E87979] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#C65B89]">Proctor Notice</p>
            <p className="text-[11px] text-[#817487] leading-tight mt-0.5">{toastViolation.message}</p>
          </div>
        </div>
      )}

      {/* Main Proctoring Box */}
      <div className="w-72 bg-white border border-[#F1E6EE] rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
        {/* Top Status Bar */}
        <div className="px-3.5 py-2.5 bg-[#FFF9FC] border-b border-[#F1E6EE] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#65B891] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#65B891]"></span>
            </span>
            <span className="font-bold text-[#30263A] text-[11px] tracking-wide uppercase">Discipline Proctor</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              integrityScore >= 80 ? 'bg-[#65B891]/15 text-[#3B8A66]' :
              integrityScore >= 60 ? 'bg-[#F2B86B]/20 text-[#A86F24]' : 'bg-[#E87979]/15 text-[#B54545]'
            }`}>
              {integrityScore}%
            </span>

            <button
              onClick={() => setMinimized(!minimized)}
              className="text-[#817487] hover:text-[#30263A] p-0.5 transition-colors"
            >
              {minimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Proctor Body */}
        {!minimized && (
          <div className="p-3 space-y-2.5">
            {/* Live Camera Stream */}
            <div className="relative aspect-video rounded-xl bg-[#FCE7F3]/40 overflow-hidden border border-[#F1E6EE]">
              {cameraStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-xs text-[#817487]">
                  <Camera className="w-6 h-6 mb-1 text-[#E879A9]" />
                  <span>Waiting for camera...</span>
                </div>
              )}

              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-white/85 text-[9px] font-mono font-semibold text-[#30263A] flex items-center space-x-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#65B891]"></span>
                <span>LIVE</span>
              </div>
              <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-white/85 text-[9px] font-bold shadow-sm ${
                faceStatus === 'detected' ? 'text-[#3B8A66]' :
                faceStatus === 'multiple' ? 'text-[#B54545]' : 'text-[#A86F24]'
              }`}>
                {faceStatus === 'detected' ? 'Face OK' :
                 faceStatus === 'multiple' ? 'Multiple Faces' : 'Check Camera'}
              </div>
            </div>

            {/* Ambient Noise Check Meter */}
            <div className="bg-[#FFF9FC] p-2.5 rounded-xl border border-[#F1E6EE] space-y-1">
              <div className="flex items-center justify-between text-[11px] text-[#817487]">
                <span className="flex items-center space-x-1">
                  <Volume2 className="w-3.5 h-3.5 text-[#E879A9]" />
                  <span>Noise Check</span>
                </span>
                <span className={`font-semibold text-[10px] ${
                  noiseStatus === 'loud' ? 'text-[#E87979]' :
                  noiseStatus === 'elevated' ? 'text-[#F2B86B]' : 'text-[#65B891]'
                }`}>
                  {noiseStatus === 'loud' ? 'High Noise!' : noiseStatus === 'elevated' ? 'Moderate' : 'Quiet'} ({audioLevel}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#FCE7F3] overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 ${
                    audioLevel > 50 ? 'bg-[#E87979]' : audioLevel > 28 ? 'bg-[#F2B86B]' : 'bg-[#65B891]'
                  }`}
                  style={{ width: `${Math.min(100, audioLevel * 1.5)}%` }}
                />
              </div>
            </div>

            {/* Hardware & Policy Status Grid */}
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <div className={`p-1.5 rounded-lg border flex items-center space-x-1.5 ${
                screenStream ? 'bg-[#65B891]/10 border-[#65B891]/30 text-[#3B8A66]' : 'bg-[#FFF0E8] border-[#F2B86B]/40 text-[#A86F24]'
              }`}>
                <Monitor className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{screenStream ? 'Screen Shared' : 'No Screen'}</span>
              </div>

              <div
                className={`p-1.5 rounded-lg border flex items-center space-x-1.5 ${
                  isFullscreen ? 'bg-[#65B891]/10 border-[#65B891]/30 text-[#3B8A66]' : 'bg-[#FCE7F3] border-[#F9D5E5] text-[#C65B89] cursor-pointer'
                }`}
                onClick={!isFullscreen ? onEnterFullscreen : undefined}
              >
                <Maximize2 className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{isFullscreen ? 'Fullscreen' : 'Go Fullscreen'}</span>
              </div>
            </div>

            {/* Audit Log */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setShowLog(!showLog)}
                className="w-full text-center text-[10px] text-[#817487] hover:text-[#C65B89] transition-colors font-medium"
              >
                {showLog ? 'Hide Audit Log' : `Audit Log (${violations.length} notices)`}
              </button>

              {showLog && (
                <div className="mt-2 max-h-24 overflow-y-auto space-y-1 text-[10px] pr-1">
                  {violations.length > 0 ? (
                    violations.map((v) => (
                      <div key={v.id} className="p-1.5 rounded-lg bg-[#FFF9FC] border border-[#F1E6EE] text-[#C65B89] flex justify-between">
                        <span className="truncate max-w-[165px]">{v.message}</span>
                        <span className="text-[9px] text-[#A99EAD] font-mono">{v.timestamp}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#A99EAD] text-center py-2">No discipline notices.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
