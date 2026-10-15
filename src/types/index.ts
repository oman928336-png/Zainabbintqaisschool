/**
 * Types and interfaces for «نجوم التميز» platform
 * إعداد وتصميم وتنفيذ المبادرة: الأستاذة باسمة الحكمانية
 */

export interface Student {
  id: string;
  name: string;
  gender: 'male' | 'female';
  avatar: string; // emoji or avatar identifier
  stars: number;
  points: number;
  badges: string[];
  notes?: string;
  parentName?: string;
  parentPhone?: string;
  lastAwardedReason?: string;
  starHistory?: { id: string; date: string; stars: number; reason: string }[];
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface ClassroomGroup {
  id: string;
  name: string;
  color: string;
  icon: string;
  studentIds: string[];
  points: number;
}

export type AchievementCategory = 
  | 'initiative'      // مبادرات منفذة
  | 'activity'        // أنشطة صفية
  | 'applied_lesson'  // دروس تطبيقية
  | 'worksheet'       // أوراق عمل تفاعلية
  | 'teaching_aid';    // وسائل تعليمية مبتكرة

export interface TeacherAchievement {
  id: string;
  title: string;
  category: AchievementCategory;
  date: string;
  description: string;
  objectives: string;
  learningImpact: string;
  gradeSection: string;
  imageUrl?: string;
  attachmentsNote?: string;
}

export interface StudentCertificate {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  reason: string;
  date: string;
  templateId: 'gold' | 'sky' | 'emerald' | 'royal';
  teacherName: string;
  schoolName: string;
}

export interface ParentCertificate {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  reason: string;
  date: string;
  templateId: 'elegant-gold' | 'rose-royale' | 'palm-green' | 'starry-navy';
  teacherName: string;
  schoolName: string;
  sentDate?: string;
}

export type TaskStatus = 'completed_distinction' | 'completed' | 'pending' | 'excused';

export interface ClassTask {
  id: string;
  title: string;
  subject: string; // لغة عربية، تربية إسلامية، رياضيات، علوم، دراسات اجتماعية، فنون تشكيلية، لغة إنجليزية
  description: string;
  dueDate: string;
  rewardStars: number;
  rewardPoints: number;
  submissions: Record<string, TaskStatus>; // studentId -> status
  createdAt: string;
}

export interface TeacherWorkspace {
  id: string;
  teacherName: string;
  schoolName: string;
  grade: string; // مثلاً: الصف الأول، الصف الثاني، الصف الثالث، الصف الرابع
  section: string; // 1, 2, 3, 4
  schoolYear: string; // 2026 / 2027 م
  schoolLogo?: string;
  themeColor: string;
  availableSections?: string[]; // قائمة الشُعب المتاحة (1، 2، 3، 4...)
  availableSubjects?: string[]; // قائمة المواد الدراسية المخصصة
  students: Student[];
  groups: ClassroomGroup[];
  attendance: AttendanceRecord[];
  tasks?: ClassTask[];
  achievements: TeacherAchievement[];
  studentCertificates: StudentCertificate[];
  parentCertificates: ParentCertificate[];
  surpriseGifts: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InitiativeGuidance {
  id: string;
  title: string;
  date: string;
  content: string;
  category: 'motivation' | 'classroom_management' | 'pedagogy';
}

export interface TeacherInviteLink {
  id: string;
  teacherName: string;
  schoolName: string;
  grade: string;
  section: string;
  schoolYear: string;
  linkUrl: string;
  createdAt: string;
  notes?: string;
}

export interface AppState {
  currentWorkspaceId: string;
  workspaces: TeacherWorkspace[];
  activeTab: 
    | 'about_initiative'       // صفحة التعريف بالمبادرة الأصلية
    | 'founder_dashboard'      // لوحة صاحبة المبادرة: الأستاذة باسمة الحكمانية
    | 'teacher_links'          // توليد روابط ونسخ المعلمات المستفيدات
    | 'teacher_dashboard'      // لوحة التحكم والنجوم
    | 'students_manager'       // إدارة الطلاب والشعب
    | 'class_tasks'            // المهام والواجبات الدراسية
    | 'groups_manager'         // المجموعات الصفية
    | 'attendance_manager'     // الحضور والغياب
    | 'gifts_wheel'            // صندوق الهدايا وعجلة المفاجآت
    | 'student_certificates'   // شهادات التميز للطلاب
    | 'parent_certificates'    // شهادات شكر أولياء الأمور
    | 'teacher_portfolio'      // توثيق أعمالي وملف الإنجاز
    | 'reports_analytics'      // التقارير ولوحة الشرف
    | 'workspace_settings';    // تعديل كل شيء، الحذف، وإدارة الشعب والمواد
}

