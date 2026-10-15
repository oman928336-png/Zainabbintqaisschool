import React, { useState } from 'react';
import { 
  Star, 
  Award, 
  Sparkles, 
  Search, 
  Filter, 
  Shuffle, 
  Plus, 
  Minus, 
  Check, 
  Heart, 
  Trophy, 
  Flame, 
  UserPlus, 
  Gift,
  HelpCircle,
  X,
  Timer,
  User
} from 'lucide-react';
import { TeacherWorkspace, Student } from '../types';
import confetti from 'canvas-confetti';
import { playChime } from '../utils/storage';
import { StudentProfileModal } from './StudentProfileModal';
import { ClassroomTimerModal } from './ClassroomTimerModal';

interface TeacherDashboardViewProps {
  workspace: TeacherWorkspace;
  onUpdateStudents: (updatedStudents: Student[]) => void;
  onGoToGifts: () => void;
  onGoToCertificates: (studentId?: string) => void;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  workspace,
  onUpdateStudents,
  onGoToGifts,
  onGoToCertificates
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');

  // Random Student Picker State
  const [randomStudentModal, setRandomStudentModal] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [pickedStudent, setPickedStudent] = useState<Student | null>(null);

  // Custom Badge Award Modal
  const [badgeModalStudent, setBadgeModalStudent] = useState<Student | null>(null);
  const [badgeInput, setBadgeInput] = useState('');

