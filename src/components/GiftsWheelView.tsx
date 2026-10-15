import React, { useState } from 'react';
import { 
  Gift, 
  Sparkles, 
  Trophy, 
  Crown, 
  Plus, 
  Trash2, 
  Check, 
  Shuffle,
  Smile
} from 'lucide-react';
import { TeacherWorkspace, Student } from '../types';
import confetti from 'canvas-confetti';
import { playChime } from '../utils/storage';

interface GiftsWheelViewProps {
  workspace: TeacherWorkspace;
  onUpdateWorkspace: (updated: Partial<TeacherWorkspace>) => void;
  onUpdateStudents: (updatedStudents: Student[]) => void;
}

export const GiftsWheelView: React.FC<GiftsWheelViewProps> = ({
  workspace,
  onUpdateWorkspace,
  onUpdateStudents
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    workspace.students[0]?.id || ''
  );
  const selectedStudent = workspace.students.find((s) => s.id === selectedStudentId);

  const [isOpeningBox, setIsOpeningBox] = useState(false);
  const [wonGift, setWonGift] = useState<string | null>(null);
  const [newGiftInput, setNewGiftInput] = useState('');

  const gifts = workspace.surpriseGifts || [
    '👑 تاج أمير / أميرة الصف ليوم كامل',
    '🎨 قلم سحري ملون ودفتر رسم كرتوني',
    '🏆 مساعد المعلمة في توزيع الدفاتر',
    '⭐ وسام نجم الأسبوع الذهبي',
    '🍬 باقة حلوى الأبطال الصحية',
    '🎲 اختيار النشاط الترفيهي المفضل'
  ];

  const handleOpenGiftBox = () => {
    if (gifts.length === 0) return;
    setIsOpeningBox(true);
    setWonGift(null);

    let counter = 0;
    const interval = setInterval(() => {
      const randGift = gifts[Math.floor(Math.random() * gifts.length)];
      setWonGift(randGift);
      counter++;

      if (counter > 12) {
        clearInterval(interval);
        setIsOpeningBox(false);
        playChime('gift');
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5 }
        });

        // Award stars to student as well!
        if (selectedStudent) {
          const updated = workspace.students.map((st) => {
            if (st.id === selectedStudent.id) {
              return {
                ...st,
                stars: st.stars + 2,
                points: st.points + 10,
                lastAwardedReason: `فوز بهدية المفاجآت: ${randGift}`
              };
            }
            return st;
          });
          onUpdateStudents(updated);
        }
      }
    }, 120);
  };

  const handleAddGift = () => {
    if (!newGiftInput.trim()) return;
    const updated = [...gifts, newGiftInput.trim()];
    onUpdateWorkspace({ surpriseGifts: updated });
    setNewGiftInput('');
  };

  const handleDeleteGift = (index: number) => {
    const updated = gifts.filter((_, idx) => idx !== index);
    onUpdateWorkspace({ surpriseGifts: updated });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 text-white rounded-3xl p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
            <Gift className="w-8 h-8 text-pink-200 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">
              صندوق الهدايا وعجلة المفاجآت 🎁
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 mt-0.5">
              مكافأة نجوم الصف بجوائز معنوية ومادية مبهجة تحببهم في المدرسة والتعلم
            </p>
          </div>
        </div>

        <div className="text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
          مبادرة «نجوم التميز» – أ. باسمة الحكمانية
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Surprise Box Interactive Area */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md text-center space-y-6">
          <div className="max-w-md mx-auto space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              اختاري الطالب المستحق للمفاجأة:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
            >
              {workspace.students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.stars} ⭐)
                </option>
              ))}
            </select>
          </div>

          {/* Big Interactive Box */}
          <div className="py-6">
            <button
              type="button"
              disabled={isOpeningBox}
              onClick={handleOpenGiftBox}
              className={`w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-400 to-pink-500 text-white flex flex-col items-center justify-center shadow-2xl transform transition-all cursor-pointer ${
                isOpeningBox ? 'animate-bounce scale-105 ring-8 ring-amber-200' : 'hover:scale-105 active:scale-95'
              }`}
            >
              <Gift className="w-20 h-20 text-white drop-shadow-md" />
              <span className="text-sm font-black mt-2 drop-shadow-sm">
                {isOpeningBox ? 'جاري فتح الصندوق...' : 'اضغط لفتح المفاجأة! ✨'}
              </span>
            </button>
          </div>

          {/* Reveal Result */}
          {wonGift && (
            <div className="bg-gradient-to-r from-amber-50 via-pink-50 to-amber-50 border-2 border-amber-300 rounded-3xl p-6 max-w-lg mx-auto animate-in zoom-in-95">
              <span className="text-xs bg-amber-200 text-amber-900 font-bold px-3 py-0.5 rounded-full">
                🎉 مبارك للنجم / {selectedStudent?.name} 🎉
              </span>
              <div className="text-lg sm:text-2xl font-black text-slate-900 mt-2">
                {wonGift}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                تمت إضافة +2 نجمة و +10 نقاط لرصيد الطالب تلقائياً! ⭐
              </p>
            </div>
          )}
        </div>

        {/* Customizable Gift List */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>قائمة جوائز صندوق المفاجآت</span>
            </h3>
            <span className="text-xs text-slate-400 font-bold">{gifts.length} جوائز</span>
          </div>

          {/* Add Gift Form */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="اكتبي هدية جديدة (مثال: نزهة مدرسية مصغرة)..."
              value={newGiftInput}
              onChange={(e) => setNewGiftInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs outline-hidden focus:border-purple-500"
            />
            <button
              onClick={handleAddGift}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة</span>
            </button>
          </div>

          {/* List */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {gifts.map((gift, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-purple-50 rounded-xl border border-slate-200/80 text-xs font-bold text-slate-700 transition-colors"
              >
                <span>{gift}</span>
                <button
                  onClick={() => handleDeleteGift(idx)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            💡 يمكنكِ تخصيص الجوائز بما يناسب طبيعة طلاب الحلقة الأولى في سلطنة عُمان (جوائز معنوية ومادية خفيفة).
          </p>
        </div>
      </div>
    </div>
  );
};
