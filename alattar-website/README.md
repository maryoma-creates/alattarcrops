# العطار للتنمية الزراعية — Al-Attar Agricultural Development

الموقع الرسمي لشركة العطار للتنمية الزراعية: تقاوي البطاطس المصرية بين يديك، منذ 2019، التل الكبير – الإسماعيلية.

The official website of Al-Attar Agricultural Development: Egyptian seed potatoes since 2019, El Tal El Kebir, Ismailia.

- خلفية 3D تتحرك مع التمرير: حبة تقاوي تُزرع والحقل ينمو تحت الري المحوري، والسماء تتحول للغروب في آخر الصفحة.
- متجر بالأصناف والمحاصيل، والطلب بالشكارة (متوسط 50 كجم) أو بالطن، ويُرسل مباشرة على واتساب المبيعات.
- عربي وإنجليزي بزرار واحد، ويعمل على الموبايل.

---

## الرفع على GitHub ونشر الموقع مجانًا (GitHub Pages)

1. أنشئ Repository جديد على GitHub، مثلًا باسم `alattar-website`.
2. ارفع الملفات بإحدى الطريقتين:
   - **من المتصفح:** صفحة الـ Repository ← **Add file ← Upload files** ← اسحب كل محتويات الفولدر (مش الفولدر نفسه) ← **Commit changes**.
   - **من الكمبيوتر:**
     ```bash
     git add -A
     git commit -m "Al-Attar website"
     git remote add origin https://github.com/USERNAME/alattar-website.git
     git push -u origin main
     ```
3. فعّل النشر: **Settings ← Pages ← Source: Deploy from a branch ← Branch: `main` / `(root)` ← Save**.
4. بعد دقيقة أو اتنين يكون الموقع على:
   `https://USERNAME.github.io/alattar-website/`

> لربط دومين الشركة (مثل alattarcrops.com): Settings ← Pages ← Custom domain، ثم من لوحة الدومين أضف سجل CNAME يشير إلى `USERNAME.github.io`.

---

## التعديل

| الملف | ماذا تعدّل فيه |
|---|---|
| `js/config.js` | رقم واتساب المبيعات، أرقام التليفون، الإيميل، العنوان، لينكات السوشيال، المؤسس |
| `js/products.js` | المنتجات: الاسم، الوصف، الصورة، الحالة (متاح / غير متاح / قريبًا)، الوحدات |
| `js/app.js` ← `I18N` | كل نصوص الموقع بالعربي والإنجليزي |
| `images/` | صور المزارع والمنتجات |
| `assets/` | اللوجو |

لو عدّلت ملفات الـ JS أو الـ CSS وما ظهرش التعديل عند الزوار، غيّر رقم `?v=` في `index.html` (وفي سطر `import('./scene.js?v=…')` داخل `js/app.js` لو عدّلت `scene.js`).

## التشغيل على الكمبيوتر

الموقع لازم يشتغل من سيرفر محلي، مش بفتح `index.html` مباشرة:

```bash
python -m http.server 5517
```

وبعدين افتح http://localhost:5517

## الصور

- صور الأصناف من موقع الشركة alattarcrops.com.
- صور المزارع من أرشيف الشركة.
- صور المحاصيل الأخرى من Unsplash، ورخصتها مجانية للاستخدام التجاري. التفاصيل في [images/crops/CREDITS.md](images/crops/CREDITS.md).

## التقنيات

HTML + CSS + JavaScript بدون أي build. الـ 3D معمول بـ [Three.js](https://threejs.org) r160 من CDN.

---

© العطار للتنمية الزراعية — Powered by Roma
