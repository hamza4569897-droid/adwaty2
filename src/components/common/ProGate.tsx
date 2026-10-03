import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ProGateProps {
  featureName?: string;
  className?: string;
}

export const ProGate: React.FC<ProGateProps> = ({ featureName, className = '' }) => {
  const { language, dir } = useApp();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-500/5 via-blue-600/5 to-purple-500/5 border border-amber-300/40 dark:border-amber-600/30 text-center space-y-4 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
        <Crown className="w-6 h-6" />
      </div>

      <div className="space-y-2 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300/60 dark:border-amber-700/60">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'قريباً' : 'Coming Soon'}</span>
        </div>

        {featureName && (
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {featureName}
          </h3>
        )}

        <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          {language === 'ar'
            ? 'هذه الميزة ضمن اشتراك برو، وهو قادم قريباً. الأدوات الأساسية ستبقى مجانية دائماً.'
            : 'This feature is part of the Pro plan, coming soon. Core tools will always remain free.'}
        </p>
      </div>

      <div className="pt-2">
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm shadow-blue-600/20"
        >
          <span>{language === 'ar' ? 'الانضمام لقائمة الانتظار' : 'Join the Pro Waitlist'}</span>
          <ArrowIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
