/**
 * «نجوم التميز – مبادرة رقمية لتعزيز طلاب الحلقة الأولى»
 * إعداد وتصميم وتنفيذ المبادرة: الأستاذة باسمة الحكمانية
 * سلطنة عُمان
 */

import React, { useState, useEffect } from 'react';
import { 
  AppState, 
  TeacherWorkspace, 
  Student, 
  ClassroomGroup, 
  AttendanceRecord, 
  ClassTask,
  TeacherAchievement, 
  StudentCertificate, 
  ParentCertificate,
  InitiativeGuidance
} from './types';
import { 
  loadWorkspaces, 
  saveWorkspaces, 
  loadCurrentWorkspaceId, 
  saveCurrentWorkspaceId,
  loadGuidance,
  saveGuidance,
  parseTeacherInviteFromUrl,
  playChime
} from './utils/storage';
import confetti from 'canvas-confetti';
import { INITIAL_WORKSPACE } from './data/initialData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CreateWorkspaceModal } from './components/CreateWorkspaceModal';
import { AboutInitiativeView } from './components/AboutInitiativeView';
import { FounderDashboardView } from './components/FounderDashboardView';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { TeacherLinksGeneratorView } from './components/TeacherLinksGeneratorView';
import { StudentsManagerView } from './components/StudentsManagerView';
import { ClassTasksView } from './components/ClassTasksView';
import { GroupsManagerView } from './components/GroupsManagerView';
import { AttendanceManagerView } from './components/AttendanceManagerView';
import { GiftsWheelView } from './components/GiftsWheelView';
import { StudentCertificatesView } from './components/StudentCertificatesView';
import { ParentCertificatesView } from './components/ParentCertificatesView';
import { TeacherPortfolioView } from './components/TeacherPortfolioView';
import { ReportsAnalyticsView } from './components/ReportsAnalyticsView';
import { MasterControlView } from './components/MasterControlView';
import { Footer } from './components/Footer';

