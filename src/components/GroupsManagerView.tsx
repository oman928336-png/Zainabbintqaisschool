import React, { useState } from 'react';
import { 
  Layers, 
  PlusCircle, 
  Sparkles, 
  Award, 
  Users, 
  Trophy, 
  Plus, 
  Minus, 
  Trash2,
  Check
} from 'lucide-react';
import { TeacherWorkspace, ClassroomGroup } from '../types';
import confetti from 'canvas-confetti';
import { playChime } from '../utils/storage';

interface GroupsManagerViewProps {
  workspace: TeacherWorkspace;
  onUpdateGroups: (updatedGroups: ClassroomGroup[]) => void;
}

export const GroupsManagerView: React.FC<GroupsManagerViewProps> = ({
  workspace,
  onUpdateGroups,
}) => {
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupForAssign, setSelectedGroupForAssign] = useState<ClassroomGroup | null>(null);

  const colors = [
    'from-amber-400 to-amber-600',
    'from-emerald-400 to-teal-600',
    'from-indigo-400 to-purple-600',
    'from-rose-400 to-red-600',
    'from-sky-400 to-blue-600',
  ];

  const handleModifyGroupPoints = (groupId: string, delta: number) => {
    const updated = workspace.groups.map((grp) => {
      if (grp.id === groupId) {
        return { ...grp, points: Math.max(0, grp.points + delta) };
      }
      return grp;
    });

    if (delta > 0) {
      playChime('star');
      confetti({
        particleCount: 50,
        spread: 60
      });
    }

    onUpdateGroups(updated);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGroup: ClassroomGroup = {
      id: `grp-${Date.now()}`,
      name: newGroupName.trim(),
      color: colors[workspace.groups.length % colors.length],
      icon: 'Sparkles',
      studentIds: [],
      points: 0
    };

    onUpdateGroups([...workspace.groups, newGroup]);
    playChime('tada');
    setNewGroupName('');
    setShowAddGroupModal(false);
  };

  const handleToggleStudentInGroup = (studentId: string, group: ClassroomGroup) => {
    const isMember = group.studentIds.includes(studentId);
    const updatedStudentIds = isMember
      ? group.studentIds.filter((id) => id !== studentId)
      : [...group.studentIds, studentId];

    const updatedGroups = workspace.groups.map((g) => {
      if (g.id === group.id) {
        return { ...g, studentIds: updatedStudentIds };
      }
      return g;
    });

    onUpdateGroups(updatedGroups);
    if (selectedGroupForAssign) {
      setSelectedGroupForAssign({ ...selectedGroupForAssign, studentIds: updatedStudentIds });
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    if (confirm('هل أنتِ متأكدة من حذف هذه المجموعة؟')) {
      onUpdateGroups(workspace.groups.filter((g) => g.id !== groupId));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
            <Layers className="w-8 h-8 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">
                المجموعات الصفية والتعلم التعاوني 🧩
              </h2>
              <span className="text-xs bg-indigo-900/50 px-2.5 py-0.5 rounded-full font-bold">
                {workspace.groups.length} مجموعات نشطة
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
              غرس روح العمل الجماعي والتنافس الإيجابي الشريف بين فرق الصف
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddGroupModal(true)}
          className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إنشاء مجموعة صفية جديدة</span>
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workspace.groups.map((group, idx) => {
          const members = workspace.students.filter((st) => group.studentIds.includes(st.id));

          return (
            <div
              key={group.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Group Header Strip */}
              <div className={`p-4 bg-gradient-to-r ${group.color} text-white flex items-center justify-between`}>
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-sm font-bold">
                    #{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-black text-white">{group.name}</h3>
                    <span className="text-[11px] text-white/80 font-medium">
                      {members.length} طلاب أعضاء
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-white/20 px-3 py-1 rounded-xl text-xs font-black">
                    {group.points} نقطة
                  </div>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="text-white/60 hover:text-white p-1"
                    title="حذف المجموعة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="p-5 space-y-3 flex-1">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>أعضاء الفريق:</span>
                  <button
                    onClick={() => setSelectedGroupForAssign(group)}
                    className="text-indigo-600 hover:underline cursor-pointer"
                  >
                    + إضافة / تعديل الطلاب
                  </button>
                </div>

                {members.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    لم تتم إضافة طلاب لهذه المجموعة بعد. اضغطي «إضافة طلاب» بالأعلى.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {members.map((m) => (
                      <span
                        key={m.id}
                        className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 border border-slate-200"
                      >
                        <span>{m.avatar}</span>
                        <span>{m.name}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Group Point Controls */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-600">تعزيز المجموعة:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleModifyGroupPoints(group.id, 5)}
                    className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-3 py-1.5 rounded-xl text-xs font-black shadow-2xs cursor-pointer"
                  >
                    +5 نقاط ⭐
                  </button>
                  <button
                    onClick={() => handleModifyGroupPoints(group.id, 10)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                  >
                    +10 تميز 🏆
                  </button>
                  <button
                    onClick={() => handleModifyGroupPoints(group.id, -5)}
                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl cursor-pointer"
                    title="-5 نقاط"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Group Modal */}
      {showAddGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-black text-slate-900">
              إنشاء مجموعة صفية جديدة
            </h3>
            <form onSubmit={handleCreateGroup} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  اسم المجموعة:
                </label>
                <input
                  type="text"
                  placeholder="مثال: مجموعة فرسان العلوم 🔬"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGroupModal(false)}
                  className="px-3 py-1.5 text-slate-500 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-1.5 rounded-xl shadow-md cursor-pointer"
                >
                  حفظ المجموعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Students Modal */}
      {selectedGroupForAssign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                توزيع الطلاب على: {selectedGroupForAssign.name}
              </h3>
              <button onClick={() => setSelectedGroupForAssign(null)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              انقري على اسم الطالب لإضافته أو إزالته من هذه المجموعة:
            </p>

            <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-72 p-1">
              {workspace.students.map((st) => {
                const isSelected = selectedGroupForAssign.studentIds.includes(st.id);
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleToggleStudentInGroup(st.id, selectedGroupForAssign)}
                    className={`p-2.5 rounded-xl border text-right text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{st.avatar}</span>
                      <span>{st.name}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedGroupForAssign(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md cursor-pointer"
              >
                تم والانتهاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
