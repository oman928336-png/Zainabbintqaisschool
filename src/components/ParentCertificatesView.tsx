import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Send, 
  Printer, 
  Sparkles, 
  Check, 
  MessageCircle, 
  User, 
  Phone, 
  FileCheck, 
  Calendar, 
  Award,
  Crown
} from 'lucide-react';
import { TeacherWorkspace, Student, ParentCertificate } from '../types';
import confetti from 'canvas-confetti';
import { playChime } from '../utils/storage';

interface ParentCertificatesViewProps {
  workspace: TeacherWorkspace;
  onSaveCertificate: (cert: ParentCertificate) => void;
}

export const ParentCertificatesView: React.FC<ParentCertificatesViewProps> = ({
  workspace,
  onSaveCertificate
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    workspace.students[0]?.id || ''
  );
  const selectedStudent = workspace.students.find((s) => s.id === selectedStudentId);

  const [parentName, setParentName] = useState<string>(
    selectedStudent?.parentName || (selectedStudent ? `ولي أمر الطالب / ${selectedStudent.name}` : '')
  );
  const [parentPhone, setParentPhone] = useState<string>(
    selectedStudent?.parentPhone || ''
  );
  const [reason, setReason] = useState<string>(
    'تقديراً لجهودكم المخلصة ومتابعتكم المستمرة لابنكم في المنزل، وحرصكم الدائم على تعزيز قيمه وسلوكه الإيجابي وانضباطه الصفي، مما كان له أبلغ الأثر في تفوقه وتألقه في منصة نجوم التميز.'
  );
  const [templateId, setTemplateId] = useState<ParentCertificate['templateId']>('elegant-gold');
  const [certDate, setCertDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // When student changes, update parent name & phone
  const handleStudentChange = (id: string) => {
    setSelectedStudentId(id);
    const st = workspace.students.find((s) => s.id === id);
    if (st) {
      setParentName(st.parentName || `ولي أمر الطالب / ${st.name}`);
      setParentPhone(st.parentPhone || '');
    }
  };

  const presetReasons = [
    'تقديراً للمتابعة المنزلية المستمرة وحل الواجبات اليومية بإتقان ونظافة.',
    'تقديراً لدعمكم المميز في تحسين مستوى القراءة الجهرية والوعي الصوتي.',
    'تقديراً للتعاون المثمر مع المدرسة وحضور اللقاءات التربوية الداعمة.',
    'تقديراً لغرسكم القيم النبيلة والأخلاق الرفيعة التي تجلت في تعامل الطالب مع زملائه ومعلمته.'
  ];

  // Save certificate
  const handleSave = () => {
    if (!selectedStudent) return;

    const newCert: ParentCertificate = {
      id: `pc-${Date.now()}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      parentName: parentName.trim() || `ولي أمر الطالب / ${selectedStudent.name}`,
      reason: reason.trim(),
      date: certDate,
      templateId,
      teacherName: workspace.teacherName,
      schoolName: workspace.schoolName,
      sentDate: new Date().toISOString().split('T')[0]
    };

    onSaveCertificate(newCert);
    playChime('tada');
    confetti({ particleCount: 70, spread: 80 });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // WhatsApp Direct link generator
  const handleOpenWhatsApp = () => {
    if (!selectedStudent) return;
    const cleanPhone = parentPhone.replace(/\D/g, '');
    const message = `السلام عليكم ورحمة الله وبركاته 🌸
الفاضل / ${parentName} المحترم،
تحية طيبة وبعد،

يسر إدارة ${workspace.schoolName} ومعلمة الصف ${workspace.teacherName} أن نرفع إليكم أسمى آيات الشكر والتقدير لجهودكم المخلصة ومتابعتكم الحثيثة لابننا المتميز (${selectedStudent.name})، والتي انعكست تميزاً وتألقاً في منصة «نجوم التميز» التربوية.

نص الشكر والتقدير:
«${reason}»

شاكرين لكم عظيم تعاونكم ودعمكم المستمر،،
معلمة الصف: ${workspace.teacherName}
مبادرة «نجوم التميز» – إعداد: أ. باسمة الحكمانية`;

    const encoded = encodeURIComponent(message);
    const targetUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encoded}` 
      : `https://wa.me/?text=${encoded}`;
    
    window.open(targetUrl, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white rounded-3xl p-6 shadow-lg flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
            <HeartHandshake className="w-8 h-8 text-amber-200" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">
              شهادات الشكر والتقدير لأولياء الأمور 💌
            </h2>
            <p className="text-xs sm:text-sm text-rose-100 mt-0.5">
              توطيد الشراكة التربوية بين البيت والمدرسة وتكريم أولياء الأمور المتعاونين
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="bg-white text-rose-800 hover:bg-rose-50 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الشهادة الحالية</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Config Form (no-print) */}
        <div className="lg:col-span-5 space-y-4 no-print">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <span>إعداد بيانات شهادة الشكر</span>
            </h3>

            {/* Select Student */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اختيار الطالب / الطالبة:
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => handleStudentChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
              >
                {workspace.students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.stars} ⭐)
                  </option>
                ))}
              </select>
            </div>

            {/* Parent Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اسم ولي الأمر (الأب / الأم):
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="الفاضل / سالم بن سعيد الوهيبي"
                  className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-indigo-500 outline-hidden"
                />
              </div>
            </div>

            {/* Parent Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم هاتف ولي الأمر (لإرسال الواتساب):
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="+968 91234567"
                  className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-indigo-500 outline-hidden"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                سبب الشكر والتقدير:
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:border-indigo-500 outline-hidden"
              />
              <div className="mt-1 flex flex-wrap gap-1">
                {presetReasons.map((pReason, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReason(pReason)}
                    className="text-[10px] bg-slate-100 hover:bg-rose-50 hover:text-rose-700 p-1 rounded-md text-slate-600 transition-colors"
                  >
                    نموذج {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                قالب الشهادة:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'elegant-gold', label: 'الذهبي الملكي 👑', border: 'border-amber-400' },
                  { id: 'rose-royale', label: 'الزهري الراقي 🌸', border: 'border-pink-400' },
                  { id: 'palm-green', label: 'الأخضر التربوي 🌿', border: 'border-emerald-400' },
                  { id: 'starry-navy', label: 'الكحلي النجمي 🌌', border: 'border-indigo-500' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplateId(tpl.id as any)}
                    className={`p-2 rounded-xl border text-right font-bold transition-all cursor-pointer ${
                      templateId === tpl.id
                        ? `${tpl.border} bg-indigo-50/50 ring-2 ring-indigo-400 text-indigo-950`
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
                تاريخ الشهادة:
              </label>
              <input
                type="date"
                value={certDate}
                onChange={(e) => setCertDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleSave}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                <span>{savedSuccess ? 'تم حفظ الشهادة بالسجل!' : 'حفظ الشهادة في سجل ولي الأمر'}</span>
              </button>

              <button
                onClick={handleOpenWhatsApp}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>إرسال رسالة شكر عبر الواتساب مباشرة 💬</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right/Certificate Preview & Printable Display */}
        <div className="lg:col-span-7">
          <div className="sticky top-20">
            {/* Live Certificate Box */}
            <div className={`p-8 rounded-3xl shadow-xl border-8 relative overflow-hidden bg-white ${
              templateId === 'elegant-gold' ? 'border-amber-400 bg-gradient-to-b from-amber-50/30 via-white to-amber-50/20' :
              templateId === 'rose-royale' ? 'border-pink-300 bg-gradient-to-b from-pink-50/30 via-white to-pink-50/20' :
              templateId === 'palm-green' ? 'border-emerald-400 bg-gradient-to-b from-emerald-50/30 via-white to-emerald-50/20' :
              'border-indigo-600 bg-gradient-to-b from-indigo-50/30 via-white to-indigo-50/20'
            }`}>
              
              {/* Corner Ornaments */}
              <div className="absolute top-2 right-2 text-amber-400 opacity-70">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="absolute top-2 left-2 text-amber-400 opacity-70">
                <Sparkles className="w-8 h-8" />
              </div>

              {/* Certificate Inner Frame */}
              <div className="border border-slate-200 p-6 rounded-2xl text-center space-y-4">
                
                {/* Header of Certificate */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs text-slate-600">
                  <div className="text-right">
                    <div className="font-bold text-slate-800">{workspace.schoolName}</div>
                    <div className="text-[11px] text-slate-500">سلطنة عُمان – الحلقة الأولى</div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-700 font-bold">
                    <Crown className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-left text-[11px]">
                    <div>العام الدراسي: {workspace.schoolYear}</div>
                    <div>التاريخ: {certDate}</div>
                  </div>
                </div>

                {/* Certificate Title */}
                <div className="py-2">
                  <span className="text-[11px] font-bold tracking-widest text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full uppercase">
                    شكر وعرفان
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                    شهادة شكر وتقدير لولي الأمر
                  </h1>
                </div>

                {/* Honoree Name */}
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">تتشرف إدارة المدرسة ومعلمة الصف بمنح هذه الشهادة إلى:</p>
                  <div className="text-xl sm:text-2xl font-black text-indigo-950 py-1">
                    {parentName || 'ولي الأمر الكريم'}
                  </div>
                  <p className="text-xs font-bold text-amber-800">
                    ولي أمر الطالب المتميز / <span className="underline decoration-amber-400 text-slate-900">{selectedStudent?.name}</span>
                  </p>
                </div>

                {/* Reason Text */}
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

                {/* Initiative Attribution Footer */}
                <div className="pt-3 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100">
                  <span>منظومة «نجوم التميز» التربوية</span>
                  <span>إعداد وتصميم المبادرة: <strong>الأستاذة باسمة الحكمانية</strong></span>
                </div>

              </div>
            </div>

            {/* Print Note */}
            <div className="mt-3 text-center no-print">
              <p className="text-xs text-slate-400">
                💡 اضغطي على زر <strong>«طباعة الشهادة الحالية»</strong> لتصدير الشهادة بدقة فائقة وبدون أي قوائم جانبية.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
