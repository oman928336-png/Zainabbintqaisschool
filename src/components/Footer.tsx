import React from 'react';
import { Crown, Sparkles, Heart, FileText, Share2, ShieldCheck } from 'lucide-react';
import { INITIATIVE_INFO } from '../data/initialData';

interface FooterProps {
  onSwitchToAbout: () => void;
  onSwitchToFounder: () => void;
  onOpenCreateModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSwitchToAbout,
  onSwitchToFounder,
  onOpenCreateModal
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16 no-print">
      {/* Golden Highlight Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-amber-950 py-3 px-4 font-bold text-center text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2">
          <Crown className="w-4 h-4 text-amber-900 inline" />
          <span>
            مبادرة «نجوم التميز» التربوية – إعداد وتصميم وتنفيذ: <strong>الأستاذة باسمة الحكمانية</strong>
          </span>
          <span className="hidden md:inline">•</span>
          <span className="text-amber-900 font-semibold">
            مدارس سلطنة عُمان (الحلقة الأولى)
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Initiative Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">منصة نجوم التميز</h3>
                <p className="text-xs text-amber-300 font-bold">
                  إعداد وتصميم وتنفيذ: الأستاذة باسمة الحكمانية
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              مبادرة تربوية رقمية متكاملة تهدف إلى تمكين معلمات الحلقة الأولى في سلطنة عُمان من تحفيز الطلاب، وتنظيم الشعب الصفية، ومتابعة الحضور، وتكريم أولياء الأمور عبر شهادات التقدير، مع إتاحة إنشاء نسخة صفية مستقلة لكل معلمة.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs">
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                الإصدار: v{INITIATIVE_INFO.version}
              </span>
              <span className="bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                خصوصية وعزل تام للبيانات
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm">روابط المبادرة</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={onSwitchToAbout}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>الوثيقة التعريفية للمبادرة (عن المبادرة)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onSwitchToFounder}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>لوحة صاحبة المبادرة: أ. باسمة الحكمانية</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCreateModal}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-emerald-400"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>أنشئي نسختكِ الخاصة لصفكِ</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Teacher Notice */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm">المعلمات المستفيدات</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              تستطيع كل معلمة إنشاء مساحة عمل خاصة بها وبشعبتها الصفية، وإضافة أسماء طلابها، وتوليد الشهادات باسمها ومدرستها دون تداخل في البيانات.
            </p>
            <div className="text-[11px] text-amber-200/80 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              جميع حقوق الفكرة والتصميم محفوظة للأستاذة / باسمة الحكمانية © {new Date().getFullYear()} م
            </div>
          </div>

        </div>

        {/* Bottom Attribution */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            «نجوم التميز» – مبادرة رقمية لتعزيز طلاب الحلقة الأولى | سلطنة عُمان
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>صُنعت بحب وإخلاص لتعليم أفضل لأطفالنا</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
