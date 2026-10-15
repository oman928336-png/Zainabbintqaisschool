import React, { useState } from 'react';
import { 
  Sliders, 
  School, 
  BookOpen, 
  Layers, 
  Trash2, 
  Plus, 
  Save, 
  Check, 
  Download, 
  Upload, 
  AlertTriangle, 
  ShieldCheck, 
  RotateCcw, 
  Users, 
  Star, 
  CalendarCheck, 
  CheckSquare, 
  Award, 
  FolderGit2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { TeacherWorkspace, Student } from '../types';
import { exportWorkspaceJSON, playChime } from '../utils/storage';
import confetti from 'canvas-confetti';

interface MasterControlViewProps {
  workspace: TeacherWorkspace;
  onUpdateWorkspace: (updated: Partial<TeacherWorkspace>) => void;
  onImportWorkspace: (importedWorkspace: TeacherWorkspace) => void;
  onDeleteCurrentWorkspace: () => void;
}

export const MasterControlView: React.FC<MasterControlViewProps> = ({
  workspace,
  onUpdateWorkspace,
  onImportWorkspace,
  onDeleteCurrentWorkspace
}) => {
  // Master Profile Fields
  const [teacherName, setTeacherName] = useState(workspace.teacherName);
  const [schoolName, setSchoolName] = useState(workspace.schoolName);
  const [grade, setGrade] = useState(workspace.grade);
  const [activeSection, setActiveSection] = useState(workspace.section);
  const [schoolYear, setSchoolYear] = useState(workspace.schoolYear || '2026 / 2027 م');
  const [schoolLogo, setSchoolLogo] = useState(workspace.schoolLogo || '');
  const [themeColor, setThemeColor] = useState(workspace.themeColor || '#4f46e5');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sections Management
  const currentSections = workspace.availableSections && workspace.availableSections.length > 0 
    ? workspace.availableSections 
    : ['1', '2', '3', '4'];
  const [newSectionInput, setNewSectionInput] = useState('');

  // Subjects Management
  const defaultSubjects = [
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
  ];
  const currentSubjects = workspace.availableSubjects && workspace.availableSubjects.length > 0
    ? workspace.availableSubjects
    : defaultSubjects;
  const [newSubjectInput, setNewSubjectInput] = useState('');

  // Save General Settings
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWorkspace({
      teacherName: teacherName.trim(),
      schoolName: schoolName.trim(),
      grade,
      section: activeSection.trim(),
      schoolYear: schoolYear.trim(),
      schoolLogo: schoolLogo.trim() || undefined,
      themeColor,
      updatedAt: new Date().toISOString()
    });

    playChime('star');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Add Section
  const handleAddSection = () => {
    const trimmed = newSectionInput.trim();
    if (!trimmed) return;
    if (currentSections.includes(trimmed)) {
      alert('هذه الشعبة موجودة بالفعل');
      return;
    }
    const updated = [...currentSections, trimmed];
    onUpdateWorkspace({ availableSections: updated });
    setNewSectionInput('');
    playChime('star');
  };

  // Delete Section
  const handleDeleteSection = (sec: string) => {
    if (currentSections.length <= 1) {
      alert('يجب أن تحتوي المنصة على شعبة واحدة على الأقل');
      return;
    }
    if (confirm(`هل أنتِ متأكدة من حذف (شعبة ${sec})؟`)) {
      const updated = currentSections.filter((s) => s !== sec);
      const nextActive = activeSection === sec ? updated[0] : activeSection;
      onUpdateWorkspace({
        availableSections: updated,
        section: nextActive
      });
      setActiveSection(nextActive);
      playChime('attendance');
    }
  };

  // Switch Active Section
  const handleSwitchActiveSection = (sec: string) => {
    setActiveSection(sec);
    onUpdateWorkspace({ section: sec });
    playChime('star');
  };

  // Add Subject
  const handleAddSubject = () => {
    const trimmed = newSubjectInput.trim();
    if (!trimmed) return;
    if (currentSubjects.includes(trimmed)) {
      alert('هذه المادة موجودة مسبقاً في القائمة');
      return;
    }
    const updated = [...currentSubjects, trimmed];
    onUpdateWorkspace({ availableSubjects: updated });
    setNewSubjectInput('');
    playChime('tada');
  };

  // Delete Subject
  const handleDeleteSubject = (subj: string) => {
    if (currentSubjects.length <= 1) {
      alert('يجب الإبقاء على مادة دراسية واحدة على الأقل');
      return;
    }
    if (confirm(`هل أنتِ متأكدة من حذف مادة (${subj})؟`)) {
      const updated = currentSubjects.filter((s) => s !== subj);
      onUpdateWorkspace({ availableSubjects: updated });
      playChime('attendance');
    }
  };

  // --- Master Delete & Reset Operations ---

  // 1. Reset all student stars & points to 0 (for new term)
  const handleResetAllStars = () => {
    if (confirm('هل أنتِ متأكدة من تصفير نجوم ونقاط جميع طلاب الصف لبدء فصل دراسي جديد؟ (ستبقى أسماء الطلاب كما هي)')) {
      const updated = workspace.students.map((st) => ({
        ...st,
        stars: 0,
        points: 0,
        lastAwardedReason: 'بدء دورة تعزيز جديدة للعام الدراسي 2026/2027م'
      }));
      onUpdateWorkspace({ students: updated });
      playChime('tada');
      alert('تم تصفير نجوم ونقاط جميع الطلاب بنجاح!');
    }
  };

  // 2. Delete all students
  const handleDeleteAllStudents = () => {
    if (confirm('تحذير: هل أنتِ متأكدة من حذف كافة طلاب الصف؟ سيتم تفريغ قائمة الأسماء بالكامل.')) {
      if (confirm('تأكيد نهائي: هل ترغبين فعلاً بحذف جميع الطلاب؟')) {
        onUpdateWorkspace({ students: [] });
        playChime('attendance');
        alert('تم تفريغ قائمة الطلاب بالكامل.');
      }
    }
  };

  // 3. Clear all attendance records
  const handleClearAttendance = () => {
    if (confirm('هل ترغبين في مسح سجل الحضور والغياب بالكامل لبدء رصد جديد؟')) {
      onUpdateWorkspace({ attendance: [] });
      playChime('attendance');
      alert('تم مسح سجل الحضور والغياب.');
    }
  };

  // 4. Clear all class tasks
  const handleClearTasks = () => {
    if (confirm('هل ترغبين في حذف جميع المهام والواجبات الدراسية المسجلة؟')) {
      onUpdateWorkspace({ tasks: [] });
      playChime('attendance');
      alert('تم حذف جميع المهام الدراسية.');
    }
  };

  // 5. Clear all groups points
  const handleResetGroupPoints = () => {
    if (confirm('هل ترغبين في تصفير نقاط المجموعات الصفية؟')) {
      const updated = workspace.groups.map((g) => ({ ...g, points: 0 }));
      onUpdateWorkspace({ groups: updated });
      playChime('tada');
      alert('تم تصفير نقاط المجموعات الصفية.');
    }
  };

  // 6. Delete all certificates
  const handleClearCertificates = () => {
    if (confirm('هل أنتِ متأكدة من مسح أرشيف شهادات التقدير (شهادات الطلاب وشكر أولياء الأمور)؟')) {
      onUpdateWorkspace({
        studentCertificates: [],
        parentCertificates: []
      });
      playChime('attendance');
      alert('تم مسح أرشيف الشهادات.');
    }
  };

  // 7. Clear portfolio achievements
  const handleClearPortfolio = () => {
    if (confirm('هل ترغبين في مسح شواهد ملف الإنجاز (توثيق أعمالي)؟')) {
      onUpdateWorkspace({ achievements: [] });
      playChime('attendance');
      alert('تم مسح شواهد ملف الإنجاز.');
    }
  };

  // Backup file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.id && parsed.teacherName && Array.isArray(parsed.students)) {
          onImportWorkspace(parsed);
          playChime('tada');
          alert('تم استيراد نسخة الصف بنجاح!');
        } else {
          alert('الملف المحدد غير صالح كنسخة لمنصة نجوم التميز');
        }
      } catch {
        alert('حدث خطأ أثناء قراءة الملف، تأكدي من سلامة ملف JSON');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-md">
              <Sliders className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full">
                  العام الدراسي: {schoolYear}
                </span>
                <span className="text-xs text-indigo-200">
                  لوحة التحكم الشاملة
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                مركز التعديل الشامل، الحذف، وإدارة الشُعب والمواد ⚙️
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200 mt-0.5">
                تعديل وتخصيص كل بيانات الصف، وإضافة شُعب جديدة، وإدارة المواد الدراسية، والتصفير الآمن
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => {
                exportWorkspaceJSON(workspace);
                playChime('tada');
              }}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تنزيل نسخة احتياطية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: إدارة الشُعب الصفية (Sections Management) */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">
                إدارة الشُعب الصفية (إضافة وحذف وتبديل الشُعب)
              </h3>
              <p className="text-xs text-slate-500">
                أضيفي الشُعب التي تدرّسينها وتنقلي بينها بحرية
              </p>
            </div>
          </div>

          <div className="text-xs font-bold bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-xl border border-indigo-200">
            الشعبة النشطة حالياً: <strong>شعبة {activeSection}</strong>
          </div>
        </div>

        {/* Add new section */}
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            placeholder="اكتبي رقم أو اسم الشعبة الجديدة (مثال: 5، أو 2/3، أو أ)..."
            value={newSectionInput}
            onChange={(e) => setNewSectionInput(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-indigo-500 outline-hidden font-medium"
          />
          <button
            onClick={handleAddSection}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة شعبة</span>
          </button>
        </div>

        {/* Existing Sections List */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-2">
          {currentSections.map((sec) => {
            const isActive = activeSection === sec;
            return (
              <div
                key={sec}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div>
                  <span className="text-[10px] text-slate-400 font-bold">شعبة</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{sec}</div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between gap-1">
                  {!isActive ? (
                    <button
                      onClick={() => handleSwitchActiveSection(sec)}
                      className="text-[11px] font-bold text-indigo-600 hover:underline flex-1 text-right"
                    >
                      تفعيل
                    </button>
                  ) : (
                    <span className="text-[11px] font-black text-emerald-600 flex-1 text-right">
                      نشطة ✓
                    </span>
                  )}

                  <button
                    onClick={() => handleDeleteSection(sec)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="حذف هذه الشعبة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: إدارة المواد الدراسية (Subjects Management) */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">
                إدارة وإضافة المواد الدراسية (قائمة مواد الصف)
              </h3>
              <p className="text-xs text-slate-500">
                أضيفي مواد جديدة تظهر تلقائياً في خانة المهام الدراسية والشهادات
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-400">
            {currentSubjects.length} مواد مسجلة
          </span>
        </div>

        {/* Add Subject Input */}
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            placeholder="اكتبي اسم المادة الجديدة (مثال: المهارات الموسيقية، تقنية المعلومات)..."
            value={newSubjectInput}
            onChange={(e) => setNewSubjectInput(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-emerald-500 outline-hidden font-medium"
          />
          <button
            onClick={handleAddSubject}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مادة</span>
          </button>
        </div>

        {/* Subjects Tags Grid */}
        <div className="flex flex-wrap gap-2 pt-2">
          {currentSubjects.map((subj) => (
            <div
              key={subj}
              className="bg-slate-50 border border-slate-200 hover:border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-2 transition-colors"
            >
              <span>{subj}</span>
              <button
                onClick={() => handleDeleteSubject(subj)}
                className="text-slate-400 hover:text-rose-500 transition-colors"
                title={`حذف مادة ${subj}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: تعديل البيانات الأساسية (Basic Info Editing) */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800">
              تعديل بيانات المعلمة والمدرسة والعام الدراسي
            </h3>
            <p className="text-xs text-slate-500">
              تعديل المسميات الرسمية التي تظهر في الشهادات ولوحة النجوم
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* School Year (2026/2027) */}
            <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200">
              <label className="block font-black text-amber-950 mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>العام الدراسي المعتمد *</span>
              </label>
              <input
                type="text"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                placeholder="2026 / 2027 م"
                className="w-full px-3 py-2 border border-amber-300 rounded-xl bg-white text-sm font-bold text-amber-950 focus:border-amber-500 outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم المعلمة المستفيدة *</label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم المدرسة *</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">الصف</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-sm font-medium"
              >
                <option value="الصف الأول الأساسي">الصف الأول الأساسي</option>
                <option value="الصف الثاني الأساسي">الصف الثاني الأساسي</option>
                <option value="الصف الثالث الأساسي">الصف الثالث الأساسي</option>
                <option value="الصف الرابع الأساسي">الصف الرابع الأساسي</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">الشعبة النشطة</label>
              <input
                type="text"
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">رابط الشعار المخصص (اختياري)</label>
              <input
                type="text"
                value={schoolLogo}
                onChange={(e) => setSchoolLogo(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium"
              />
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'تم حفظ التعديلات بنجاح!' : 'حفظ التعديلات الأساسية'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section 4: مركز الحذف والتصفير الشامل لكل شيء (Master Delete & Reset Hub) */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-rose-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-rose-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-rose-950">
              مركز الحذف والتصفير السريع لعناصر الصف
            </h3>
            <p className="text-xs text-rose-600">
              إجراءات سريعة لتصفير النجوم أو مسح السجلات القديمة مع رسائل تأكيد آمنة
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-1">
          
          {/* Reset All Stars */}
          <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-600" />
                <span>تصفير نجوم ونقاط الطلاب</span>
              </div>
              <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                تصفير رصيد النجوم لكافة الطلاب لبدء فصل دراسي جديد (مع الاحتفاظ بالأسماء).
              </p>
            </div>
            <button
              onClick={handleResetAllStars}
              className="mt-3 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تصفير النجوم للجميع</span>
            </button>
          </div>

          {/* Delete All Students */}
          <div className="bg-rose-50/60 border border-rose-200 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="text-xs font-black text-rose-950 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-rose-600" />
                <span>حذف جميع طلاب الصف ({workspace.students.length})</span>
              </div>
              <p className="text-[11px] text-rose-800 mt-1 leading-relaxed">
                تفريغ قائمة الطلاب بالكامل لإدخال دفعة جديدة من الطلاب.
              </p>
            </div>
            <button
              onClick={handleDeleteAllStudents}
              className="mt-3 bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف كافة الطلاب</span>
            </button>
          </div>

          {/* Clear Attendance */}
          <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                <span>مسح سجل الحضور والغياب</span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                مسح كل سجلات الحضور السابقة لبدء دورة رصد جديدة.
              </p>
            </div>
            <button
              onClick={handleClearAttendance}
              className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح الحضور</span>
            </button>
          </div>

          {/* Clear Tasks */}
          <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <span>حذف جميع المهام الدراسية</span>
              </div>
              <p className="text-[11px] text-blue-800 mt-1 leading-relaxed">
                حذف قائمة الواجبات والمهام المدرسية المسجلة ({workspace.tasks?.length || 0} مهام).
              </p>
            </div>
            <button
              onClick={handleClearTasks}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف كافة المهام</span>
            </button>
          </div>

          {/* Reset Group Points */}
          <div className="bg-purple-50/60 border border-purple-200 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>تصفير نقاط المجموعات الصفية</span>
              </div>
              <p className="text-[11px] text-purple-800 mt-1 leading-relaxed">
                إعادة نقاط كافة مجموعات التعلم التعاوني إلى 0 نقاط.
              </p>
            </div>
            <button
              onClick={handleResetGroupPoints}
              className="mt-3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تصفير نقاط المجموعات</span>
            </button>
          </div>

          {/* Clear Certificates */}
          <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>مسح أرشيف الشهادات</span>
              </div>
              <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                مسح شهادات التميز وشهادات شكر أولياء الأمور السابقة.
              </p>
            </div>
            <button
              onClick={handleClearCertificates}
              className="mt-3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح الشهادات</span>
            </button>
          </div>

        </div>
      </div>

      {/* Section 5: النسخ الاحتياطي والاستيراد وحذف النسخة الصفية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Export JSON */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-950 font-bold">
            <Download className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-black">تنزيل نسخة احتياطية من كافة البيانات</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            تنزيل ملف رقمي مستقل (.json) لحفظ بيانات الشعب والمواد والطلاب ونقلها لأي جهاز آخر.
          </p>
          <button
            onClick={() => {
              exportWorkspaceJSON(workspace);
              playChime('tada');
            }}
            className="w-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-300 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل ملف النسخة الاحتياطية (JSON)</span>
          </button>
        </div>

        {/* Import JSON */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-950 font-bold">
            <Upload className="w-5 h-5 text-emerald-600" />
            <h4 className="text-sm font-black">استيراد نسخة صفية سابقة</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            استعادة كافة البيانات من ملف JSON تم تنزيله مسبقاً بنقرة واحدة.
          </p>
          <label className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-emerald-300 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>اختيار ملف JSON واستعادته</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Delete Workspace Entirely */}
      <div className="border border-rose-200 bg-rose-50/40 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-rose-900">حذف هذه النسخة الصفية بالكامل</div>
          <div className="text-[11px] text-rose-700 mt-0.5">
            سيؤدي هذا لحذف مساحة العمل هذه من المتصفح (تأكدي من تنزيل نسخة احتياطية أولاً).
          </div>
        </div>
        <button
          onClick={onDeleteCurrentWorkspace}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>حذف النسخة الحالية</span>
        </button>
      </div>

    </div>
  );
};
