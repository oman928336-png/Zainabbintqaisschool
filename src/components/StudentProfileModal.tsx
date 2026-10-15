import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Award, 
  CalendarCheck, 
  CheckSquare, 
  Printer, 
  MessageCircle, 
  Phone, 
  User, 
  Sparkles, 
  Check, 
  FileText,
  Crown,
  Heart
} from 'lucide-react';
import { Student, TeacherWorkspace } from '../types';
import { playChime } from '../utils/storage';

interface StudentProfileModalProps {
  student: Student;
  workspace: TeacherWorkspace;
  onClose: () => void;
  onUpdateStudent: (updatedStudent: Student) => void;
  onGoToCertificates: (studentId: string) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  workspace,
  onClose,
  onUpdateStudent,
  onGoToCertificates
}) => {
  const [notes, setNotes] = useState(student.notes || '');
  const [savedNotes, setSavedNotes] = useState(false);

  // Calculate attendance stats for this student
  const studentAttendance = (workspace.attendance || []).filter((a) => a.studentId === student.id);
  const presentDays = studentAttendance.filter((a) => a.status === 'present').length;
  const absentDays = studentAttendance.filter((a) => a.status === 'absent').length;
  const lateDays = studentAttendance.filter((a) => a.status === 'late').length;
  const totalRecordedDays = studentAttendance.length;
  const attendanceRate = totalRecordedDays > 0 ? Math.round((presentDays / totalRecordedDays) * 100) : 100;

  // Calculate homework / tasks stats
  const allTasks = workspace.tasks || [];
  const completedTasks = allTasks.filter(
    (t) => t.submissions[student.id] === 'completed' || t.submissions[student.id] === 'completed_distinction'
  ).length;
  const tasksRate = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 100;

  // Calculate rank
  const sortedStudents = [...workspace.students].sort((a, b) => b.stars - a.stars);
  const rank = sortedStudents.findIndex((s) => s.id === student.id) + 1;

  const handleSaveNotes = () => {
    onUpdateStudent({
      ...student,
      notes: notes.trim()
    });
    setSavedNotes(true);
    playChime('star');
    setTimeout(() => setSavedNotes(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const cleanPhone = (student.parentPhone || '').replace(/\D/g, '');
    const message = `السلام عليكم ورحمة الله وبركاته 🌸
الفاضل ولي أمر الطالب المتميز (${student.name}) المحترم،
تحية طيبة من ${workspace.schoolName}،
معلمة الصف: ${workspace.teacherName}

يسعدنا مشاركتكم تقرير إنجاز الطالب في منصة «نجوم التميز» لهذا الأسبوع:
⭐ رصيد النجوم: ${student.stars} نجمة تميز (المركز ${rank} بالصف)
🏆 إجمالي النقاط: ${student.points} نقطة
📅 نسبة الحضور والانضباط: ${attendanceRate}%
📝 نسبة إنجاز الواجبات: ${tasksRate}% (${completedTasks} من ${allTasks.length} مهام)
🎖️ الأوسمة الحاصل عليها: ${(student.badges || []).join('، ') || 'طالب متميز'}

شاكرين لكم عظيم اهتمامكم ومتابعتكم المستمرة،،
منصة «نجوم التميز» – إعداد وتصميم: أ. باسمة الحكمانية`;

    const encoded = encodeURIComponent(message);
    const targetUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encoded}` 
      : `https://wa.me/?text=${encoded}`;
    
    window.open(targetUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 max-w-2xl w-full overflow-hidden my-auto animate-in zoom-in-95">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-indigo-800 via-purple-800 to-indigo-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors no-print"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/20">
              {student.avatar || (student.gender === 'female' ? '👧🏻' : '👦🏻')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-400 text-amber-950 font-black px-2.5 py-0.5 rounded-full">
                  المركز #{rank} في الصف
                </span>
                <span className="text-xs text-indigo-200">
                  {workspace.grade} – شعبة {workspace.section}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {student.name}
              </h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                {workspace.schoolName} | المعلمة: {workspace.teacherName}
              </p>
            </div>
          </div>

          <div className="mt-3 text-[11px] bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-indigo-200 flex items-center justify-between">
            <span>منظومة «نجوم التميز» التربوية</span>
            <span>إعداد وتصميم: <strong>أ. باسمة الحكمانية</strong></span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
              <div className="text-[11px] text-amber-700 font-bold">نجوم التميز</div>
              <div className="text-2xl font-black text-amber-950 mt-0.5 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span>{student.stars}</span>
              </div>
              <div className="text-[10px] text-amber-600 font-bold">{student.points} نقطة</div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
              <div className="text-[11px] text-emerald-700 font-bold">نسبة الحضور</div>
              <div className="text-2xl font-black text-emerald-950 mt-0.5">
                {attendanceRate}%
              </div>
              <div className="text-[10px] text-emerald-600 font-bold">{presentDays} أيام حضور</div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl">
              <div className="text-[11px] text-blue-700 font-bold">إنجاز الواجبات</div>
              <div className="text-2xl font-black text-blue-950 mt-0.5">
                {tasksRate}%
              </div>
              <div className="text-[10px] text-blue-600 font-bold">{completedTasks} من {allTasks.length} مهام</div>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-2xl">
              <div className="text-[11px] text-purple-700 font-bold">الأوسمة والشارات</div>
              <div className="text-2xl font-black text-purple-950 mt-0.5">
                {(student.badges || []).length}
              </div>
              <div className="text-[10px] text-purple-600 font-bold">أوسمة فخرية</div>
            </div>
          </div>

          {/* Badges Section */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>الأوسمة والشارات المستحقة للطالب:</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {(student.badges || []).map((badge, idx) => (
                <span
                  key={idx}
                  className="bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-300 text-amber-950 text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Parent Info & Contact */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] text-slate-400 font-bold">بيانات ولي الأمر:</div>
              <div className="text-xs font-black text-slate-800 mt-0.5">
                {student.parentName || 'لم يسجل اسم ولي الأمر'}
              </div>
              <div className="text-xs text-slate-500 font-mono" dir="ltr">
                {student.parentPhone || 'لا يوجد هاتف'}
              </div>
            </div>

            <button
              onClick={handleOpenWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>إرسال تقرير الإنجاز للأسرة عبر الواتساب</span>
            </button>
          </div>

          {/* Teacher Private Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              سجل الملاحظات التربوية والسلوكية للمعلمة:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اكتبي ملاحظاتكِ حول نقاط تميز الطالب أو المهارات التي تحتاج إلى تعزيز إضافي..."
              className="w-full p-3 border border-slate-300 rounded-2xl text-xs focus:border-indigo-500 outline-hidden font-medium"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveNotes}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                {savedNotes ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Check className="w-3.5 h-3.5" />}
                <span>{savedNotes ? 'تم حفظ الملاحظات!' : 'حفظ الملاحظة'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-wrap items-center justify-between gap-2 no-print">
          <button
            onClick={() => onGoToCertificates(student.id)}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Crown className="w-4 h-4" />
            <span>إصدار شهادة تميز للطالب 📜</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة بطاقة الطالب (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
