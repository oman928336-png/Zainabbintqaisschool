import React, { useState } from 'react';
import { 
  CalendarCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  Calendar, 
  Check, 
  Printer, 
  Sparkles, 
  Users,
  Download
} from 'lucide-react';
import { TeacherWorkspace, AttendanceRecord, AttendanceStatus } from '../types';
import { playChime } from '../utils/storage';

interface AttendanceManagerViewProps {
  workspace: TeacherWorkspace;
  onUpdateAttendance: (attendance: AttendanceRecord[]) => void;
}

export const AttendanceManagerView: React.FC<AttendanceManagerViewProps> = ({
  workspace,
  onUpdateAttendance
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const getRecordForStudent = (studentId: string): AttendanceStatus => {
    const rec = (workspace.attendance || []).find(
      (a) => a.date === selectedDate && a.studentId === studentId
    );
    return rec ? rec.status : 'present';
  };

  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    const existing = workspace.attendance || [];
    const withoutStudentToday = existing.filter(
      (a) => !(a.date === selectedDate && a.studentId === studentId)
    );

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}-${studentId}`,
      date: selectedDate,
      studentId,
      status
    };

    onUpdateAttendance([...withoutStudentToday, newRecord]);
    playChime('attendance');
  };

  const handleMarkAllPresent = () => {
    const existing = workspace.attendance || [];
    const withoutToday = existing.filter((a) => a.date !== selectedDate);

    const allPresentToday: AttendanceRecord[] = workspace.students.map((st) => ({
      id: `att-${Date.now()}-${st.id}`,
      date: selectedDate,
      studentId: st.id,
      status: 'present'
    }));

    onUpdateAttendance([...withoutToday, ...allPresentToday]);
    playChime('tada');
  };

  // Stats for selected date
  const presentCount = workspace.students.filter((st) => getRecordForStudent(st.id) === 'present').length;
  const absentCount = workspace.students.filter((st) => getRecordForStudent(st.id) === 'absent').length;
  const lateCount = workspace.students.filter((st) => getRecordForStudent(st.id) === 'late').length;
  const excusedCount = workspace.students.filter((st) => getRecordForStudent(st.id) === 'excused').length;

  const handleExportCSV = () => {
    const headers = ['#', 'اسم الطالب', 'التاريخ', 'حالة الحضور'];
    const rows = workspace.students.map((st, idx) => {
      const stStatus = getRecordForStudent(st.id);
      const label = stStatus === 'present' ? 'حاضر' : stStatus === 'absent' ? 'غائب' : stStatus === 'late' ? 'متأخر' : 'معذور';
      return [idx + 1, `"${st.name}"`, selectedDate, label];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `كشف_حضور_${selectedDate}_${workspace.grade}_${workspace.section}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    playChime('tada');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-3xl p-6 shadow-lg flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
            <CalendarCheck className="w-8 h-8 text-emerald-200" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">
              سجل الحضور والغياب اليومي 📅
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
              رصد انضباط الطلاب اليومي وتعزيز الحضور المنتظم في الحلقة الأولى
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            title="تصدير كشف الحضور إكسل"
          >
            <Download className="w-4 h-4" />
            <span>تصدير CSV</span>
          </button>

          <button
            onClick={handleMarkAllPresent}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>الجميع حاضر اليوم (نقرة واحدة)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="bg-white text-emerald-950 hover:bg-emerald-50 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الكشف</span>
          </button>
        </div>
      </div>

      {/* Date & Quick Counters */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>تاريخ الرصد:</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
          />
        </div>

        <div className="flex items-center flex-wrap gap-2 text-xs font-bold">
          <span className="bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>حاضر: {presentCount}</span>
          </span>
          <span className="bg-rose-100 text-rose-900 px-3 py-1.5 rounded-xl flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>غائب: {absentCount}</span>
          </span>
          <span className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>متأخر: {lateCount}</span>
          </span>
          <span className="bg-sky-100 text-sky-900 px-3 py-1.5 rounded-xl flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>معذور: {excusedCount}</span>
          </span>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">الطالب / الطالبة</th>
                <th className="py-3 px-4 text-center">حاضر</th>
                <th className="py-3 px-4 text-center">غائب</th>
                <th className="py-3 px-4 text-center">متأخر</th>
                <th className="py-3 px-4 text-center">معذور</th>
                <th className="py-3 px-4">الحالة الحالية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workspace.students.map((st, idx) => {
                const currentStatus = getRecordForStudent(st.id);

                return (
                  <tr key={st.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 text-slate-400 font-bold">{idx + 1}</td>
                    <td className="py-3 px-4 font-black text-slate-900 flex items-center gap-2">
                      <span className="text-base">{st.avatar}</span>
                      <span>{st.name}</span>
                    </td>

                    {/* Present radio button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleSetStatus(st.id, 'present')}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center mx-auto transition-colors cursor-pointer ${
                          currentStatus === 'present'
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-300 hover:bg-emerald-100'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Absent button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleSetStatus(st.id, 'absent')}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center mx-auto transition-colors cursor-pointer ${
                          currentStatus === 'absent'
                            ? 'bg-rose-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-300 hover:bg-rose-100'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Late button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleSetStatus(st.id, 'late')}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center mx-auto transition-colors cursor-pointer ${
                          currentStatus === 'late'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-300 hover:bg-amber-100'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Excused button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleSetStatus(st.id, 'excused')}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center mx-auto transition-colors cursor-pointer ${
                          currentStatus === 'excused'
                            ? 'bg-sky-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-300 hover:bg-sky-100'
                        }`}
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Status label */}
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                        currentStatus === 'present' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        currentStatus === 'absent' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                        currentStatus === 'late' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        'bg-sky-50 text-sky-800 border border-sky-200'
                      }`}>
                        {currentStatus === 'present' ? 'حاضر اليوم' :
                         currentStatus === 'absent' ? 'غائب' :
                         currentStatus === 'late' ? 'متأخر' : 'معذور'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
