import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CONTACT_EMAIL } from '../config/site';

export const TermsPage: React.FC = () => {
  const { language } = useApp();

  useEffect(() => {
    document.title = language === 'ar' ? 'الشروط والأحكام | أدواتي' : 'Terms of Service | Adawaty';
    window.scrollTo(0, 0);
  }, [language]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {language === 'ar' ? 'الشروط والأحكام' : 'Terms of Service'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {language === 'ar' ? 'شروط استخدام موقع وخدمات أدواتي' : 'Terms governing the usage of Adawaty tools'}
        </p>
      </div>

      <div className="space-y-6 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {language === 'ar' ? '1. الاستخدام المقبول' : '1. Acceptable Use'}
        </h2>
        <p>
          {language === 'ar'
            ? 'منصة "أدواتي" متاحة للاستخدام الشخصي والتجاري مجاناً بالكامل. أنت مسؤول بمفردك عن شرعية ومحتوى الملفات التي تعالجها باستخدام المتصفح.'
            : 'Adawaty is freely available for personal and commercial usage. You are solely responsible for the legality and ownership of the files processed via your device.'}
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {language === 'ar' ? '2. إخلاء المسؤولية' : '2. Disclaimer'}
        </h2>
        <p>
          {language === 'ar'
            ? 'تُقدم الأدوات "كما هي" دون أي ضمانات صريحة أو ضمنية. نحن نسعى دائماً لضمان دقة التحويل والدمج والضغط، لكن يُنصح دائماً بالاحتفاظ بنسخ احتياطية أصلية من مستنداتك وصورك الهامة.'
            : 'All tools are provided on an "as-is" basis without warranties of any kind. While we rigorously test all algorithms, we always recommend keeping backups of your original documents.'}
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {language === 'ar' ? '3. التعديلات على الشروط' : '3. Changes to Terms'}
        </h2>
        <p>
          {language === 'ar'
            ? 'نحتفظ بالحق في تحديث هذه الشروط عند إضافة أدوات أو ميزات جديدة لتحسين التجربة وضمان الأمان.'
            : 'We reserve the right to periodically update these terms as new tools or features are introduced.'}
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {language === 'ar' ? '4. التواصل والاستفسارات' : '4. Inquiries & Contact'}
        </h2>
        <p>
          {language === 'ar'
            ? `لأي استفسارات قانونية أو تنظيمية حول شروط الاستخدام، يمكنكم مراسلتنا عبر: ${CONTACT_EMAIL}`
            : `For any legal inquiries regarding these terms, please reach out to: ${CONTACT_EMAIL}`}
        </p>
      </div>
    </div>
  );
};
