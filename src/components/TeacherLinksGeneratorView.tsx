import React, { useState } from 'react';
import { 
  Link2, 
  Sparkles, 
  Copy, 
  Check, 
  MessageCircle, 
  QrCode, 
  School, 
  Users, 
  Crown, 
  Share2, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck,
  Send,
  Trash2,
  ExternalLink,
  Smartphone,
  Tablet,
  Laptop,
  Globe,
  HelpCircle,
  Zap,
  Info
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { TeacherInviteLink } from '../types';
import { 
  generateTeacherInviteUrl, 
  getGeneralDirectUrl,
  loadInviteLinks, 
  saveInviteLinks, 
  playChime 
} from '../utils/storage';

interface TeacherLinksGeneratorViewProps {
  onOpenCreateModal: () => void;
}

export const TeacherLinksGeneratorView: React.FC<TeacherLinksGeneratorViewProps> = ({
  onOpenCreateModal
}) => {
  // Domain selection (defaults to current live host or user's Netlify app)
  const defaultBaseDomain = window.location.origin.includes('netlify.app')
    ? window.location.origin
    : 'https://basmaalhakmani.netlify.app';

  const [selectedDomain, setSelectedDomain] = useState<string>(
    window.location.origin.includes('run.app') ? window.location.origin : defaultBaseDomain
  );
  const [customDomainInput, setCustomDomainInput] = useState('');
  const [isCustomDomain, setIsCustomDomain] = useState(false);

  const activeDomain = isCustomDomain && customDomainInput.trim() 
    ? customDomainInput.trim() 
    : selectedDomain;

  // General Direct Link State
  const generalLinkUrl = getGeneralDirectUrl(activeDomain);
  const [copiedGeneral, setCopiedGeneral] = useState(false);
  const [generalQrUrl, setGeneralQrUrl] = useState<string | null>(null);

  // Personalized Link Generator State
  const [teacherName, setTeacherName] = useState('');
  const [schoolName, setSchoolName] = useState('مدرسة الحلقة الأولى');
  const [grade, setGrade] = useState('الصف الأول الأساسي');
  const [section, setSection] = useState('1');
  const [schoolYear, setSchoolYear] = useState('2026 / 2027 م');
  const [notes, setNotes] = useState('');

  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [generatedTeacher, setGeneratedTeacher] = useState<string>('');
  const [copiedPersonal, setCopiedPersonal] = useState(false);
  const [personalQrCodeUrl, setPersonalQrCodeUrl] = useState<string | null>(null);
  const [issuedLinks, setIssuedLinks] = useState<TeacherInviteLink[]>(() => loadInviteLinks());

  // Generate general QR on first mount or domain change
  React.useEffect(() => {
    QRCode.toDataURL(generalLinkUrl, {
      width: 260,
      margin: 2,
      color: { dark: '#1e1b4b', light: '#ffffff' }
    }).then(setGeneralQrUrl).catch(console.error);
  }, [generalLinkUrl]);

  // Handle Copy General Link
  const handleCopyGeneral = () => {
    navigator.clipboard.writeText(generalLinkUrl);
    setCopiedGeneral(true);
    playChime('star');
    setTimeout(() => setCopiedGeneral(false), 2000);
  };

  // WhatsApp share for general direct link
  const handleSendGeneralWhatsApp = () => {
    const text = `السلام عليكم ورحمة الله وبركاته 🌸
عزيزتي المعلمة الفاضلة المحترمة،
تحية طيبة وبعد،

يسرني إهداؤكِ رابط منصة مبادرة «نجوم التميز» الرقمية المخصصة لمدارس الحلقة الأولى للعام الدراسي 2026 / 2027 م.

⚡ الرابط يفتح فوراً في المتصفح بدون أي إيميل، وبدون تسجيل، وبدون كلمة مرور:
🔗 الرابط المباشر:
${generalLinkUrl}

✅ مميزات الرابط للمعلمة:
• يعمل على الآيباد والهاتف والكمبيوتر.
• يمكنكِ إدارة صفكِ ورصد نجوم الطلاب وتكليف المهام وحفظ الحضور.
• استخراج شهادات تميز الطلاب وشكر أولياء الأمور باسمكِ ومدرستكِ.
• مستقل تماماً وخاص بصفكِ.

إعداد وتصميم وتنفيذ المبادرة:
الأستاذة / باسمة الحكمانية`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  // Generate Personalized Link
  const handleGeneratePersonalLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) {
      alert('الرجاء كتابة اسم المعلمة المستفيدة');
      return;
    }

    const url = generateTeacherInviteUrl(teacherName, schoolName, grade, section, schoolYear, activeDomain);
    setGeneratedLink(url);
    setGeneratedTeacher(teacherName.trim());

    // Generate QR Code
    try {
      const qr = await QRCode.toDataURL(url, {
        width: 260,
        margin: 2,
        color: { dark: '#1e1b4b', light: '#ffffff' },
      });
      setPersonalQrCodeUrl(qr);
    } catch (err) {
      console.error('Error generating QR code', err);
    }

    // Save to issued archive
    const newRecord: TeacherInviteLink = {
      id: `link-${Date.now()}`,
      teacherName: teacherName.trim(),
      schoolName: schoolName.trim(),
      grade,
      section,
      schoolYear,
      linkUrl: url,
      createdAt: new Date().toISOString(),
      notes: notes.trim() || undefined
    };

    const updated = [newRecord, ...issuedLinks];
    setIssuedLinks(updated);
    saveInviteLinks(updated);

    playChime('tada');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCopyPersonal = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedPersonal(true);
    playChime('star');
    setTimeout(() => setCopiedPersonal(false), 2000);
  };

  const handleSendPersonalWhatsApp = (item: { teacherName: string; schoolName: string; grade: string; section: string; linkUrl: string }) => {
    const text = `السلام عليكم ورحمة الله وبركاته 🌸
عزيزتي المعلمة الفاضلة / ${item.teacherName} المحترمة،
تحية طيبة وبعد،

يسرني إهداؤكِ نسختكِ الصفية المستقلة من مشروع مبادرة «نجوم التميز» التربوية المخصصة لـ (${item.grade} - شعبة ${item.section}) بـ ${item.schoolName} للعام الدراسي 2026 / 2027 م.

⚡ الرابط يفتح فوراً بدون أي إيميل، وبدون تسجيل، وبدون كلمة مرور:
🔗 رابط نسختكِ المباشر:
${item.linkUrl}

(بمجرد النقر، سيتم تهيئة صفكِ وشعبتكِ فوراً على جهازكِ في الآيباد أو الهاتف أو الكمبيوتر، وينضاف اسمكِ كمعلمة للصف في جميع الشهادات المطبوعة)

مع خالص التحايا والتمنيات لكِ ولطلابكِ بعام دراسي حافل بالإنجاز والتألق،،
إعداد وتصميم وتنفيذ المبادرة:
الأستاذة / باسمة الحكمانية`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleDeleteLink = (id: string) => {
    if (confirm('هل ترغبين في حذف هذا الرابط من سجلكِ؟')) {
      const updated = issuedLinks.filter((l) => l.id !== id);
      setIssuedLinks(updated);
      saveInviteLinks(updated);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-indigo-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 text-2xl">
              <Link2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full">
                  مشروع مبادرة نجوم التميز 2026 / 2027 م
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  يفتح بدون إيميل نهائياً
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-white mt-1">
                إرسال ومشاركة الروابط للمعلمات 🔗
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200 mt-0.5">
                تفتح المعلمة الرابط في الآيباد أو الهاتف أو الحاسوب فوراً وبكل سهولة بدون أي طلب إيميل أو تسجيل
              </p>
            </div>
          </div>

          <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20 text-xs text-amber-200 font-bold flex items-center gap-2">
            <Tablet className="w-4 h-4" />
            <Smartphone className="w-4 h-4" />
            <Laptop className="w-4 h-4" />
            <span>متوافق مع جميع الأجهزة</span>
          </div>
        </div>
      </div>

      {/* Official Project Author Accreditation Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-amber-950 p-4 sm:p-5 rounded-3xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-950/15 flex items-center justify-center">
            <Crown className="w-6 h-6 text-amber-950" />
          </div>
          <div>
            <span className="text-[11px] font-black text-amber-900/80 uppercase">
              توثيق الملكية الفكرية والتربوية للمشروع:
            </span>
            <div className="text-base sm:text-lg font-black text-amber-950">
              صاحبة ومصممة المبادرة: الأستاذة / باسمة الحكمانية
            </div>
          </div>
        </div>

        <div className="text-xs font-bold bg-amber-950/10 px-3.5 py-2 rounded-xl border border-amber-950/15">
          مدارس سلطنة عُمان – الحلقة الأولى (1 - 4)
        </div>
      </div>

      {/* Key Reassurance Box: No Email Required */}
      <div className="bg-emerald-50 border-2 border-emerald-300 p-4 sm:p-5 rounded-3xl flex items-start gap-3 shadow-xs">
        <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-emerald-950 flex items-center gap-2">
            <span>ميزة الدخول السريع: لا حاجة لأي إيميل أو تسجيل دخول للمعلمات!</span>
            <span className="bg-emerald-200 text-emerald-900 text-[10px] px-2 py-0.5 rounded-full font-bold">100% مجاني ومباشر</span>
          </h4>
          <p className="text-xs text-emerald-800 leading-relaxed">
            عند إرسال الرابط لأي معلمة زميلة، <strong>لن يُطلب منها أي بريد إلكتروني (Gmail أو غيره) ولن يُطلب كلمة مرور</strong>. بمجرد ضغط الرابط في متصفح Safari على الآيباد أو Chrome على الهاتف أو الكمبيوتر، يفتح النظام جاهزاً بكامل الخصائص والشهادات.
          </p>
        </div>
      </div>

      {/* Domain Selection Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-black text-slate-800">
              نطاق الرابط المستخدم للمشاركة:
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            (يمكنكِ اختيار رابط Netlify أو الرابط المباشر)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => { setSelectedDomain('https://basmaalhakmani.netlify.app'); setIsCustomDomain(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDomain === 'https://basmaalhakmani.netlify.app' && !isCustomDomain
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🌐 موقع Netlify المباشر (basmaalhakmani.netlify.app)
          </button>

          <button
            type="button"
            onClick={() => { setSelectedDomain(window.location.origin); setIsCustomDomain(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDomain === window.location.origin && !isCustomDomain
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            📱 رابط المتصفح الحالي ({window.location.host.slice(0, 25)}...)
          </button>

          <button
            type="button"
            onClick={() => setIsCustomDomain(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isCustomDomain
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ✏️ نطاق مخصص آخر
          </button>
        </div>

        {isCustomDomain && (
          <div className="pt-2">
            <input
              type="url"
              placeholder="https://your-custom-domain.com"
              value={customDomainInput}
              onChange={(e) => setCustomDomainInput(e.target.value)}
              className="w-full px-3 py-2 border border-indigo-300 rounded-xl text-xs outline-hidden"
            />
          </div>
        )}
      </div>

      {/* SECTION 1: GENERAL DIRECT LINK (FOR ALL TEACHERS - NO EMAIL) */}
      <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 p-6 sm:p-7 rounded-3xl border-2 border-indigo-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900">
                  الخيار الأول: الرابط العام المباشر (لأي معلمة فوراً)
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md">
                  بدون إيميل ⚡
                </span>
              </div>
              <p className="text-xs text-slate-500">
                أرسلي هذا الرابط العام لأي معلمة؛ ستفتحه مباشرة وتبدأ صفها الخاص دون الحاجة لأي إعداد مسبق
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500">الرابط المباشر العام:</span>
              <input
                type="text"
                readOnly
                value={generalLinkUrl}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-indigo-900 select-all font-semibold"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopyGeneral}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-transform transform active:scale-98"
              >
                {copiedGeneral ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedGeneral ? 'تم نسخ الرابط بنجاح!' : 'نسخ الرابط المباشر'}</span>
              </button>

              <button
                type="button"
                onClick={handleSendGeneralWhatsApp}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-transform transform active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>إرسال بالواتساب مع رسالة جاهزة 💬</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-4 bg-white p-3.5 rounded-2xl border border-slate-200 text-center space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700 block">
              رمز QR للآيباد والهاتف:
            </span>
            {generalQrUrl && (
              <img
                src={generalQrUrl}
                alt="General QR Code"
                className="w-32 h-32 mx-auto rounded-xl border border-slate-100 shadow-2xs"
              />
            )}
            <span className="text-[10px] text-slate-400 block">
              مسح مباشر بكاميرا الآيباد بدون إيميل
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: PERSONALIZED CLASS LINKS FOR INDIVIDUAL TEACHERS */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">
                الخيار الثاني: توليد روابط مخصصة باسم وشعبة كل معلمة
              </h3>
              <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-md">
                مخصص بالاسم 🎯
              </span>
            </div>
            <p className="text-xs text-slate-500">
              اكتبي اسم المعلمة وشعبتها وصفها لتوليد رابط يفتح صفها مباشرة وينضاف اسمها كمعلمة في الشهادات
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleGeneratePersonalLink} className="space-y-4 text-xs">
              <div>
                <label className="block font-black text-slate-700 mb-1">
                  1. اسم المعلمة المستفيدة (يظهر في الشهادات المطبوعة) *
                </label>
                <input
                  type="text"
                  placeholder="مثال: أ. منى بنت سيف الشكيلية"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-indigo-500 outline-hidden font-medium text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 mb-1">
                  2. اسم المدرسة *
                </label>
                <input
                  type="text"
                  placeholder="مثال: مدرسة الواحة للتعليم الأساسي (1-4)"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-indigo-500 outline-hidden font-medium text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-black text-slate-700 mb-1">
                    3. الصف الدراسي *
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-white font-medium text-xs sm:text-sm"
                  >
                    <option value="الصف الأول الأساسي">الصف الأول الأساسي</option>
                    <option value="الصف الثاني الأساسي">الصف الثاني الأساسي</option>
                    <option value="الصف الثالث الأساسي">الصف الثالث الأساسي</option>
                    <option value="الصف الرابع الأساسي">الصف الرابع الأساسي</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black text-slate-700 mb-1">
                    4. الشعبة المخصصة *
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 1 أو 2 أو 3"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-medium text-xs sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 mb-1">
                    5. العام الدراسي *
                  </label>
                  <input
                    type="text"
                    value={schoolYear}
                    onChange={(e) => setSchoolYear(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-medium text-xs sm:text-sm bg-slate-50 font-bold text-slate-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ملاحظات أو وسم المعلمة (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: معلمة مجال أول / صف المتميزين الصغار..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-800 text-white font-black py-3 rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform transform active:scale-98"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>توليد رابط النسخة المخصصة للمعلمة (بدون إيميل) ✨</span>
              </button>
            </form>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-5 space-y-3">
            {generatedLink ? (
              <div className="bg-slate-50 p-5 rounded-3xl border-2 border-indigo-300 shadow-md space-y-3 animate-in zoom-in-95">
                <div className="flex items-center gap-2 text-indigo-950 font-black text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>تم تجهيز الرابط الخاص بالأستاذة / {generatedTeacher}</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 mb-1">رابط المعلمة المباشر:</div>
                  <input
                    type="text"
                    readOnly
                    value={generatedLink}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-800 select-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyPersonal(generatedLink)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {copiedPersonal ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPersonal ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSendPersonalWhatsApp({
                        teacherName: generatedTeacher,
                        schoolName,
                        grade,
                        section,
                        linkUrl: generatedLink
                      })
                    }
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>إرسال بالواتساب 💬</span>
                  </button>
                </div>

                {personalQrCodeUrl && (
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center space-y-1">
                    <span className="text-[11px] font-black text-slate-800 block">
                      رمز QR المباشر للآيباد 📱
                    </span>
                    <img
                      src={personalQrCodeUrl}
                      alt="Personal QR Code"
                      className="w-32 h-32 mx-auto rounded-xl border border-slate-100"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      يوجه كاميرا الآيباد للرمز لفتح الصف فوراً
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-300 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center">
                  <Link2 className="w-6 h-6" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-slate-800">
                  جاهز لإنشاء رابط مخصص
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  اكتبي اسم المعلمة واضغطي «توليد رابط النسخة المخصصة» للحصول فوراً على رابط مباشر ورسالة واتساب ورمز QR.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HOW TO ADD TO IPAD/PHONE HOME SCREEN (PWA Guide for teachers) */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Tablet className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-black text-slate-900">
            طريقة حفظ الرابط كأيقونة تطبيق على الآيباد أو الهاتف بدون إيميل 📱
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          يمكن لأي معلمة فتح الرابط لمرة واحدة، ثم تثبيته كأيقونة على شاشتها الرئيسية ليعمل مثل تطبيق الآيباد بدون أي تسجيل:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-black text-indigo-900 flex items-center gap-1.5">
              <span>🍏 على أجهزة الآيباد والآيفون (Safari):</span>
            </span>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
              <li>تفتح المعلمة الرابط في متصفح Safari.</li>
              <li>تضغط على أيقونة <strong>«المشاركة» (Share 📤)</strong> في شريط المتصفح.</li>
              <li>تختار خيار <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen ➕)</strong>.</li>
              <li>ستظهر أيقونة «نجوم التميز» فوراً على سطح جهازها وتفتح بلمسة واحدة!</li>
            </ol>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-black text-indigo-900 flex items-center gap-1.5">
              <span>🤖 على أجهزة أندرويد والكمبيوتر (Chrome):</span>
            </span>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
              <li>تفتح المعلمة الرابط في متصفح Chrome.</li>
              <li>تضغط على زر القائمة (الثلاث نقاط <strong>⋮</strong> بالأعلى).</li>
              <li>تختار <strong>«تثبيت التطبيق»</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.</li>
              <li>يعمل النظام بشكل كامل ومباشر بدون إنترنت وبدون إيميل!</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Archive Table of Issued Teacher Links */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-800">
              سجل الروابط والشُعب المرسلة للمعلمات ({issuedLinks.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            مشروع الأستاذة باسمة الحكمانية
          </span>
        </div>

        {issuedLinks.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            لم يتم إصدار أي روابط مخصصة بعد. استخدمي الخيار الأول لإرسال الرابط العام أو الخيار الثاني لإصدار رابط مخصص.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <th className="py-2.5 px-3">المعلمة المستفيدة</th>
                  <th className="py-2.5 px-3">المدرسة</th>
                  <th className="py-2.5 px-3">الصف والشعبة</th>
                  <th className="py-2.5 px-3">العام الدراسي</th>
                  <th className="py-2.5 px-3">تاريخ الإصدار</th>
                  <th className="py-2.5 px-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {issuedLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-black text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{link.teacherName}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{link.schoolName}</td>
                    <td className="py-3 px-3 font-bold text-indigo-600">{link.grade} (شعبة {link.section})</td>
                    <td className="py-3 px-3 text-slate-500">{link.schoolYear}</td>
                    <td className="py-3 px-3 text-slate-400">{new Date(link.createdAt).toLocaleDateString('ar-OM')}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleCopyPersonal(link.linkUrl)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                          title="نسخ الرابط"
                        >
                          <Copy className="w-3 h-3" />
                          <span>نسخ</span>
                        </button>

                        <button
                          onClick={() => handleSendPersonalWhatsApp(link)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                          title="إرسال بالواتساب"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>واتساب</span>
                        </button>

                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                          title="حذف الرابط من السجل"
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
        )}
      </div>

    </div>
  );
};
