import React, { useState } from 'react';
import { 
  Award, 
  Printer, 
  Sparkles, 
  Star, 
  Crown, 
  Check, 
  User, 
  Calendar,
  Medal
} from 'lucide-react';
import { TeacherWorkspace, Student, StudentCertificate } from '../types';
import confetti from 'canvas-confetti';
import { playChime } from '../utils/storage';

interface StudentCertificatesViewProps {
  workspace: TeacherWorkspace;
  initialStudentId?: string;
  onSaveCertificate: (cert: StudentCertificate) => void;
}

export const StudentCertificatesView: React.FC<StudentCertificatesViewProps> = ({
  workspace,
  initialStudentId,
  onSaveCertificate
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || workspace.students[0]?.id || ''
  );
  const selectedStudent = workspace.students.find((s) => s.id === selectedStudentId);

  const [certTitle, setCertTitle] = useState('شهادة التميز والتفوق الصفي 🌟');
  const [reason, setReason] = useState(
    'نظير تألقه وتميزه في المشاركة الصفية، وتحقيقه أعلى رصيد من نجوم التميز، والتزامه بالأخلاق الفاضلة والتعاون مع زملائه.'
  );
  const [templateId, setTemplateId] = useState<StudentCertificate['templateId']>('gold');
  const [certDate, setCertDate] = useState(new Date().toISOString().split('T')[0]);
  const [saved, setSaved] = useState(false);

  const quickTitles = [
    'شهادة التميز والتفوق الصفي 🌟',
    'وسام نجم الأسبوع الذهبي 👑',
    'فارس القراءة والطلاقة 📖',
    'أميرة الأخلاق والترتيب 🌸',
    'بطل الحساب والذكاء 📐',
  ];

  const handleSave = () => {
    if (!selectedStudent) return;
    const cert: StudentCertificate = {
      id: `sc-${Date.now()}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      title: certTitle,
      reason: reason.trim(),
      date: certDate,
      templateId,
      teacherName: workspace.teacherName,
      schoolName: workspace.schoolName
    };

    onSaveCertificate(cert);
    playChime('tada');
    confetti({ particleCount: 80, spread: 90 });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-6 shadow-lg flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
            <Award className="w-8 h-8 text-amber-100" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">
              شهادات التميز والتكريم لطلاب الحلقة الأولى 🏆
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 mt-0.5">
              تصميم وطباعة شهادات التكريم لتتويج فرسان التميز في الصف
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-white text-amber-950 hover:bg-amber-50 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة الشهادة (A4)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Controls (no-print) */}
        <div className="lg:col-span-5 space-y-4 no-print">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Medal className="w-4 h-4 text-amber-500" />
              <span>بيانات شهادة الطالب</span>
            </h3>

            {/* Select Student */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اختيار الطالب المكرم:
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

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                عنوان الشهادة أو الوسام:
              </label>
              <input
                type="text"
                value={certTitle}
                onChange={(e) => setCertTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
              />
              <div className="mt-1 flex flex-wrap gap-1">
                {quickTitles.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCertTitle(t)}
                    className="text-[10px] bg-slate-100 hover:bg-amber-50 hover:text-amber-700 p-1 rounded-md text-slate-600 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                عبارة التكريم والإشادة:
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:border-amber-500 outline-hidden"
              />
            </div>

            {/* Template */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                نمط القالب:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'gold', label: 'الذهبي البراق 🌟' },
                  { id: 'sky', label: 'السماوي البهيج 🌊' },
                  { id: 'emerald', label: 'الزمردي الأخضر 🌿' },
                  { id: 'royal', label: 'الملكي البنفسجي 👑' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplateId(tpl.id as any)}
                    className={`p-2 rounded-xl border text-right font-bold transition-all cursor-pointer ${
                      templateId === tpl.id
                        ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-300 text-amber-950'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                التاريخ:
              </label>
              <input
                type="date"
                value={certDate}
                onChange={(e) => setCertDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              {saved ? <Check className="w-4 h-4 text-emerald-800" /> : <Sparkles className="w-4 h-4" />}
              <span>{saved ? 'تم حفظ الشهادة في أرشيف الطالب' : 'حفظ الشهادة وتأكيد المنح'}</span>
            </button>
          </div>
        </div>

        {/* Right / Live Certificate Preview */}
        <div className="lg:col-span-7">
          <div className="sticky top-20">
            <div className={`p-8 rounded-3xl shadow-2xl border-8 relative overflow-hidden bg-white ${
              templateId === 'gold' ? 'border-amber-400 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30' :
              templateId === 'sky' ? 'border-sky-400 bg-gradient-to-b from-sky-50/40 via-white to-sky-50/30' :
              templateId === 'emerald' ? 'border-emerald-400 bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30' :
              'border-purple-600 bg-gradient-to-b from-purple-50/40 via-white to-purple-50/30'
            }`}>
              
              {/* Corner Embellishments */}
              <div className="absolute top-2 right-2 text-amber-400 opacity-60">
                <Star className="w-8 h-8 fill-amber-400" />
              </div>
              <div className="absolute top-2 left-2 text-amber-400 opacity-60">
                <Star className="w-8 h-8 fill-amber-400" />
              </div>

              {/* Inner Frame */}
              <div className="border-2 border-dashed border-amber-300/80 p-6 rounded-2xl text-center space-y-4">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs text-slate-600">
                  <div className="text-right">
                    <div className="font-black text-slate-800">{workspace.schoolName}</div>
                    <div className="text-[11px] text-slate-500">{workspace.grade} – شعبة {workspace.section}</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-md">
                    <Award className="w-7 h-7" />
                  </div>
                  <div className="text-left text-[11px]">
                    <div>العام: {workspace.schoolYear}</div>
                    <div>التاريخ: {certDate}</div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <div className="inline-block bg-amber-400/20 text-amber-900 font-black text-xs px-3 py-1 rounded-full mb-1">
                    منظومة نجوم التميز
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-indigo-950">
                    {certTitle}
                  </h1>
                </div>

                {/* Student Name */}
                <div className="py-2">
                  <p className="text-xs text-slate-500 font-medium">تُمنح هذه الشهادة بكل فخر واعتزاز إلى النجم / النجمة:</p>
                  <div className="text-2xl sm:text-3xl font-black text-amber-600 my-1">
                    {selectedStudent?.avatar} {selectedStudent?.name || 'اسم الطالب'}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-amber-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Reason */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-lg mx-auto py-2 font-medium">
                  {reason}
                </p>

                {/* Signatures */}
                <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs">
                  <div className="text-right">
                    <div className="text-slate-400 font-bold">معلمة الصف</div>
                    <div className="font-black text-indigo-900 mt-0.5">{workspace.teacherName}</div>
                    <div className="text-[10px] text-slate-400 mt-2">التوقيع: ____________</div>
                  </div>

                  <div className="text-left">
                    <div className="text-slate-400 font-bold">إدارة المدرسة</div>
                    <div className="font-black text-slate-800 mt-0.5">مديرة المدرسة</div>
                    <div className="text-[10px] text-slate-400 mt-2">الختم: ____________</div>
                  </div>
                </div>

                {/* Initiative attribution watermark */}
                <div className="pt-3 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100">
                  <span>مبادرة «نجوم التميز» – سلطنة عُمان</span>
                  <span>إعداد وتصميم المبادرة: <strong>الأستاذة باسمة الحكمانية</strong></span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
