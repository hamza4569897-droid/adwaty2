/**
 * Adawaty Production Pre-renderer & SEO Generator
 * 
 * Generates static HTML for every route at build time, containing:
 * - Proper <title>, <meta name="description">, canonical URL, hreflang alternates
 * - Open Graph & Twitter Social Cards
 * - Full Schema.org JSON-LD (WebApplication, FAQPage, BreadcrumbList, WebSite, Organization)
 * - Complete semantic Arabic SEO content block in raw HTML (H1, steps, benefits, FAQs, breadcrumb)
 * - Auto-generates sitemap.xml and robots.txt using the single SITE_URL constant.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SITE_URL, SITE_NAME_AR, SITE_NAME_EN, SITE_DESC_AR, DEFAULT_OG_IMAGE } from '../src/config/site';
import { TOOLS, TOOLS_SEO } from '../src/data/toolsData';
import { CALCULATORS, CALCULATORS_SEO } from '../src/data/calculatorsData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const publicDir = path.resolve(rootDir, 'public');

interface PrerenderRoute {
  path: string;
  outputPath: string;
  title: string;
  description: string;
  h1: string;
  ogType?: string;
  categoryName?: string;
  breadcrumbs: { name: string; url: string }[];
  steps?: { title: string; desc: string }[];
  benefits?: { title: string; desc: string }[];
  faqs?: { questionAr: string; answerAr: string }[];
  jsonLdList: any[];
  extraBodyHtml?: string;
  priority: string;
  changefreq: string;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildHtmlForRoute(baseTemplate: string, route: PrerenderRoute): string {
  const fullUrl = route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
  const ogImageUrl = `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  let html = baseTemplate;

  // Ensure <html lang="ar" dir="rtl">
  html = html.replace(/<html[^>]*>/i, '<html lang="ar" dir="rtl">');

  // Clean existing OpenGraph, Twitter tags, canonical/hreflang links, and consecutive blank lines
  html = html.replace(/<meta\s+property=["']og:[^"']*["'][^>]*\/?>/gi, '');
  html = html.replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*\/?>/gi, '');
  html = html.replace(/<link\s+rel=["'](canonical|alternate)["'][^>]*\/?>/gi, '');
  html = html.replace(/<!--[\s\S]*?OpenGraph[\s\S]*?-->/gi, '');
  html = html.replace(/^\s*[\r\n]/gm, '\n');

  // Replace Title cleanly without duplicate brand suffix
  let cleanTitle = route.title.trim();
  if (!cleanTitle.includes(SITE_NAME_AR) && !cleanTitle.includes(SITE_NAME_EN)) {
    cleanTitle = `${cleanTitle} - ${SITE_NAME_AR}`;
  }
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(cleanTitle)}</title>`);

  // Meta description
  const metaDescRegex = /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i;
  const newMetaDesc = `<meta name="description" content="${escapeHtml(route.description)}" />`;
  if (metaDescRegex.test(html)) {
    html = html.replace(metaDescRegex, newMetaDesc);
  } else {
    html = html.replace('</head>', `  ${newMetaDesc}\n</head>`);
  }

  // Canonical tag & Hreflang alternates
  const canonicalTag = `<link rel="canonical" href="${fullUrl}" />`;
  const hreflangTags = `
    <link rel="alternate" hreflang="ar" href="${fullUrl}" />
    <link rel="alternate" hreflang="x-default" href="${fullUrl}" />`;

  // Open Graph & Twitter meta tags
  const ogTags = `
    <!-- OpenGraph Tags -->
    <meta property="og:type" content="${route.ogType || 'website'}" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:url" content="${fullUrl}" />
    <meta property="og:site_name" content="${SITE_NAME_AR}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:locale" content="ar_AR" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${ogImageUrl}" />`;

  // JSON-LD Scripts
  const jsonLdScripts = route.jsonLdList
    .map(
      (data) =>
        `\n    <script type="application/ld+json">\n${JSON.stringify(
          data,
          null,
          2
        )}\n    </script>`
    )
    .join('');

  // Remove existing template JSON-LD to avoid duplicates
  html = html.replace(/<script type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, '');

  // Inject meta tags and JSON-LD before </head>
  const headInjection = `  ${canonicalTag}${hreflangTags}${ogTags}${jsonLdScripts}\n`;
  html = html.replace('</head>', `${headInjection}</head>`);

  // Construct Semantic Pre-rendered Body for Search Engines & Quick First Paint
  const breadcrumbsHtml = route.breadcrumbs.length > 0 ? `
    <nav class="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
      ${route.breadcrumbs
        .map((b, idx) => {
          const isLast = idx === route.breadcrumbs.length - 1;
          if (isLast) {
            return `<span class="font-semibold text-slate-800 dark:text-slate-200">${escapeHtml(b.name)}</span>`;
          }
          return `<a href="${b.url}" class="hover:text-blue-600 transition-colors">${escapeHtml(b.name)}</a> <span class="text-slate-400">/</span>`;
        })
        .join(' ')}
    </nav>` : '';

  const stepsHtml = route.steps && route.steps.length > 0 ? `
    <section class="mt-12 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">كيفية الاستخدام خطوة بخطوة</h2>
      <div class="grid grid-cols-1 md:grid-cols-${Math.min(route.steps.length, 4)} gap-4">
        ${route.steps
          .map(
            (step, idx) => `
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm mb-3">${idx + 1}</span>
            <h3 class="font-bold text-slate-900 dark:text-white text-base mb-1">${escapeHtml(step.title)}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${escapeHtml(step.desc)}</p>
          </div>`
          )
          .join('')}
      </div>
    </section>` : '';

  const benefitsHtml = route.benefits && route.benefits.length > 0 ? `
    <section class="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">المميزات الرئيسية</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(route.benefits.length, 3)} gap-4">
        ${route.benefits
          .map(
            (b) => `
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <h3 class="font-bold text-slate-900 dark:text-white text-base mb-1">${escapeHtml(b.title)}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${escapeHtml(b.desc)}</p>
          </div>`
          )
          .join('')}
      </div>
    </section>` : '';

  const faqsHtml = route.faqs && route.faqs.length > 0 ? `
    <section class="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">الأسئلة الشائعة</h2>
      <div class="space-y-4">
        ${route.faqs
          .map(
            (faq) => `
          <details class="group border border-slate-200 dark:border-slate-800 rounded-2xl p-4 open:bg-slate-50/50 dark:open:bg-slate-800/30">
            <summary class="font-semibold text-slate-900 dark:text-white cursor-pointer select-none text-base list-none flex justify-between items-center">
              <span>${escapeHtml(faq.questionAr)}</span>
              <span class="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p class="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">${escapeHtml(faq.answerAr)}</p>
          </details>`
          )
          .join('')}
      </div>
    </section>` : '';

  const prerenderedBody = `
    <header class="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 py-4 px-4 sm:px-8">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <a href="/" class="text-xl font-black text-blue-600 dark:text-blue-400">${SITE_NAME_AR}</a>
        <div class="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
          <a href="/calculators" class="hover:text-blue-600">الحاسبات</a>
          <a href="/pricing" class="hover:text-blue-600">الأسعار</a>
          <a href="/about" class="hover:text-blue-600">من نحن</a>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      ${breadcrumbsHtml}
      
      <div class="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          ${escapeHtml(route.h1)}
        </h1>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          ${escapeHtml(route.description)}
        </p>
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium">
          <span>🛡️ معالجة محلية 100% داخل المتصفح دون رفع ملفات</span>
        </div>
      </div>

      ${route.extraBodyHtml || ''}
      ${stepsHtml}
      ${benefitsHtml}
      ${faqsHtml}
    </main>

    <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 px-4 text-center text-sm text-slate-500">
      <div class="max-w-6xl mx-auto space-y-4">
        <p>© ${new Date().getFullYear()} ${SITE_NAME_AR} - جميع الحقوق محفوظة. معالجة محلية بأمان وخصوصية 100%.</p>
        <div class="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
          <a href="/about" class="hover:text-blue-600">من نحن</a>
          <a href="/privacy" class="hover:text-blue-600">سياسة الخصوصية</a>
          <a href="/terms" class="hover:text-blue-600">شروط الاستخدام</a>
          <a href="/disclaimer" class="hover:text-blue-600">إخلاء المسؤولية</a>
          <a href="/contact" class="hover:text-blue-600">اتصل بنا</a>
        </div>
      </div>
    </footer>`;

  // Inject prerendered semantic content inside <div id="root">
  html = html.replace('<div id="root"></div>', `<div id="root">${prerenderedBody}</div>`);

  return html;
}

export async function prerenderSite() {
  console.log('🚀 Starting SEO Prerendering...');

  if (!fs.existsSync(distDir)) {
    console.error('❌ dist directory does not exist! Run "vite build" first.');
    process.exit(1);
  }

  const baseTemplatePath = path.resolve(distDir, 'index.html');
  if (!fs.existsSync(baseTemplatePath)) {
    console.error('❌ dist/index.html not found!');
    process.exit(1);
  }

  const baseTemplate = fs.readFileSync(baseTemplatePath, 'utf-8');
  const routes: PrerenderRoute[] = [];

  // 1. Home Page
  const homeFaqs = [
    {
      questionAr: 'هل الأدوات مجانية فعلاً؟',
      answerAr: 'نعم! جميع الأدوات الأساسية في منصة أدواتي مجانية 100% وتعمل مباشرة داخل المتصفح دون أي قيود أو مصاريف مخفية.',
    },
    {
      questionAr: 'كيف تضمنون عدم رفع ملفاتي إلى أي خادم؟',
      answerAr: 'تطبيق أدواتي مبني بتقنيات WebAssembly و Canvas البرمجية الحديثة التي تتيح معالجة ملفات PDF والصور بالكامل داخل ذاكرة جهازك. يمكنك فصل الإنترنت بعد فتح الصفحة وستستمر الأدوات بالعمل!',
    },
    {
      questionAr: 'ما هي صيغ الملفات المدعومة؟',
      answerAr: 'ندعم ملفات PDF، وصور JPG و PNG و WebP، بالإضافة إلى أدوات تحويل النصوص وتنسيق الأرقام والحاسبات المالية.',
    },
    {
      questionAr: 'هل تعمل الأدوات على الهواتف الذكية؟',
      answerAr: 'نعم، تم تصميم الموقع ليعمل بكفاءة وسرعة فائقة على جميع الهواتف الذكية والأجهزة اللوحية دون الحاجة لتثبيت أي تطبيقات.',
    },
  ];

  routes.push({
    path: '/',
    outputPath: path.resolve(distDir, 'index.html'),
    title: `${SITE_NAME_AR} - أدوات PDF وصور ونصوص وحاسبات مجانية بدون رفع ملفات`,
    description: SITE_DESC_AR,
    h1: 'أدوات رقمية مجانية لمعالجة الملفات وحساباتك اليومية',
    ogType: 'website',
    breadcrumbs: [{ name: 'الرئيسية', url: `${SITE_URL}/` }],
    faqs: homeFaqs,
    priority: '1.0',
    changefreq: 'daily',
    jsonLdList: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: `${SITE_NAME_AR} (${SITE_NAME_EN})`,
        url: `${SITE_URL}/`,
        description: SITE_DESC_AR,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: `${SITE_NAME_AR} (${SITE_NAME_EN})`,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/favicon.svg`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: `${SITE_URL}/`,
          },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: homeFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.questionAr,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answerAr,
          },
        })),
      },
    ],
    extraBodyHtml: `
      <section class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${[...TOOLS, ...CALCULATORS]
          .map((tool) => {
            const href = tool.category === 'calculator' ? `/calculators/${tool.slug}` : `/tools/${tool.slug}`;
            return `
            <a href="${href}" class="block p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 shadow-xs transition-all">
              <h3 class="font-bold text-slate-900 dark:text-white text-base mb-2">${escapeHtml(tool.titleAr)}</h3>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">${escapeHtml(tool.descAr)}</p>
            </a>`;
          })
          .join('')}
      </section>
    `,
  });

  // 2. Tools
  for (const tool of TOOLS) {
    const seo = TOOLS_SEO[tool.slug];
    const toolTitle = seo?.metaTitleAr || `${tool.titleAr} - ${SITE_NAME_AR}`;
    const toolDesc = seo?.metaDescAr || tool.descAr;
    const toolH1 = seo?.h1Ar || tool.titleAr;
    const steps = seo?.stepsAr || [];
    const benefits = seo?.benefitsAr || [];
    const faqs = seo?.faqs || [];
    const pageUrl = `${SITE_URL}/tools/${tool.slug}`;
    const categoryName = tool.category === 'pdf' ? 'ملفات PDF' : tool.category === 'image' ? 'الصور' : 'النصوص';

    const breadcrumbs = [
      { name: 'الرئيسية', url: `${SITE_URL}/` },
      { name: categoryName, url: `${SITE_URL}/` },
      { name: tool.titleAr, url: pageUrl },
    ];

    const jsonLdList: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: tool.titleAr,
        url: pageUrl,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description: toolDesc,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: b.url,
        })),
      },
    ];

    if (faqs.length > 0) {
      jsonLdList.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.questionAr,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answerAr,
          },
        })),
      });
    }

    routes.push({
      path: `/tools/${tool.slug}`,
      outputPath: path.resolve(distDir, 'tools', tool.slug, 'index.html'),
      title: toolTitle,
      description: toolDesc,
      h1: toolH1,
      categoryName,
      breadcrumbs,
      steps,
      benefits,
      faqs,
      jsonLdList,
      priority: tool.popular ? '0.9' : '0.8',
      changefreq: 'weekly',
    });
  }

  // 3. Calculators Landing Page
  const calcLandingFaqs = [
    {
      questionAr: 'هل حاسبات أدواتي دقيقة ومطابقة للمعايير البنكية؟',
      answerAr: 'نعم، تعتمد جميع الحاسبات الرياضية والتمويلية على الصيغ المالية القياسية المعترف بها دولياً مثل جداول الاستهلاك البنكي وقوانين الفائدة والقيمة الزمنية للنقود.',
    },
    {
      questionAr: 'هل تحفظ الحاسبات أرقامي أو رواتبي؟',
      answerAr: 'أبداً، جميع العمليات الحسابية تجرى فورياً في متصفحك ولا يتم تسجيل أو إرسال أي أرقام إلى أي طرف.',
    },
  ];

  routes.push({
    path: '/calculators',
    outputPath: path.resolve(distDir, 'calculators', 'index.html'),
    title: 'حاسبات مالية واستثمارية ورقمية ذكية - أدواتي',
    description: 'مجموعة متكاملة من الحاسبات المالية الدقيقة: الفائدة المركبة، قسط السيارة، العائد على الاستثمار، التضخم، وهدف الادخار مجاناً وبدون تسجيل.',
    h1: 'حاسبات مالية واستثمارية دقيقة',
    breadcrumbs: [
      { name: 'الرئيسية', url: `${SITE_URL}/` },
      { name: 'الحاسبات المالية', url: `${SITE_URL}/calculators` },
    ],
    faqs: calcLandingFaqs,
    priority: '0.9',
    changefreq: 'weekly',
    jsonLdList: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'حاسبات أدواتي المالية والذكية',
        url: `${SITE_URL}/calculators`,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        description: 'مجموعة من الحاسبات المالية الدقيقة لحساب الفائدة المركبة، القروض، الاستثمار، والادخار.',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'الحاسبات المالية', item: `${SITE_URL}/calculators` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: calcLandingFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.questionAr,
          acceptedAnswer: { '@type': 'Answer', text: faq.answerAr },
        })),
      },
    ],
    extraBodyHtml: `
      <section class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${CALCULATORS.map(
          (calc) => `
          <a href="/calculators/${calc.slug}" class="block p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 shadow-xs transition-all">
            <h3 class="font-bold text-slate-900 dark:text-white text-base mb-2">${escapeHtml(calc.titleAr)}</h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">${escapeHtml(calc.descAr)}</p>
          </a>`
        ).join('')}
      </section>
    `,
  });

  // 4. Individual Calculators
  for (const calc of CALCULATORS) {
    const seo = CALCULATORS_SEO[calc.slug];
    const calcTitle = seo?.metaTitleAr || `${calc.titleAr} - ${SITE_NAME_AR}`;
    const calcDesc = seo?.metaDescAr || calc.descAr;
    const calcH1 = seo?.h1Ar || calc.titleAr;
    const steps = seo?.stepsAr || [];
    const benefits = seo?.benefitsAr || [];
    const faqs = seo?.faqs || [];
    const pageUrl = `${SITE_URL}/calculators/${calc.slug}`;

    const breadcrumbs = [
      { name: 'الرئيسية', url: `${SITE_URL}/` },
      { name: 'حاسبات', url: `${SITE_URL}/calculators` },
      { name: calc.titleAr, url: pageUrl },
    ];

    const jsonLdList: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: calc.titleAr,
        url: pageUrl,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description: calcDesc,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: b.url,
        })),
      },
    ];

    if (faqs.length > 0) {
      jsonLdList.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.questionAr,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answerAr,
          },
        })),
      });
    }

    routes.push({
      path: `/calculators/${calc.slug}`,
      outputPath: path.resolve(distDir, 'calculators', calc.slug, 'index.html'),
      title: calcTitle,
      description: calcDesc,
      h1: calcH1,
      breadcrumbs,
      steps,
      benefits,
      faqs,
      jsonLdList,
      priority: calc.popular ? '0.9' : '0.8',
      changefreq: 'weekly',
    });
  }

  // 5. Static Pages
  const staticPages = [
    {
      path: '/pricing',
      title: 'خطة الأسعار والاشتراكات - أدواتي',
      description: 'جميع الأدوات الأساسية في منصة أدواتي مجانية بالكامل. تعرف على خطتنا ومستقبل المنصة الشفاف.',
      h1: 'خطة الأسعار والميزات المجانية',
      priority: '0.7',
      changefreq: 'monthly',
      content: `
        <div class="max-w-2xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">مجاني بالكامل وبلا اشتراكات مخفية</h2>
          <p class="text-slate-600 dark:text-slate-300">جميع الأدوات الحالية في منصة أدواتي مجانية 100%، وتعمل بلا حدود وبأقصى سرعة ممكنة مباشرة داخل متصفحك دون الحاجة لتسجيل حساب أو بطاقة بنكية.</p>
        </div>
      `,
    },
    {
      path: '/about',
      title: 'عن منصة أدواتي ورؤيتنا للخصوصية - أدواتي',
      description: 'تعرف على قصة ورؤية منصة أدواتي الهادفة لتوفير أدوات ويب عربية فائقة السرعة والأمان بدون رفع ملفات إلى أي خوادم.',
      h1: 'عن منصة "أدواتي" وأمان الملفات',
      priority: '0.6',
      changefreq: 'monthly',
      content: `
        <div class="max-w-3xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">معالجة محلية 100%</h2>
          <p class="text-slate-600 dark:text-slate-300">انطلقت "أدواتي" بهدف تقديم أدوات رقمية مجانية وعالية الأداء باللغة العربية لمعالجة ملفات PDF والصور والنصوص دون المساومة على خصوصية وأمن بيانات المستخدم.</p>
        </div>
      `,
    },
    {
      path: '/privacy',
      title: 'سياسة الخصوصية وحماية البيانات - أدواتي',
      description: 'سياسة الخصوصية لمنصة أدواتي: نلتزم بعدم رفع أي ملف أو مستند إلى خوادمنا نهائياً. خصوصيتك مصونة بالكامل بتقنيات المعالجة المحلية.',
      h1: 'سياسة الخصوصية وضمان الأمان',
      priority: '0.6',
      changefreq: 'monthly',
      content: `
        <div class="max-w-3xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">معالجة داخل جهازك فقط</h2>
          <p class="text-slate-600 dark:text-slate-300">تتم معالجة جميع ملفات PDF والصور والنصوص محلياً داخل متصفح الإنترنت الخاص بك. لا نقوم برفع أو تخزين أو فحص أي من ملفاتك على أي خادم خارجي.</p>
        </div>
      `,
    },
    {
      path: '/terms',
      title: 'شروط وأحكام الاستخدام - أدواتي',
      description: 'شروط استخدام منصة أدواتي: الضوابط القانونية والتنظيمية لاستخدام الأدوات المجانية وحماية الحقوق.',
      h1: 'شروط وأحكام الاستخدام',
      priority: '0.5',
      changefreq: 'monthly',
      content: `
        <div class="max-w-3xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">الاستخدام المشروع</h2>
          <p class="text-slate-600 dark:text-slate-300">باستخدامك لمنصة أدواتي، فإنك توافق على الالتزام بالقوانين المعمول بها واستخدام الأدوات لأغراض مشروعة ومصرح بها نظاماً.</p>
        </div>
      `,
    },
    {
      path: '/disclaimer',
      title: 'إخلاء المسؤولية القانونية والمالية - أدواتي',
      description: 'إخلاء المسؤولية بشأن الحاسبات المالية والصحية والدينية: جميع النتائج استرشادية وتثقيفية ولا تغني عن الاستشارة المتخصصة.',
      h1: 'إخلاء المسؤولية القانونية والتنظيمية',
      priority: '0.5',
      changefreq: 'monthly',
      content: `
        <div class="max-w-3xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">نتائج استرشادية فقط</h2>
          <p class="text-slate-600 dark:text-slate-300">جميع نتائج الحاسبات التمويلية والصحية والدينية على منصة أدواتي هي نتائج تقريبية استرشادية ولا تشكل استشارة مهنية أو بنكية أو قانونية رسمية.</p>
        </div>
      `,
    },
    {
      path: '/contact',
      title: 'اتصل بنا والدعم الفني - أدواتي',
      description: 'تواصل مع فريق تطوير منصة أدواتي للاقتراحات والاستفسارات والدعم الفني.',
      h1: 'اتصل بنا وتواصل مع الفريق',
      priority: '0.5',
      changefreq: 'monthly',
      content: `
        <div class="max-w-3xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-center">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">يسعدنا دائماً سماع رأيك</h2>
          <p class="text-slate-600 dark:text-slate-300">إذا كان لديك اقتراح لأداة جديدة أو رغبة في الإبلاغ عن مشكلة فنية، يمكنك مراسلتنا في أي وقت.</p>
        </div>
      `,
    },
  ];

  for (const page of staticPages) {
    const pageUrl = `${SITE_URL}${page.path}`;
    const breadcrumbs = [
      { name: 'الرئيسية', url: `${SITE_URL}/` },
      { name: page.h1, url: pageUrl },
    ];

    routes.push({
      path: page.path,
      outputPath: path.resolve(distDir, page.path.slice(1), 'index.html'),
      title: page.title,
      description: page.description,
      h1: page.h1,
      breadcrumbs,
      priority: page.priority,
      changefreq: page.changefreq,
      jsonLdList: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: page.title,
          url: pageUrl,
          description: page.description,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((b, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: b.name,
            item: b.url,
          })),
        },
      ],
      extraBodyHtml: page.content,
    });
  }

  // 6. Custom 404 Page (dist/404.html)
  const notFoundRoute: PrerenderRoute = {
    path: '/404',
    outputPath: path.resolve(distDir, '404.html'),
    title: `الصفحة غير موجودة 404 - ${SITE_NAME_AR}`,
    description: 'عفواً، الصفحة المطلوبة غير متوفرة. تصفح أدوات أدواتي المجانية لمعالجة الملفات وحساباتك اليومية.',
    h1: 'الصفحة غير موجودة (404)',
    breadcrumbs: [
      { name: 'الرئيسية', url: `${SITE_URL}/` },
      { name: '404', url: `${SITE_URL}/404` },
    ],
    priority: '0.1',
    changefreq: 'yearly',
    jsonLdList: [],
    extraBodyHtml: `
      <div class="text-center py-10 space-y-6">
        <p class="text-lg text-slate-600 dark:text-slate-300">عفواً، الصفحة التي تبحث عنها غير متوفرة أو تم تغيير مسارها.</p>
        <div class="flex justify-center gap-4">
          <a href="/" class="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">العودة للرئيسية</a>
          <a href="/calculators" class="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-300 transition-colors">تصفح الحاسبات</a>
        </div>
      </div>
    `,
  };

  // Write all static HTML files
  let generatedCount = 0;
  for (const route of [...routes, notFoundRoute]) {
    const renderedHtml = buildHtmlForRoute(baseTemplate, route);
    const targetDir = path.dirname(route.outputPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(route.outputPath, renderedHtml, 'utf-8');
    generatedCount++;
  }

  console.log(`✅ Generated ${generatedCount} static HTML pages with full SEO metadata & JSON-LD.`);

  // 7. Auto-generate sitemap.xml
  const sitemapUrls = routes.map((r) => {
    const fullLoc = r.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${r.path}`;
    return `  <url>
    <loc>${fullLoc}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`;
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>
`;

  fs.writeFileSync(path.resolve(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log(`✅ Auto-generated sitemap.xml with ${routes.length} URLs using SITE_URL="${SITE_URL}".`);

  // 8. Auto-generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.resolve(publicDir, 'robots.txt'), robotsTxt, 'utf-8');
  fs.writeFileSync(path.resolve(distDir, 'robots.txt'), robotsTxt, 'utf-8');
  console.log(`✅ Auto-generated robots.txt pointing to ${SITE_URL}/sitemap.xml.`);
}

// Execute when invoked directly
prerenderSite().catch((err) => {
  console.error('❌ Error during prerendering:', err);
  process.exit(1);
});
