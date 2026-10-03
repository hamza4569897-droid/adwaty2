# أدواتي (Adawaty) - منصة الأدوات الرقمية والحاسبات المجانية

منصة أدوات عربية مجانية وشاملة تعمل بنسبة 100% داخل المتصفح لمعالجة ملفات PDF، الصور، تحويل وتنسيق النصوص، بالإضافة إلى مجموعة متكاملة من الحاسبات المالية الدقيقة دون رفع أي ملف لأي خادم عبر الإنترنت.

---

## 🚀 كيفية النشر والرفع (How to Deploy)

المشروع مبني بتقنيات Vite و React 19، ومزود بنظام توليد ثابت مسبق (SSG Prerendering) ينتج ملفات HTML كاملة لجميع المسارات بالإضافة إلى ملفات التوافق مع منصات الاستضافة العالمية.

### 1. أمر البناء (Build Command)
```bash
npm run build
```
أو مع Bun:
```bash
bun run build
```

### 2. مجلد المخرجات (Publish / Output Directory)
```text
dist
```

### 3. دعم الاستضافات المباشر:
- **Netlify & Cloudflare Pages:** مدعوم تلقائياً بفضل ملف `public/_redirects` المنقول إلى `dist/_redirects`.
- **Vercel:** مدعوم تلقائياً بفضل ملف `vercel.json` الذي يتضمن قواعد إعادة التوجيه وترويسات الأمان.
- **GitHub Pages / Apache / Nginx:** جميع المسارات مولدة مسبقاً كمجلدات تحتوي على `index.html` مع صفحة `404.html` مخصصة.

---

## 📋 قائمة فحص ما قبل الإطلاق (Launch Checklist)

قبل نشر الموقع للمستخدمين، افتح ملف `src/config/site.ts` واستبدل القيم التالية:

1. **`SITE_URL`**: استبدل `"https://example.com"` برابط موقعك الحقيقي (مثال: `"https://adawaty.app"`). سيقوم نظام البناء تلقائياً بتحديث `sitemap.xml` و `robots.txt` وجميع وسوم `canonical` و OpenGraph و JSON-LD.
2. **`CONTACT_EMAIL`**: استبدل `"contact@example.com"` ببريدك الفعلي لتلقي الاستفسارات ومقترحات المستخدمين.
3. **`GA_MEASUREMENT_ID`** *(اختياري)*: ضع معرّف إحصاءات Google (مثال: `"G-XXXXXXXXXX"`). يتم تحميله حصراً بعد موافقة المستخدم في شريط الخصوصية.
4. **`ADSENSE_CLIENT_ID`** *(اختياري)*: ضع معرّف ناشر Google AdSense (مثال: `"ca-pub-XXXXXXXXXXXXXXXX"`).
5. **`public/ads.txt`**: عند قبول حسابك في AdSense، افتح ملف `public/ads.txt` وألصق سطر التحقق الخاص بك.
6. **`WAITLIST_FORM_ENDPOINT`** في `src/config/waitlist.ts`: اربط رابط نموذج Formspree أو Google Forms لاستقبال اشتراكات باقة برو إن رغبت.

---

## 🔒 الأمان والخصوصية 100%
- لا يتم إرسال أي ملف PDF أو صورة إلى أي سيرفر خارجي.
- العمليات تتم باستخدام WebAssembly و HTML5 Canvas داخل متصفح المستخدم فقط.
