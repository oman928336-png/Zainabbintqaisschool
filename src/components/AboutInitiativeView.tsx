import React from 'react';
import { 
  Sparkles, 
  Crown, 
  Target, 
  Eye, 
  Compass, 
  CheckCircle, 
  Users, 
  Award, 
  Printer, 
  School, 
  FileCheck2, 
  ShieldCheck,
  Calendar,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { INITIATIVE_INFO } from '../data/initialData';
import { TeacherWorkspace } from '../types';

interface AboutInitiativeViewProps {
  currentWorkspace: TeacherWorkspace;
  onOpenCreateModal: () => void;
}

export const AboutInitiativeView: React.FC<AboutInitiativeViewProps> = ({
  currentWorkspace,
  onOpenCreateModal
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Action Toolbar (No-print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs no-print">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-slate-700">
            الوثيقة التعريفية الرسمية لمبادرة «نجوم التميز»
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة وتصدير الوثيقة (PDF)</span>
          </button>
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>أنشئي نسختكِ لصفكِ</span>
          </button>
        </div>
      </div>

      {/* Official Printable Portfolio / Document Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print:shadow-none print:border-0 print:m-0">
        
        {/* Header of the Official Document */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 sm:p-10 relative overflow-hidden print:bg-indigo-900">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
                <Sparkles className="w-9 h-9" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-300 font-bold bg-white/10 px-2.5 py-0.5 rounded-full inline-block">
                  مبادرة تربوية رقمية نوعية
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
                  «نجوم التميز»
                </h1>
                <p className="text-indigo-200 text-sm mt-0.5 font-medium">
                  منظومة رقمية تفاعلية لتعزيز طلاب الحلقة الأولى وبناء السلوك الإيجابي
                </p>
              </div>
            </div>

            <div className="text-left bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20 text-xs text-indigo-100 min-w-[200px]">
              <div className="text-amber-300 font-bold">سلطنة عُمان</div>
              <div className="text-slate-200 mt-0.5">وزارة التربية والتعليم</div>
              <div className="text-slate-300">مدارس الحلقة الأولى (1 - 4)</div>
              <div className="text-[11px] text-amber-200/90 mt-1">العام الدراسي: 2026 / 2027 م</div>
            </div>
          </div>

          {/* Golden Attribution Ribbon */}
          <div className="mt-6 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-amber-950 p-4 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-900/15 flex items-center justify-center font-black">
                <Crown className="w-6 h-6 text-amber-950" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-900/80">
                  إعداد وتصميم وتنفيذ المبادرة:
                </div>
                <div className="text-lg sm:text-xl font-black text-amber-950">
                  الأستاذة / باسمة الحكمانية
                </div>
              </div>
            </div>
            <div className="text-xs font-bold bg-amber-900/10 px-3 py-1.5 rounded-xl border border-amber-900/15">
              الإصدار المعتمد للمبادرة v{INITIATIVE_INFO.version}
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div className="p-6 sm:p-10 space-y-8 text-slate-800">

          {/* Quick Fact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs mb-1">
                <Users className="w-4 h-4" />
                <span>الفئة المستهدفة</span>
              </div>
              <div className="text-sm font-black text-slate-800">{INITIATIVE_INFO.targetAudience}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs mb-1">
                <Compass className="w-4 h-4" />
                <span>نطاق التطبيق</span>
              </div>
              <div className="text-sm font-black text-slate-800">{INITIATIVE_INFO.scope}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs mb-1">
                <Calendar className="w-4 h-4" />
                <span>تاريخ التأسيس</span>
              </div>
              <div className="text-sm font-black text-slate-800">{INITIATIVE_INFO.dateEstablished}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>طبيعة المنصة</span>
              </div>
              <div className="text-sm font-black text-slate-800">مستقلة لكل معلمة وصف</div>
            </div>
          </div>

          {/* Idea & Overview */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 sm:p-7">
            <div className="flex items-center gap-2.5 text-indigo-900 font-black text-lg mb-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2>فكرة المبادرة</h2>
            </div>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              انطلقت مبادرة <strong>«نجوم التميز»</strong> من واقع الميدان التربوي بمدارس سلطنة عُمان، بهدف إيجاد منصة رقمية جاذبة وسهلة الاستخدام تُعين معلمات الحلقة الأولى على إثارة حماس الطلاب، وبناء بيئة صفية إيجابية قائمة على التحفيز المستمر، وتوثيق السلوك المتميز، وتعزيز الشراكة مع أولياء الأمور. صُممت المنصة لتكون نظاماً متكاملاً تقتنيه كل معلمة كنسخة خاصة بها، فتدير طلابها وشعبتها دون أدنى اختلاط بالبيانات بين المعلمات، بينما يظل التوثيق الفكري والأكاديمي للمبادرة مسجلاً باسم صاحبتها ومصممتها <strong>الأستاذة باسمة الحكمانية</strong>.
            </p>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6">
              <div className="flex items-center gap-2.5 text-amber-950 font-black text-lg mb-2">
                <Eye className="w-5 h-5 text-amber-700" />
                <h3>الرؤية</h3>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                {INITIATIVE_INFO.vision}
              </p>
            </div>

            <div className="bg-teal-50/70 border border-teal-200/80 rounded-3xl p-6">
              <div className="flex items-center gap-2.5 text-teal-950 font-black text-lg mb-2">
                <Target className="w-5 h-5 text-teal-700" />
                <h3>الرسالة</h3>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                {INITIATIVE_INFO.mission}
              </p>
            </div>
          </div>

          {/* Pedagogical Goals */}
          <div>
            <div className="flex items-center gap-2.5 text-indigo-950 font-black text-lg mb-4">
              <Award className="w-5 h-5 text-indigo-600" />
              <h3>الأهداف التربوية للمبادرة</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {INITIATIVE_INFO.pedagogicalGoals.map((goal, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs hover:border-indigo-200 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                    {goal}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation Mechanism */}
          <div>
            <div className="flex items-center gap-2.5 text-indigo-950 font-black text-lg mb-4">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h3>آلية التطبيق في الميدان المدرسي</h3>
            </div>
            <div className="space-y-3">
              {INITIATIVE_INFO.implementationMechanism.map((mech, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                    {mech}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Results */}
          <div>
            <div className="flex items-center gap-2.5 text-indigo-950 font-black text-lg mb-4">
              <HeartHandshake className="w-5 h-5 text-indigo-600" />
              <h3>المخرجات والنتائج المتوقعة</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INITIATIVE_INFO.expectedResults.map((res, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-2xl">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-emerald-950 text-xs sm:text-sm leading-relaxed">
                    {res}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Verification & Certification Section for Administration */}
          <div className="border-t-2 border-dashed border-slate-300 pt-8 mt-8">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
              <div className="text-center mb-6">
                <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full">
                  توثيق واعتماد المبادرة بالمدرسة
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-800 mt-2">
                  سجل تطبيق المبادرة للعام الدراسي الحالي
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="text-slate-400 font-bold mb-1">صاحبة ومصممة المبادرة</div>
                  <div className="font-black text-slate-800 text-sm">الأستاذة / باسمة الحكمانية</div>
                  <div className="text-[11px] text-slate-500 mt-2">التوقيع والاعتماد: ____________</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="text-slate-400 font-bold mb-1">المعلمة المستفيدة المنفذة</div>
                  <div className="font-black text-indigo-700 text-sm">{currentWorkspace.teacherName || 'الأستاذة / ___________'}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{currentWorkspace.schoolName} ({currentWorkspace.grade})</div>
                  <div className="text-[11px] text-slate-500 mt-1">التوقيع: ____________</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="text-slate-400 font-bold mb-1">اعتماد إدارة المدرسة / المشرفة</div>
                  <div className="font-black text-slate-800 text-sm">مديرة المدرسة / المشرفة التربوية</div>
                  <div className="text-[11px] text-slate-500 mt-2">الختم والتوقيع: ____________</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer of the Document */}
        <div className="bg-slate-100 border-t border-slate-200 p-4 text-center text-xs text-slate-500">
          «نجوم التميز» – جميع حقوق الفكرة والتصميم محفوظة للأستاذة باسمة الحكمانية © {new Date().getFullYear()} م | سلطنة عُمان
        </div>
      </div>
    </div>
  );
};
