import React, { useState } from 'react';
import { 
  FolderGit2, 
  PlusCircle, 
  Printer, 
  Sparkles, 
  Calendar, 
  Tag, 
  Image as ImageIcon, 
  CheckCircle, 
  Layers, 
  Trash2, 
  FileText,
  School,
  ExternalLink
} from 'lucide-react';
import { TeacherWorkspace, TeacherAchievement, AchievementCategory } from '../types';
import { playChime } from '../utils/storage';

interface TeacherPortfolioViewProps {
  workspace: TeacherWorkspace;
  onUpdateAchievements: (achievements: TeacherAchievement[]) => void;
}

export const TeacherPortfolioView: React.FC<TeacherPortfolioViewProps> = ({
  workspace,
  onUpdateAchievements
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AchievementCategory>('activity');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState('');
  const [learningImpact, setLearningImpact] = useState('');
  const [gradeSection, setGradeSection] = useState(`${workspace.grade} - ${workspace.section}`);
  const [imageUrl, setImageUrl] = useState('');
  const [attachmentsNote, setAttachmentsNote] = useState('');

  const categoriesMap: Record<AchievementCategory, { label: string; color: string }> = {
    initiative: { label: 'مبادرة تعليمية 🌟', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    activity: { label: 'نشاط صفي تفاعلي 🎨', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
    applied_lesson: { label: 'درس تطبيقي 📖', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    worksheet: { label: 'ورقة عمل مبتكرة 📝', color: 'bg-cyan-100 text-cyan-900 border-cyan-300' },
    teaching_aid: { label: 'وسيلة تعليمية مجسمة 🧩', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newAch: TeacherAchievement = {
      id: `ach-${Date.now()}`,
      title: title.trim(),
      category,
      date,
      description: description.trim(),
      objectives: objectives.trim(),
      learningImpact: learningImpact.trim(),
      gradeSection: gradeSection.trim() || `${workspace.grade} - ${workspace.section}`,
      imageUrl: imageUrl.trim() || undefined,
      attachmentsNote: attachmentsNote.trim() || undefined
    };

    onUpdateAchievements([newAch, ...(workspace.achievements || [])]);
    playChime('tada');

    // Reset
    setTitle('');
    setDescription('');
    setObjectives('');
    setLearningImpact('');
    setImageUrl('');
    setAttachmentsNote('');
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكدة من حذف هذا الإنجاز من ملفك؟')) {
      onUpdateAchievements((workspace.achievements || []).filter((a) => a.id !== id));
    }
  };

  const filteredAchievements = (workspace.achievements || []).filter((a) => {
    if (selectedCategoryFilter === 'all') return true;
    return a.category === selectedCategoryFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 shadow-lg flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
            <FolderGit2 className="w-8 h-8 text-teal-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">
                توثيق أعمالي وملف الإنجاز الإلكتروني 📁
              </h2>
              <span className="text-xs bg-teal-900/50 px-2.5 py-0.5 rounded-full font-bold">
                {workspace.achievements?.length || 0} شواهد موثقة
              </span>
            </div>
            <p className="text-xs sm:text-sm text-teal-100 mt-0.5">
              سجل الشواهد والدروس التطبيقية والوسائل التعليمية الخاصة بالمعلمة: <strong>{workspace.teacherName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="bg-white text-teal-900 hover:bg-teal-50 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة ملف الإنجاز الشامل</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-amber-400 text-amber-950 hover:bg-amber-500 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة شاهد أو نشاط جديد</span>
          </button>
        </div>
      </div>

      {/* Printable Portfolio Cover Sheet for Supervisor */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
            <School className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">ملف إنجاز المعلمة المعتمد:</div>
            <div className="text-base sm:text-lg font-black text-slate-800">
              {workspace.teacherName} – {workspace.schoolName}
            </div>
            <div className="text-xs text-indigo-600 font-medium mt-0.5">
              {workspace.grade} ({workspace.section}) | العام الدراسي: {workspace.schoolYear}
            </div>
          </div>
        </div>

        <div className="text-left text-xs text-slate-500 no-print">
          <div>مبادرة: <strong>نجوم التميز لطلاب الحلقة الأولى</strong></div>
          <div className="text-[11px] text-slate-400">إعداد وتصميم: أ. باسمة الحكمانية</div>
        </div>
      </div>

      {/* Filter Tabs (no-print) */}
      <div className="flex flex-wrap items-center gap-2 no-print">
        <button
          onClick={() => setSelectedCategoryFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            selectedCategoryFilter === 'all'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          كل الشواهد ({workspace.achievements?.length || 0})
        </button>

        {Object.entries(categoriesMap).map(([key, item]) => {
          const count = (workspace.achievements || []).filter((a) => a.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategoryFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedCategoryFilter === key
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Achievements Cards Grid */}
      {filteredAchievements.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
          <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">لا توجد أعمال موثقة في هذا التصنيف بعد</h3>
          <p className="text-xs text-slate-500 mt-1">
            اضغطي على «إضافة شاهد أو نشاط جديد» لتوثيق أنشطتكِ ودروسكِ التطبيقية
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAchievements.map((ach) => {
            const cat = categoriesMap[ach.category] || { label: ach.category, color: 'bg-slate-100 text-slate-800' };
            return (
              <div
                key={ach.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${cat.color}`}>
                      {cat.label}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {ach.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ach.date}</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <span className="font-medium text-indigo-600">{ach.gradeSection}</span>
                    <button
                      onClick={() => handleDelete(ach.id)}
                      className="text-slate-300 hover:text-rose-500 p-1 no-print transition-colors"
                      title="حذف هذا الشاهد"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
                  {/* Text details */}
                  <div className={ach.imageUrl ? 'md:col-span-8 space-y-3' : 'md:col-span-12 space-y-3'}>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 mb-0.5">وصف النشاط والآلية:</h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {ach.description}
                      </p>
                    </div>

                    {ach.objectives && (
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <h4 className="text-xs font-bold text-teal-800 mb-0.5">الأهداف التربوية المحققة:</h4>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {ach.objectives}
                        </p>
                      </div>
                    )}

                    {ach.learningImpact && (
                      <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100">
                        <h4 className="text-xs font-bold text-emerald-900 mb-0.5">أثر النشاط على تعلم وسلوك الطلاب:</h4>
                        <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                          {ach.learningImpact}
                        </p>
                      </div>
                    )}

                    {ach.attachmentsNote && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>ملاحظات المرفقات والشواهد: {ach.attachmentsNote}</span>
                      </div>
                    )}
                  </div>

                  {/* Image Preview if provided */}
                  {ach.imageUrl && (
                    <div className="md:col-span-4">
                      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs max-h-56 bg-slate-100 flex items-center justify-center">
                        <img
                          src={ach.imageUrl}
                          alt={ach.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Achievement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 my-auto animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-black text-slate-900">
                  توثيق شاهد جديد في ملف الإنجاز
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  عنوان العمل / الشاهد *
                </label>
                <input
                  type="text"
                  placeholder="مثال: تطبيق استراتيجية قطار الكلمات لطلاب الصف الثاني..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-teal-500 outline-hidden font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    تصنيف الشاهد *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium"
                  >
                    <option value="activity">نشاط صفي تفاعلي</option>
                    <option value="applied_lesson">درس تطبيقي</option>
                    <option value="initiative">مبادرة تعليمية</option>
                    <option value="teaching_aid">وسيلة تعليمية مجسمة</option>
                    <option value="worksheet">ورقة عمل مبتكرة</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    تاريخ التنفيذ *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    الصف والشعبة
                  </label>
                  <input
                    type="text"
                    value={gradeSection}
                    onChange={(e) => setGradeSection(e.target.value)}
                    placeholder="الصف الثاني - شعبة 1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  وصف النشاط وإجراءات تنفيذه *
                </label>
                <textarea
                  rows={3}
                  placeholder="اشرحي بالتفصيل خطوات تنفيذ النشاط والأدوات المستخدمة..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 outline-hidden font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    الأهداف التربوية المستهدفة:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="مثال: تنمية مهارات القراءة السريعة والتمييز البصري..."
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    أثر النشاط على تعلم وسلوك الطلاب:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="مثال: ارتفاع درجات إتقان الطلاب بنسبة 85% وزيادة التفاعل..."
                    value={learningImpact}
                    onChange={(e) => setLearningImpact(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  رابط صورة الشاهد أو الوسيلة (اختياري):
                </label>
                <input
                  type="text"
                  placeholder="https://... أو يمكنك لصق رابط صورة مباشرة"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2 rounded-xl shadow-md cursor-pointer"
                >
                  حفظ الشاهد في ملف الإنجاز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
