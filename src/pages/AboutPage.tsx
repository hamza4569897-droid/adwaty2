import React, { useEffect } from 'react';
import { ShieldCheck, Zap, Heart, EyeOff, Sparkles, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { language, t } = useApp();

  useEffect(() => {
    document.title = language === 'ar' ? 'من نحن | أدواتي' : 'About Us | Adawaty';
    window.scrollTo(0, 0);
  }, [language]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center shadow-xs">
          <Layers className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {language === 'ar' ? 'عن منصة "أدواتي"' : 'About Adawaty'}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.appTagline}
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>{language === 'ar' ? 'رؤيتنا ورسالتنا' : 'Our Mission'}</span>
          </h2>
          <p>
            {language === 'ar'
              ? 'انطلقت "أدواتي" بهدف واحد واضح: تقديم أدوات رقمية مجانية وعالية الأداء باللغة العربية لمعالجة ملفات PDF والصور والنصوص دون المساومة على خصوصية وأمن بيانات المستخدم. لاحظنا أن معظم المواقع الحالية تجبر المستخدمين على رفع عقودهم وصورهم الحساسة إلى خوادم غير معروفة، فقررنا تقديم الحل العصري البديل: معالجة سحابية بدون سحابة، 100% داخل متصفحك.'
              : 'Adawaty was created with one clear purpose: to provide free, high-performance web utilities for processing PDFs, images, and text in Arabic and English without ever compromising user privacy. Unlike traditional services that upload sensitive contracts and photos to mysterious servers, we process 100% of your data right inside your browser.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <EyeOff className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {language === 'ar' ? 'صفر رفع للملفات' : 'Zero Uploads'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {language === 'ar'
                ? 'لا يتم إرسال أي بايت من ملفاتك إلى أي خادم عبر الإنترنت.'
                : 'Not a single byte of your documents is ever transmitted to a remote server.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <Zap className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {language === 'ar' ? 'سرعة قصوى' : 'Ultra Fast'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {language === 'ar'
                ? 'العمليات تتم بقوة معالج جهازك وبدون انتظار الرفع أو طوابير السيرفرات.'
                : 'Processing happens at native device speeds without network latency.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <Heart className="w-6 h-6 text-rose-600" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {language === 'ar' ? 'مجاني بلا حدود' : 'Forever Free'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {language === 'ar'
                ? 'بدون تسجيل دخول، بدون بطاقات بنكية، وبلا قيود على الاستخدام.'
                : 'No accounts, no credit cards, and no daily usage limits.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
