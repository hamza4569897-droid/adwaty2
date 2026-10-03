import React, { useState } from 'react';
import { Copy, Check, Sparkles, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StyleItem {
  id: string;
  nameAr: string;
  nameEn: string;
  fn: (text: string) => string;
}

// Unicode alphabet transformations
const UNICODE_FONTS: Record<string, [string, string]> = {
  bold: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳'],
  italic: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', '𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧'],
  boldItalic: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', '𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛'],
  doubleStruck: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫'],
  script: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', '𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏'],
  boldScript: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃'],
  fraktur: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷'],
  boldFraktur: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', '𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟'],
  sans: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', '𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖵𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓'],
  sansBold: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇'],
  mono: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣'],
  circled: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ'],
  squared: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', '🅂🅀🅄🄰🅁🄴🄳🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉'],
  fullwidth: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９'],
};

function mapChars(text: string, [from, to]: [string, string]): string {
  const fromArr = Array.from(from);
  const toArr = Array.from(to);
  const map: Record<string, string> = {};
  for (let i = 0; i < fromArr.length; i++) {
    map[fromArr[i]] = toArr[i] || fromArr[i];
  }
  return Array.from(text)
    .map((c) => map[c] || c)
    .join('');
}

function stretchArabic(text: string, repeats = 2): string {
  const kashida = 'ـ'.repeat(repeats);
  // insert kashida between connecting letters
  return text.split('').join(kashida);
}

export const NameDecoratorTool: React.FC = () => {
  const { language, t } = useApp();
  const [name, setName] = useState<string>('محمد');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const styles: StyleItem[] = [
    // Arabic Kashida & flourishes
    { id: 'ar_kashida1', nameAr: 'كشيدة وتطويل خفيف', nameEn: 'Kashida Stretching', fn: (s) => stretchArabic(s, 1) },
    { id: 'ar_kashida2', nameAr: 'كشيدة ممتدة فخمة', nameEn: 'Extended Kashida', fn: (s) => stretchArabic(s, 3) },
    { id: 'ar_stars', nameAr: 'نجوم وأجنحة', nameEn: 'Wings & Stars', fn: (s) => `★彡 ${s} 彡★` },
    { id: 'ar_royal', nameAr: 'تاج ملكي وشرفي', nameEn: 'Royal Crown', fn: (s) => `👑 ༒ ${s} ༒ 👑` },
    { id: 'ar_wings', nameAr: 'أجنحة أسطورية', nameEn: 'Mythic Wings', fn: (s) => `꧁༺ ${s} ༻꧂` },
    { id: 'ar_spade', nameAr: 'أسلوب ألعاب حربي', nameEn: 'Gaming Legend', fn: (s) => `⚔ ☠ ${s} ☠ ⚔` },
    { id: 'ar_sparkle', nameAr: 'بريق وزهور', nameEn: 'Flowers & Sparkles', fn: (s) => `✿◕ ‿ ◕✿ ${s} ✿` },
    { id: 'ar_bracket1', nameAr: 'أقواس إمبراطورية', nameEn: 'Imperial Brackets', fn: (s) => `『 ${s} 』` },
    { id: 'ar_bracket2', nameAr: 'أقواس كلاسيكية', nameEn: 'Classic Frames', fn: (s) => `【 ${s} 】` },
    { id: 'ar_bracket3', nameAr: 'أقواس زاوية مزدوجة', nameEn: 'Double Angles', fn: (s) => `《 ${s} 》` },
    { id: 'ar_pulse', nameAr: 'نبض وفخامة', nameEn: 'Pulse Wave', fn: (s) => `ﮩ٨ـﮩﮩ ${s} ﮩ٨ـﮩﮩ` },
    { id: 'ar_islamic', nameAr: 'زخرفة إسلامية', nameEn: 'Islamic Motif', fn: (s) => `۞ ${s} ۞` },
    { id: 'ar_shield', nameAr: 'دروع شرفية', nameEn: 'Knight Shields', fn: (s) => `🛡️ ⚔️ ${s} ⚔️ 🛡️` },
    { id: 'ar_bird', nameAr: 'أقواس طائر', nameEn: 'Phoenix Bows', fn: (s) => `𓆩 ${s} 𓆪` },
    { id: 'ar_hearts', nameAr: 'قلوب رومانسية', nameEn: 'Hearts', fn: (s) => `💖 ✨ ${s} ✨ 💖` },
    { id: 'ar_sparks', nameAr: 'شرارات مضيئة', nameEn: 'Gleam', fn: (s) => `✦•┈๑ ${s} ๑┈•✦` },
    { id: 'ar_fire', nameAr: 'نيران أسطورية', nameEn: 'Flame Accent', fn: (s) => `🔥 ⚡ ${s} ⚡ 🔥` },
    { id: 'ar_swords', nameAr: 'سيوف ومقاتل', nameEn: 'Combat Ready', fn: (s) => `꧁༒☬ ${s} ☬༒꧂` },
    { id: 'ar_diamond', nameAr: 'ألماس برّاق', nameEn: 'Diamonds', fn: (s) => `💎 ⫷ ${s} ⫸ 💎` },
    { id: 'ar_cross', nameAr: 'صلبان وشعارات', nameEn: 'Regal Crest', fn: (s) => `† ${s} †` },

    // English Unicode Math & Fonts
    { id: 'en_bold', nameAr: 'عريض بولد (Bold)', nameEn: 'Bold Serif', fn: (s) => mapChars(s, UNICODE_FONTS.bold) },
    { id: 'en_italic', nameAr: 'مائل (Italic)', nameEn: 'Italic Serif', fn: (s) => mapChars(s, UNICODE_FONTS.italic) },
    { id: 'en_boldItalic', nameAr: 'عريض ومائل (Bold Italic)', nameEn: 'Bold Italic', fn: (s) => mapChars(s, UNICODE_FONTS.boldItalic) },
    { id: 'en_doubleStruck', nameAr: 'خط مزدوج (Double Struck)', nameEn: 'Double Struck', fn: (s) => mapChars(s, UNICODE_FONTS.doubleStruck) },
    { id: 'en_script', nameAr: 'كتابة يدوية أنيقة (Script)', nameEn: 'Fancy Script', fn: (s) => mapChars(s, UNICODE_FONTS.script) },
    { id: 'en_boldScript', nameAr: 'يدوي عريض (Bold Script)', nameEn: 'Bold Script', fn: (s) => mapChars(s, UNICODE_FONTS.boldScript) },
    { id: 'en_fraktur', nameAr: 'قوطي تاريخي (Fraktur)', nameEn: 'Fraktur Gothic', fn: (s) => mapChars(s, UNICODE_FONTS.fraktur) },
    { id: 'en_boldFraktur', nameAr: 'قوطي عريض (Bold Fraktur)', nameEn: 'Bold Fraktur', fn: (s) => mapChars(s, UNICODE_FONTS.boldFraktur) },
    { id: 'en_sans', nameAr: 'سانس سيريف (Sans-Serif)', nameEn: 'Sans Style', fn: (s) => mapChars(s, UNICODE_FONTS.sans) },
    { id: 'en_sansBold', nameAr: 'سانس عريض (Sans Bold)', nameEn: 'Sans Bold', fn: (s) => mapChars(s, UNICODE_FONTS.sansBold) },
    { id: 'en_mono', nameAr: 'آلة كاتبة (Monospace)', nameEn: 'Monospace Code', fn: (s) => mapChars(s, UNICODE_FONTS.mono) },
    { id: 'en_circled', nameAr: 'دوائر مغلقة (Circled)', nameEn: 'Circled Letters', fn: (s) => mapChars(s, UNICODE_FONTS.circled) },
    { id: 'en_squared', nameAr: 'مربعات (Squared)', nameEn: 'Squared Box', fn: (s) => mapChars(s, UNICODE_FONTS.squared) },
    { id: 'en_fullwidth', nameAr: 'متباعد كامل (Fullwidth)', nameEn: 'Fullwidth Aesthetic', fn: (s) => mapChars(s, UNICODE_FONTS.fullwidth) },
  ];

  const handleCopy = (id: string, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Input Field */}
      <div className="space-y-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <label htmlFor="nameInput" className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>{language === 'ar' ? 'اكتب الاسم أو النص المراد زخرفته (عربي أو إنجليزي):' : 'Enter name or text to decorate:'}</span>
          </label>
          {name && (
            <button
              type="button"
              onClick={() => setName('')}
              className="text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.common.clearAll}</span>
            </button>
          )}
        </div>
        <input
          id="nameInput"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={language === 'ar' ? 'مثال: محمد، سارة، Legend، Gamer...' : 'e.g. Alex, Legend, Sara...'}
          className="w-full text-lg sm:text-xl font-bold px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Decorative Styles Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {language === 'ar'
              ? `أكثر من ${styles.length} شكلاً وزخرفة جاهزة (انقر للنسخ بنقرة واحدة):`
              : `${styles.length} Decorative Styles (One-tap Copy):`}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {styles.map((st) => {
            const decorated = st.fn(name || 'أدواتي');
            const isCopied = copiedId === st.id;

            return (
              <div
                key={st.id}
                onClick={() => handleCopy(st.id, decorated)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCopy(st.id, decorated);
                  }
                }}
                className={`group cursor-pointer p-4 rounded-2xl border transition-all select-none flex flex-col justify-between gap-3 ${
                  isCopied
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-700 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                  <span>{language === 'ar' ? st.nameAr : st.nameEn}</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium transition-colors ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white'
                    }`}
                  >
                    {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? t.common.copySuccess : t.common.copy}</span>
                  </span>
                </div>

                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white text-center py-2 break-all overflow-hidden">
                  {decorated}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
