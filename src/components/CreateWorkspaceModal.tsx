import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  School, 
  Users, 
  Settings2, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  ShieldCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { TeacherWorkspace, Student } from '../types';
import confetti from 'canvas-confetti';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWorkspace: (workspace: TeacherWorkspace) => void;
}

export const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onCreateWorkspace,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form Fields
  const [teacherName, setTeacherName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [grade, setGrade] = useState('الصف الأول الأساسي');
  const [section, setSection] = useState('1');
  const [schoolYear, setSchoolYear] = useState('2026 / 2027 م');
  const [schoolLogo, setSchoolLogo] = useState('');
  const [rawStudentNames, setRawStudentNames] = useState('');
  const [themeColor, setThemeColor] = useState('#4f46e5');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleCopyShareLink = () => {
    const shareUrl = window.location.origin;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleFinalSubmit = () => {
    if (!teacherName.trim()) {
      alert('الرجاء إدخال اسم المعلمة');
      setStep(1);
      return;
    }

    // Parse students from textarea
    const lines = rawStudentNames
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const generatedStudents: Student[] = lines.length > 0
      ? lines.map((name, idx) => ({
          id: `st-custom-${Date.now()}-${idx}`,
          name,
          gender: name.includes('ة') || name.includes('بنت') || name.includes('مريم') || name.includes('فاطمة') || name.includes('ريم') ? 'female' : 'male',
          avatar: name.includes('ة') || name.includes('بنت') || name.includes('مريم') || name.includes('فاطمة') || name.includes('ريم') ? '👧🏻' : '👦🏻',
          stars: 0,
          points: 0,
          badges: ['بطل البداية'],
        }))
      : [
          { id: `st-${Date.now()}-1`, name: 'طالب متميز 1', gender: 'male', avatar: '👦🏻', stars: 0, points: 0, badges: [] },
          { id: `st-${Date.now()}-2`, name: 'طالبة متميزة 1', gender: 'female', avatar: '👧🏻', stars: 0, points: 0, badges: [] },
        ];

    const newWorkspace: TeacherWorkspace = {
      id: `workspace-${Date.now()}`,
      teacherName: teacherName.trim(),
      schoolName: schoolName.trim() || 'مدرسة الحلقة الأولى',
      grade,
      section,
      schoolYear,
      schoolLogo: schoolLogo.trim() || undefined,
      themeColor,
      availableSections: ['1', '2', '3', '4'],
      availableSubjects: [
        'اللغة العربية',
        'التربية الإسلامية',
        'الرياضيات',
        'العلوم',
        'الدراسات الاجتماعية',
        'الفنون التشكيلية',
        'اللغة الإنجليزية',
        'المهارات الحياتية',
        'المهارات الموسيقية',
        'الرياضة المدرسية',
        'تقنية المعلومات'
      ],
      students: generatedStudents,
      groups: [
        { id: `grp-${Date.now()}-1`, name: 'مجموعة النجوم 🌟', color: 'from-amber-400 to-amber-600', icon: 'Sparkles', studentIds: [], points: 0 },
        { id: `grp-${Date.now()}-2`, name: 'مجموعة الأبطال 🚀', color: 'from-indigo-400 to-purple-600', icon: 'Rocket', studentIds: [], points: 0 },
      ],
      attendance: [],
      tasks: [],
      achievements: [],
      studentCertificates: [],
      parentCertificates: [],
      surpriseGifts: [
        '👑 تاج أمير / أميرة الصف ليوم كامل',
        '🎨 قلم سحري ملون ودفتر رسم كرتوني',
        '🏆 مساعد المعلمة في الحصة',
        '⭐ وسام نجم الأسبوع',
        '🍬 باقة حلويات الأبطال'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onCreateWorkspace(newWorkspace);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 w-full max-w-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                أنشئي نسختكِ الخاصة لصفكِ
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100 mt-0.5">
                مساحة صفية رقمية مستقلة تماماً لطلابكِ وشعبتكِ
              </p>
            </div>
          </div>

          <div className="mt-3 text-[11px] bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 flex items-center justify-between text-indigo-100">
            <span>إعداد وتصميم المبادرة: <strong>الأستاذة باسمة الحكمانية</strong></span>
            <span className="flex items-center gap-1 text-emerald-300 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              فصل تام وسرية لبيانات الطلاب
            </span>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/15 text-xs font-bold">
            <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-amber-300' : 'text-white/60'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-amber-400 text-indigo-950 font-black' : 'bg-white/20'}`}>1</span>
              <span>بيانات المعلمة والصف</span>
            </div>
            <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-amber-300' : 'text-white/60'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-amber-400 text-indigo-950 font-black' : 'bg-white/20'}`}>2</span>
              <span>قائمة الطلاب</span>
            </div>
            <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-amber-300' : 'text-white/60'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-amber-400 text-indigo-950 font-black' : 'bg-white/20'}`}>3</span>
              <span>التخصيص والإطلاق</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3.5 text-xs text-indigo-900 leading-relaxed flex items-start gap-2.5">
                <School className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">مرحباً بكِ زميلتنا معلمة الحلقة الأولى 🌸</p>
                  <p className="text-slate-600 mt-0.5">
                    ستحصلين على بيئة إلكترونية مستقلة لحفظ طلابك، ورصد نجومهم، وتوليد شهادات الشكر لأولياء الأمور باسمك ومدرستك، دون مشاركة هذه البيانات مع أي معلمة أخرى.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. اسم المعلمة الكامل (المستفيدة من المبادرة) *
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="مثال: أ. مريم بنت راشد الحارثية"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-hidden text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. اسم المدرسة *
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="مثال: مدرسة الواحة للتعليم الأساسي (1-4)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-hidden text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    3. الصف
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-hidden text-sm bg-white"
                  >
                    <option value="الصف الأول الأساسي">الصف الأول الأساسي</option>
                    <option value="الصف الثاني الأساسي">الصف الثاني الأساسي</option>
                    <option value="الصف الثالث الأساسي">الصف الثالث الأساسي</option>
                    <option value="الصف الرابع الأساسي">الصف الرابع الأساسي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    4. الشعبة
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="مثال: 1 أو 2 أو 3"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-hidden text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    5. العام الدراسي
                  </label>
                  <input
                    type="text"
                    value={schoolYear}
                    onChange={(e) => setSchoolYear(e.target.value)}
                    placeholder="2024 / 2025 م"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-hidden text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  6. رابط شعار المدرسة أو رمز اختياري (اختياري)
                </label>
                <input
                  type="text"
                  value={schoolLogo}
                  onChange={(e) => setSchoolLogo(e.target.value)}
                  placeholder="https://... أو اتركيها فارغة لاستخدام الشعار التلقائي"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-hidden text-sm"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                <Users className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">إضافة أسماء الطلاب دفعة واحدة (سهل وسريع)</p>
                  <p className="text-amber-800 mt-0.5">
                    يمكنكِ نسخ أسماء طلابك من ملف الإكسل أو البوابة التعليمية ولصقها هنا (اسم كل طالب في سطر منفصل). ستنشئ المنصة بطاقة لكل طالب فوراً!
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  7. الصقي أو اكتبي أسماء الطلاب (اسم في كل سطر):
                </label>
                <textarea
                  rows={8}
                  value={rawStudentNames}
                  onChange={(e) => setRawStudentNames(e.target.value)}
                  placeholder={`محمد بن سعيد الحارثي\nفاطمة بنت أحمد الشحية\nحمد بن علي المعمري\nريم بنت سلطان البلوشية\nسالم بن خالد الحكماني\nعائشة بنت خلفان الغافرية`}
                  className="w-full p-3.5 rounded-2xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden text-sm font-sans"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  يمكنك أيضاً إضافة وحذف وتعديل الطلاب لاحقاً في أي وقت من قسم «إدارة الطلاب».
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-950">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  مراجعة تفاصيل نسختكِ الصفية المستقلة
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-slate-700 bg-white/70 p-3 rounded-xl border border-emerald-100">
                  <div><strong>المعلمة:</strong> {teacherName || 'لم يحدد'}</div>
                  <div><strong>المدرسة:</strong> {schoolName || 'لم يحدد'}</div>
                  <div><strong>الصف والشعبة:</strong> {grade} - شعبة {section}</div>
                  <div><strong>العام الدراسي:</strong> {schoolYear}</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  8. اختيار لون السمة المميز لصفكِ:
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { color: '#4f46e5', label: 'نيلي ملكي' },
                    { color: '#059669', label: 'زمردي أخضر' },
                    { color: '#d97706', label: 'ذهبي عنبري' },
                    { color: '#e11d48', label: 'وردي ياقوتي' },
                    { color: '#0891b2', label: 'سماوي بحري' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setThemeColor(c.color)}
                      className={`w-9 h-9 rounded-xl transition-all flex items-center justify-center ${
                        themeColor === c.color ? 'ring-3 ring-indigo-400 scale-110 shadow-md' : 'opacity-80'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    >
                      {themeColor === c.color && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Share option with other teachers */}
              <div className="border-t border-slate-200 pt-3 mt-3">
                <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-indigo-600" />
                  مشاركة المبادرة مع معلمات الحلقة الأولى في مدرستكِ:
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={window.location.origin}
                    className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-600 select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  عند إرسال هذا الرابط لزميلاتكِ، تفتح كل معلمة منصة «نجوم التميز» وتضغط زر «أنشئي نسختكِ الخاصة لصفكِ» لتحصل على مساحتها الخاصة فوراً.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 px-4 py-2 text-slate-600 hover:text-slate-800 text-xs sm:text-sm font-bold bg-white border border-slate-300 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 hover:text-slate-700 text-xs sm:text-sm font-medium cursor-pointer"
            >
              إلغاء
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !teacherName.trim()) {
                    alert('الرجاء كتابة اسم المعلمة للمتابعة');
                    return;
                  }
                  setStep(step + 1);
                }}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md cursor-pointer"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-200 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>إطلاق نسختي الصفية الآن</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
