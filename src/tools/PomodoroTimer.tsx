import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, Sparkles, CheckCircle2, Coffee, Flame, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { trackToolUsage, trackEvent } from '../lib/analytics';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const MODE_DURATIONS: Record<TimerMode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_DURATIONS.work);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play gentle bell chime with Web Audio API
  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5 note

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio context error:', e);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Completed session
      setIsActive(false);
      playChime();

      if (mode === 'work') {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        setCompletedSessions((prev) => prev + 1);
        setTotalFocusMinutes((prev) => prev + 25);
        trackEvent('pomodoro_work_completed');
        // Auto-switch to break
        setMode('shortBreak');
        setTimeLeft(MODE_DURATIONS.shortBreak);
      } else {
        trackEvent('pomodoro_break_completed');
        setMode('work');
        setTimeLeft(MODE_DURATIONS.work);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode]);

  const switchMode = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
    trackEvent('pomodoro_mode_switched', { mode: newMode });
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    trackToolUsage('pomodoro-timer', 'مؤقت بومودورو', isActive ? 'pause_timer' : 'start_timer');
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODE_DURATIONS[mode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalDuration = MODE_DURATIONS[mode];
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-center">
      
      {/* Mode Switcher Tabs */}
      <div className="inline-flex p-1.5 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-inner">
        <button
          type="button"
          onClick={() => switchMode('work')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            mode === 'work'
              ? 'bg-red-500 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>تركيز وعمل (25 د)</span>
        </button>

        <button
          type="button"
          onClick={() => switchMode('shortBreak')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            mode === 'shortBreak'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>استراحة قصيرة (5 د)</span>
        </button>

        <button
          type="button"
          onClick={() => switchMode('longBreak')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            mode === 'longBreak'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>استراحة طويلة (15 د)</span>
        </button>
      </div>

      {/* Main Timer Display */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 p-8 sm:p-14 shadow-sm space-y-8 transition-colors relative overflow-hidden">
        
        {/* Top subtle progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100 dark:bg-gray-800">
          <div
            style={{ width: `${progressPercent}%` }}
            className={`h-full transition-all duration-300 ${
              mode === 'work' ? 'bg-red-500' : mode === 'shortBreak' ? 'bg-emerald-500' : 'bg-blue-500'
            }`}
          />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500 block">
            {mode === 'work' ? '🍅 جلسة تركيز جارية' : '☕ وقت الاستراحة واستعادة الطاقة'}
          </span>
          <div className="text-7xl sm:text-8xl font-black text-gray-900 dark:text-white tracking-tighter font-mono">
            {formattedTime}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={toggleTimer}
            className={`px-8 py-4 rounded-2xl font-black text-base transition-all transform active:scale-95 shadow-md flex items-center gap-3 cursor-pointer ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-400 text-white'
                : mode === 'work'
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            <span>{isActive ? 'إيقاف مؤقت' : 'ابدأ التركيز الآن'}</span>
          </button>

          <button
            type="button"
            onClick={resetTimer}
            className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all cursor-pointer"
            title="إعادة ضبط الوقت"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Stats and Pomodoro Counter */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100 dark:border-gray-800 text-xs">
          <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
            <span className="text-gray-400 block mb-1">جلسات البومودورو المكتملة</span>
            <div className="text-xl font-black text-red-500 flex items-center justify-center gap-1">
              <span>{completedSessions}</span>
              <span>🍅</span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
            <span className="text-gray-400 block mb-1">إجمالي دقائق التركيز</span>
            <div className="text-xl font-black text-blue-600 dark:text-blue-400">
              {totalFocusMinutes} دقيقة
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
