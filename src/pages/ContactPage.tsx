import React, { useEffect } from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CONTACT_EMAIL } from '../config/site';

export const ContactPage: React.FC = () => {
  const { language } = useApp();

  useEffect(() => {
    document.title = language === 'ar' ? 'اتصل بنا | أدواتي' : 'Contact Us | Adawaty';
    window.scrollTo(0, 0);
  }, [language]);

  const supportEmail = CONTACT_EMAIL;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center space-y-8">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
        <MessageSquare className="w-8 h-8" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
          {language === 'ar'
            ? 'نسعد دائماً بسماع مقترحاتك وملاحظاتك حول أدواتنا أو طلب أدوات وميزات جديدة ترغب برؤيتها في "أدواتي".'
            : 'We welcome your feedback, bug reports, and suggestions for new tools you would love to see on Adawaty.'}
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {language === 'ar' ? 'البريد الإلكتروني المباشر' : 'Direct Email'}
          </p>
          <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">
            {supportEmail}
          </p>
        </div>

        <a
          href={`mailto:${supportEmail}?subject=${encodeURIComponent(
            language === 'ar' ? 'استفسار / مقترح لموقع أدواتي' : 'Feedback for Adawaty'
          )}`}
          className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm shadow-blue-600/20 active:scale-98 transition-all"
        >
          <Mail className="w-4 h-4" />
          <span>{language === 'ar' ? 'إرسال رسالة بريد إلكتروني' : 'Send an Email'}</span>
        </a>
      </div>
    </div>
  );
};
