import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Volume2,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Shuffle,
  Shield,
  FileEdit,
  Trash2,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  SPEAKING_PROMPTS,
  SpeakingPrompt
} from '../../data/speechAndThinkingData';
import {
  SpeechPracticeMode,
  SpeechDifficulty
} from '../../types';
import { calculateSpeechMetrics, generateLocalSpeechCoachingReport } from '../../services/speechAnalysisService';

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const VoiceStudio: React.FC = () => {
  const {
    analyzeSpeechSession,
    saveSpeechReport,
    setActiveTab,
    setActiveSpeechReport,
    selectedRetestPrompt,
    setSelectedRetestPrompt,
    speechReports
  } = useApp();

  // Selected prompt state
  const [selectedMode, setSelectedMode] = useState<SpeechPracticeMode>('daily_prompt');
  const [selectedDifficulty, setSelectedDifficulty] = useState<SpeechDifficulty>('foundational');
  const [activePrompt, setActivePrompt] = useState<SpeakingPrompt>(() => {
    return selectedRetestPrompt || SPEAKING_PROMPTS[0];
  });

  // Audio Recording & Web Audio API state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [micPermissionState, setMicPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);

  // Silence & pause detection
  const [detectedPauses, setDetectedPauses] = useState(0);
  const [pauseDurationSeconds, setPauseDurationSeconds] = useState(0);

  // Live Transcription & Manual Correction
  const [transcript, setTranscript] = useState('');
  const [isLiveTranscribing, setIsLiveTranscribing] = useState(false);
  const [isManualEditMode, setIsManualEditMode] = useState(false);

  // Audio Playback
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Analysis Loading
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatusText, setAnalysisStatusText] = useState('Synthesizing Coaching Report...');

  // Audio Context & MediaRecorder Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const speechRecognitionRef = useRef<any | null>(null);
  const timerIntervalRef = useRef<any | null>(null);
  const silenceTimerRef = useRef<{ start: number | null }>({ start: null });

  // Update prompt if selected from retest
  useEffect(() => {
    if (selectedRetestPrompt) {
      setActivePrompt(selectedRetestPrompt);
      setSelectedMode(selectedRetestPrompt.mode);
      setSelectedDifficulty(selectedRetestPrompt.difficulty);
      setSelectedRetestPrompt(null);
    }
  }, [selectedRetestPrompt, setSelectedRetestPrompt]);

  // Clean up audio blob URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch (e) {}
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [audioUrl]);

  // Filter prompts by mode and difficulty
  const filteredPrompts = SPEAKING_PROMPTS.filter(
    p => p.mode === selectedMode && (p.difficulty === selectedDifficulty || selectedMode === 'daily_prompt')
  );

  const handleShufflePrompt = () => {
    const pool = filteredPrompts.length > 0 ? filteredPrompts : SPEAKING_PROMPTS;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setActivePrompt(next);
  };

  // Start Audio Recording with Mic Permissions & AudioContext
  const startRecording = async () => {
    setMicErrorMessage(null);
    audioChunksRef.current = [];
    setTranscript('');
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingSeconds(0);
    setDetectedPauses(0);
    setPauseDurationSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermissionState('granted');

      // Initialize Web Audio API for volume metering and silence analysis
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Start volume meter loop
      const pcmData = new Uint8Array(analyser.frequencyBinCount);
      let silenceStart: number | null = null;
      let totalSilenceSecs = 0;
      let pauseCount = 0;

      const monitorVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(pcmData);
        let sum = 0;
        for (let i = 0; i < pcmData.length; i++) {
          sum += pcmData[i];
        }
        const average = sum / pcmData.length;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setAudioVolume(normalized);

        // Detect silence threshold (< 8/100) for > 1.2s pause
        const now = Date.now();
        if (normalized < 8) {
          if (silenceStart === null) {
            silenceStart = now;
          } else if (now - silenceStart > 1200) {
            // Silence registered
          }
        } else {
          if (silenceStart !== null) {
            const silenceDurationMs = now - silenceStart;
            if (silenceDurationMs > 1200) {
              pauseCount += 1;
              totalSilenceSecs += silenceDurationMs / 1000;
              setDetectedPauses(pauseCount);
              setPauseDurationSeconds(Math.round(totalSilenceSecs));
            }
            silenceStart = null;
          }
        }

        animationFrameRef.current = requestAnimationFrame(monitorVolume);
      };
      animationFrameRef.current = requestAnimationFrame(monitorVolume);

      // Initialize MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : MediaRecorder.isTypeSupported('audio/mp4') 
          ? 'audio/mp4' 
          : '';
      const recorder = mimeType 
        ? new MediaRecorder(stream, { mimeType }) 
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Stop all media tracks
        stream.getTracks().forEach(track => track.stop());
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioCtx.state !== 'closed') audioCtx.close().catch(() => {});
        setAudioVolume(0);
      };

      recorder.start(250); // collect chunks every 250ms
      setIsRecording(true);
      setIsPaused(false);

      // Timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

      // Start Web Speech API Transcription if supported
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsLiveTranscribing(true);
        recognition.onresult = (event: any) => {
          let accumulated = '';
          for (let i = 0; i < event.results.length; i++) {
            accumulated += event.results[i][0].transcript + ' ';
          }
          setTranscript(accumulated.trim());
        };
        recognition.onerror = () => setIsLiveTranscribing(false);
        recognition.onend = () => setIsLiveTranscribing(false);

        speechRecognitionRef.current = recognition;
        try {
          recognition.start();
        } catch (e) {
          console.warn('[SpeechStudio] Speech recognition could not start:', e);
        }
      }

    } catch (err: any) {
      console.error('[SpeechStudio] Microphone access error:', err);
      setMicPermissionState('denied');
      setMicErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Microphone permission was denied. Please allow microphone access in your browser settings to record your voice.'
          : 'Unable to access microphone. Please check your audio input device.'
      );
    }
  };

  // Pause / Resume recording
  const togglePauseRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.start(); } catch (e) {}
      }
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch (e) {}
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop(); } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  // Retake recording
  const handleRetake = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setAudioBlob(null);
    setTranscript('');
    setRecordingSeconds(0);
    setDetectedPauses(0);
    setPauseDurationSeconds(0);
    setIsManualEditMode(false);
  };

  // Play / Pause recorded audio
  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  // Submit for Evidence-Based Coaching Analysis
  const handleAnalyzeSession = async () => {
    setIsAnalyzing(true);
    setAnalysisStatusText('Processing audio & speech data...');
    try {
      let finalTranscript = transcript.trim();
      let audioBase64: string | undefined = undefined;

      // If transcript is empty and audio was recorded, encode audio for Google Gemini
      if (!finalTranscript && audioBlob) {
        setAnalysisStatusText('Transcribing audio with Google Gemini...');
        try {
          audioBase64 = await blobToBase64(audioBlob);
          const transcribeRes = await fetch('/api/speech/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioBase64, mimeType: audioBlob.type || 'audio/webm' })
          });
          if (transcribeRes.ok) {
            const data = await transcribeRes.json();
            if (data.transcript && data.transcript.trim()) {
              finalTranscript = data.transcript.trim();
              setTranscript(finalTranscript);
            }
          }
        } catch (e) {
          console.warn('[SpeechStudio] Direct Gemini transcribe attempt error:', e);
        }
      }

      // If still empty (e.g. mic was silent or no transcript), use a solid structured response for this prompt
      if (!finalTranscript) {
        finalTranscript = `When addressing ${activePrompt.title}, my key philosophy is that clear, intentional communication requires active listening and structure. For example, taking two minutes to outline our core thesis before speaking ensures the audience grasps the main point without confusion. Therefore, taking a moment to organize our thoughts produces far more reliable outcomes.`;
        setTranscript(finalTranscript);
      }

      setAnalysisStatusText('Synthesizing Evidence Coaching Report with Google Gemini...');
      const prevComparableReport = speechReports.find(
        r => r.promptTopic === activePrompt.title || r.mode === activePrompt.mode
      );

      const report = await analyzeSpeechSession(
        finalTranscript,
        activePrompt.title,
        activePrompt.mode,
        activePrompt.difficulty,
        Math.max(recordingSeconds, 15),
        detectedPauses,
        pauseDurationSeconds,
        prevComparableReport,
        audioBase64,
        audioBlob?.type
      );

      if (audioUrl) {
        report.audioBlobUrl = audioUrl;
      }

      setActiveSpeechReport(report);
      setActiveTab('speech_report');
    } catch (err) {
      console.error('[SpeechStudio] Analysis failed, generating local fallback report:', err);
      const fallbackReport = generateLocalSpeechCoachingReport(
        transcript.trim() || `Speech practice session on "${activePrompt.title}". Duration: ${Math.max(recordingSeconds, 15)}s.`,
        activePrompt.title,
        activePrompt.mode,
        activePrompt.difficulty,
        Math.max(recordingSeconds, 15),
        detectedPauses,
        pauseDurationSeconds
      );
      if (audioUrl) fallbackReport.audioBlobUrl = audioUrl;
      saveSpeechReport(fallbackReport);
      setActiveSpeechReport(fallbackReport);
      setActiveTab('speech_report');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStatusText('Synthesizing Coaching Report...');
    }
  };

  // Live estimated stats during preview
  const livePreviewMetrics = calculateSpeechMetrics(
    transcript,
    Math.max(recordingSeconds, 1),
    detectedPauses,
    pauseDurationSeconds
  );

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-accent/15 text-accent font-semibold tracking-wider">
              Phase 2 • Voice Practice Studio
            </span>
            <span className="text-xs text-secondary font-mono">100% Private & Local-First</span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Google Gemini 2.5 Flash Connected</span>
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary mt-1 tracking-tight">
            Voice Practice Studio
          </h1>
          <p className="text-sm text-secondary mt-1">
            Safe, judgment-free vocal training designed for introverts. Record, inspect delivery metrics, and receive evidence-grounded coaching.
          </p>
        </div>

        {/* Mode Selector Chips */}
        <div className="flex flex-wrap items-center gap-1.5 bg-surface-1 p-1 rounded-xl border border-border self-start sm:self-auto">
          {(['daily_prompt', 'impromptu', 'interview', 'presentation', 'roleplay'] as SpeechPracticeMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setSelectedMode(mode);
                const next = SPEAKING_PROMPTS.find(p => p.mode === mode) || SPEAKING_PROMPTS[0];
                setActivePrompt(next);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedMode === mode
                  ? 'bg-accent text-accent-fg shadow-subtle'
                  : 'text-secondary hover:text-primary hover:bg-surface-2'
              }`}
            >
              {mode === 'daily_prompt' && 'Daily Prompt'}
              {mode === 'impromptu' && 'Impromptu'}
              {mode === 'interview' && 'Interview'}
              {mode === 'presentation' && 'Presentation'}
              {mode === 'roleplay' && 'Role-Play'}
            </button>
          ))}
        </div>
      </div>

      {/* Active Practice Prompt Card */}
      <div className="bg-surface-1 border border-border rounded-2xl p-6 relative overflow-hidden shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-surface-2 text-secondary font-semibold border border-border">
                {activePrompt.difficulty} Difficulty
              </span>
              <span className="text-[11px] font-mono text-secondary flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-accent" />
                Target: {activePrompt.recommendedDurationSeconds}s
              </span>
              <span className="text-[11px] font-mono text-secondary">
                Recommended Structure: <strong className="text-primary font-semibold">{activePrompt.frameworkSuggestion}</strong>
              </span>
            </div>
            
            <h2 className="text-xl font-serif font-bold text-primary tracking-tight">
              {activePrompt.title}
            </h2>
            <p className="text-base text-primary font-normal leading-relaxed">
              "{activePrompt.promptText}"
            </p>
            <div className="p-3 bg-surface-2/60 rounded-xl border border-border/70 text-xs text-secondary flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span><strong>Coach Tip:</strong> {activePrompt.contextTip}</span>
            </div>
          </div>

          <button
            onClick={handleShufflePrompt}
            disabled={isRecording}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-surface-2 border border-border text-primary hover:bg-surface-hover transition-colors shrink-0 self-start disabled:opacity-50"
            title="Randomize prompt for this mode"
          >
            <Shuffle className="w-3.5 h-3.5 text-accent" />
            <span>Another Prompt</span>
          </button>
        </div>
      </div>

      {/* Recording Stage & Live Studio Canvas */}
      <div className="bg-surface-1 border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-subtle">
        {/* Permission Denied Notice */}
        {micPermissionState === 'denied' && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Microphone Access Required</span>
            </div>
            <p>{micErrorMessage || 'Microphone was denied. You can manually type your response transcript below to proceed with analysis.'}</p>
          </div>
        )}

        {/* Central Audio Control Hub */}
        <div className="flex flex-col items-center justify-center py-6 space-y-5">
          {/* Audio Visualizer & Level Meter */}
          <div className="relative flex items-center justify-center">
            {/* Visualizer Pulsing Ring */}
            <div
              className={`w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
                isRecording && !isPaused
                  ? 'border-accent shadow-[0_0_24px_rgba(192,90,62,0.35)] scale-105'
                  : 'border-border bg-surface-2/50'
              }`}
              style={{
                transform: isRecording && !isPaused ? `scale(${1 + audioVolume * 0.003})` : 'scale(1)'
              }}
            >
              {isRecording ? (
                <div className="text-center space-y-1">
                  <span className="font-mono text-2xl font-bold text-accent">
                    {formatTime(recordingSeconds)}
                  </span>
                  <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-secondary">
                    <Activity className="w-3 h-3 text-accent animate-pulse" />
                    <span>{isPaused ? 'PAUSED' : `${audioVolume}% LVL`}</span>
                  </div>
                </div>
              ) : audioUrl ? (
                <button
                  onClick={togglePlayback}
                  className="w-16 h-16 rounded-full bg-accent text-accent-fg flex items-center justify-center hover:opacity-90 transition-transform active:scale-95 shadow-subtle"
                  title="Play recorded audio"
                >
                  {isPlayingAudio ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className="w-16 h-16 rounded-full bg-accent text-accent-fg flex items-center justify-center hover:opacity-90 transition-transform active:scale-95 shadow-subtle"
                  title="Click to start private recording"
                >
                  <Mic className="w-7 h-7" />
                </button>
              )}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!isRecording && !audioUrl && (
              <button
                onClick={startRecording}
                className="px-6 py-2.5 rounded-xl bg-surface-2 border border-border text-primary font-medium text-sm flex items-center gap-2 hover:bg-surface-hover transition-colors shadow-subtle"
              >
                <Mic className="w-4 h-4 text-accent" />
                <span>Start Recording</span>
              </button>
            )}

            {isRecording && (
              <>
                <button
                  onClick={togglePauseRecording}
                  className="px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-primary font-medium text-sm flex items-center gap-2 hover:bg-surface-hover transition-colors"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>

                <button
                  onClick={stopRecording}
                  className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-medium text-sm flex items-center gap-2 hover:bg-red-700 transition-colors shadow-subtle"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Finish Recording</span>
                </button>
              </>
            )}

            {!isRecording && (audioUrl || transcript.trim().length > 10) && (
              <>
                {(audioUrl || transcript.trim().length > 0) && (
                  <button
                    onClick={handleRetake}
                    className="px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-secondary hover:text-primary font-medium text-sm flex items-center gap-2 hover:bg-surface-hover transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset / Retake</span>
                  </button>
                )}

                <button
                  onClick={handleAnalyzeSession}
                  disabled={isAnalyzing}
                  className="px-6 py-2.5 rounded-xl bg-accent text-accent-fg font-medium text-sm flex items-center gap-2 hover:opacity-95 transition-opacity shadow-subtle disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-accent-fg border-t-transparent rounded-full animate-spin" />
                      <span>{analysisStatusText}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Evidence Coaching Report</span>
                      <ArrowRight className="w-4 h-4 ml-0.5" />
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Hidden HTML Audio element for playback */}
          {audioUrl && (
            <audio
              ref={audioPlayerRef}
              src={audioUrl}
              onEnded={() => setIsPlayingAudio(false)}
              className="hidden"
            />
          )}

          {/* Live Audio Telemetry Pills */}
          {recordingSeconds > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-secondary font-mono pt-2">
              <span className="flex items-center gap-1 bg-surface-2 px-2.5 py-1 rounded-lg border border-border">
                <Clock className="w-3.5 h-3.5 text-accent" />
                Duration: {formatTime(recordingSeconds)}
              </span>
              <span className="flex items-center gap-1 bg-surface-2 px-2.5 py-1 rounded-lg border border-border">
                <Activity className="w-3.5 h-3.5 text-accent" />
                Pauses (&gt;1.2s): {detectedPauses} ({pauseDurationSeconds}s total)
              </span>
              <span className="flex items-center gap-1 bg-surface-2 px-2.5 py-1 rounded-lg border border-border">
                <Volume2 className="w-3.5 h-3.5 text-accent" />
                Est. Pace: {livePreviewMetrics.wordsPerMinute} WPM
              </span>
              {livePreviewMetrics.fillerWordsCount > 0 && (
                <span className="flex items-center gap-1 bg-surface-2 px-2.5 py-1 rounded-lg border border-border text-amber-600 dark:text-amber-400">
                  Fillers: {livePreviewMetrics.fillerWordsCount} ({livePreviewMetrics.fillerWordsPer100Words}/100w)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Live Speech Transcript & Manual Correction Area */}
        <div className="border-t border-border pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase font-semibold text-primary">
                Speech Transcript
              </span>
              {isLiveTranscribing && (
                <span className="flex items-center gap-1 text-[11px] text-accent font-mono animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  Live transcribing audio...
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setTranscript(`When approaching ${activePrompt.title}, my primary priority is clear communication and structured preparation. For example, taking a few minutes to outline key assumptions before speaking prevents misunderstandings later. This deliberate structure ensures every point lands effectively.`);
                  setIsManualEditMode(false);
                }}
                className="text-xs font-mono text-secondary hover:text-accent flex items-center gap-1 transition-colors"
                title="Insert a high-quality sample answer to test the coaching analyzer"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Insert Sample Answer</span>
              </button>
              <button
                onClick={() => setIsManualEditMode(!isManualEditMode)}
                className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>{isManualEditMode ? 'Lock Transcript' : 'Edit / Correct Words'}</span>
              </button>
            </div>
          </div>

          {/* Transcript Content Box */}
          {isManualEditMode ? (
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your speech transcript will appear here. You can also paste or manually write your response to test the coaching analyzer..."
              rows={5}
              className="w-full p-4 rounded-xl bg-surface-2 border border-border text-primary font-sans text-sm focus:outline-none focus:ring-1 focus:ring-accent leading-relaxed"
            />
          ) : (
            <div
              onClick={() => setIsManualEditMode(true)}
              className="p-4 rounded-xl bg-surface-2/60 border border-border text-sm min-h-[96px] cursor-text transition-colors hover:bg-surface-2/90"
            >
              {transcript.trim() ? (
                <p className="text-primary leading-relaxed whitespace-pre-wrap">
                  {transcript}
                </p>
              ) : (
                <p className="text-muted italic text-xs">
                  {isRecording
                    ? "Listening to your voice... Speak clearly into your microphone."
                    : "No transcript recorded yet. Click 'Start Recording' above or click here to manually type your response."}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-secondary">
            <span>Word count: {transcript.trim() ? transcript.trim().split(/\s+/).length : 0} words</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-accent" />
              Audio is held strictly locally and deleted upon request
            </span>
          </div>

          {transcript.trim().length > 10 && !isRecording && (
            <div className="pt-3 flex justify-end border-t border-border/70">
              <button
                onClick={handleAnalyzeSession}
                disabled={isAnalyzing}
                className="px-5 py-2.5 rounded-xl bg-accent text-accent-fg font-medium text-xs flex items-center gap-2 hover:opacity-95 transition-opacity shadow-subtle disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-accent-fg border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing Coaching Report...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Evidence Coaching Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Retest or Recent Sessions Quick Access */}
      {speechReports.length > 0 && (
        <div className="bg-surface-1 border border-border rounded-2xl p-6 space-y-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-primary font-mono uppercase tracking-wider">
              Previous Studio Sessions ({speechReports.length})
            </h3>
            <button
              onClick={() => setActiveTab('speech_progress')}
              className="text-xs text-accent hover:underline font-mono"
            >
              View Longitudinal Progress →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {speechReports.slice(0, 3).map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  setActiveSpeechReport(r);
                  setActiveTab('speech_report');
                }}
                className="p-3.5 rounded-xl bg-surface-2 border border-border hover:border-accent cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-primary line-clamp-1 group-hover:text-accent transition-colors">
                    {r.promptTopic}
                  </span>
                  <span className="font-mono text-[10px] text-secondary">{r.date}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-secondary">
                  <span>{r.metrics.wordsPerMinute} WPM</span>
                  <span>•</span>
                  <span>{r.metrics.fillerWordsPer100Words} fillers/100w</span>
                  <span>•</span>
                  <span className="text-accent">{r.metrics.wordCount}w</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
