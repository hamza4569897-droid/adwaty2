import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const CookieConsent: React.FC = () => {
  const { language } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('adawaty_cookie_consent');
    if (!consent) {
      // Delay display slightly for smooth page entrance
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (choice: 'accepted' | 'rejected') => {
    localStorage.setItem('adawaty_cookie_consent', choice);
    window.dispatchEvent(new Event('cookie_consent_updated'));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label={language === 'ar' ? 'إشعار الخصوصية وملفات تعريف الارتباط' : 'Cookie & Privacy Notice'}
      className="fixed bottom-4 start-4 end-4 sm:start-auto sm:end-6 sm:max-w-md z-50 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-2 flex-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>{language === 'ar' ? 'الخصوصية وملفات الارتباط' : 'Privacy & Cookies'}</span>
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {language === 'ar'
              ? 'تتم معالجة جميع ملفاتك محلياً 100% داخل جهازك دون رفعها. نستخدم ملفات الارتباط والتخزين المحلي لتحسين تجربتك وتخصيص تفضيلاتك وعرض إعلانات غير تطفلية لدعم استمرار الخدمة مجاناً.'
              : 'All your files are processed 100% locally in your browser. We use local storage and non-intrusive cookies to remember your preferences and keep our utilities permanently free.'}
          </p>
          <div className="text-xs pt-1">
            <Link
              to="/privacy"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-block"
            >
              {language === 'ar' ? 'تفاصيل سياسة الخصوصية' : 'Learn more in Privacy Policy'}
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => handleConsent('rejected')}
          className="min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {language === 'ar' ? 'الضرورية فقط' : 'Essential Only'}
        </button>
        <button
          type="button"
          onClick={() => handleConsent('accepted')}
          className="min-h-[40px] px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          {language === 'ar' ? 'موافق وقبول' : 'Accept All'}
        </button>
      </div>
    </aside>
  );
};
