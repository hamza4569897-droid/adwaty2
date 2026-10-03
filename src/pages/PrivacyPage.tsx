import React, { useEffect } from 'react';
import { ShieldCheck, Lock, CheckCircle2, Cookie, UserCheck, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CONTACT_EMAIL } from '../config/site';

export const PrivacyPage: React.FC = () => {
  const { language } = useApp();

  useEffect(() => {
    document.title = language === 'ar' ? 'سياسة الخصوصية وحماية البيانات | أدواتي' : 'Privacy & Data Protection Policy | Adawaty';
    window.scrollTo(0, 0);
  }, [language]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xs">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {language === 'ar' ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy & Data Protection Policy'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {language === 'ar'
            ? 'نحن نؤمن بأن خصوصيتك وأمان بياناتك حق غير قابل للمساومة. صممنا منصة "أدواتي" لتعمل بالكامل في متصفحك دون رفع أي ملف.'
            : 'We believe your privacy and security are non-negotiable. Adawaty is engineered to run completely client-side in your browser.'}
        </p>
      </div>

      {/* Main Privacy Guarantee Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/40 border-2 border-emerald-200/80 dark:border-emerald-800 space-y-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Lock className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold text-emerald-950 dark:text-emerald-100">
            {language === 'ar'
              ? 'الضمان الأساسي: ملفاتك لا تغادر جهازك نهائياً'
              : 'Our Fundamental Guarantee: Your Files Never Leave Your Device'}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-emerald-900 dark:text-emerald-200 leading-relaxed">
          {language === 'ar'
            ? 'على عكس معظم أدوات PDF ومحولات الصور السحابية التقليدية التي تطلب منك رفع مستنداتك إلى خوادم وسيطة، تعمل منصة "أدواتي" بنسبة 100% داخل متصفح جهازك باستخدام تقنيات WebAssembly و Canvas البرمجية الحديثة. هذا يعني أن مستنداتك وعقودك وصورك الحساسة لا تغادر هاتفك أو حاسوبك الشخصي بأي شكل من الأشكال.'
            : 'Unlike conventional online file converters that require uploading your documents to third-party cloud servers, Adawaty operates 100% locally within your client browser using WebAssembly and HTML5 Canvas. Your sensitive contracts, invoices, and photos never leave your device.'}
        </p>
      </div>

      <div className="space-y-6 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            <span>{language === 'ar' ? '1. ما هي البيانات التي نجمعها ونعالجها؟' : '1. What Data Do We Collect & Process?'}</span>
          </h3>
          <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
            <li>
              <strong>{language === 'ar' ? 'الملفات والمستندات:' : 'Files and Documents:'}</strong>{' '}
              {language === 'ar'
                ? 'صفر رفع وصفر تخزين. لا نملك أي خادم لتلقي الملفات أو معالجتها أو حفظها.'
                : 'Zero uploads and zero remote storage. We operate without a file processing backend.'}
            </li>
            <li>
              <strong>{language === 'ar' ? 'البريد الإلكتروني:' : 'Email Address:'}</strong>{' '}
              {language === 'ar'
                ? 'فقط في حال قام المستخدم بإدخال بريده طواعية في نموذج الإخطار بالإطلاق أو باقة برو، ونستخدمه حصرياً لإرسال إشعار الإطلاق دون مشاركته مع أي أطراف ثالثة.'
                : 'Only if voluntarily submitted via the launch notification or Pro waitlist form, used solely to inform you of the launch and never sold to third parties.'}
            </li>
            <li>
              <strong>{language === 'ar' ? 'التحليلات مجهولة الهوية:' : 'Anonymous Analytics:'}</strong>{' '}
              {language === 'ar'
                ? 'إذا وافقت على ملفات الارتباط، قد نجمع بيانات مجهولة الهوية بالكامل حول عدد الزيارات والصفحات الشائعة لتحسين الأداء فقط دون تتبع هويتك الشخصية.'
                : 'Upon user consent, we may gather fully anonymized aggregate pageview metrics to improve tool performance.'}
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Cookie className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{language === 'ar' ? '2. ملفات تعريف الارتباط والتخزين المحلي' : '2. Cookies and Local Storage'}</span>
          </h3>
          <p>
            {language === 'ar'
              ? 'نستخدم التخزين المحلي (LocalStorage) لحفظ إعداداتك المفضلة (مثل اختيار اللغة بين العربية والإنجليزية، وتفعيل الوضع النهاري أو الليلي). هذه الإعدادات تبقى في متصفحك ولا تُرسل لأي جهة.'
              : 'We utilize browser LocalStorage to remember your preferences (such as language selection and light/dark theme). These settings stay purely on your device.'}
          </p>
        </section>

        {/* Section 3: AdSense & Partner cookies */}
        <section className="space-y-3 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>{language === 'ar' ? '3. إعلانات Google AdSense وملفات الشركاء' : '3. Google AdSense & Partner Cookies'}</span>
          </h3>
          <p>
            {language === 'ar'
              ? 'قد تستخدم شركة Google وشركاؤها الخارجيون ملفات تعريف ارتباط لعرض إعلانات ملائمة بناءً على زياراتك السابقة لهذا الموقع أو لمواقع أخرى على الإنترنت. يساعدنا عرض هذه الإعلانات غير المزعجة في تغطية تكاليف الخوادم وتطوير الأدوات مجاناً للجميع.'
              : 'Google and its third-party partners may use cookies to serve relevant advertisements based on a user’s prior visits to this website or other sites on the internet.'}
          </p>
          <p>
            {language === 'ar' ? (
              <>
                يمكن للمستخدمين إلغاء استخدام ملفات تعريف الارتباط للإعلانات المخصصة في أي وقت عبر زيارة{' '}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline font-medium"
                >
                  إعدادات إعلانات Google (Google Ads Settings)
                </a>
                .
              </>
            ) : (
              <>
                Users may opt out of personalized advertising by visiting{' '}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline font-medium"
                >
                  Google Ads Settings
                </a>
                .
              </>
            )}
          </p>
        </section>

        {/* Section 4: User Rights */}
        <section className="space-y-3 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{language === 'ar' ? '4. حقوق المستخدم (User Rights)' : '4. User Rights'}</span>
          </h3>
          <p>
            {language === 'ar'
              ? 'يحق لك في أي وقت مسح بيانات التخزين المحلي في متصفحك أو رفض ملفات تعريف الارتباط عبر شريط الإشعار أو من إعدادات المتصفح. إذا قمت بالتسجيل في قائمة الانتظار، يحق لك طلب حذف بريدك الإلكتروني فوراً عن طريق مراسلتنا.'
              : 'You retain full control over your local browser data and cookies. You can clear LocalStorage or refuse tracking cookies anytime. If you registered for waitlist notifications, you can request immediate email deletion by contacting us.'}
          </p>
        </section>

        {/* Section 5: Contact */}
        <section className="space-y-3 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600 shrink-0" />
            <span>{language === 'ar' ? '5. التواصل ومسؤول الخصوصية' : '5. Privacy Inquiries & Contact'}</span>
          </h3>
          <p>
            {language === 'ar'
              ? `إذا كانت لديك أي أسئلة أو استفسارات تتعلق بسياسة الخصوصية وحماية بياناتك، يرجى مراسلتنا مباشرة على البريد الإلكتروني:`
              : `For any questions regarding our privacy practices and data protection, please contact us directly at:`}
          </p>
          <p className="font-mono font-semibold text-blue-600 dark:text-blue-400 text-base">
            {CONTACT_EMAIL}
          </p>
        </section>
      </div>
    </div>
  );
};
