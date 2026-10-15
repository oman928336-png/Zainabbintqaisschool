import { TeacherWorkspace, InitiativeGuidance } from '../types';

export const INITIATIVE_INFO = {
  name: 'نجوم التميز – مبادرة رقمية لتعزيز طلاب الحلقة الأولى',
  author: 'الأستاذة باسمة الحكمانية',
  targetAudience: 'معلمات وطلاب الحلقة الأولى (الصفوف 1 - 4)',
  scope: 'مدارس سلطنة عُمان – الحلقة الأولى',
  version: '3.0 المحدثة للعام الدراسي (2026 / 2027م)',
  dateEstablished: 'سبتمبر 2024م',
  vision: 'بيئة صفية تفاعلية محفزة تستثمر التقنيات الحديثة لإيقاظ شغف التعلم وبناء شخصية الطالب القيادية والواثقة في مرحلة الطفولة المبكرة.',
  mission: 'تمكين معلمات الحلقة الأولى من أدوات تربوية رقمية سهلة الاستخدام تعزز السلوك الإيجابي، وتوثق مسارات التميز، وتمد جسور التواصل الفعّال مع أولياء الأمور والمجتمع المدرسي.',
  pedagogicalGoals: [
    'إثارة الدافعية الذاتية نحو التعلم النشط والمشاركة الصفية اليومية.',
    'غرس القيم والسلوكيات الإيجابية (الاحترام، التعاون، الالتزام، النظام) عبر نظام تعزيز مرئي ومبهج.',
    'تيسير إدارة الصف وتنظيم المجموعات التعاونية ورصد الحضور والغياب للمعلمة دون جهد ورقي.',
    'توطيد الشراكة الإيجابية مع أولياء الأمور عبر شهادات التقدير المباشرة والرسائل التقديرية.',
    'توثيق الشواهد والمبادرات المتميزة للمعلمات وتجهيز ملفات الإنجاز بأسلوب تقني احترافي.',
    'إتاحة استنساخ التجربة لكل معلمة لتملك منصتها المستقلة دون تداخل في خصوصية بيانات الطلاب.'
  ],
  implementationMechanism: [
    'التهيئة الصفية: إطلاق المنصة في بداية العام الدراسي وتوزيع شارات النجوم وتعريف الطلاب بنظام النقاط.',
    'التعزيز الفوري: منح النجوم والشارات أثناء الحصص الدراسية فردياً وجماعياً.',
    'تحفيز المجموعات: تفعيل التنافس الشريف بين المجموعات الصفية وتحديث لوحة الشرف أسبوعياً.',
    'صندوق الهدايا وعجلة المفاجآت: تكريم فرسان التميز بنهاية كل وحدة دراسية أو أسبوع.',
    'الشراكة المجتمعية: إصدار شهادات شكر وتقدير لأولياء الأمور المتابعين لأبنائهم.',
    'التوثيق المهني: أرشفة الأنشطة وأوراق العمل والدروس التطبيقية لملف المعلمة الوظيفي.'
  ],
  expectedResults: [
    'ارتفاع نسبة التحصيل الأكاديمي والمشاركة الصفية لدى طلاب الحلقة الأولى بنسبة تزيد عن 85%.',
    'انخفاض السلوكيات غير المرغوبة وزيادة روح العمل الجماعي والتعاون داخل القاعة الصفية.',
    'توفير 70% من الوقت والجهد المبذول في الرصد الورقي وتصميم شهادات التقدير يدوياً.',
    'تعزيز رضا أولياء الأمور وتوثيق الشراكة التربوية بين البيت والمدرسة.',
    'خلق مجتمع ممارسات تعليمية ملهم بين معلمات الحلقة الأولى في المدرسة.'
  ]
};

