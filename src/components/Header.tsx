import React from 'react';
import { 
  Sparkles, 
  PlusCircle, 
  Crown, 
  School, 
  UserCheck, 
  Share2, 
  Award, 
  Printer, 
  Link2,
  Sliders,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { TeacherWorkspace } from '../types';

interface HeaderProps {
  currentWorkspace: TeacherWorkspace;
  workspaces: TeacherWorkspace[];
  onSelectWorkspace: (id: string) => void;
  onUpdateSection?: (section: string) => void;
  onOpenCreateModal: () => void;
  onSwitchToFounder: () => void;
  onSwitchToAbout: () => void;
  onSwitchToLinks?: () => void;
  onSwitchToSettings?: () => void;
  isFounderActive: boolean;
  isLinksActive?: boolean;
  isSettingsActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentWorkspace,
  workspaces,
  onSelectWorkspace,
  onUpdateSection,
  onOpenCreateModal,
  onSwitchToFounder,
  onSwitchToAbout,
  onSwitchToLinks,
  onSwitchToSettings,
  isFounderActive,
  isLinksActive,
  isSettingsActive
}) => {
  return (
    <header className="bg-white border-b border-indigo-100 shadow-xs sticky top-0 z-30 no-print">
      
      {/* Top Banner with Author Certification & No-Email Guarantee */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 text-white py-1.5 px-3 sm:px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Author Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-400 text-amber-950 font-black px-2.5 py-0.5 rounded-full text-[11px] shadow-xs flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 inline text-amber-900" />
              <span>مبادرة تربوية رقمية</span>
            </span>
            <span className="text-indigo-200 hidden sm:inline">•</span>
            <span className="font-bold text-amber-200">
              إعداد وتصميم وتنفيذ: الأستاذة باسمة الحكمانية
            </span>
            <span className="text-indigo-300 hidden md:inline text-[11px]">
              (مدارس سلطنة عُمان – الحلقة الأولى 2026 / 2027 م)
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              دخول مباشر بدون إيميل ⚡
            </span>
          </div>

          {/* Quick Header Navigation */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {onSwitchToLinks && (
              <button
                onClick={onSwitchToLinks}
                className={`transition-colors flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold cursor-pointer ${
                  isLinksActive
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/30'
                }`}
                title="مشاركة روابط المعلمات بدون إيميل"
              >
                <Link2 className="w-3 h-3" />
                <span>روابط المعلمات (بدون إيميل)</span>
              </button>
            )}

            <button
              onClick={onSwitchToAbout}
              className="hover:text-amber-300 transition-colors flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-lg text-[11px] cursor-pointer"
              title="عرض الوثيقة الرسمية للمبادرة"
            >
              <BookOpen className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">عن المبادرة</span>
            </button>

            <button
              onClick={onSwitchToFounder}
              className={`transition-colors flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold cursor-pointer ${
                isFounderActive
                  ? 'bg-amber-400 text-amber-950 shadow-xs'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              <Crown className="w-3 h-3 text-amber-300" />
              <span>لوحة صاحبة المبادرة</span>
            </button>

            {onSwitchToSettings && (
              <button
                onClick={onSwitchToSettings}
                className={`transition-colors flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold cursor-pointer ${
                  isSettingsActive
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="تعديل الشُعب والمواد والبيانات"
              >
                <Sliders className="w-3 h-3 text-indigo-300" />
                <span className="hidden md:inline">تعديل كل شيء</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div 
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-200 transform hover:scale-105 transition-transform cursor-pointer" 
            onClick={onSwitchToAbout}
            title="مبادرة نجوم التميز – الأستاذة باسمة الحكمانية"
          >
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 bg-clip-text text-transparent">
                نجوم التميز
              </h1>
              <span className="text-[10px] sm:text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-black">
                الحلقة الأولى (1-4)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
              <span>منظومة التعزيز المدرسي المتكاملة</span>
              <span className="text-slate-300">•</span>
              <span className="text-indigo-600 font-bold">2026 / 2027 م</span>
            </p>
          </div>
        </div>

        {/* Current Teacher & Workspace Selector */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Active Workspace Info Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl px-2.5 sm:px-3 py-1.5 transition-colors">
            <School className="w-4 h-4 text-indigo-600 shrink-0" />
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-medium">المعلمة والصف:</div>
              <div className="text-xs font-black text-slate-800 flex items-center gap-1">
                <span>{currentWorkspace.teacherName}</span>
                <span className="text-indigo-600 font-bold">({currentWorkspace.grade} - {currentWorkspace.section})</span>
              </div>
            </div>
            {workspaces.length > 1 && (
              <select
                value={currentWorkspace.id}
                onChange={(e) => onSelectWorkspace(e.target.value)}
                className="bg-transparent border-0 text-xs font-medium text-slate-600 focus:ring-0 cursor-pointer pr-1"
                title="التبديل بين الصفوف أو نسخ المعلمات"
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.teacherName} ({ws.grade} - {ws.section})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Quick Section Switcher if multiple sections exist */}
          {currentWorkspace.availableSections && currentWorkspace.availableSections.length > 1 && onUpdateSection && (
            <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 rounded-xl px-2 py-1 text-xs">
              <span className="text-[10px] font-bold text-indigo-600">الشعبة:</span>
              <select
                value={currentWorkspace.section}
                onChange={(e) => onUpdateSection(e.target.value)}
                className="bg-transparent border-0 text-xs font-black text-indigo-950 focus:ring-0 cursor-pointer p-0"
                title="التبديل السريع بين شُعبكِ"
              >
                {currentWorkspace.availableSections.map((sec) => (
                  <option key={sec} value={sec}>
                    شعبة {sec}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Direct CTA: Share Link Without Email */}
          {onSwitchToLinks && (
            <button
              onClick={onSwitchToLinks}
              className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer"
              title="مشاركة رابط المعلمات بدون إيميل"
            >
              <Link2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>إرسال رابط للمعلمات</span>
            </button>
          )}

          {/* Major CTA: Create new workspace */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>صف جديد ➕</span>
          </button>

          {/* Print button */}
          <button
            onClick={() => window.print()}
            className="p-2 text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="طباعة الصفحة الحالية"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
