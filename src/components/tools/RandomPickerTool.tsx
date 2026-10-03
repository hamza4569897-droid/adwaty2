import React, { useState } from 'react';
import { Trophy, Dices, Copy, Check, Sparkles, RefreshCw, Hash, CircleDot } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RandomPickerTool: React.FC = () => {
  const { language, t } = useApp();
  const [activeTab, setActiveTab] = useState<'names' | 'numbers' | 'dice'>('names');

  // --- Names state ---
  const [namesInput, setNamesInput] = useState<string>(
    'أحمد علي\nمحمد إبراهيم\nسارة محمود\nعمر خالد\nنور حسن\nفاطمة الزهراء\nيوسف طارق'
  );
  const [winnerCount, setWinnerCount] = useState<number>(1);
  const [isRollingNames, setIsRollingNames] = useState<boolean>(false);
  const [winners, setWinners] = useState<string[]>([]);
  const [copiedWinners, setCopiedWinners] = useState<boolean>(false);

  // --- Numbers state ---
  const [minNum, setMinNum] = useState<number>(1);
  const [maxNum, setMaxNum] = useState<number>(100);
  const [numCount, setNumCount] = useState<number>(3);
  const [uniqueNumbers, setUniqueNumbers] = useState<boolean>(true);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [copiedNumbers, setCopiedNumbers] = useState<boolean>(false);

  // --- Coin / Dice state ---
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);
  const [diceCount, setDiceCount] = useState<1 | 2>(1);
  const [diceResult, setDiceResult] = useState<number[]>([6]);
  const [isFlippingCoin, setIsFlippingCoin] = useState<boolean>(false);
  const [isRollingDice, setIsRollingDice] = useState<boolean>(false);

  // Pick Names Handler
  const handlePickWinners = () => {
    const list = namesInput
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (list.length === 0) return;

    setIsRollingNames(true);
    setWinners([]);

    // Quick rolling animation simulation
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        // Pick final winners
        const shuffled = [...list].sort(() => Math.random() - 0.5);
        const count = Math.min(winnerCount, shuffled.length);
        setWinners(shuffled.slice(0, count));
        setIsRollingNames(false);
      }
    }, 80);
  };

  // Generate Numbers Handler
  const handleGenerateNumbers = () => {
    const min = Math.min(minNum, maxNum);
    const max = Math.max(minNum, maxNum);
    const rangeSize = max - min + 1;

    let res: number[] = [];
    if (uniqueNumbers && numCount <= rangeSize) {
      const pool = Array.from({ length: rangeSize }, (_, i) => min + i);
      pool.sort(() => Math.random() - 0.5);
      res = pool.slice(0, numCount);
    } else {
      for (let i = 0; i < numCount; i++) {
        res.push(Math.floor(Math.random() * rangeSize) + min);
      }
    }
    setGeneratedNumbers(res);
  };

  // Flip Coin
  const handleFlipCoin = () => {
    setIsFlippingCoin(true);
    setTimeout(() => {
      setCoinResult(Math.random() > 0.5 ? 'heads' : 'tails');
      setIsFlippingCoin(false);
    }, 400);
  };

  // Roll Dice
  const handleRollDice = () => {
    setIsRollingDice(true);
    setTimeout(() => {
      const r = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);
      setDiceResult(r);
      setIsRollingDice(false);
    }, 400);
  };

  const copyText = (text: string, callback: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    callback(true);
    setTimeout(() => callback(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('names')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
            activeTab === 'names'
              ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>{language === 'ar' ? 'سحب الأسماء والفائزين' : 'Name Picker'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('numbers')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
            activeTab === 'numbers'
              ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>{language === 'ar' ? 'أرقام عشوائية' : 'Random Numbers'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dice')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
            activeTab === 'dice'
              ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Dices className="w-4 h-4" />
          <span>{language === 'ar' ? 'قرعة ونرد' : 'Coin & Dice'}</span>
        </button>
      </div>

      {/* TAB 1: NAMES PICKER */}
      {activeTab === 'names' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label htmlFor="namesArea" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'ar' ? 'قائمة الأسماء والمشاركين (اسم في كل سطر):' : 'List of Participants (one per line):'}
              </label>
              <textarea
                id="namesArea"
                rows={8}
                value={namesInput}
                onChange={(e) => setNamesInput(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب كل اسم في سطر مستقل...' : 'Enter names...'}
                className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600 resize-y"
              />

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'عدد الفائزين المطلوب اختيارهم:' : 'Number of winners:'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={winnerCount}
                  onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-center"
                />
              </div>

              <button
                type="button"
                onClick={handlePickWinners}
                disabled={isRollingNames}
                className="w-full min-h-[48px] rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 active:scale-98 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isRollingNames ? (language === 'ar' ? 'جارٍ السحب العشوائي...' : 'Rolling...') : (language === 'ar' ? 'إجراء السحب واختيار الفائز' : 'Pick Random Winner')}</span>
              </button>
            </div>

            {/* Winners Display Box */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {language === 'ar' ? 'الفائزون في السحب:' : 'Selected Winners:'}
                  </span>
                  {winners.length > 0 && (
                    <button
                      type="button"
                      onClick={() => copyText(winners.join('\n'), setCopiedWinners)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      {copiedWinners ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedWinners ? t.common.copySuccess : t.common.copy}</span>
                    </button>
                  )}
                </div>

                {isRollingNames ? (
                  <div className="py-12 text-center space-y-3 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 mx-auto flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    </div>
                    <p className="text-sm font-bold text-blue-600">{language === 'ar' ? 'نختار عشوائياً...' : 'Picking random name...'}</p>
                  </div>
                ) : winners.length > 0 ? (
                  <div className="space-y-3 py-2">
                    {winners.map((w, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200 dark:border-amber-900/40 flex items-center gap-3 shadow-xs"
                      >
                        <span className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-sm shrink-0">
                          #{idx + 1}
                        </span>
                        <p className="text-lg font-bold text-amber-950 dark:text-amber-100 truncate">
                          {w}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-400 text-sm">
                    {language === 'ar' ? 'اضغط على زر السحب لاختيار الفائز' : 'Click the button to pick a winner'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RANDOM NUMBERS */}
      {activeTab === 'numbers' && (
        <div className="max-w-2xl mx-auto space-y-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'الحد الأدنى (Min):' : 'Min:'}
              </label>
              <input
                type="number"
                value={minNum}
                onChange={(e) => setMinNum(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'الحد الأقصى (Max):' : 'Max:'}
              </label>
              <input
                type="number"
                value={maxNum}
                onChange={(e) => setMaxNum(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'عدد الأرقام (Count):' : 'Count:'}
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={numCount}
                onChange={(e) => setNumCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-center"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="uniqueCheck"
              type="checkbox"
              checked={uniqueNumbers}
              onChange={(e) => setUniqueNumbers(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300"
            />
            <label htmlFor="uniqueCheck" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              {language === 'ar' ? 'منع تكرار الأرقام (أرقام فريدة)' : 'Generate unique numbers without repeats'}
            </label>
          </div>

          <button
            type="button"
            onClick={handleGenerateNumbers}
            className="w-full min-h-[48px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 active:scale-98 transition-all"
          >
            <Hash className="w-5 h-5" />
            <span>{language === 'ar' ? 'توليد الأرقام العشوائية' : 'Generate Random Numbers'}</span>
          </button>

          {generatedNumbers.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {language === 'ar' ? 'الأرقام الناتجة:' : 'Generated Numbers:'}
                </span>
                <button
                  type="button"
                  onClick={() => copyText(generatedNumbers.join(', '), setCopiedNumbers)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-xs font-semibold flex items-center gap-1 border border-slate-200 dark:border-slate-600 transition-colors"
                >
                  {copiedNumbers ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNumbers ? t.common.copySuccess : t.common.copy}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {generatedNumbers.map((n, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-mono text-lg font-bold shadow-xs"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COIN & DICE */}
      {activeTab === 'dice' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Coin Toss */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <CircleDot className="w-5 h-5 text-amber-500" />
              <span>{language === 'ar' ? 'رمي العملة (ملك أو كتابة)' : 'Coin Toss'}</span>
            </h3>

            <div className="py-6">
              <div
                className={`w-28 h-28 mx-auto rounded-full border-4 border-amber-400 bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-amber-950 font-bold text-lg shadow-md transition-transform duration-300 ${
                  isFlippingCoin ? 'rotate-180 scale-90' : ''
                }`}
              >
                {coinResult ? (
                  coinResult === 'heads'
                    ? language === 'ar' ? 'ملك 👑' : 'Heads'
                    : language === 'ar' ? 'كتابة 🦅' : 'Tails'
                ) : (
                  '؟'
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleFlipCoin}
              disabled={isFlippingCoin}
              className="w-full min-h-[44px] rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-xs transition-all"
            >
              {language === 'ar' ? 'رمي العملة الآن' : 'Flip Coin'}
            </button>
          </div>

          {/* Dice Roll */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Dices className="w-5 h-5 text-blue-600" />
                <span>{language === 'ar' ? 'رمي النرد' : 'Roll Dice'}</span>
              </h3>

              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setDiceCount(1)}
                  className={`px-2 py-1 rounded-md border ${
                    diceCount === 1 ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' : ''
                  }`}
                >
                  نرد 1
                </button>
                <button
                  type="button"
                  onClick={() => setDiceCount(2)}
                  className={`px-2 py-1 rounded-md border ${
                    diceCount === 2 ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' : ''
                  }`}
                >
                  نردين 2
                </button>
              </div>
            </div>

            <div className="py-6 flex items-center justify-center gap-4">
              {diceResult.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-20 h-20 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-3xl font-extrabold text-blue-600 dark:text-blue-400 shadow-sm transition-transform duration-300 ${
                    isRollingDice ? 'rotate-45 scale-90' : ''
                  }`}
                >
                  {val}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleRollDice}
              disabled={isRollingDice}
              className="w-full min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-all"
            >
              {language === 'ar' ? 'رمي النرد الآن' : 'Roll Dice'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