  // Student Profile Modal State
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);

  // Classroom Timer Modal State
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  const quickBadges = [
    'بطل الإملاء ✍️',
    'القارئ الماهر 📖',
    'فارس الرياضيات 📐',
    'الخلق الرفيع 🌸',
    'نجم التعاون 🤝',
    'الترتيب والنظافة ✨',
    'المستكشف الذكي 🔬',
    'أمير الإلقاء 🎤'
  ];

  // Quick points modification
  const handleModifyPoints = (studentId: string, deltaPoints: number, deltaStars: number, reason?: string) => {
    const updated = workspace.students.map((st) => {
      if (st.id === studentId) {
        const nextPoints = Math.max(0, st.points + deltaPoints);
        const nextStars = Math.max(0, st.stars + deltaStars);
        return {
          ...st,
          points: nextPoints,
          stars: nextStars,
          lastAwardedReason: reason || (deltaPoints > 0 ? 'مشاركة صفية متميزة' : 'تنبيه للتطوير')
        };
      }
      return st;
    });

    if (deltaPoints > 0) {
      playChime('star');
      confetti({
        particleCount: deltaPoints > 3 ? 60 : 30,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    onUpdateStudents(updated);
  };

  // Bulk Award to all students in view
  const handleAwardAll = () => {
    const updated = workspace.students.map((st) => ({
      ...st,
      stars: st.stars + 1,
      points: st.points + 5,
      lastAwardedReason: 'تعزيز جماعي لتفاعل الصف الرائع'
    }));

    playChime('tada');
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 }
    });

    onUpdateStudents(updated);
  };

  // Random Student Selector
  const handleStartRandomPicker = () => {
    if (workspace.students.length === 0) return;
    setRandomStudentModal(true);
    setIsPicking(true);
    setPickedStudent(null);

    let count = 0;
    const interval = setInterval(() => {
      const randIdx = Math.floor(Math.random() * workspace.students.length);
      setPickedStudent(workspace.students[randIdx]);
      count++;
      if (count > 15) {
        clearInterval(interval);
        setIsPicking(false);
        playChime('tada');
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.5 }
        });
      }
    }, 100);
  };

  // Add badge to student
  const handleAddBadge = (badgeName: string) => {
    if (!badgeModalStudent) return;
    const updated = workspace.students.map((st) => {
      if (st.id === badgeModalStudent.id) {
        const existingBadges = st.badges || [];
        if (!existingBadges.includes(badgeName)) {
          return {
            ...st,
            badges: [...existingBadges, badgeName],
            stars: st.stars + 2,
            points: st.points + 10,
            lastAwardedReason: `نيل وسام: ${badgeName}`
          };
        }
      }
      return st;
    });

    playChime('tada');
    confetti({ particleCount: 50 });
    onUpdateStudents(updated);
    setBadgeModalStudent(null);
    setBadgeInput('');
  };

  // Filter students
  const filteredStudents = workspace.students.filter((st) => {
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === 'all' ? true : st.gender === genderFilter;
    
    let matchesGroup = true;
    if (selectedGroupFilter !== 'all') {
      const group = workspace.groups.find((g) => g.id === selectedGroupFilter);
      matchesGroup = group ? group.studentIds.includes(st.id) : true;
    }

    return matchesSearch && matchesGender && matchesGroup;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Classroom Status Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-white/25 text-white font-black px-2.5 py-0.5 rounded-full text-xs shadow-2xs">
                {workspace.grade} – شعبة {workspace.section}
              </span>
              <span className="text-xs bg-amber-950/20 px-2.5 py-0.5 rounded-full font-bold">
                {workspace.schoolName}
              </span>
              <span className="text-xs bg-amber-900/30 text-amber-100 px-2.5 py-0.5 rounded-full font-black">
                {workspace.schoolYear || '2026 / 2027 م'}
              </span>
              <span className="text-[11px] bg-emerald-500/25 text-white border border-emerald-300/40 px-2 py-0.5 rounded-full font-bold">
                ✓ دخول مباشر بدون إيميل
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black mt-1.5">
              لوحة نجوم التميز اليومية ⭐
            </h2>
            <p className="text-amber-100 text-xs sm:text-sm mt-0.5 font-medium">
              معلمة الصف: <strong>{workspace.teacherName}</strong> | مبادرة إعداد وتصميم: الأستاذة / باسمة الحكمانية
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={handleAwardAll}
              className="bg-white hover:bg-amber-50 text-amber-950 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black shadow-md flex items-center gap-1.5 transition-all transform hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>تعزيز جماعي للصف (+1 نجمة)</span>
            </button>

            <button
              onClick={handleStartRandomPicker}
              className="bg-indigo-900/80 hover:bg-indigo-950 text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Shuffle className="w-4 h-4 text-amber-300" />
              <span>من يجيب على السؤال؟ (عشوائي)</span>
            </button>

            <button
              onClick={() => setIsTimerOpen(true)}
              className="bg-emerald-900/80 hover:bg-emerald-950 text-white px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Timer className="w-4 h-4 text-emerald-300" />
              <span>مؤقت الأنشطة ⏱️</span>
            </button>

            <button
              onClick={onGoToGifts}
              className="bg-purple-900/80 hover:bg-purple-950 text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Gift className="w-4 h-4 text-pink-300" />
              <span>صندوق المفاجآت</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="ابحثي عن اسم الطالب أو الطالبة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-2"
            >
              مسح
            </button>
          )}
        </div>

        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Gender Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setGenderFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                genderFilter === 'all' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              الجميع ({workspace.students.length})
            </button>
            <button
              onClick={() => setGenderFilter('male')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                genderFilter === 'male' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              الأبطال 👦
            </button>
            <button
              onClick={() => setGenderFilter('female')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                genderFilter === 'female' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              الزهرات 👧
            </button>
          </div>

          {/* Group Filter */}
          {workspace.groups.length > 0 && (
            <select
              value={selectedGroupFilter}
              onChange={(e) => setSelectedGroupFilter(e.target.value)}
              className="bg-slate-100 border-0 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 cursor-pointer"
            >
              <option value="all">كل المجموعات الصفية</option>
              {workspace.groups.map((grp) => (
                <option key={grp.id} value={grp.id}>
                  {grp.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Student Cards Grid */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-3">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">لا يوجد طلاب مطابقون للبحث</h3>
          <p className="text-xs text-slate-500 mt-1">
            يمكنكِ إضافة طلاب جدد من تبويب «إدارة الطلاب» أعلى الصفحة
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredStudents.map((student) => {
            return (
              <div
                key={student.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-amber-400 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top of Student Card */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div 
                      className="flex items-center gap-2.5 cursor-pointer"
                      onClick={() => setSelectedStudentForProfile(student)}
                      title="انقري لعرض ملف الطالب الشامل وسجل الإنجاز"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
                        {student.avatar || (student.gender === 'female' ? '👧🏻' : '👦🏻')}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                          {student.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="flex items-center gap-0.5 text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>{student.stars}</span>
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {student.points} نقطة
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Badge Button */}
                    <button
                      onClick={() => setBadgeModalStudent(student)}
                      className="text-slate-400 hover:text-amber-500 p-1.5 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer"
                      title="منح وسام أو شارة"
                    >
                      <Award className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Badges List */}
                  {student.badges && student.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {student.badges.slice(-3).map((badge, bIdx) => (
                        <span
                          key={bIdx}
                          className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-lg border border-indigo-100"
                        >
                          {badge}
                        </span>
                      ))}
                      {student.badges.length > 3 && (
                        <span className="text-[10px] text-slate-400 px-1 py-0.5">
                          +{student.badges.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Last Reason */}
                  {student.lastAwardedReason && (
                    <div className="mt-2.5 text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-100 line-clamp-1">
                      {student.lastAwardedReason}
                    </div>
                  )}
                </div>

                {/* Bottom Action Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleModifyPoints(student.id, 5, 1, 'إجابة متميزة')}
                      className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                      title="إضافة نجمة واحدة (+5 نقاط)"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-950" />
                      <span>+1</span>
                    </button>

                    <button
                      onClick={() => handleModifyPoints(student.id, 15, 3, 'تفوق أكاديمي باهر')}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-2 py-1.5 rounded-xl transition-colors cursor-pointer"
                      title="تفوق باهر (+3 نجوم، +15 نقطة)"
                    >
                      +3 🌟
                    </button>

                    <button
                      onClick={() => handleModifyPoints(student.id, -5, -1, 'تنبيه لطيف لتصحيح السلوك')}
                      className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-xl transition-colors cursor-pointer"
                      title="تنبيه لطيف (-1 نجمة)"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedStudentForProfile(student)}
                      className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-0.5 cursor-pointer"
                      title="عرض ملف الطالب الفردي الشامل"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>الملف</span>
                    </button>

                    <button
                      onClick={() => onGoToCertificates(student.id)}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                    >
                      شهادة 📜
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Random Student Winner Modal */}
      {randomStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border-4 border-amber-400 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 text-white mx-auto flex items-center justify-center text-4xl shadow-lg mb-4 animate-bounce">
              {pickedStudent?.avatar || '🌟'}
            </div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isPicking ? 'جاري السحب العشوائي...' : '🎉 الطالب المختار للإجابة 🎉'}
            </h3>
            <div className="text-xl sm:text-2xl font-black text-indigo-950 mt-1 min-h-[36px]">
              {pickedStudent ? pickedStudent.name : '...'}
            </div>

            {!isPicking && pickedStudent && (
              <div className="mt-4 space-y-3">
                <div className="text-xs text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-xl font-bold">
                  لديه {pickedStudent.stars} نجمة متميزة ⭐
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      handleModifyPoints(pickedStudent.id, 10, 2, 'إجابة رائعة في السؤال العشوائي');
                      setRandomStudentModal(false);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs cursor-pointer"
                  >
                    إجابة صحيحة (+2 نجمة) ⭐
                  </button>
                  <button
                    onClick={() => setRandomStudentModal(false)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Badge Award Modal */}
      {badgeModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-indigo-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900">
                  منح وسام تميز للطالب / {badgeModalStudent.name}
                </h3>
              </div>
              <button onClick={() => setBadgeModalStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                اختاري وساماً سريعاً:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {quickBadges.map((badge, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddBadge(badge)}
                    className="text-right text-xs bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    {badge}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  أو اكتبي وساماً مخصصاً:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="مثال: فارس جدول الضرب..."
                    value={badgeInput}
                    onChange={(e) => setBadgeInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-indigo-500 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => badgeInput.trim() && handleAddBadge(badgeInput.trim())}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    منح
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {selectedStudentForProfile && (
        <StudentProfileModal
          student={selectedStudentForProfile}
          workspace={workspace}
          onClose={() => setSelectedStudentForProfile(null)}
          onUpdateStudent={(updated) => {
            onUpdateStudents(
              workspace.students.map((s) => (s.id === updated.id ? updated : s))
            );
            setSelectedStudentForProfile(updated);
          }}
          onGoToCertificates={(stId) => {
            setSelectedStudentForProfile(null);
            onGoToCertificates(stId);
          }}
        />
      )}

      {/* Classroom Timer Modal */}
      <ClassroomTimerModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
      />

    </div>
  );
};
