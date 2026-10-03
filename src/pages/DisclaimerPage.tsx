import React, { useEffect } from 'react';
import { AlertTriangle, ShieldCheck, Scale, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CONTACT_EMAIL } from '../config/site';

export const DisclaimerPage: React.FC = () => {
  const { language, dir, t } = useApp();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  useEffect(() => {
    document.title =
      language === 'ar'
        ? 'إخلاء المسؤولية القانونية والمالية | أدواتي'
        : 'Disclaimer & Terms of Use | Adawaty';
    window.scrollTo(0, 0);
  }, [language]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-xs">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {language === 'ar' ? 'إخلاء المسؤولية' : 'Disclaimer'}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {language === 'ar'
            ? 'تنبيه قانوني وإرشادي مهم بشأن طبيعة نتائج الأدوات والحاسبات المتاحة على المنصة.'
            : 'Important legal and informational notice regarding the nature of calculations and tools provided on this platform.'}
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
        
        {/* Section 1: Financial & Investment */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-amber-600" />
            <span>
              {language === 'ar'
                ? '1. الحاسبات المالية والاستثمارية والقروض'
                : '1. Financial, Investment & Loan Calculators'}
            </span>
          </h2>
          <p>
            {language === 'ar'
              ? 'جميع الحاسبات المالية على منصة "أدواتي" (مثل: حاسبة الفائدة المركبة، العائد على الاستثمار، قسط السيارة، سداد البطاقة الائتمانية، نقطة التعادل، وهدف الادخار) مُعدة لأغراض إرشادية وتثقيفية وتقريبية فقط. لا تعتبر هذه النتائج بأي حال من الأحوال استشارة مالية، مصرفية، قانونية، أو توصية استثمارية رسمية.'
              : 'All financial calculators on Adawaty (including compound interest, ROI, car loans, credit card payoff, break-even, and savings goals) are provided strictly for educational and indicative estimation purposes. They do not constitute formal financial, banking, legal, or investment advice.'}
          </p>
          <p>
            {language === 'ar'
              ? 'البنوك والجهات التمويلية تطبق سياسات رسوم إدارية، تأمين، وتقريب كسور قد تؤدي إلى اختلافات عن نتائج هذه الحاسبات. يُنصح دائماً بالرجوع إلى مستشارك المالي أو مصرفك قبل اتخاذ أي قرار مالي أو التوقيع على عقود التمويل.'
              : 'Banks and lending institutions apply specific fee structures, insurance fees, and rounding rules that may differ from these calculations. Always consult a certified financial advisor or your bank before executing financial commitments.'}
          </p>
        </div>

        {/* Section 2: Health & Fitness */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Info className="w-5 h-5 text-blue-600" />
            <span>
              {language === 'ar'
                ? '2. الحاسبات الصحية واللياقة البدنية'
                : '2. Health & Fitness Calculators'}
            </span>
          </h2>
          <p>
            {language === 'ar'
              ? 'الحاسبات المتعلقة بالصحة واللياقة (مثل مؤشر كتلة الجسم، السعرات الحرارية، وغيرها) تعتمد على معادلات رياضية عامة مبنية على متوسطات إحصائية. لا تغني نتائج هذه الأدوات عن الاستشارة الطبية المتخصصة، ولا يجوز الاعتماد عليها لتشخيص الحالات الصحية أو وضع خطط علاجية أو غذائية للمرضى والحوامل.'
              : 'Health and fitness calculators rely on generic statistical formulas and averages. They are not a substitute for professional medical advice, diagnosis, or treatment.'}
          </p>
        </div>

        {/* Section 3: Religious & Zakat */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>
              {language === 'ar'
                ? '3. الحاسبات الدينية والزكاة والفرائض'
                : '3. Religious, Zakat & Inheritance Calculators'}
            </span>
          </h2>
          <p>
            {language === 'ar'
              ? 'تعتمد حاسبات الزكاة على الآراء الفقهية الشائعة والنسب المعتمدة لأسعار الذهب والفضة والأنصبة الشرعية. نظراً لتعدد المذاهب والاجتهادات الفقهية وتغير أسعار الأصول، نوصي بمراجعة الجهات والهيئات الشرعية الرسمية ودور الإفتاء المعتمدة للتحقق من وجوب ونصاب زكاة أموالك الخاصة.'
              : 'Zakat calculation tools follow mainstream jurisprudential guidelines and standard nisab thresholds. Due to varying scholarly opinions and fluctuating asset prices, please verify your specific zakat obligations with recognized local Islamic authorities.'}
          </p>
        </div>

        {/* Section 4: Data Processing & Zero Storage */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>
              {language === 'ar'
                ? '4. ضمان أمان البيانات ومسؤولية الاستخدام'
                : '4. Local Data Security & User Responsibility'}
            </span>
          </h2>
          <p>
            {language === 'ar'
              ? 'معالجة جميع الملفات (PDF، الصور، النصوص) تتم بصورة محلية 100% داخل ذاكرة متصفحك دون رفعها أو تخزينها على خوادمنا. يتحمل المستخدم المسؤولية الكاملة عن حفظ نسخ احتياطية من ملفاته الأصلية قبل إجراء أي عمليات تعديل أو ضغط أو حذف صفحات.'
              : 'All files (PDFs, images, texts) are processed 100% locally in your browser memory without being transmitted to our servers. Users remain fully responsible for maintaining original backups prior to performing any modification, compression, or page deletion.'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ar'
              ? `لأي استفسارات قانونية أو فنية، يمكنكم التواصل معنا عبر البريد الإلكتروني: ${CONTACT_EMAIL}`
              : `For legal or technical inquiries, contact us at: ${CONTACT_EMAIL}`}
          </p>
        </div>

      </div>

      <div className="text-center pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
        >
          <span>{t.nav.home}</span>
          <ArrowIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
