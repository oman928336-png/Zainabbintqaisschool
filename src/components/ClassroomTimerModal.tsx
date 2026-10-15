import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, X, Bell, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playChime } from '../utils/storage';

interface ClassroomTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClassroomTimerModal: React.FC<ClassroomTimerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [totalSeconds, setTotalSeconds] = useState(120); // 2 minutes default
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playChime('tada');
            confetti({
              particleCount: 100,
              spread: 100,
              origin: { y: 0.5 }
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  if (!isOpen) return null;

  const setPreset = (mins: number) => {
    setIsRunning(false);
    setTotalSeconds(mins * 60);
    setSecondsLeft(mins * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border-4 border-indigo-200 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-800">
              مؤقت الأنشطة الصفية ⏱️
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Circular Display */}
        <div className="my-6">
          <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-tr from-indigo-50 to-amber-50 border-8 border-indigo-500 flex flex-col items-center justify-center shadow-inner relative">
            <span className="text-4xl sm:text-5xl font-black font-mono text-indigo-950 tracking-wider">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs font-bold text-slate-400 mt-1">
              {secondsLeft === 0 ? '🎉 انتهى الوقت! 🎉' : isRunning ? 'الوقت يمضي...' : 'جاهز للبدء'}
            </span>
          </div>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-4 gap-1.5 mb-6">
          {[
            { label: '1 دقيقة', mins: 1 },
            { label: '2 دقيقة', mins: 2 },
            { label: '3 دقائق', mins: 3 },
            { label: '5 دقائق', mins: 5 },
          ].map((preset) => (
            <button
              key={preset.mins}
              onClick={() => setPreset(preset.mins)}
              className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                totalSeconds === preset.mins * 60
                  ? 'bg-indigo-600 text-white font-black shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-2.5 rounded-2xl text-sm font-black text-white flex items-center gap-2 shadow-md transition-transform transform active:scale-95 cursor-pointer ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            <span>{isRunning ? 'إيقاف مؤقت' : 'بدء التحدي'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="إعادة ضبط"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
