import { useState, useEffect, useRef, useCallback } from 'react';

export const useProctoring = ({ onViolation, isExamActive = false }) => {
  const [cameraStream, setCameraStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [noiseStatus, setNoiseStatus] = useState('quiet'); // 'quiet' | 'elevated' | 'loud'
  const [faceStatus, setFaceStatus] = useState('detected'); // 'detected' | 'missing' | 'multiple'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violations, setViolations] = useState([]);
  const [integrityScore, setIntegrityScore] = useState(100);
  const [systemCheckStatus, setSystemCheckStatus] = useState({
    camera: false,
    microphone: false,
    screenShare: false,
    fullscreen: false
  });

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const hiddenVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const examStartTimeRef = useRef(0);
  const lastFaceWarningRef = useRef(0);
  const consecutiveMissingFaceRef = useRef(0);
  const highNoiseFramesRef = useRef(0);
  const lastNoiseWarningRef = useRef(0);

  // Add violation log (respects 5-second startup grace period)
  const logViolation = useCallback((type, message) => {
    if (isExamActive && Date.now() - examStartTimeRef.current < 5000) {
      return;
    }

    const violationEntry = {
      id: Date.now() + Math.random(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    };

    setViolations(prev => [violationEntry, ...prev]);
    setIntegrityScore(prev => Math.max(0, prev - (type === 'tab_switch' || type === 'multiple_faces' ? 10 : 5)));

    if (onViolation) {
      onViolation(violationEntry);
    }
  }, [onViolation, isExamActive]);

  // Track when exam becomes active
  useEffect(() => {
    if (isExamActive) {
      examStartTimeRef.current = Date.now();
      consecutiveMissingFaceRef.current = 0;
      highNoiseFramesRef.current = 0;
    }
  }, [isExamActive]);

  // Request Camera and Microphone
  const requestCameraAndMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: true
      });

      setCameraStream(stream);

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateAudioMeter = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const level = Math.min(100, Math.round((avg / 128) * 100));
          setAudioLevel(level);

          if (level > 50) {
            setNoiseStatus('loud');
            highNoiseFramesRef.current += 1;
          } else if (level > 28) {
            setNoiseStatus('elevated');
            highNoiseFramesRef.current = Math.max(0, highNoiseFramesRef.current - 1);
          } else {
            setNoiseStatus('quiet');
            highNoiseFramesRef.current = 0;
          }

          animationFrameRef.current = requestAnimationFrame(updateAudioMeter);
        };
        updateAudioMeter();
      }

      setSystemCheckStatus(prev => ({ ...prev, camera: true, microphone: true }));
      return true;
    } catch (err) {
      console.warn('Camera/Mic permission denied or unavailable:', err);
      return false;
    }
  };

  // Noise Violation Check (only triggers on sustained loud noise > 2.5 seconds during active exam)
  useEffect(() => {
    if (!isExamActive) return;
    const noiseInterval = setInterval(() => {
      if (highNoiseFramesRef.current > 90) { // ~1.5-2.5s of continuous loud audio
        const now = Date.now();
        if (now - lastNoiseWarningRef.current > 18000) {
          lastNoiseWarningRef.current = now;
          highNoiseFramesRef.current = 0;
          logViolation('noise_detected', 'Sustained background noise or speaking detected during test.');
        }
      }
    }, 1000);
    return () => clearInterval(noiseInterval);
  }, [isExamActive, logViolation]);

  // Request Screen Share
  const requestScreenShare = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: false
        });

        setScreenStream(stream);
        setSystemCheckStatus(prev => ({ ...prev, screenShare: true }));

        stream.getVideoTracks()[0].onended = () => {
          if (isExamActive) {
            logViolation('screen_share_stopped', 'Screen sharing was stopped during test.');
          }
          setSystemCheckStatus(prev => ({ ...prev, screenShare: false }));
        };

        return true;
      }
      return false;
    } catch (err) {
      console.warn('Screen share permission denied:', err);
      return false;
    }
  };

  // Request Fullscreen
  const enterFullscreen = async () => {
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
      setSystemCheckStatus(prev => ({ ...prev, fullscreen: true }));
      return true;
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
      return false;
    }
  };

  // Periodic Face & Presence Detection (requires 2 consecutive missed checks to avoid false alerts)
  useEffect(() => {
    if (!isExamActive || !cameraStream) return;

    const videoEl = document.createElement('video');
    videoEl.srcObject = cameraStream;
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.play().catch(() => {});
    hiddenVideoRef.current = videoEl;

    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 120;
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const faceDetector = 'FaceDetector' in window ? new window.FaceDetector({ fastMode: true, maxDetectedFaces: 3 }) : null;

    const interval = setInterval(async () => {
      if (videoEl.readyState < 2) return;

      try {
        const now = Date.now();
        if (faceDetector) {
          const faces = await faceDetector.detect(videoEl);
          if (faces.length === 0) {
            consecutiveMissingFaceRef.current += 1;
            if (consecutiveMissingFaceRef.current >= 2) {
              setFaceStatus('missing');
              if (now - lastFaceWarningRef.current > 20000) {
                lastFaceWarningRef.current = now;
                logViolation('face_missing', 'Candidate face not visible in camera frame.');
              }
            }
          } else if (faces.length > 1) {
            consecutiveMissingFaceRef.current = 0;
            setFaceStatus('multiple');
            if (now - lastFaceWarningRef.current > 20000) {
              lastFaceWarningRef.current = now;
              logViolation('multiple_faces', `Multiple faces (${faces.length}) detected in camera view.`);
            }
          } else {
            consecutiveMissingFaceRef.current = 0;
            setFaceStatus('detected');
          }
        } else {
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          let totalBrightness = 0;
          for (let i = 0; i < pixels.length; i += 16) {
            totalBrightness += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
          }
          const avgBrightness = totalBrightness / (pixels.length / 16);
          if (avgBrightness < 10) {
            consecutiveMissingFaceRef.current += 1;
            if (consecutiveMissingFaceRef.current >= 2) {
              setFaceStatus('missing');
              if (now - lastFaceWarningRef.current > 20000) {
                lastFaceWarningRef.current = now;
                logViolation('camera_obstructed', 'Camera appears covered or lighting is too dark.');
              }
            }
          } else {
            consecutiveMissingFaceRef.current = 0;
            setFaceStatus('detected');
          }
        }
      } catch {
        // Ignore single frame errors
      }
    }, 3500);

    return () => {
      clearInterval(interval);
      videoEl.srcObject = null;
    };
  }, [isExamActive, cameraStream, logViolation]);

  // Listen for Tab Switching and Fullscreen Exit (debounced, no false blur triggers on dropdowns)
  useEffect(() => {
    if (!isExamActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation('tab_switch', 'Switched away from the assessment tab.');
      }
    };

    const handleFullscreenChange = () => {
      const full = !!document.fullscreenElement || !!document.webkitFullscreenElement;
      setIsFullscreen(full);
      if (!full && isExamActive) {
        logViolation('fullscreen_exit', 'Exited full-screen mode during active assessment.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isExamActive, logViolation]);

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraStream, screenStream]);

  return {
    cameraStream,
    screenStream,
    audioLevel,
    noiseStatus,
    faceStatus,
    isFullscreen,
    violations,
    integrityScore,
    systemCheckStatus,
    requestCameraAndMic,
    requestScreenShare,
    enterFullscreen,
    logViolation
  };
};
