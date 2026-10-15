import React, { useState } from 'react';
import { 
  CheckSquare, 
  PlusCircle, 
  Calendar, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Users, 
  MessageCircle, 
  Printer, 
  Trash2, 
  Edit3, 
  BookOpen, 
  Award, 
  Check, 
  X, 
  AlertCircle,
  Share2
} from 'lucide-react';
import { TeacherWorkspace, Student, ClassTask, TaskStatus } from '../types';
import confetti from 'canvas-confetti';
import { playChime } from '../utils/storage';

interface ClassTasksViewProps {
  workspace: TeacherWorkspace;
  onUpdateTasks: (updatedTasks: ClassTask[]) => void;
  onUpdateStudents: (updatedStudents: Student[]) => void;
}

export const ClassTasksView: React.FC<ClassTasksViewProps> = ({
  workspace,
  onUpdateTasks,
  onUpdateStudents,
}) => {
  const tasks = workspace.tasks || [];
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTrackingTask, setActiveTrackingTask] = useState<ClassTask | null>(null);

  // New Task Form
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('اللغة العربية');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [rewardStars, setRewardStars] = useState(2);

  const defaultSubjectNames = [
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

  const currentSubjectNames = (workspace.availableSubjects && workspace.availableSubjects.length > 0)
    ? workspace.availableSubjects
    : defaultSubjectNames;

  const colorPalettes = [
    'bg-emerald-100 text-emerald-800 border-emerald-300',
    'bg-amber-100 text-amber-900 border-amber-300',
    'bg-indigo-100 text-indigo-800 border-indigo-300',
    'bg-cyan-100 text-cyan-800 border-cyan-300',
    'bg-orange-100 text-orange-800 border-orange-300',
    'bg-pink-100 text-pink-800 border-pink-300',
    'bg-purple-100 text-purple-800 border-purple-300',
    'bg-rose-100 text-rose-800 border-rose-300',
    'bg-teal-100 text-teal-800 border-teal-300',
    'bg-yellow-100 text-yellow-900 border-yellow-300',
  ];

  const subjects = currentSubjectNames.map((name, i) => ({
    name,
    color: colorPalettes[i % colorPalettes.length]
  }));

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: ClassTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      subject,
      description: description.trim(),
      dueDate,
      rewardStars: Number(rewardStars) || 2,
      rewardPoints: (Number(rewardStars) || 2) * 5,
      submissions: {},
      createdAt: new Date().toISOString()
    };

    onUpdateTasks([newTask, ...tasks]);
    playChime('tada');
    confetti({ particleCount: 50, spread: 60 });

    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('هل أنتِ متأكدة من حذف هذه المهمة الدراسية؟')) {
      onUpdateTasks(tasks.filter((t) => t.id !== taskId));
      if (activeTrackingTask?.id === taskId) {
        setActiveTrackingTask(null);
      }
    }
  };

  // Set student submission status
  const handleSetStudentTaskStatus = (
    task: ClassTask,
    studentId: string,
    newStatus: TaskStatus
  ) => {
    const prevStatus = task.submissions[studentId] || 'pending';
    const updatedSubmissions = {
      ...task.submissions,
      [studentId]: newStatus
    };

    const updatedTask = {
      ...task,
      submissions: updatedSubmissions
    };

    const updatedTasksList = tasks.map((t) => (t.id === task.id ? updatedTask : t));
    onUpdateTasks(updatedTasksList);
    setActiveTrackingTask(updatedTask);

    // If marked as completed or distinction, award stars to student!
    if (
      (newStatus === 'completed' || newStatus === 'completed_distinction') &&
      prevStatus !== 'completed' &&
      prevStatus !== 'completed_distinction'
    ) {
      const addedStars = newStatus === 'completed_distinction' ? task.rewardStars + 1 : task.rewardStars;
      const addedPoints = addedStars * 5;

      const updatedStudents = workspace.students.map((st) => {
        if (st.id === studentId) {
          return {
            ...st,
            stars: st.stars + addedStars,
            points: st.points + addedPoints,
            lastAwardedReason: `إنجاز مهمة: ${task.title}`
          };
        }
        return st;
      });

      onUpdateStudents(updatedStudents);
      playChime('star');
      confetti({ particleCount: 35, spread: 50 });
    }
  };

  // Mark all students as completed for a task
  const handleMarkAllCompleted = (task: ClassTask) => {
    const newSubmissions: Record<string, TaskStatus> = {};
    workspace.students.forEach((st) => {
      newSubmissions[st.id] = 'completed';
    });

    const updatedTask = {
      ...task,
      submissions: newSubmissions
    };

    const updatedTasksList = tasks.map((t) => (t.id === task.id ? updatedTask : t));
    onUpdateTasks(updatedTasksList);
    setActiveTrackingTask(updatedTask);

    // Award stars to all students who hadn't completed it
    const updatedStudents = workspace.students.map((st) => {
      const prev = task.submissions[st.id];
      if (prev !== 'completed' && prev !== 'completed_distinction') {
        return {
          ...st,
          stars: st.stars + task.rewardStars,
          points: st.points + task.rewardPoints,
          lastAwardedReason: `إنجاز جماعي لمهمة: ${task.title}`
        };
      }
      return st;
    });

    onUpdateStudents(updatedStudents);
    playChime('tada');
    confetti({ particleCount: 90, spread: 80 });
  };

  // WhatsApp reminder for pending students
  const handleSendWhatsAppReminder = (task: ClassTask, student: Student) => {
    const cleanPhone = (student.parentPhone || '').replace(/\D/g, '');
    const message = `السلام عليكم ورحمة الله وبركاته 🌸
تحية طيبة من ${workspace.schoolName}،
معلمة الصف: ${workspace.teacherName}

نود تذكيركم بموعد تسليم المهمة الدراسية للطالب المتميز (${student.name}):
📌 المادة: ${task.subject}
📝 المهمة: ${task.title}
📅 موعد التسليم: ${task.dueDate}
⭐ المكافأة: ${task.rewardStars} نجوم تميز في المنصة!

شاكرين لكم عظيم حرصكم ومتابعتكم المنزلية الكريمة،،
منصة «نجوم التميز» – إعداد: أ. باسمة الحكمانية`;

    const encoded = encodeURIComponent(message);
    const targetUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encoded}` 
      : `https://wa.me/?text=${encoded}`;
    
    window.open(targetUrl, '_blank');
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedSubjectFilter === 'all') return true;
    return t.subject === selectedSubjectFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 text-white rounded-3xl p-6 shadow-lg flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
            <CheckSquare className="w-8 h-8 text-cyan-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">
                المهام والواجبات الدراسية 📝
              </h2>
              <span className="text-xs bg-blue-900/50 px-2.5 py-0.5 rounded-full font-bold">
                {tasks.length} مهام مسجلة
              </span>
            </div>
            <p className="text-xs sm:text-sm text-cyan-100 mt-0.5">
              تنظيم الواجبات الصفية والمنزلية، ورصد تسليم الطلاب، ومكافأة الملتزمين بنجوم التميز
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => window.print()}
            className="bg-white text-indigo-950 hover:bg-indigo-50 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة جدول المهام</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة مهمة دراسية جديدة</span>
          </button>
        </div>
      </div>

      {/* Printable Classroom Homework Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 print:border-0 print:m-0">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase">
            سجل متابعة المهام والواجبات المدرسية
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-800">
            {workspace.schoolName} – {workspace.grade} (شعبة {workspace.section})
          </h3>
          <p className="text-xs text-indigo-600 font-medium">
            المعلمة: {workspace.teacherName} | العام الدراسي: {workspace.schoolYear}
          </p>
        </div>

        <div className="text-left text-xs text-slate-500 no-print">
          <div>مبادرة: <strong>«نجوم التميز» لطلاب الحلقة الأولى</strong></div>
          <div className="text-[11px] text-slate-400">إعداد وتصميم: أ. باسمة الحكمانية</div>
        </div>
      </div>

      {/* Subject Filter Bar (no-print) */}
      <div className="flex flex-wrap items-center gap-2 no-print">
        <button
          onClick={() => setSelectedSubjectFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            selectedSubjectFilter === 'all'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          كل المواد ({tasks.length})
        </button>

        {subjects.map((sub) => {
          const count = tasks.filter((t) => t.subject === sub.name).length;
          return (
            <button
              key={sub.name}
              onClick={() => setSelectedSubjectFilter(sub.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedSubjectFilter === sub.name
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {sub.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">لا توجد مهام دراسية في هذا التصنيف</h3>
          <p className="text-xs text-slate-500 mt-1">
            اضغطي على «إضافة مهمة دراسية جديدة» لتكليف طلاب الصف بواجب قراءة أو حفظ أو نشاط
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((task) => {
            const subBadge = subjects.find((s) => s.name === task.subject) || {
              color: 'bg-slate-100 text-slate-800 border-slate-200'
            };

            // Calculate completed count
            const completedCount = workspace.students.filter(
              (st) =>
                task.submissions[st.id] === 'completed' ||
                task.submissions[st.id] === 'completed_distinction'
            ).length;
            const completionPercent = workspace.students.length > 0
              ? Math.round((completedCount / workspace.students.length) * 100)
              : 0;

            const isDueSoon = new Date(task.dueDate) <= new Date(Date.now() + 86400000);

            return (
              <div
                key={task.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-400 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Subject and Due Date header */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${subBadge.color}`}>
                      {task.subject}
                    </span>

                    <span className={`text-xs font-bold flex items-center gap-1 ${
                      isDueSoon ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200' : 'text-slate-400'
                    }`}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>تسليم: {task.dueDate}</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Reward Stars */}
                  <div className="mt-3 flex items-center justify-between text-xs bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                    <span className="text-amber-900 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>مكافأة الإنجاز:</span>
                    </span>
                    <span className="font-black text-amber-800">
                      +{task.rewardStars} نجوم ({task.rewardPoints} نقطة)
                    </span>
                  </div>

                  {/* Completion Progress Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>نسبة الإنجاز بالصف:</span>
                      <span className="text-indigo-600">
                        {completedCount} من {workspace.students.length} ({completionPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Bottom Actions (no-print) */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 no-print">
                  <button
                    onClick={() => setActiveTrackingTask(task)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>رصد تسليم الطلاب</span>
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="حذف المهمة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Student Tracking Modal */}
      {activeTrackingTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-3xl w-full shadow-2xl border border-indigo-100 my-auto animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full">
                  {activeTrackingTask.subject}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  رصد تسليم مهمة: {activeTrackingTask.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  موعد التسليم: {activeTrackingTask.dueDate} | مكافأة الإنجاز: +{activeTrackingTask.rewardStars} نجوم
                </p>
              </div>

              <button
                onClick={() => setActiveTrackingTask(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Bulk Action */}
            <div className="my-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-slate-600 font-bold">
                إجراء سريع لجميع طلاب الصف:
              </span>
              <button
                onClick={() => handleMarkAllCompleted(activeTrackingTask)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>الجميع أتم الواجب بنجاح (+النجوم للجميع) ⭐</span>
              </button>
            </div>

            {/* Students List in Tracker */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {workspace.students.map((student) => {
                const status = activeTrackingTask.submissions[student.id] || 'pending';

                return (
                  <div
                    key={student.id}
                    className="p-3 rounded-2xl border border-slate-200 hover:border-indigo-200 flex flex-wrap items-center justify-between gap-3 bg-white transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{student.avatar}</span>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-900">
                          {student.name}
                        </div>
                        <div className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                          <span>رصيده: {student.stars} ⭐</span>
                          {student.parentName && (
                            <span className="text-slate-400">• {student.parentName}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Distinction Button */}
                      <button
                        onClick={() =>
                          handleSetStudentTaskStatus(
                            activeTrackingTask,
                            student.id,
                            'completed_distinction'
                          )
                        }
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          status === 'completed_distinction'
                            ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-500 font-black'
                            : 'bg-slate-100 text-slate-600 hover:bg-amber-50'
                        }`}
                        title="أتم الواجب بتميز وإتقان استثنائي (+نجمة إضافية)"
                      >
                        🌟 تميز
                      </button>

                      {/* Completed Button */}
                      <button
                        onClick={() =>
                          handleSetStudentTaskStatus(
                            activeTrackingTask,
                            student.id,
                            'completed'
                          )
                        }
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          status === 'completed'
                            ? 'bg-emerald-600 text-white ring-2 ring-emerald-500'
                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
                        }`}
                      >
                        ✅ مُنجز
                      </button>

                      {/* Pending Button */}
                      <button
                        onClick={() =>
                          handleSetStudentTaskStatus(
                            activeTrackingTask,
                            student.id,
                            'pending'
                          )
                        }
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          status === 'pending'
                            ? 'bg-rose-100 text-rose-800 ring-2 ring-rose-400'
                            : 'bg-slate-100 text-slate-500 hover:bg-rose-50'
                        }`}
                      >
                        ⏳ معلق
                      </button>

                      {/* WhatsApp reminder button if pending */}
                      {status === 'pending' && (
                        <button
                          onClick={() =>
                            handleSendWhatsAppReminder(activeTrackingTask, student)
                          }
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors cursor-pointer"
                          title="إرسال تذكير بالواجب لولي الأمر عبر الواتساب"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveTrackingTask(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                حفظ وإغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900">
                  إضافة مهمة أو واجب دراسي جديد
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان المهمة أو الواجب *</label>
                <input
                  type="text"
                  placeholder="مثال: قراءة درس الأمانة ص 32 مع ضبط الحركات..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-500 outline-hidden font-medium text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المادة الدراسية *</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.name} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">تاريخ الاستحقاق والتسليم *</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">تعليمات وتوجيهات لولي الأمر والطلاب:</label>
                <textarea
                  rows={3}
                  placeholder="اكتبي توجيهات حل الواجب أو كيفية مساعدة ولي الأمر للطفل..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-indigo-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">مكافأة إنجاز المهمة (نجوم التميز):</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRewardStars(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        rewardStars === num
                          ? 'bg-amber-400 text-amber-950 border-amber-500 ring-2 ring-amber-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      +{num} ⭐ ({num * 5} نقطة)
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-xl shadow-md cursor-pointer"
                >
                  نشر المهمة للصف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