export const INITIAL_GUIDANCE: InitiativeGuidance[] = [
  {
    id: 'g-1',
    title: 'إرشادات الأسبوع الأول: ترسيخ مفهوم نجم الأسبوع',
    date: '2026-09-01',
    content: 'عزيزتي المعلمة المتميزة، ابدئي الأسبوع بالتركيز على السلوكيات البسيطة كرفع اليد والاستئذان، واجعلي النجمة الأولى سهلة المنال ليشعر كل طالب بالقدرة على النجاح.',
    category: 'motivation'
  },
  {
    id: 'g-2',
    title: 'استثمار المجموعات التعاونية في حصص القراءة',
    date: '2026-09-15',
    content: 'وزعي الطلاب بحكمة بحيث تضم كل مجموعة مستويات متباينة، وامنحي نقاطاً إضافية للمجموعة التي يتعاون أفرادها في إتقان التهجئة والقراءة الجهرية.',
    category: 'classroom_management'
  },
  {
    id: 'g-3',
    title: 'أثر شهادة الشكر لولي الأمر في تحسين سلوك الطفل',
    date: '2026-10-02',
    content: 'عندما ترسلين شهادة شكر مصممة باسم ولي الأمر عبر الواتساب مع رسالة تشجيعية، يتضاعف حرص الأسرة على متابعة الطالب في المنزل وينعكس ذلك فوراً في الصف.',
    category: 'pedagogy'
  }
];

