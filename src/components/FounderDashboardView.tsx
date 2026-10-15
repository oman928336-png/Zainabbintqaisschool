import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  Users, 
  School, 
  Award, 
  Share2, 
  Copy, 
  Check, 
  BookOpen, 
  PlusCircle, 
  Printer, 
  ShieldCheck, 
  MessageSquareQuote,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { INITIATIVE_INFO } from '../data/initialData';
import { TeacherWorkspace, InitiativeGuidance } from '../types';
import { Link2 } from 'lucide-react';

interface FounderDashboardViewProps {
  workspaces: TeacherWorkspace[];
  guidanceList: InitiativeGuidance[];
  onAddGuidance: (guidance: InitiativeGuidance) => void;
  onOpenCreateModal: () => void;
  onNavigateToLinks?: () => void;
}

export const FounderDashboardView: React.FC<FounderDashboardViewProps> = ({
  workspaces,
  guidanceList,
  onAddGuidance,
  onOpenCreateModal,
  onNavigateToLinks
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAddGuidance, setShowAddGuidance] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'motivation' | 'classroom_management' | 'pedagogy'>('motivation');

  // Aggregated non-personal statistics
  const totalWorkspaces = workspaces.length;
  const totalStudents = workspaces.reduce((acc, ws) => acc + ws.students.length, 0);
  const totalStars = workspaces.reduce((acc, ws) => acc + ws.students.reduce((sAcc, st) => sAcc + st.stars, 0), 0);
  const totalCertificates = workspaces.reduce((acc, ws) => acc + (ws.studentCertificates?.length || 0) + (ws.parentCertificates?.length || 0), 0);
  const totalAchievements = workspaces.reduce((acc, ws) => acc + (ws.achievements?.length || 0), 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateGuidance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newG: InitiativeGuidance = {
      id: `g-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      date: new Date().toISOString().split('T')[0]
    };

    onAddGuidance(newG);
    setNewTitle('');
    setNewContent('');
    setShowAddGuidance(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Crown className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-amber-950 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  لوحة التحكم الإشرافية الخاصة
                </span>
                <span className="text-xs text-indigo-200">
                  إصدار المنصة: v{INITIATIVE_INFO.version}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                صاحبة ومصممة المبادرة: الأستاذة باسمة الحكمانية
              </h1>
              <p className="text-indigo-200 text-xs sm:text-sm mt-0.5">
                متابعة انتشار المبادرة في مدارس سلطنة عُمان، وتحديث الإرشادات التربوية، ومشاركة الرابط للمعلمات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 no-print">
            {onNavigateToLinks && (
              <button
                onClick={onNavigateToLinks}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-indigo-400"
              >
                <Link2 className="w-4 h-4 text-amber-300" />
                <span>إصدار وتوليد روابط وشُعب المعلمات 🔗</span>
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة تقرير انتشار المبادرة</span>
            </button>
            <button
              onClick={onOpenCreateModal}
              className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إنشاء نسخة صفية جديدة</span>
            </button>
          </div>
        </div>

        {/* Aggregated Public Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl text-center">
            <div className="text-[11px] text-indigo-200 font-medium">النسخ والصفوف المنشأة</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">{totalWorkspaces}</div>
            <div className="text-[10px] text-slate-300">نسخة مستقلة</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl text-center">
            <div className="text-[11px] text-indigo-200 font-medium">الطلاب المستفيدون</div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">{totalStudents}</div>
            <div className="text-[10px] text-slate-300">طالب وطالبة</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl text-center">
            <div className="text-[11px] text-indigo-200 font-medium">إجمالي النجوم الممنوحة</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{totalStars}</div>
            <div className="text-[10px] text-slate-300">نجمة تميز</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl text-center">
            <div className="text-[11px] text-indigo-200 font-medium">شهادات التقدير الصادرة</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">{totalCertificates}</div>
            <div className="text-[10px] text-slate-300">للطلاب وأولياء الأمور</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl text-center col-span-2 sm:col-span-1">
            <div className="text-[11px] text-indigo-200 font-medium">الشواهد والأنشطة الموثقة</div>
            <div className="text-2xl sm:text-3xl font-black text-purple-300 mt-1">{totalAchievements}</div>
            <div className="text-[10px] text-slate-300">إنجاز تربوي</div>
          </div>
        </div>
      </div>

      {/* Share Initiative & Privacy Commitment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Share Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-indigo-950 font-bold">
            <Share2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg">رابط نشر ومشاركة المبادرة مع المعلمات</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            شاركي هذا الرابط مع معلمات الحلقة الأولى في مدرستكِ أو عبر مجموعات الواتساب التربوية. يمكن لكل معلمة فتح الرابط والضغط على <strong>«أنشئي نسختكِ الخاصة لصفكِ»</strong> لبدء استخدام المنصة فوراً.
          </p>
          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-300">
            <input
              type="text"
              readOnly
              value={window.location.origin}
              className="flex-1 bg-transparent text-xs text-slate-700 outline-hidden font-mono px-2 select-all"
            />
            <button
              onClick={handleCopy}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
            </button>
          </div>
          <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>نص مقترح لمشاركته في رسالة الواتساب:</strong>
              <p className="text-[11px] text-amber-800 mt-1 select-all font-sans bg-white/70 p-2 rounded-lg">
                «زميلاتي معلمات الحلقة الأولى 🌷 يسرني إهداءكن منصة (نجوم التميز) الرقمية، مبادرة تربوية متكاملة لتعزيز طلابكن وتنظيم الصف وإصدار شهادات التميز وشكر أولياء الأمور بنقرة زر. أنشئي نسختك الخاصة لصفكِ الآن: {window.location.origin}»
              </p>
            </div>
          </div>
        </div>

        {/* Privacy & Professional Ethics Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-950 font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg">ميثاق الخصوصية وأمان البيانات الصفية</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            حرصاً على الأمانة المهنية وحماية خصوصية الطلاب وأولياء الأمور في مدارس سلطنة عُمان:
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>الفصل التام:</strong> تحفظ بيانات كل معلمة (الأسماء، السلوكيات، الغياب، أرقام الهواتف) في متصفحها وجهازها ولا تتداخل مع أي معلمة أخرى.</span>
            </li>
            <li className="flex items-start gap-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>عدم الوصول التلقائي:</strong> لا تطلع صاحبة المبادرة على أرقام هواتف أو أسماء طلاب المعلمات الأخريات؛ الإحصاءات المعروضة هنا عامة وتراكمية فقط.</span>
            </li>
            <li className="flex items-start gap-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>الملكية الفكرية:</strong> توثيق المبادرة والتصميم باسم <strong>الأستاذة باسمة الحكمانية</strong> ثابت في النظام، بينما تصدر الشهادات باسم المعلمة المستفيدة ومدرستها.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Guidance & Bulletins for Teachers */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-lg font-black text-slate-800">
                إرشادات وتوجيهات صاحبة المبادرة للمعلمات المستفيدات
              </h2>
              <p className="text-xs text-slate-500">
                توجيهات تربوية تظهر للمعلمات في المنصة لدعمهن في إدارة الصف والتعزيز
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddGuidance(!showAddGuidance)}
            className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showAddGuidance ? 'إغلاق النموذج' : 'إضافة إرشاد تربوي جديد'}</span>
          </button>
        </div>

        {/* Add Guidance Form */}
        {showAddGuidance && (
          <form onSubmit={handleCreateGuidance} className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 space-y-3">
            <h3 className="text-xs font-bold text-indigo-900">إضافة توجيه تربوي جديد:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="عنوان الإرشاد التربوي (مثال: طريقة تشجيع الطالب الخجول)..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-indigo-500"
                  required
                />
              </div>
              <div>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-indigo-500"
                >
                  <option value="motivation">تعزيز ودافعية التعلم</option>
                  <option value="classroom_management">إدارة الصف والمجموعات</option>
                  <option value="pedagogy">طرق تدريس وشراكة أسرية</option>
                </select>
              </div>
            </div>
            <div>
              <textarea
                rows={3}
                placeholder="نص التوجيه التربوي الموجه لزميلاتك معلمات الحلقة الأولى..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-indigo-500"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddGuidance(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                نشر التوجيه
              </button>
            </div>
          </form>
        )}

        {/* Existing Guidance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {guidanceList.map((g) => (
            <div key={g.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                  <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                    {g.category === 'motivation' ? 'تحفيز' : g.category === 'classroom_management' ? 'إدارة صفية' : 'شراكة تربوية'}
                  </span>
                  <span>{g.date}</span>
                </div>
                <h4 className="text-xs font-black text-slate-800 mb-1.5">{g.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{g.content}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-indigo-600 font-bold">
                أ. باسمة الحكمانية
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workspaces List in this browser */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-black text-slate-800">
              سجل النسخ والصفوف المسجلة في هذه المنصة
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {workspaces.length} صفوف مسجلة
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="py-2.5 px-3 font-bold">المعلمة المستفيدة</th>
                <th className="py-2.5 px-3 font-bold">المدرسة</th>
                <th className="py-2.5 px-3 font-bold">الصف والشعبة</th>
                <th className="py-2.5 px-3 font-bold">عدد الطلاب</th>
                <th className="py-2.5 px-3 font-bold">العام الدراسي</th>
                <th className="py-2.5 px-3 font-bold">تاريخ الإنشاء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workspaces.map((ws) => (
                <tr key={ws.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-3 font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{ws.teacherName}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{ws.schoolName}</td>
                  <td className="py-3 px-3 font-medium text-indigo-600">{ws.grade} ({ws.section})</td>
                  <td className="py-3 px-3 font-bold text-slate-800">{ws.students.length} طالب</td>
                  <td className="py-3 px-3 text-slate-500">{ws.schoolYear}</td>
                  <td className="py-3 px-3 text-slate-400">{new Date(ws.createdAt).toLocaleDateString('ar-OM')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
