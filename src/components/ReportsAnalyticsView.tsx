import React from 'react';
import { 
  BarChart3, 
  Trophy, 
  Crown, 
  Star, 
  Printer, 
  Award, 
  TrendingUp, 
  Sparkles,
  Users
} from 'lucide-react';
import { TeacherWorkspace } from '../types';

interface ReportsAnalyticsViewProps {
  workspace: TeacherWorkspace;
  onGoToCertificates: (studentId: string) => void;
}

export const ReportsAnalyticsView: React.FC<ReportsAnalyticsViewProps> = ({
  workspace,
  onGoToCertificates
}) => {
  // Sort students by stars descending
  const sortedStudents = [...workspace.students].sort((a, b) => b.stars - a.stars);
  const topThree = sortedStudents.slice(0, 3);

  // Group sorting
  const sortedGroups = [...workspace.groups].sort((a, b) => b.points - a.points);

  const totalClassStars = workspace.students.reduce((acc, st) => acc + st.stars, 0);
  const averageStars = workspace.students.length > 0 ? (totalClassStars / workspace.students.length).toFixed(1) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-6 shadow-lg flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
            <Trophy className="w-8 h-8 text-amber-200" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">
              لوحة الشرف وتقارير تقدم الطلاب 🏆
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 mt-0.5">
              تكريم فرسان التميز ورصد مؤشرات الأداء والسلوك الإيجابي للصف
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-white text-amber-950 hover:bg-amber-50 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة لوحة الشرف للتعليق بالصف</span>
        </button>
      </div>

      {/* Podium for Top 3 Students */}
      {topThree.length >= 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase">
              منظومة نجوم التميز
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 mt-1">
              فرسان الصف الأوائل في رصيد النجوم 🌟
            </h3>
          </div>

          <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-6 pt-6">
            
            {/* Rank 2 (Silver) */}
            <div className="flex flex-col items-center order-2 sm:order-1">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-3xl shadow-sm">
                {topThree[1].avatar}
              </div>
              <div className="text-xs font-black text-slate-800 mt-2 text-center max-w-[120px] truncate">
                {topThree[1].name}
              </div>
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mt-1">
                {topThree[1].stars} ⭐
              </span>
              <div className="w-24 sm:w-28 bg-slate-200 h-24 rounded-t-2xl mt-3 flex items-center justify-center text-slate-600 font-black text-xl shadow-inner">
                🥈 المركز 2
              </div>
            </div>

            {/* Rank 1 (Gold) */}
            <div className="flex flex-col items-center order-1 sm:order-2">
              <div className="relative">
                <Crown className="w-7 h-7 text-amber-500 absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce" />
                <div className="w-20 h-20 rounded-2xl bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-4xl shadow-md">
                  {topThree[0].avatar}
                </div>
              </div>
              <div className="text-sm font-black text-slate-900 mt-2 text-center max-w-[140px] truncate">
                {topThree[0].name}
              </div>
              <span className="text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 mt-1">
                {topThree[0].stars} نجمة تميز ⭐
              </span>
              <div className="w-28 sm:w-32 bg-gradient-to-t from-amber-500 to-amber-400 h-32 rounded-t-2xl mt-3 flex items-center justify-center text-amber-950 font-black text-2xl shadow-lg">
                🥇 المركز 1
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="flex flex-col items-center order-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-700/40 flex items-center justify-center text-3xl shadow-sm">
                {topThree[2].avatar}
              </div>
              <div className="text-xs font-black text-slate-800 mt-2 text-center max-w-[120px] truncate">
                {topThree[2].name}
              </div>
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mt-1">
                {topThree[2].stars} ⭐
              </span>
              <div className="w-24 sm:w-28 bg-amber-700/20 h-16 rounded-t-2xl mt-3 flex items-center justify-center text-amber-900 font-black text-xl shadow-inner">
                🥉 المركز 3
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Complete Star Ranking Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>الترتيب العام لنجوم الصف ({workspace.grade} - {workspace.section})</span>
          </h3>
          <span className="text-xs text-slate-400">
            معدل نجوم الصف: {averageStars} ⭐
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3 px-4">الترتيب</th>
                <th className="py-3 px-4">الطالب</th>
                <th className="py-3 px-4">النجوم</th>
                <th className="py-3 px-4">إجمالي النقاط</th>
                <th className="py-3 px-4">الأوسمة</th>
                <th className="py-3 px-4 text-center">شهادة شكر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedStudents.map((st, idx) => (
                <tr key={st.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold">
                    <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs ${
                      idx === 0 ? 'bg-amber-400 text-amber-950 font-black' :
                      idx === 1 ? 'bg-slate-200 text-slate-700 font-bold' :
                      idx === 2 ? 'bg-amber-100 text-amber-800 font-bold' : 'text-slate-400'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-black text-slate-900 flex items-center gap-2">
                    <span>{st.avatar}</span>
                    <span>{st.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {st.stars} ⭐
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-600">{st.points} نقطة</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {(st.badges || []).slice(0, 2).map((b, bIdx) => (
                        <span key={bIdx} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onGoToCertificates(st.id)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-lg text-[11px] transition-colors cursor-pointer"
                    >
                      إصدار شهادة 📜
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