export const INITIAL_WORKSPACE: TeacherWorkspace = {
  id: 'workspace-demo-1',
  teacherName: 'الأستاذة باسمة الحكمانية',
  schoolName: 'مدرسة الأمل للتعليم الأساسي (1-4)',
  grade: 'الصف الثاني الأساسي',
  section: '1',
  schoolYear: '2026 / 2027 م',
  themeColor: '#4f46e5',
  availableSections: ['1', '2', '3', '4'],
  availableSubjects: [
    'اللغة العربية',
    'التربية الإسلامية',
    'الرياضيات',
    'العلوم',
    'الدراسات الاجتماعية',
    'الفنون التشكيلية',
    'اللغة الإنجليزية',
    'المهارات الحياتية',
    'المهارات الموسيقية',
    'الرياضة المدرسية',
    'تقنية المعلومات'
  ],
  surpriseGifts: [
    '👑 تاج أمير / أميرة الصف ليوم كامل',
    '🎨 قلم سحري ملون ودفتر رسم كرتوني',
    '🏆 مساعد المعلمة في توزيع دفاتر الحصة',
    '⭐ اختيار النشاط الترفيهي المفضل بنهاية الحصة',
    '🎖️ وسام بطل القراءة الذكي',
    '🍬 باقة حلوى الأبطال الصحية',
    '🎲 حرية الجلوس في المقعد الأمامي المتميز',
    '📷 التقاط صورة تذكارية مع المعلمة في لوحة الشرف'
  ],
  students: [
    {
      id: 'st-1',
      name: 'محمد بن سالم الوهيبي',
      gender: 'male',
      avatar: '👦🏻',
      stars: 18,
      points: 90,
      badges: ['بطل الإملاء', 'القارئ الماهر', 'الخلق الرفيع'],
      parentName: 'سالم بن سعيد الوهيبي',
      parentPhone: '+96891234567',
      lastAwardedReason: 'قراءة النص بطلاقة مع الحركات'
    },
    {
      id: 'st-2',
      name: 'فاطمة بنت أحمد البلوشية',
      gender: 'female',
      avatar: '👧🏻',
      stars: 22,
      points: 110,
      badges: ['نجمة الصف', 'فارسة الرياضيات', 'التعاون والمحبة'],
      parentName: 'أحمد بن علي البلوشي',
      parentPhone: '+96892345678',
      lastAwardedReason: 'حل المسألة الحسابية بذكاء ومساعدة زميلتها'
    },
    {
      id: 'st-3',
      name: 'حمد بن ناصر المعمري',
      gender: 'male',
      avatar: '🧒🏽',
      stars: 14,
      points: 70,
      badges: ['الخط الجميل', 'النظام والترتيب'],
      parentName: 'ناصر بن حمد المعمري',
      parentPhone: '+96893456789',
      lastAwardedReason: 'دفتر منظم وخالٍ من الأخطاء'
    },
    {
      id: 'st-4',
      name: 'ريم بنت سلطان العامرية',
      gender: 'female',
      avatar: '👧🏽',
      stars: 20,
      points: 100,
      badges: ['الفنانة المبدعة', 'الاستماع الإيجابي'],
      parentName: 'سلطان بن مسعود العامري',
      parentPhone: '+96894567890',
      lastAwardedReason: 'مشاركة ممتازة في نشاط الرسم والتلوين'
    },
    {
      id: 'st-5',
      name: 'سالم بن خالد الحكماني',
      gender: 'male',
      avatar: '👦🏽',
      stars: 16,
      points: 80,
      badges: ['بطل الاستكشاف', 'السرعة والذكاء'],
      parentName: 'خالد بن سالم الحكماني',
      parentPhone: '+96895678901',
      lastAwardedReason: 'إجابة سريعة وصحيحة في المسابقة الصباحية'
    },
    {
      id: 'st-6',
      name: 'مريم بنت عبدالله الحارثية',
      gender: 'female',
      avatar: '👧🏻',
      stars: 19,
      points: 95,
      badges: ['فصاحة التعبير', 'القدوة الحسنة'],
      parentName: 'عبدالله بن راشد الحارثي',
      parentPhone: '+96896789012',
      lastAwardedReason: 'إلقاء نشيد الصباح بصوت عذب وشجاعة'
    },
    {
      id: 'st-7',
      name: 'هزاع بن فهد الشحي',
      gender: 'male',
      avatar: '👦🏻',
      stars: 15,
      points: 75,
      badges: ['روح الفريق', 'المشاركة الفاعلة'],
      parentName: 'فهد بن هزاع الشحي',
      parentPhone: '+96897890123',
      lastAwardedReason: 'تعاون رائع مع أفراد مجموعته في النشاط'
    },
    {
      id: 'st-8',
      name: 'عائشة بنت خلفان الغافرية',
      gender: 'female',
      avatar: '👧🏼',
      stars: 21,
      points: 105,
      badges: ['أميرة الأخلاق', 'الواجب المكتمل'],
      parentName: 'خلفان بن سيف الغافري',
      parentPhone: '+96898901234',
      lastAwardedReason: 'إتمام جميع الواجبات الإثرائية بنظافة فائقة'
    }
  ],
  groups: [
    {
      id: 'grp-1',
      name: 'مجموعة فرسان القراءة 📖',
      color: 'from-amber-400 to-amber-600',
      icon: 'BookOpen',
      studentIds: ['st-1', 'st-3'],
      points: 160
    },
    {
      id: 'grp-2',
      name: 'مجموعة نجوم الرياضيات 📐',
      color: 'from-emerald-400 to-teal-600',
      icon: 'Calculator',
      studentIds: ['st-2', 'st-5'],
      points: 190
    },
    {
      id: 'grp-3',
      name: 'مجموعة المبدعون الصغار 🎨',
      color: 'from-indigo-400 to-purple-600',
      icon: 'Palette',
      studentIds: ['st-4', 'st-6'],
      points: 195
    },
    {
      id: 'grp-4',
      name: 'مجموعة أبطال المستقبل 🚀',
      color: 'from-rose-400 to-red-600',
      icon: 'Sparkles',
      studentIds: ['st-7', 'st-8'],
      points: 180
    }
  ],
  attendance: [
    { id: 'att-1', date: new Date().toISOString().split('T')[0], studentId: 'st-1', status: 'present' },
    { id: 'att-2', date: new Date().toISOString().split('T')[0], studentId: 'st-2', status: 'present' },
    { id: 'att-3', date: new Date().toISOString().split('T')[0], studentId: 'st-3', status: 'late', note: 'تأخر 5 دقائق لعذر صحي' },
    { id: 'att-4', date: new Date().toISOString().split('T')[0], studentId: 'st-4', status: 'present' },
    { id: 'att-5', date: new Date().toISOString().split('T')[0], studentId: 'st-5', status: 'present' },
    { id: 'att-6', date: new Date().toISOString().split('T')[0], studentId: 'st-6', status: 'present' },
    { id: 'att-7', date: new Date().toISOString().split('T')[0], studentId: 'st-7', status: 'present' },
    { id: 'att-8', date: new Date().toISOString().split('T')[0], studentId: 'st-8', status: 'excused', note: 'إذن رسمي مسبق' }
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'قراءة النص القرائي (رحلة في ربوع عُمان) بالحركات',
      subject: 'اللغة العربية',
      description: 'تدريب الطالب على القراءة الجهرية المعبرة ومراعاة علامات الترقيم، مع ضبط أواخر الكلمات.',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      rewardStars: 2,
      rewardPoints: 10,
      submissions: {
        'st-1': 'completed_distinction',
        'st-2': 'completed_distinction',
        'st-4': 'completed',
        'st-6': 'completed',
        'st-3': 'pending',
        'st-5': 'pending',
        'st-7': 'pending',
        'st-8': 'excused'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-2',
      title: 'حل نشاط كتاب النشاط (جمع عددين من منزلتين ص 24)',
      subject: 'الرياضيات',
      description: 'حل التدريبات في كتاب الرياضيات والتحقق من ناتج الجمع التراكمي وتدوين الخطوات بوضوح.',
      dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      rewardStars: 3,
      rewardPoints: 15,
      submissions: {
        'st-2': 'completed_distinction',
        'st-5': 'completed_distinction',
        'st-1': 'completed',
        'st-3': 'pending'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-3',
      title: 'حفظ وترتيل سورة الفيل بصوت ندي ومتقن',
      subject: 'التربية الإسلامية',
      description: 'متابعة حفظ الآيات الكريمة مع أحكام المد والتجويد البسيطة لطلاب الصف الثاني.',
      dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
      rewardStars: 2,
      rewardPoints: 10,
      submissions: {
        'st-1': 'completed_distinction',
        'st-6': 'completed_distinction',
        'st-8': 'completed'
      },
      createdAt: new Date().toISOString()
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'مبادرة شجرة الحروف الهجائية التفاعلية',
      category: 'teaching_aid',
      date: '2024-10-10',
      description: 'تصميم وسيلة تعليمية مجسمة بجيوب شفافة لتركيب الكلمات وتحليل المقاطع الصوتية لطلاب الصف الأول والثاني.',
      objectives: 'تنمية مهارات الوعي الصوتي وتركيب المقاطع الهجائية لدى طلاب الحلقة الأولى بطريقة لمسية ممتعة.',
      learningImpact: 'تحسن ملحوظ في قراءة الكلمات الثلاثية والمقاطع الساكنة لدى 92% من الطلاب المستهدفين.',
      gradeSection: 'الصف الثاني الأساسي - شعبة 2/1',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
      attachmentsNote: 'تم تطبيقها كورشة مصغرة لمعلمات المجال الأول بالمدرسة.'
    },
    {
      id: 'ach-2',
      title: 'درس تطبيقي: رحلة إلى عالم الأعداد الزوجية والفردية',
      category: 'applied_lesson',
      date: '2024-11-05',
      description: 'تنفيذ درس تطبيقي بنمط التعلم باللعب وقصص كرتونية لتمييز الأعداد الزوجية والفردية بحضور معلمات الحلقة الأولى والمشرفة التربوية.',
      objectives: 'تمكين الطلاب من استنتاج مفهوم العدد الزوجي والفردي عبر تكوين الأزواج الثنائية بالمحسوسات.',
      learningImpact: 'تفاعل 100% من الطلاب ونيل إشادة المشرفة التربوية بالبيئة الصفية الإيجابية ونظام نجوم التميز.',
      gradeSection: 'الصف الثاني الأساسي',
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80'
    }
  ],
  studentCertificates: [
    {
      id: 'sc-1',
      studentId: 'st-2',
      studentName: 'فاطمة بنت أحمد البلوشية',
      title: 'شهادة التميز والتفوق الدراسي',
      reason: 'لتميزها وتألقها في مهارات القراءة والتهجئة وحصولها على وسام نجمة الصف لشهر أكتوبر.',
      date: '2024-10-30',
      templateId: 'gold',
      teacherName: 'الأستاذة باسمة الحكمانية',
      schoolName: 'مدرسة الأمل للتعليم الأساسي (1-4)'
    }
  ],
  parentCertificates: [
    {
      id: 'pc-1',
      studentId: 'st-1',
      studentName: 'محمد بن سالم الوهيبي',
      parentName: 'الفاضل / سالم بن سعيد الوهيبي',
      reason: 'تقديراً لمتابعتكم المنزلية الدائمة وحرصكم المستمر على التزام الطالب وانضباطه، مما كان له أطيب الأثر في تفوقه.',
      date: '2024-11-01',
      templateId: 'elegant-gold',
      teacherName: 'الأستاذة باسمة الحكمانية',
      schoolName: 'مدرسة الأمل للتعليم الأساسي (1-4)',
      sentDate: '2024-11-01'
    }
  ],
  createdAt: '2024-09-01T08:00:00.000Z',
  updatedAt: new Date().toISOString()
};
