import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ClipboardPaste, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Phone, 
  User, 
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';
import { TeacherWorkspace, Student } from '../types';
import { playChime } from '../utils/storage';

interface StudentsManagerViewProps {
  workspace: TeacherWorkspace;
  onUpdateStudents: (updatedStudents: Student[]) => void;
}

export const StudentsManagerView: React.FC<StudentsManagerViewProps> = ({
  workspace,
  onUpdateStudents,
}) => {
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showAddSingleModal, setShowAddSingleModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Single Student Form
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  // Batch Form
  const [batchNames, setBatchNames] = useState('');

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newStudent: Student = {
      id: `st-${Date.now()}`,
      name: name.trim(),
      gender,
      avatar: gender === 'female' ? '👧🏻' : '👦🏻',
      stars: 0,
      points: 0,
      badges: ['طالب جديد'],
      parentName: parentName.trim() || undefined,
      parentPhone: parentPhone.trim() || undefined
    };

    onUpdateStudents([...workspace.students, newStudent]);
    playChime('star');
    setName('');
    setParentName('');
    setParentPhone('');
    setShowAddSingleModal(false);
  };

  const handleBatchImport = () => {
    const lines = batchNames
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    const newStudents: Student[] = lines.map((sName, idx) => {
      const isFemale = sName.includes('ة') || sName.includes('بنت') || sName.includes('فاطمة') || sName.includes('مريم') || sName.includes('ريم');
      return {
        id: `st-batch-${Date.now()}-${idx}`,
        name: sName,
        gender: isFemale ? 'female' : 'male',
        avatar: isFemale ? '👧🏻' : '👦🏻',
        stars: 0,
        points: 0,
        badges: ['طالب جديد'],
        parentName: `ولي أمر الطالب / ${sName}`
      };
    });

    onUpdateStudents([...workspace.students, ...newStudents]);
    playChime('tada');
    setBatchNames('');
    setShowBatchModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const updated = workspace.students.map((st) => {
      if (st.id === editingStudent.id) {
        return editingStudent;
      }
      return st;
    });

    onUpdateStudents(updated);
    setEditingStudent(null);
  };

  const handleDelete = (id: string, sName: string) => {
    if (confirm(`هل أنتِ متأكدة من حذف الطالب (${sName}) من الصف؟`)) {
      onUpdateStudents(workspace.students.filter((s) => s.id !== id));
    }
  };

  const handleResetPoints = (id: string) => {
    if (confirm('هل ترغبين في تصفير نقاط ونجوم هذا الطالب لبدء فترة جديدة؟')) {
      const updated = workspace.students.map((st) => {
        if (st.id === id) {
          return { ...st, stars: 0, points: 0, lastAwardedReason: 'بدء دورة تعزيز جديدة' };
        }
        return st;
      });
      onUpdateStudents(updated);
    }
  };

  const handleExportCSV = () => {
    const headers = ['#', 'اسم الطالب', 'النوع', 'نجوم التميز', 'إجمالي النقاط', 'اسم ولي الأمر', 'هاتف ولي الأمر'];
    const rows = workspace.students.map((st, idx) => [
      idx + 1,
      `"${st.name}"`,
      st.gender === 'female' ? 'أنثى' : 'ذكر',
      st.stars,
      st.points,
      `"${st.parentName || ''}"`,
      `"${st.parentPhone || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `كشف_نجوم_التميز_${workspace.grade}_شعبة_${workspace.section}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    playChime('tada');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white rounded-3xl p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
            <Users className="w-8 h-8 text-indigo-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">
                إدارة طلاب الصف والشعبة 👥
              </h2>
              <span className="text-xs bg-indigo-900/50 px-2.5 py-0.5 rounded-full font-bold">
                {workspace.students.length} طلاب مسجلين
              </span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-100 mt-0.5">
              الصف: <strong>{workspace.grade}</strong> | الشعبة: <strong>{workspace.section}</strong> | المدرسة: <strong>{workspace.schoolName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            title="تصدير كشف إكسل CSV"
          >
            <Download className="w-4 h-4" />
            <span>تصدير إكسل (CSV)</span>
          </button>

          <button
            onClick={() => setShowBatchModal(true)}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <ClipboardPaste className="w-4 h-4" />
            <span>لصق قائمة الطلاب دفعة واحدة</span>
          </button>

          <button
            onClick={() => setShowAddSingleModal(true)}
            className="bg-white hover:bg-indigo-50 text-indigo-900 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة طالب منفرد</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800">
            قائمة طلاب الصف الحالي ({workspace.students.length} طالب وطالبة)
          </h3>
          <span className="text-xs text-slate-400">
            المعلمة: {workspace.teacherName}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">الطالب</th>
                <th className="py-3 px-4">النوع</th>
                <th className="py-3 px-4">النجوم والنقاط</th>
                <th className="py-3 px-4">ولي الأمر</th>
                <th className="py-3 px-4">هاتف ولي الأمر</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workspace.students.map((st, idx) => (
                <tr key={st.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 text-slate-400 font-bold">{idx + 1}</td>
                  <td className="py-3 px-4 font-black text-slate-900 flex items-center gap-2">
                    <span className="text-lg">{st.avatar}</span>
                    <span>{st.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {st.gender === 'female' ? '👧🏻 أنثى' : '👦🏻 ذكر'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {st.stars} ⭐ ({st.points} نقطة)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {st.parentName || '—'}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600" dir="ltr">
                    {st.parentPhone || '—'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setEditingStudent(st)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="تعديل بيانات الطالب"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleResetPoints(st.id)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors text-[10px] font-bold"
                        title="تصفير النقاط"
                      >
                        تصفير
                      </button>
                      <button
                        onClick={() => handleDelete(st.id, st.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="حذف الطالب"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch Import Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ClipboardPaste className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900">
                  لصق قائمة الطلاب دفعة واحدة
                </h3>
              </div>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              انسخي الأسماء من ملف إكسل أو البوابة التعليمية والصقيها هنا (اسم كل طالب أو طالبة في سطر مستقل):
            </p>

            <textarea
              rows={8}
              value={batchNames}
              onChange={(e) => setBatchNames(e.target.value)}
              placeholder={`محمد بن سالم الوهيبي\nفاطمة بنت أحمد البلوشية\nحمد بن ناصر المعمري\nريم بنت سلطان العامرية`}
              className="w-full p-3 border border-slate-300 rounded-2xl text-xs outline-hidden focus:border-indigo-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowBatchModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
              >
                إلغاء
              </button>
              <button
                onClick={handleBatchImport}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                استيراد القائمة فوراً
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Single Modal */}
      {showAddSingleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900">
                  إضافة طالب جديد للصف
                </h3>
              </div>
              <button onClick={() => setShowAddSingleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSingle} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الطالب الكامل *</label>
                <input
                  type="text"
                  placeholder="محمد بن سعيد الوهيبي..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">النوع</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                    />
                    <span>👦 ذكر</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                    />
                    <span>👧 أنثى</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم ولي الأمر</label>
                <input
                  type="text"
                  placeholder="الفاضل / سعيد بن حمد الوهيبي"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم هاتف ولي الأمر (لإرسال شهادات الواتساب)</label>
                <input
                  type="tel"
                  placeholder="+968 9XXXXXXX"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSingleModal(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl shadow-md cursor-pointer"
                >
                  إضافة الطالب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                تعديل بيانات الطالب / {editingStudent.name}
              </h3>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الطالب</label>
                <input
                  type="text"
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم ولي الأمر</label>
                <input
                  type="text"
                  value={editingStudent.parentName || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  value={editingStudent.parentPhone || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">النجوم الحالية</label>
                <input
                  type="number"
                  value={editingStudent.stars}
                  onChange={(e) => setEditingStudent({ ...editingStudent, stars: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl shadow-md cursor-pointer"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