export default function App() {
  const [workspaces, setWorkspaces] = useState<TeacherWorkspace[]>(() => loadWorkspaces());
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>(() => loadCurrentWorkspaceId());
  const [activeTab, setActiveTab] = useState<AppState['activeTab']>('teacher_dashboard');
  const [guidanceList, setGuidanceList] = useState<InitiativeGuidance[]>(() => loadGuidance());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [targetStudentForCert, setTargetStudentForCert] = useState<string | undefined>(undefined);
  const [welcomeInvite, setWelcomeInvite] = useState<{
    teacher: string;
    school: string;
    grade: string;
    section: string;
  } | null>(null);

  // Check on mount if teacher opened a personalized invite link
  useEffect(() => {
    const invite = parseTeacherInviteFromUrl();
    if (invite) {
      const existing = workspaces.find(
        (ws) => ws.teacherName.trim().toLowerCase() === invite.teacher.trim().toLowerCase() && ws.section === invite.section
      );

      if (existing) {
        setCurrentWorkspaceId(existing.id);
        setActiveTab('teacher_dashboard');
      } else {
        const newWs: TeacherWorkspace = {
          id: `ws-invite-${Date.now()}`,
          teacherName: invite.teacher,
          schoolName: invite.school || 'مدرسة الحلقة الأولى',
          grade: invite.grade || 'الصف الأول الأساسي',
          section: invite.section || '1',
          schoolYear: invite.year || '2026 / 2027 م',
          themeColor: '#4f46e5',
          availableSections: [invite.section, '1', '2', '3', '4'].filter((v, i, a) => a.indexOf(v) === i),
          availableSubjects: INITIAL_WORKSPACE.availableSubjects,
          surpriseGifts: INITIAL_WORKSPACE.surpriseGifts,
          students: [
            {
              id: `st-inv-1`,
              name: 'سالم بن أحمد المعمري',
              gender: 'male',
              avatar: '👦🏻',
              stars: 6,
              points: 30,
              badges: ['نجم البداية'],
              parentName: 'أحمد بن علي المعمري',
              parentPhone: '+96891000000',
              lastAwardedReason: 'بداية مشجعة للعام الدراسي 2026/2027م'
            },
            {
              id: `st-inv-2`,
              name: 'مريم بنت سعيد الحارثية',
              gender: 'female',
              avatar: '👧🏻',
              stars: 8,
              points: 40,
              badges: ['نجمة البداية', 'الأخلاق الفاضلة'],
              parentName: 'سعيد بن ناصر الحارثي',
              parentPhone: '+96892000000',
              lastAwardedReason: 'التعاون والمشاركة في اليوم الأول'
            }
          ],
          groups: [
            { id: 'g-1', name: 'مجموعة النجوم ⭐', color: 'bg-amber-100 text-amber-800 border-amber-300', icon: '⭐', studentIds: ['st-inv-1'], points: 10 },
            { id: 'g-2', name: 'مجموعة الأبطال 🚀', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: '🚀', studentIds: ['st-inv-2'], points: 10 }
          ],
          attendance: [],
          tasks: [],
          achievements: [],
          studentCertificates: [],
          parentCertificates: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setWorkspaces((prev) => [newWs, ...prev]);
        setCurrentWorkspaceId(newWs.id);
        setActiveTab('teacher_dashboard');
      }

      setWelcomeInvite({
        teacher: invite.teacher,
        school: invite.school,
        grade: invite.grade,
        section: invite.section
      });

      playChime('tada');
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });

      // Clean query parameters from URL cleanly
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Sync workspaces to localStorage whenever changed
  useEffect(() => {
    saveWorkspaces(workspaces);
  }, [workspaces]);

  // Sync current workspace id
  useEffect(() => {
    saveCurrentWorkspaceId(currentWorkspaceId);
  }, [currentWorkspaceId]);

  // Sync guidance
  useEffect(() => {
    saveGuidance(guidanceList);
  }, [guidanceList]);

  // Get current active workspace
  const currentWorkspace = workspaces.find((ws) => ws.id === currentWorkspaceId) || workspaces[0];

  // Helper to update current workspace
  const handleUpdateCurrentWorkspace = (updatedFields: Partial<TeacherWorkspace>) => {
    setWorkspaces((prev) =>
      prev.map((ws) => {
        if (ws.id === currentWorkspace.id) {
          return {
            ...ws,
            ...updatedFields,
            updatedAt: new Date().toISOString()
          };
        }
        return ws;
      })
    );
  };

  // Helper to create new independent workspace
  const handleCreateNewWorkspace = (newWorkspace: TeacherWorkspace) => {
    setWorkspaces((prev) => [newWorkspace, ...prev]);
    setCurrentWorkspaceId(newWorkspace.id);
    setActiveTab('teacher_dashboard');
  };

  // Switch workspace
  const handleSelectWorkspace = (id: string) => {
    setCurrentWorkspaceId(id);
    if (activeTab === 'founder_dashboard' || activeTab === 'about_initiative') {
      setActiveTab('teacher_dashboard');
    }
  };

  // Delete current workspace
  const handleDeleteCurrentWorkspace = () => {
    if (workspaces.length <= 1) {
      alert('لا يمكن حذف النسخة الوحيدة المتبقية. يمكنكِ تعديل بياناتها من النموذج بالأعلى.');
      return;
    }
    const remaining = workspaces.filter((ws) => ws.id !== currentWorkspace.id);
    setWorkspaces(remaining);
    setCurrentWorkspaceId(remaining[0].id);
  };

  // Import workspace JSON
  const handleImportWorkspace = (imported: TeacherWorkspace) => {
    const existingIndex = workspaces.findIndex((ws) => ws.id === imported.id);
    if (existingIndex >= 0) {
      // Overwrite existing
      const updated = [...workspaces];
      updated[existingIndex] = imported;
      setWorkspaces(updated);
    } else {
      setWorkspaces([imported, ...workspaces]);
    }
    setCurrentWorkspaceId(imported.id);
  };

  // Jump to certificates with preselected student
  const handleGoToCertificates = (studentId?: string) => {
    setTargetStudentForCert(studentId);
    setActiveTab('student_certificates');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* Top Application Header */}
      <Header
        currentWorkspace={currentWorkspace}
        workspaces={workspaces}
        onSelectWorkspace={handleSelectWorkspace}
        onUpdateSection={(sec) => handleUpdateCurrentWorkspace({ section: sec })}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onSwitchToFounder={() => setActiveTab('founder_dashboard')}
        onSwitchToAbout={() => setActiveTab('about_initiative')}
        onSwitchToLinks={() => setActiveTab('teacher_links')}
        onSwitchToSettings={() => setActiveTab('workspace_settings')}
        isFounderActive={activeTab === 'founder_dashboard'}
        isLinksActive={activeTab === 'teacher_links'}
        isSettingsActive={activeTab === 'workspace_settings'}
      />

      {/* Main Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'student_certificates') {
            setTargetStudentForCert(undefined);
          }
        }}
        studentsCount={currentWorkspace.students.length}
        tasksCount={currentWorkspace.tasks?.length || 0}
        groupsCount={currentWorkspace.groups.length}
        achievementsCount={currentWorkspace.achievements?.length || 0}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Welcome Banner for invited teachers */}
        {welcomeInvite && (
          <div className="mb-6 bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white p-4 sm:p-5 rounded-3xl shadow-lg border-2 border-emerald-300 flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-emerald-800 flex items-center justify-center font-black shadow-md shrink-0 text-2xl">
                🌸
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black">
                    مرحباً بكِ أستاذة {welcomeInvite.teacher}! ✨
                  </h3>
                  <span className="bg-emerald-400 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                    مفتوح بدون إيميل ✓
                  </span>
                </div>
                <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                  تم إعداد نسختكِ الصفية المستقلة بنجاح لـ <strong>({welcomeInvite.grade} – شعبة {welcomeInvite.section})</strong> بـ <strong>{welcomeInvite.school}</strong> للعام الدراسي <strong>2026 / 2027 م</strong>.
                  <br />
                  اسمكِ معتمد الآن كمعلمة للصف في جميع الشهادات المطبوعة ضمن مشروع مبادرة «نجوم التميز» (إعداد وتصميم وتنفيذ: الأستاذة باسمة الحكمانية).
                </p>
              </div>
            </div>
            <button
              onClick={() => setWelcomeInvite(null)}
              className="bg-white text-emerald-900 hover:bg-emerald-50 text-xs sm:text-sm font-black px-4 py-2.5 rounded-2xl transition-all cursor-pointer shadow-md shrink-0 transform active:scale-95"
            >
              ابدأي بالصف الآن 🚀
            </button>
          </div>
        )}

        {activeTab === 'about_initiative' && (
          <AboutInitiativeView
            currentWorkspace={currentWorkspace}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {activeTab === 'founder_dashboard' && (
          <FounderDashboardView
            workspaces={workspaces}
            guidanceList={guidanceList}
            onAddGuidance={(g) => setGuidanceList([g, ...guidanceList])}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onNavigateToLinks={() => setActiveTab('teacher_links')}
          />
        )}

        {activeTab === 'teacher_links' && (
          <TeacherLinksGeneratorView
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {activeTab === 'teacher_dashboard' && (
          <TeacherDashboardView
            workspace={currentWorkspace}
            onUpdateStudents={(students: Student[]) => handleUpdateCurrentWorkspace({ students })}
            onGoToGifts={() => setActiveTab('gifts_wheel')}
            onGoToCertificates={handleGoToCertificates}
          />
        )}

        {activeTab === 'students_manager' && (
          <StudentsManagerView
            workspace={currentWorkspace}
            onUpdateStudents={(students: Student[]) => handleUpdateCurrentWorkspace({ students })}
          />
        )}

        {activeTab === 'class_tasks' && (
          <ClassTasksView
            workspace={currentWorkspace}
            onUpdateTasks={(tasks: ClassTask[]) => handleUpdateCurrentWorkspace({ tasks })}
            onUpdateStudents={(students: Student[]) => handleUpdateCurrentWorkspace({ students })}
          />
        )}

        {activeTab === 'groups_manager' && (
          <GroupsManagerView
            workspace={currentWorkspace}
            onUpdateGroups={(groups: ClassroomGroup[]) => handleUpdateCurrentWorkspace({ groups })}
          />
        )}

        {activeTab === 'attendance_manager' && (
          <AttendanceManagerView
            workspace={currentWorkspace}
            onUpdateAttendance={(attendance: AttendanceRecord[]) => handleUpdateCurrentWorkspace({ attendance })}
          />
        )}

        {activeTab === 'gifts_wheel' && (
          <GiftsWheelView
            workspace={currentWorkspace}
            onUpdateWorkspace={handleUpdateCurrentWorkspace}
            onUpdateStudents={(students: Student[]) => handleUpdateCurrentWorkspace({ students })}
          />
        )}

        {activeTab === 'student_certificates' && (
          <StudentCertificatesView
            workspace={currentWorkspace}
            initialStudentId={targetStudentForCert}
            onSaveCertificate={(cert: StudentCertificate) => {
              const existing = currentWorkspace.studentCertificates || [];
              handleUpdateCurrentWorkspace({ studentCertificates: [cert, ...existing] });
            }}
          />
        )}

        {activeTab === 'parent_certificates' && (
          <ParentCertificatesView
            workspace={currentWorkspace}
            onSaveCertificate={(cert: ParentCertificate) => {
              const existing = currentWorkspace.parentCertificates || [];
              handleUpdateCurrentWorkspace({ parentCertificates: [cert, ...existing] });
            }}
          />
        )}

        {activeTab === 'teacher_portfolio' && (
          <TeacherPortfolioView
            workspace={currentWorkspace}
            onUpdateAchievements={(achievements: TeacherAchievement[]) => handleUpdateCurrentWorkspace({ achievements })}
          />
        )}

        {activeTab === 'reports_analytics' && (
          <ReportsAnalyticsView
            workspace={currentWorkspace}
            onGoToCertificates={handleGoToCertificates}
          />
        )}

        {activeTab === 'workspace_settings' && (
          <MasterControlView
            workspace={currentWorkspace}
            onUpdateWorkspace={handleUpdateCurrentWorkspace}
            onImportWorkspace={handleImportWorkspace}
            onDeleteCurrentWorkspace={handleDeleteCurrentWorkspace}
          />
        )}
      </main>

      {/* Create Workspace Modal Wizard */}
      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateWorkspace={handleCreateNewWorkspace}
      />

      {/* Global Application Footer with Formal Attribution */}
      <Footer
        onSwitchToAbout={() => setActiveTab('about_initiative')}
        onSwitchToFounder={() => setActiveTab('founder_dashboard')}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

    </div>
  );
}
