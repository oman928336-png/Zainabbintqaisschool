import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Users, 
  CheckSquare,
  Layers, 
  CalendarCheck, 
  Gift, 
  Award, 
  HeartHandshake, 
  FolderGit2, 
  BarChart3, 
  FileText, 
  Sliders,
  Sparkles,
  Link2,
  ChevronDown,
  LayoutGrid,
  ListFilter
} from 'lucide-react';
import { AppState } from '../types';

interface NavigationProps {
  activeTab: AppState['activeTab'];
  onSelectTab: (tab: AppState['activeTab']) => void;
  studentsCount: number;
  tasksCount: number;
  groupsCount: number;
  achievementsCount: number;
}

type HubId = 'daily_reinforcement' | 'classroom_management' | 'certificates_honors' | 'analytics_portfolio' | 'quick_tools';

interface SubNavItem {
  id: AppState['activeTab'];
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  badge?: number | string;
  description: string;
}

interface HubCategory {
  id: HubId;
  label: string;
  icon: React.ElementType;
  colorClass: string;
  badge?: number | string;
  items: SubNavItem[];
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  studentsCount,
  tasksCount,
  groupsCount,
  achievementsCount
}) => {
  // Organize 13 tabs into clear, structured hubs
  const hubs: HubCategory[] = [
    {
      id: 'daily_reinforcement',
      label: 'التعزيز اليومي والمهام',
      icon: Star,
      colorClass: 'text-amber-500 bg-amber-50 border-amber-200',
      items: [
        { 
          id: 'teacher_dashboard', 
          label: 'لوحة تعزيز النجوم', 
          shortLabel: 'لوحة النجوم', 
          icon: Star, 
          description: 'الشاشة التفاعلية اليومية لرصد نقاط ونجوم الطلاب' 
        },
        { 
          id: 'class_tasks', 
          label: 'المهام الدراسية والواجبات', 
          shortLabel: 'المهام والواجبات', 
          icon: CheckSquare, 
          badge: tasksCount, 
          description: 'تكليف وتصحيح المهام والأنشطة الصفية والمنزلية' 
        },
        { 
          id: 'gifts_wheel', 
          label: 'صندوق المفاجآت والجوائز', 
          shortLabel: 'عجلة الهدايا', 
          icon: Gift, 
          description: 'تحفيز الطلاب بالهدايا الفورية وعجلة الحظ' 
        },
      ]
    },
    {
      id: 'classroom_management',
      label: 'إدارة الصف والطلاب',
      icon: Users,
      colorClass: 'text-indigo-500 bg-indigo-50 border-indigo-200',
      badge: studentsCount,
      items: [
        { 
          id: 'students_manager', 
          label: 'شؤون الطلاب وقوائم الأسماء', 
          shortLabel: 'قائمة الطلاب', 
          icon: Users, 
          badge: studentsCount, 
          description: 'إضافة وتعديل بيانات الطلاب، أولياء الأمور، والصور' 
        },
        { 
          id: 'groups_manager', 
          label: 'المجموعات الصفية التعاونية', 
          shortLabel: 'المجموعات', 
          icon: Layers, 
          badge: groupsCount, 
          description: 'تنظيم الطلاب في فرق عمل ونقاط المجموعات' 
        },
        { 
          id: 'attendance_manager', 
          label: 'سجل الحضور والغياب اليومي', 
          shortLabel: 'الحضور والغياب', 
          icon: CalendarCheck, 
          description: 'رصد الغياب والتأخير اليومي بكل سلاسة' 
        },
      ]
    },
    {
      id: 'certificates_honors',
      label: 'الشهادات والتكريم',
      icon: Award,
      colorClass: 'text-rose-500 bg-rose-50 border-rose-200',
      items: [
        { 
          id: 'student_certificates', 
          label: 'شهادات تميز وتفوق الطلاب', 
          shortLabel: 'شهادات الطلاب', 
          icon: Award, 
          description: 'طباعة فورية لشكر وتكريم المتميزين بالاسم والمدرسة' 
        },
        { 
          id: 'parent_certificates', 
          label: 'شهادات شكر أولياء الأمور', 
          shortLabel: 'شكر أولياء الأمور', 
          icon: HeartHandshake, 
          description: 'بطاقات تقدير لدعم أولياء الأمور ومتابعتهم' 
        },
      ]
    },
    {
      id: 'analytics_portfolio',
      label: 'التقارير وملف الإنجاز',
      icon: BarChart3,
      colorClass: 'text-teal-500 bg-teal-50 border-teal-200',
      items: [
        { 
          id: 'reports_analytics', 
          label: 'التقارير ولوحة الشرف', 
          shortLabel: 'لوحة الشرف', 
          icon: BarChart3, 
          description: 'إحصائيات الإنجاز وقوائم الشرف القابلة للطباعة' 
        },
        { 
          id: 'teacher_portfolio', 
          label: 'توثيق أعمالي وإنجازاتي', 
          shortLabel: 'توثيق أعمالي', 
          icon: FolderGit2, 
          badge: achievementsCount, 
          description: 'ملف الإنجاز الرقمي الخاص بمعلمة الصف' 
        },
        { 
          id: 'about_initiative', 
          label: 'عن مبادرة نجوم التميز', 
          shortLabel: 'عن المبادرة', 
          icon: FileText, 
          description: 'الوثيقة التأسيسية وأهداف المشروع للأستاذة باسمة الحكمانية' 
        },
      ]
    }
  ];

  // Direct special tool items
  const directTools: SubNavItem[] = [
    {
      id: 'teacher_links',
      label: 'روابط المعلمات (بدون إيميل) 🔗',
      shortLabel: 'روابط المعلمات',
      icon: Link2,
      description: 'مشاركة رابط مباشر فوري لأي معلمة بدون تسجيل أو إيميل'
    },
    {
      id: 'workspace_settings',
      label: 'تعديل كل شيء والشعب والمواد ⚙️',
      shortLabel: 'تعديل كل شيء',
      icon: Sliders,
      description: 'تخصيص كامل للشعب، المواد الدراسية، وحذف وتعديل البيانات'
    }
  ];

  // Flatten all items for flat-mode or lookup
  const allItems: SubNavItem[] = [
    ...hubs.flatMap(h => h.items),
    ...directTools
  ];

  // Determine which hub contains the active tab
  const getActiveHubId = (): HubId => {
    for (const hub of hubs) {
      if (hub.items.some(item => item.id === activeTab)) {
        return hub.id;
      }
    }
    return 'daily_reinforcement';
  };

  const [selectedHub, setSelectedHub] = useState<HubId>(getActiveHubId);
  const [viewMode, setViewMode] = useState<'structured' | 'all'>('structured');

  // Keep selectedHub in sync if activeTab changes externally
  useEffect(() => {
    const parentHub = getActiveHubId();
    if (parentHub) {
      setSelectedHub(parentHub);
    }
  }, [activeTab]);

  const currentHub = hubs.find(h => h.id === selectedHub) || hubs[0];
  const activeItemDetails = allItems.find(i => i.id === activeTab);

  return (
    <nav className="bg-white border-b border-slate-200/90 shadow-xs no-print select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        
        {/* Tier 1: Main System Hubs & Direct Special Actions */}
        <div className="flex items-center justify-between gap-2 pt-2.5 pb-2 border-b border-slate-100 overflow-x-auto no-scrollbar">
          
          {/* Main Hub Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {hubs.map((hub) => {
              const HubIcon = hub.icon;
              const isHubActive = selectedHub === hub.id;
              const hasActiveChild = hub.items.some(item => item.id === activeTab);

              return (
                <button
                  key={hub.id}
                  onClick={() => {
                    setSelectedHub(hub.id);
                    // If none of this hub's items is active, select the first one
                    if (!hasActiveChild) {
                      onSelectTab(hub.items[0].id);
                    }
                  }}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                    isHubActive
                      ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                      : hasActiveChild
                      ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold'
                  }`}
                >
                  <HubIcon className={`w-4 h-4 ${isHubActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span>{hub.label}</span>
                  {hub.badge !== undefined && (typeof hub.badge === 'number' ? hub.badge > 0 : Boolean(hub.badge)) && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isHubActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {hub.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Direct Highlights: Teacher Links (Without Email) & Master Settings */}
          <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-slate-200">
            {/* Direct Link Tool Button */}
            <button
              onClick={() => onSelectTab('teacher_links')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'teacher_links'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-200 ring-2 ring-emerald-500'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300/80'
              }`}
              title="مشاركة رابط مستقل للمعلمات يفتح بدون أي إيميل"
            >
              <Link2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>روابط المعلمات</span>
              <span className="hidden sm:inline bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold">
                بدون إيميل ⚡
              </span>
            </button>

            {/* Direct Master Settings Button */}
            <button
              onClick={() => onSelectTab('workspace_settings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'workspace_settings'
                  ? 'bg-indigo-700 text-white shadow-md shadow-indigo-200 ring-2 ring-indigo-500'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
              title="تعديل الشُعب والمواد وحذف وتخصيص كل شيء"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">تعديل كل شيء</span>
              <span className="md:hidden">الإعدادات</span>
            </button>

            {/* Toggle View Mode */}
            <button
              onClick={() => setViewMode(prev => prev === 'structured' ? 'all' : 'structured')}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl text-xs transition-colors"
              title={viewMode === 'structured' ? 'عرض سريع لكافة الخانات (13 خانة)' : 'العودة للعرض المنظم'}
            >
              {viewMode === 'structured' ? <LayoutGrid className="w-4 h-4" /> : <ListFilter className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>

        </div>

        {/* Tier 2: Sub-items of Current Hub (Clean, organized pills) */}
        {viewMode === 'structured' ? (
          <div className="py-2.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-bold text-slate-400 pl-1 hidden sm:inline">
                {currentHub.label}:
              </span>
              
              {currentHub.items.map((item) => {
                const ItemIcon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-300'
                        : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80'
                    }`}
                  >
                    <ItemIcon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && (typeof item.badge === 'number' ? item.badge > 0 : Boolean(item.badge)) && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isActive ? 'bg-indigo-800 text-amber-200' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sub-item Context Helper */}
            {activeItemDetails && (
              <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{activeItemDetails.description}</span>
              </div>
            )}
          </div>
        ) : (
          /* All-tabs Flattened Mode for users who prefer all buttons at glance */
          <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {allItems.map((item) => {
              const ItemIcon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70'
                  }`}
                >
                  <ItemIcon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{item.shortLabel}</span>
                  {item.badge !== undefined && Number(item.badge) > 0 && (
                    <span className={`text-[9px] px-1 rounded-full font-bold ${
                      isActive ? 'bg-indigo-800 text-amber-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </nav>
  );
};
