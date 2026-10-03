import React, { useState, useEffect } from 'react';
import {
  Check,
  Crown,
  ShieldCheck,
  Zap,
  Mail,
  ChevronDown,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WAITLIST_FORM_ENDPOINT } from '../config/waitlist';

export const PricingPage: React.FC = () => {
  const { language, t } = useApp();

  // Waitlist form state
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'dev_notice' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    document.title =
      language === 'ar'
        ? `الأسعار وباقة برو | ${t.appName}`
        : `Pricing & Pro Plan | ${t.appName}`;
    window.scrollTo(0, 0);
  }, [language, t.appName]);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى إدخال بريد إلكتروني صحيح.'
          : 'Please enter a valid email address.'
      );
      return;
    }

    if (!consent) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى الموافقة على استخدام البريد لإبلاغك بالإطلاق.'
          : 'Please agree to use your email to notify you upon launch.'
      );
      return;
    }

    setStatus('submitting');

    // If an external endpoint is configured (Formspree or Google Forms)
    if (WAITLIST_FORM_ENDPOINT && WAITLIST_FORM_ENDPOINT.trim() !== '') {
      try {
        const response = await fetch(WAITLIST_FORM_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            email,
            consent: true,
            source: 'adawaty_pro_waitlist',
            submittedAt: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          setStatus('success');
          setEmail('');
          setConsent(false);
        } else {
          setStatus('error');
          setErrorMessage(
            language === 'ar'
              ? 'حدث خطأ أثناء الإرسال للرابط المخصص، يُرجى المحاولة لاحقاً.'
              : 'An error occurred while submitting to the endpoint. Please try again.'
          );
        }
      } catch {
        setStatus('error');
        setErrorMessage(
          language === 'ar'
            ? 'تعذر الاتصال بالخادم الخارجي، يُرجى التحقق من اتصالك.'
            : 'Could not connect to the form endpoint.'
        );
      }
    } else {
      // Endpoint is not yet configured: do NOT fake a network success.
      // Save locally to localStorage so emails are preserved, and notify clearly.
      try {
        const existing = JSON.parse(localStorage.getItem('adawaty_waitlist_signups') || '[]');
        existing.push({ email, timestamp: new Date().toISOString() });
        localStorage.setItem('adawaty_waitlist_signups', JSON.stringify(existing));
      } catch {
        // Ignore local storage error
      }

      setStatus('dev_notice');
    }
  };

  const faqs = [
    {
      qAr: 'هل الأدوات هتبقى مجانية؟',
      qEn: 'Will the tools stay free?',
      aAr: 'نعم! جميع الأدوات الأساسية في منصة «أدواتي» مجانية 100% وستبقى مجانية دائماً دون أي قيود أو اشتراكات. الاشتراك المدفوع (برو) قادم قريباً وسيكون مخصصاً فقط لميزات إضافية متقدمة دون المساس بمجانية الأدوات الحالية.',
      aEn: 'Yes! All core tools on Adawaty are 100% free and will remain free forever with zero restrictions. The upcoming Pro plan will only provide optional advanced enhancements without altering the free tier.',
    },
    {
      qAr: 'ما هي الميزات المخطط إضافتها في اشتراك برو؟',
      qEn: 'What features are planned for the Pro plan?',
      aAr: 'معالجة دفعات ضخمة من ملفات PDF والصور بضغطة زر، رفع الحد الأقصى للملف الواحد حتى 500 ميجابايت، تجربة نقية تماماً بدون أي مساحات إعلانية، ودعم فني ذو أولوية.',
      aEn: 'Bulk batch operations for dozens of files at once, increased single file limit up to 500MB, an entirely ad-free experience, and priority customer support.',
    },
    {
      qAr: 'هل يتطلب الانضمام لقائمة الانتظار أي دفع الآن؟',
      qEn: 'Does joining the waitlist require payment now?',
      aAr: 'لا، التسجيل في قائمة الانتظار مجاني تماماً ولا يتطلب أي بطاقة دفع أو بيانات بنكية، سنرسل إليك فقط بريداً عند الإطلاق.',
      aEn: 'No, joining the waitlist is 100% free and requires no credit card. We will only email you when Pro launches.',
    },
    {
      qAr: 'هل تضمنون عدم إرسال رسائل مزعجة (سبام)؟',
      qEn: 'Do you guarantee no spam emails?',
      aAr: 'بالتأكيد. لن نستخدم بريدك الإلكتروني إلا لإرسال إشعار واحد عند إطلاق باقة برو رسمياً فقط ولن نشاركه مع أي جهة خارجية أبداً.',
      aEn: 'Absolutely. We will only use your email for a single notification upon the official Pro launch and never share it.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Top Banner: Coming Soon & Waitlist Form */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-600/10 via-amber-500/10 to-indigo-600/10 border-2 border-amber-400/40 dark:border-amber-500/30 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/80">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>{language === 'ar' ? 'قريباً: باقة برو' : 'Coming Soon: Pro Plan'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
            {language === 'ar'
              ? 'الاشتراك المدفوع (برو) قادم قريباً. اترك إيميلك وسنبلغك عند الإطلاق.'
              : 'The paid plan (Pro) is coming soon. Leave your email and we will notify you at launch.'}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {language === 'ar'
              ? 'جميع الأدوات الحالية مجانية بالكامل وستظل مجانية. باقة برو ستوفر إمكانيات متقدمة لمعالجة الملفات الضخمة والدفعات للمحترفين.'
              : 'All current tools are completely free and will always stay free. Pro will provide advanced high-capacity batch features for power users.'}
          </p>

          {/* Waitlist Form */}
          <form onSubmit={handleWaitlistSubmit} className="max-w-xl mx-auto pt-2 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'أدخل بريدك الإلكتروني هنا...'
                      : 'Enter your email address...'
                  }
                  required
                  className="w-full ps-11 pe-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-sm shadow-blue-600/20 whitespace-nowrap cursor-pointer"
              >
                {status === 'submitting'
                  ? language === 'ar'
                    ? 'جارٍ التسجيل...'
                    : 'Submitting...'
                  : language === 'ar'
                  ? 'إبلاغي عند الإطلاق'
                  : 'Notify Me at Launch'}
              </button>
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start gap-2 text-start pt-1">
              <input
                id="consent-checkbox"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="consent-checkbox"
                className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none leading-relaxed"
              >
                {language === 'ar'
                  ? 'أوافق على استخدام بريدي لإبلاغي بالإطلاق فقط'
                  : 'I agree to use my email only to notify me upon launch'}
              </label>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 text-start">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Real Endpoint Success Message */}
            {status === 'success' && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 text-start">
                <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  {language === 'ar'
                    ? 'تم تسجيل بريدك بنجاح! سنقوم بإشعارك فور إطلاق باقة برو.'
                    : 'Your email has been registered! We will notify you when Pro launches.'}
                </span>
              </div>
            )}

            {/* Local Storage / Dev Endpoint Notice (Honest representation without fake network call) */}
            {status === 'dev_notice' && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs space-y-1 text-start">
                <div className="flex items-center gap-2 font-bold">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {language === 'ar'
                      ? 'تم تسجيل بريدك في قائمة الانتظار محلياً على هذا المتصفح!'
                      : 'Email saved locally to waitlist on this browser!'}
                  </span>
                </div>
                <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80 ps-6">
                  {language === 'ar'
                    ? 'ملاحظة للمسؤول: لربط استقبال الإيميلات عبر Formspree أو Google Forms، حدد الرابط في الثابت WAITLIST_FORM_ENDPOINT داخل ملف src/config/waitlist.ts.'
                    : 'Admin Note: To forward submissions to Formspree or Google Forms, configure WAITLIST_FORM_ENDPOINT in src/config/waitlist.ts.'}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Pricing Comparison Cards */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {language === 'ar' ? 'مقارنة الخطط' : 'Plans Comparison'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {language === 'ar'
              ? 'الأدوات الأساسية مجانية دائماً للجميع'
              : 'Core tools will always remain free for everyone'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan 1: Free Plan (Current) */}
          <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {language === 'ar' ? 'الخطة المجانية' : 'Free Plan'}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  {language === 'ar' ? 'متاحة دائماً' : 'Forever Free'}
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  0$
                </span>
                <span className="text-xs text-slate-500">
                  {language === 'ar' ? '/ مجاناً مدى الحياة' : '/ forever'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {language === 'ar'
                  ? 'جميع أدوات PDF والصور والنصوص الأساسية بدون أي رسوم أو تسجيل دخول.'
                  : 'All core PDF, image, and text tools with zero cost and no login.'}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'ar' ? 'معالجة محلية 100% داخل المتصفح' : '100% browser-local processing'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'ar' ? 'ملفاتك لا تغادر جهازك أبداً' : 'Files never leave your device'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'ar' ? 'حد أقصى 100 ميجابايت للملف الواحد' : 'Up to 100MB per file'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'ar' ? 'استخدام غير محدود بدون عداد يومي' : 'Unlimited usage without daily caps'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'ar' ? 'بدون أي علامة مائية' : 'Zero watermarks on outputs'}</span>
                </div>
              </div>
            </div>

            {/* Active Plan Indicator Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled
                className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm cursor-default"
              >
                {language === 'ar' ? 'الخطة الحالية المفعّلة' : 'Current Active Plan'}
              </button>
            </div>
          </div>

          {/* Plan 2: Pro Plan (Coming Soon) */}
          <div className="rounded-2xl border-2 border-amber-300/80 dark:border-amber-600/50 bg-gradient-to-b from-amber-50/40 via-white to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {language === 'ar' ? 'باقة برو (Pro)' : 'Pro Plan'}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/80">
                  {language === 'ar' ? 'قريباً' : 'Coming Soon'}
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  {language === 'ar' ? 'قريباً' : 'Soon'}
                </span>
                <span className="text-xs text-slate-500">
                  {language === 'ar' ? '/ تسعير رمزي' : '/ accessible pricing'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {language === 'ar'
                  ? 'للمحترفين وأصحاب الأعمال الذين يحتاجون معالجة ملفات مجمعة وأحجام ضخمة.'
                  : 'For power users needing bulk processing and huge file capacities.'}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-medium text-slate-900 dark:text-white">
                    {language === 'ar' ? 'كل ميزات الخطة المجانية' : 'All Free Plan features'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{language === 'ar' ? 'معالجة دفعات ضخمة (عشرات الملفات معاً)' : 'High-capacity batch bulk processing'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{language === 'ar' ? 'رفع حد الملفات حتى 500 ميجابايت' : 'Increased file size limits up to 500MB'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{language === 'ar' ? 'واجهة نقية 100% خالية من الإعلانات' : '100% ad-free experience'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{language === 'ar' ? 'أولوية في الدعم وطلب أدوات جديدة' : 'Priority support & tool requests'}</span>
                </div>
              </div>
            </div>

            {/* Requirement 3: Replace the payment buttons with a disabled "قريباً: الدفع الإلكتروني" button */}
            <div className="pt-2">
              <button
                type="button"
                disabled
                className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2 select-none"
              >
                <span>
                  {language === 'ar' ? 'قريباً: الدفع الإلكتروني' : 'Soon: Online Payment'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>{language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {language === 'ar' ? 'كل ما يهمك معرفته حول باقة برو' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            const q = language === 'ar' ? faq.qAr : faq.qEn;
            const a = language === 'ar' ? faq.aAr : faq.aEn;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-start flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>{q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
