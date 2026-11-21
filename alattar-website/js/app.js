/* =========================================================
   Al-Attar — UI, i18n, shop & WhatsApp ordering
   ========================================================= */
const CFG = window.SITE_CONFIG || {};
const PRODUCTS = window.PRODUCTS || [];
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

/* ---------------- i18n ---------------- */
const I18N = {
  ar: {
    loader: "نجهّز الأرض للزراعة…",
    "brand.name": "العطار", "brand.sub": "للتنمية الزراعية",
    "nav.home": "الرئيسية", "nav.about": "من نحن", "nav.specialty": "تخصصنا", "nav.shop": "المتجر", "nav.why": "لماذا العطار", "nav.gallery": "مزارعنا", "nav.contact": "تواصل معنا",
    "hero.eyebrow": "منذ 2019 · من أوائل شركات إنتاج التقاوي في مصر",
    "hero.title1": "تقاوي البطاطس المصرية", "hero.title2": "بين يديك",
    "hero.lead": "العطار للتنمية الزراعية — من التل الكبير بالإسماعيلية، ننتج تقاوي بطاطس عالية الجودة بأسعار منافسة، ونزرع محاصيل تكفي طموح المزارع المصري.",
    "hero.cta1": "تصفّح المنتجات", "hero.cta2": "اطلب عبر واتساب",
    "hero.scroll": "مرّر لأسفل.. وشاهد البذرة تنمو",
    "v.spunta": "سبونتا", "v.caruso": "كاروزو", "v.rosita": "ليدي روزيتا", "v.diamond": "دايموند", "v.hermes": "هرمز",
    "stats.s1": "سنة التأسيس", "stats.s2": "أصناف تقاوي بطاطس", "stats.s3": "محاصيل متاحة", "stats.s4": "عضو في مجتمعنا على فيسبوك",
    "about.kicker": "من نحن", "about.title": "جذورنا في الأرض.. وعيننا على المستقبل",
    "about.p1": "تأسست <b>شركة العطار للتنمية الزراعية</b> عام 2019 في التل الكبير بمحافظة الإسماعيلية، وهي من أوائل الشركات العاملة في مجال إنتاج التقاوي في مصر. نزرع بأنظمة الري المحوري الحديثة في الأراضي المستصلحة، وهدفنا إنتاج تقاوي عالية الجودة بأسعار منافسة.",
    "about.p2": "لدينا <b>إدارة للبحوث والتطوير</b> تختبر الأصناف في أيام حقلية مع المزارعين، ونحن <b>الوكيل الحصري والموزّع الوحيد لشركة DevoTek Seeds</b> في مصر. نقدّم تقاوي البطاطس سبونتا وكاروزو وليدي روزيتا ودايموند وهرمز، إلى جانب الثوم والفول السوداني والبنجر واللب الأصفر — والقادم بصل.",
    "about.vision.t": "رؤيتنا", "about.vision.d": "أن نكون الاسم الأول الذي يثق به المزارع المصري في التقاوي.",
    "about.mission.t": "رسالتنا", "about.mission.d": "إنتاج تقاوي عالية الجودة وتوفيرها بأسعار منافسة تدعم إنتاجية المزارع وربحه.",
    "about.values.t": "قيمنا", "about.values.d": "الجودة، الأمانة، الالتزام بالمواعيد، والتطوير المستمر.",
    "spec.kicker": "تخصصنا", "spec.title": "إنتاج المزروعات.. من البذرة للحصاد",
    "spec.lead": "إحنا مش بس بنبيع تقاوي — إحنا بننتجها. كل مرحلة بتعدّي تحت عينينا عشان توصلك بأعلى جودة.",
    "spec.c1.t": "إنتاج تقاوي البطاطس", "spec.c1.d": "أصناف عالمية مختارة بعناية تناسب الأراضي والمناخ المصري.",
    "spec.c2.t": "المحاصيل الحقلية", "spec.c2.d": "ثوم وفول سوداني بجودة عالية ومواصفات متجانسة.",
    "spec.c3.t": "الفاكهة", "spec.c3.d": "الباشون فروت والدراجون فروت — بلّغنا وهنكلمك أول ما تتوفر.",
    "spec.c4.t": "توسّع مستمر", "spec.c4.d": "بنجر ولب أصفر متاحين، والبصل في الطريق.",
    "proc.title": "رحلة التقاوي عندنا",
    "proc.1.t": "انتقاء الصنف", "proc.1.d": "نختار أصنافًا مجرّبة تناسب التربة والمناخ.",
    "proc.2.t": "الزراعة والإكثار", "proc.2.d": "زراعة تحت إشراف هندسي ومتابعة مستمرة.",
    "proc.3.t": "الفحص والجودة", "proc.3.d": "فحص التقاوي للتأكد من سلامتها ومطابقتها.",
    "proc.4.t": "الفرز والتدريج", "proc.4.d": "فرز حسب الأحجام لضمان التجانس.",
    "proc.5.t": "التخزين والتوريد", "proc.5.d": "تخزين مناسب وتوريد في الموعد للمزارع.",
    "shop.kicker": "المتجر", "shop.title": "منتجاتنا",
    "shop.lead": "اختار المنتج والكمية، وابعت طلبك مباشرة لمسئول المبيعات على واتساب — السعر بيتحدد حسب الكمية والموسم.",
    "f.all": "الكل", "f.potato": "تقاوي البطاطس", "f.crops": "محاصيل", "f.soon": "قريبًا",
    "card.add": "أضف للطلب", "card.ask": "اسأل عن السعر", "card.notify": "بلّغني عند التوفر", "card.qty": "الكمية",
    "unit.ton": "طن", "unit.sack": "شكارة", "unit.kg": "كيلو", "card.sackNote": "متوسط وزن الشكارة 50 كيلو", "wa.sackNote": "(متوسط الشكارة 50 كيلو)",
    "badge.potato": "تقاوي بطاطس", "badge.crops": "محصول", "badge.soon": "قريبًا", "badge.planted": "تمت الزراعة", "badge.unavailable": "غير متاح حاليًا",
    "cart.title": "طلبك", "cart.empty": "لسه ما ضفتش أي منتجات", "cart.name": "الاسم", "cart.phone": "رقم الهاتف",
    "cart.gov": "المحافظة / المركز", "cart.notes": "ملاحظات", "cart.send": "إرسال الطلب على واتساب", "cart.clear": "تفريغ الطلب",
    "cart.hint": "هيتفتح واتساب برسالة جاهزة فيها طلبك، ومسئول المبيعات هيرد عليك بالسعر والتوافر.",
    "cart.needItems": "أضف منتجًا واحدًا على الأقل", "cart.needName": "من فضلك اكتب اسمك",
    "why.kicker": "لماذا العطار", "why.title": "ليه المزارع بيختارنا؟",
    "why.1.t": "جودة عالية", "why.1.d": "تقاوي منتقاة ومفحوصة لموسم ناجح.",
    "why.2.t": "أسعار منافسة", "why.2.d": "أفضل قيمة مقابل الجودة في السوق.",
    "why.3.t": "خبرة منذ 2019", "why.3.d": "من أوائل الشركات في إنتاج التقاوي بمصر.",
    "why.6.t": "بحوث وتطوير", "why.6.d": "إدارة متخصصة تختبر الأصناف في أيام حقلية قبل طرحها.",
    "why.4.t": "تنوّع المحاصيل", "why.4.d": "بطاطس، ثوم، فول سوداني، بنجر، لب أصفر والمزيد.",
    "why.5.t": "طلب سهل وسريع", "why.5.d": "اطلب في ثوانٍ وتواصل مباشرة مع المبيعات.",
    "contact.kicker": "تواصل معنا", "contact.title": "جاهز لموسم جديد؟",
    "contact.lead": "كلّمنا على واتساب وفريق المبيعات يرد عليك بكل التفاصيل والأسعار.",
    "contact.wa": "تحدث مع المبيعات", "contact.phone": "المبيعات", "contact.support": "الدعم الفني", "contact.people": "المؤسس", "founder": "المؤسس", "contact.email": "البريد الإلكتروني", "contact.address": "العنوان", "contact.follow": "تابعنا",
    "footer.tag": "تقاوي عالية الجودة بأسعار منافسة", "footer.rights": "العطار للتنمية الزراعية. جميع الحقوق محفوظة.",
    "gal.kicker": "من أرض الواقع", "gal.title": "صور من مزارعنا",
    "gal.lead": "مش رسومات — دي حقولنا الحقيقية.",
    "gal.1": "حقول البطاطس تحت الري المحوري وقت الغروب", "gal.2": "نباتات البطاطس على الخطوط في الأرض الرملية",
    "gal.3": "حقل بطاطس في مرحلة النمو الخضري", "gal.4": "حصاد الفول السوداني من حقولنا", "gal.5": "يوم حقلي لإدارة البحوث والتطوير",
    "toast.added": "اتضاف لطلبك ✓", "toast.cleared": "تم تفريغ الطلب",
    "wa.general": "السلام عليكم، أريد الاستفسار عن منتجات شركة العطار للتنمية الزراعية.",
    "wa.order": "السلام عليكم 👋\nأريد طلب المنتجات التالية من شركة العطار للتنمية الزراعية:",
    "wa.ask": "السلام عليكم، أريد معرفة سعر وتوافر:", "wa.notify": "السلام عليكم، أرجو إبلاغي عند توفر:",
    "wa.name": "الاسم", "wa.phone": "الهاتف", "wa.gov": "المحافظة/المركز", "wa.notes": "ملاحظات", "wa.thanks": "شكرًا لكم 🌱"
  },
  en: {
    loader: "Preparing the field…",
    "brand.name": "Al-Attar", "brand.sub": "Agricultural Development",
    "nav.home": "Home", "nav.about": "About", "nav.specialty": "Specialty", "nav.shop": "Shop", "nav.why": "Why us", "nav.gallery": "Our farms", "nav.contact": "Contact",
    "hero.eyebrow": "Since 2019 · One of Egypt's first seed-production companies",
    "hero.title1": "Egyptian seed potatoes", "hero.title2": "in your hands",
    "hero.lead": "Al-Attar Agricultural Development — from El Tal El Kebir, Ismailia — produces high-quality seed potatoes at competitive prices and grows crops that match Egyptian farmers' ambitions.",
    "hero.cta1": "Browse products", "hero.cta2": "Order on WhatsApp",
    "hero.scroll": "Scroll down… and watch the seed grow",
    "v.spunta": "Spunta", "v.caruso": "Caruso", "v.rosita": "Lady Rosetta", "v.diamond": "Diamond", "v.hermes": "Hermes",
    "stats.s1": "Founded", "stats.s2": "Seed-potato varieties", "stats.s3": "Crops available", "stats.s4": "Members in our Facebook community",
    "about.kicker": "About us", "about.title": "Rooted in the land, looking to the future",
    "about.p1": "<b>Al-Attar Agricultural Development</b> was founded in 2019 in El Tal El Kebir, Ismailia, and is one of the first companies working in seed production in Egypt. We farm reclaimed land under modern centre-pivot irrigation, with one goal: high-quality seed at competitive prices.",
    "about.p2": "Our <b>Research & Development department</b> trials varieties at field days with farmers, and we are the <b>exclusive agent and sole distributor of DevoTek Seeds</b> in Egypt. We offer Spunta, Caruso, Lady Rosetta, Diamond and Hermes seed potatoes, alongside garlic, peanuts, beetroot and yellow seeds. Next up: onions.",
    "about.vision.t": "Vision", "about.vision.d": "To be the first name Egyptian farmers trust for seed.",
    "about.mission.t": "Mission", "about.mission.d": "Producing high-quality seed and supplying it at competitive prices that boost farmers' yield and profit.",
    "about.values.t": "Values", "about.values.d": "Quality, honesty, on-time delivery and continuous improvement.",
    "spec.kicker": "Our specialty", "spec.title": "Crop production — from seed to harvest",
    "spec.lead": "We don't just sell seed — we produce it. Every stage passes under our eyes so it reaches you at the highest quality.",
    "spec.c1.t": "Seed-potato production", "spec.c1.d": "Carefully selected international varieties suited to Egyptian soil and climate.",
    "spec.c2.t": "Field crops", "spec.c2.d": "Garlic and peanuts of high, consistent quality.",
    "spec.c3.t": "Fruit", "spec.c3.d": "Passion fruit and dragon fruit — ask and we will tell you when they are back.",
    "spec.c4.t": "Always expanding", "spec.c4.d": "Beetroot and yellow seeds are available; onions are on the way.",
    "proc.title": "The journey of our seed",
    "proc.1.t": "Variety selection", "proc.1.d": "Proven varieties that suit the soil and climate.",
    "proc.2.t": "Planting & multiplication", "proc.2.d": "Grown under engineering supervision with constant follow-up.",
    "proc.3.t": "Inspection & quality", "proc.3.d": "Seed is checked for health and conformity.",
    "proc.4.t": "Sorting & grading", "proc.4.d": "Graded by size for uniformity.",
    "proc.5.t": "Storage & supply", "proc.5.d": "Proper storage and on-time delivery to farmers.",
    "shop.kicker": "Shop", "shop.title": "Our products",
    "shop.lead": "Pick a product and quantity, then send your order straight to our sales team on WhatsApp — prices depend on quantity and season.",
    "f.all": "All", "f.potato": "Seed potatoes", "f.crops": "Crops", "f.soon": "Coming soon",
    "card.add": "Add to order", "card.ask": "Ask for price", "card.notify": "Notify me", "card.qty": "Qty",
    "unit.ton": "ton", "unit.sack": "sack", "unit.kg": "kg", "card.sackNote": "Average sack weight: 50 kg", "wa.sackNote": "(avg. sack 50 kg)",
    "badge.potato": "Seed potato", "badge.crops": "Crop", "badge.soon": "Coming soon", "badge.planted": "Planted", "badge.unavailable": "Currently unavailable",
    "cart.title": "Your order", "cart.empty": "No products added yet", "cart.name": "Name", "cart.phone": "Phone",
    "cart.gov": "Governorate / town", "cart.notes": "Notes", "cart.send": "Send order on WhatsApp", "cart.clear": "Clear order",
    "cart.hint": "WhatsApp opens with your order pre-written; our sales rep will reply with price and availability.",
    "cart.needItems": "Add at least one product", "cart.needName": "Please enter your name",
    "why.kicker": "Why Al-Attar", "why.title": "Why farmers choose us",
    "why.1.t": "High quality", "why.1.d": "Selected, inspected seed for a successful season.",
    "why.2.t": "Competitive prices", "why.2.d": "The best value for quality in the market.",
    "why.3.t": "Experience since 2019", "why.3.d": "One of the first seed producers in Egypt.",
    "why.6.t": "Research & development", "why.6.d": "A dedicated team trials varieties at field days before release.",
    "why.4.t": "Crop variety", "why.4.d": "Potatoes, garlic, peanuts, beetroot, yellow seeds and more.",
    "why.5.t": "Easy, fast ordering", "why.5.d": "Order in seconds and talk directly to sales.",
    "contact.kicker": "Contact", "contact.title": "Ready for a new season?",
    "contact.lead": "Message us on WhatsApp and our sales team will reply with all details and prices.",
    "contact.wa": "Chat with sales", "contact.phone": "Sales", "contact.support": "Technical support", "contact.people": "Founder", "founder": "Founder", "contact.email": "Email", "contact.address": "Address", "contact.follow": "Follow us",
    "footer.tag": "High-quality seed at competitive prices", "footer.rights": "Al-Attar Agricultural Development. All rights reserved.",
    "gal.kicker": "Real life", "gal.title": "From our farms",
    "gal.lead": "Not renders — these are our real fields.",
    "gal.1": "Potato fields under centre-pivot irrigation at sunset", "gal.2": "Potato plants on ridges in sandy soil",
    "gal.3": "A potato field in full vegetative growth", "gal.4": "Peanut harvest from our fields", "gal.5": "R&D field day",
    "toast.added": "Added to your order ✓", "toast.cleared": "Order cleared",
    "wa.general": "Hello, I'd like to ask about Al-Attar Agricultural Development products.",
    "wa.order": "Hello 👋\nI'd like to order the following from Al-Attar Agricultural Development:",
    "wa.ask": "Hello, I'd like the price and availability of:", "wa.notify": "Hello, please notify me when this is available:",
    "wa.name": "Name", "wa.phone": "Phone", "wa.gov": "Governorate/town", "wa.notes": "Notes", "wa.thanks": "Thank you 🌱"
  }
};
let lang = store.get('alattar-lang', 'ar');
const t = k => (I18N[lang] && I18N[lang][k]) ?? I18N.ar[k] ?? k;

/* ---------------- icons ---------------- */
const S = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.4H7.6V14h2.7v8h3.2z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" ${S}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.27 0 .53.04.77.12V9.8a5.8 5.8 0 0 0-.77-.05 5.7 5.7 0 1 0 5.7 5.7V9.1a7.4 7.4 0 0 0 4.3 1.37V7.4a4.3 4.3 0 0 1-3.2-1.6z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.9 8.6H3.6V20h3.3V8.6zM5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zM20.4 13.5c0-3-1.6-5.1-4.4-5.1-1.4 0-2.4.8-2.8 1.5V8.6H10V20h3.3v-5.9c0-1.5.6-2.6 2-2.6 1.4 0 1.9 1.2 1.9 2.6V20h3.3v-6.5z"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z"/></svg>`,
  bag: `<svg viewBox="0 0 24 24" ${S}><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" ${S} class="flip-rtl"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" ${S}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`,
  target: `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" ${S}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>`,
  potato: `<svg viewBox="0 0 24 24" ${S}><path d="M4.5 14c-1-3.6 1.6-8 6.3-8.6 4.6-.6 9 2 9 6 0 4-3.5 7-8.3 7.1C8 18.6 5.3 17 4.5 14z"/><circle cx="9" cy="11" r=".6" fill="currentColor"/><circle cx="14" cy="9.5" r=".6" fill="currentColor"/><circle cx="15" cy="14" r=".6" fill="currentColor"/></svg>`,
  sprout: `<svg viewBox="0 0 24 24" ${S}><path d="M12 21v-9"/><path d="M12 12c0-4 2.5-6.5 7-6.5 0 4.5-2.5 6.5-7 6.5z"/><path d="M12 14c0-3-2-5-6-5 0 3.5 2 5 6 5z"/><path d="M7 21h10"/></svg>`,
  fruit: `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="14" r="7"/><path d="M12 7c0-2 1-3.5 3-4"/><path d="M12 7c-1.5-1.8-3.5-2-5-1.5 1 1.6 2.8 2 5 1.5z"/></svg>`,
  growth: `<svg viewBox="0 0 24 24" ${S}><path d="M3 20h18"/><path d="M6 20v-4M11 20v-7M16 20V9"/><path d="M5 10l5-4 4 3 6-5"/><path d="M16 4h4v4"/></svg>`,
  medal: `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/><path d="M12 6.5l.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3z"/></svg>`,
  tag: `<svg viewBox="0 0 24 24" ${S}><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" ${S}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24" ${S}><path d="M5 19C5 10 10 4 20 4c0 10-6 15-15 15z"/><path d="M5 19l8-8"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" ${S}><path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" ${S}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" ${S}><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
  flask: `<svg viewBox="0 0 24 24" ${S}><path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/></svg>`,
  headset: `<svg viewBox="0 0 24 24" ${S}><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/><path d="M19 20a3 3 0 0 1-3 2h-3"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" ${S}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>`
};
const fillIcons = (root = document) => $$('[data-icon]', root).forEach(el => { el.innerHTML = ICONS[el.dataset.icon] || ''; });

/* ---------------- product illustrations ---------------- */
function art(p) {
  const id = 'g' + p.id;
  const shadow = `<ellipse cx="100" cy="170" rx="64" ry="9" fill="#1d3b1f" opacity=".14"/>`;
  const potato = (path, eyes, c) => `
    <defs><radialGradient id="${id}" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#fff3cf"/><stop offset=".25" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></radialGradient></defs>
    ${shadow}
    <g transform="translate(18 26) scale(.55)" opacity=".95"><path d="${path}" fill="url(#${id})"/></g>
    <path d="${path}" fill="url(#${id})"/>
    ${eyes.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="1.8" fill="#000" opacity=".22"/>`).join('')}
    <path d="M118 62c2-12 8-20 18-24" stroke="#6E9E3C" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M136 38c6-6 14-6 18-2-5 5-12 6-18 2z" fill="#4CB050"/>`;
  const shapes = {
    'potato-long': 'M32 112c-2-30 30-50 74-48 44 2 66 22 64 46-2 28-32 44-72 44-40 0-64-16-66-42z',
    'potato-oval': 'M44 110c-2-30 24-50 60-50 38 0 58 22 58 48 0 28-26 46-60 46-34 0-56-18-58-44z',
    'potato-round': 'M52 110c0-30 22-52 50-52 30 0 50 22 50 50 0 30-22 52-50 52-30 0-50-22-50-50z',
    'potato-red': 'M42 112c-2-28 26-48 62-48 36 0 58 22 56 46-2 28-26 46-60 46-34 0-56-18-58-44z'
  };
  const eyes = [[78, 96], [120, 88], [138, 120], [96, 132], [62, 118]];
  switch (p.art) {
    case 'potato-long': case 'potato-oval': case 'potato-round': case 'potato-red':
      return potato(shapes[p.art], eyes, p.skin || ['#F3D27C', '#C98F3E']);
    case 'cucumber': return `
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC254"/><stop offset="1" stop-color="#2E7D32"/></linearGradient></defs>
      ${shadow}
      <path d="M150 52c-8-6-22 2-22 2" stroke="#6E9E3C" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M128 40c10-12 30-12 38-2-10 10-28 12-38 2z" fill="#5DBB55"/>
      <g transform="rotate(-28 100 110)">
        <rect x="34" y="88" width="136" height="40" rx="20" fill="url(#${id})"/>
        ${[50, 66, 82, 98, 114, 130, 146].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 98 : 116}" r="2.4" fill="#E6F5C9" opacity=".8"/>`).join('')}
        <rect x="44" y="94" width="110" height="6" rx="3" fill="#fff" opacity=".22"/>
      </g>
      <g transform="rotate(-10 120 150)">
        <rect x="70" y="132" width="96" height="30" rx="15" fill="url(#${id})"/>
        <rect x="80" y="137" width="76" height="4" rx="2" fill="#fff" opacity=".2"/>
      </g>`;
    case 'garlic': return `
      <defs><radialGradient id="${id}" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#F2E9F2"/><stop offset="1" stop-color="#C9A8C9"/></radialGradient></defs>
      ${shadow}
      <path d="M100 30c4 10 6 22 4 34" stroke="#9BBF6A" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M100 60c-40 6-58 40-50 70 6 24 28 36 50 36s44-12 50-36c8-30-10-64-50-70z" fill="url(#${id})"/>
      <path d="M100 62c-14 16-18 50-6 100M100 62c14 16 18 50 6 100M100 62c-30 14-40 50-28 96M100 62c30 14 40 50 28 96" stroke="#B48FB4" stroke-width="2" fill="none" opacity=".7"/>
      <path d="M84 166l-4 8M96 167l-1 9M108 167l2 8M118 165l5 7" stroke="#C8B08A" stroke-width="2.5" stroke-linecap="round"/>`;
    case 'peanut': return `
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0D4A0"/><stop offset="1" stop-color="#C28F52"/></linearGradient>
      <pattern id="${id}p" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 5h10M5 0v10" stroke="#A97A42" stroke-width="1" opacity=".45"/></pattern></defs>
      ${shadow}
      <g transform="rotate(-24 100 100)">
        <path d="M40 100c0-22 16-34 34-30 10 2 16 8 26 8s16-6 26-8c18-4 34 8 34 30s-16 34-34 30c-10-2-16-8-26-8s-16 6-26 8c-18 4-34-8-34-30z" fill="url(#${id})"/>
        <path d="M40 100c0-22 16-34 34-30 10 2 16 8 26 8s16-6 26-8c18-4 34 8 34 30s-16 34-34 30c-10-2-16-8-26-8s-16 6-26 8c-18 4-34-8-34-30z" fill="url(#${id}p)"/>
      </g>
      <ellipse cx="62" cy="150" rx="13" ry="9" fill="#C9764A"/><ellipse cx="86" cy="156" rx="13" ry="9" fill="#B9683E"/>
      <ellipse cx="58" cy="147" rx="5" ry="2.5" fill="#fff" opacity=".35"/>`;
    case 'passion': return `
      <defs><radialGradient id="${id}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#9D6BB8"/><stop offset="1" stop-color="#4A2160"/></radialGradient>
      <radialGradient id="${id}y" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#F2A81D"/></radialGradient></defs>
      ${shadow}
      <circle cx="78" cy="96" r="46" fill="url(#${id})"/>
      ${[[60, 80], [92, 74], [70, 112], [98, 104], [56, 100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#fff" opacity=".25"/>`).join('')}
      <path d="M78 50c0-8 4-14 10-16" stroke="#6E9E3C" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="136" cy="134" rx="36" ry="30" fill="#5A2A72"/>
      <ellipse cx="136" cy="134" rx="30" ry="24" fill="#F7F0E2"/>
      <ellipse cx="136" cy="134" rx="25" ry="19" fill="url(#${id}y)"/>
      ${[[126, 128], [140, 124], [148, 136], [132, 142], [122, 138], [144, 146], [136, 134]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#2b1a0e"/>`).join('')}`;
    case 'onion': return `
      <defs><radialGradient id="${id}" cx=".38" cy=".35" r=".8"><stop offset="0" stop-color="#E7A5B5"/><stop offset=".6" stop-color="#A8436A"/><stop offset="1" stop-color="#6B1F44"/></radialGradient></defs>
      ${shadow}
      <path d="M100 52c-4-10-2-20 4-26M100 52c2-12 8-18 14-20" stroke="#8DB65A" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M100 54c-30 18-58 40-52 76 4 24 26 36 52 36s48-12 52-36c6-36-22-58-52-76z" fill="url(#${id})"/>
      <path d="M100 56c-14 24-20 60-8 108M100 56c14 24 20 60 8 108M100 56c-30 26-40 64-24 104M100 56c30 26 40 64 24 104" stroke="#fff" stroke-width="1.6" fill="none" opacity=".35"/>
      <path d="M90 166l-3 8M100 167v9M110 166l3 8" stroke="#C8B08A" stroke-width="2.5" stroke-linecap="round"/>`;
    case 'beet': return `
      <defs><radialGradient id="${id}" cx=".38" cy=".35" r=".8"><stop offset="0" stop-color="#D4507A"/><stop offset="1" stop-color="#5E0E2C"/></radialGradient></defs>
      ${shadow}
      <path d="M100 74c-10-24-30-40-48-40 4 22 22 38 48 40z" fill="#4CA84A"/><path d="M100 74c-10-24-30-40-48-40" stroke="#B8245A" stroke-width="2" fill="none"/>
      <path d="M100 74c8-28 26-46 46-48-2 24-20 42-46 48z" fill="#5DBB55"/><path d="M100 74c8-28 26-46 46-48" stroke="#B8245A" stroke-width="2" fill="none"/>
      <path d="M100 76c-30 0-46 22-44 46 2 22 22 34 40 40l4 14 4-14c18-6 38-18 40-40 2-24-14-46-44-46z" fill="url(#${id})"/>
      <ellipse cx="84" cy="100" rx="10" ry="5" fill="#fff" opacity=".2"/>`;
    case 'seeds': return `
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF4C2"/><stop offset="1" stop-color="#E6B94A"/></linearGradient></defs>
      ${shadow}
      ${Array.from({ length: 22 }, (_, i) => {
        const a = i * 2.4, r = 10 + i * 2.6, x = 100 + Math.cos(a) * r, y = 112 + Math.sin(a) * r * 0.6;
        return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(i * 47) % 360})"><path d="M0-11c6 0 9 6 8 11-1 6-5 9-8 9s-7-3-8-9c-1-5 2-11 8-11z" fill="url(#${id})" stroke="#C9963A" stroke-width="1"/></g>`;
      }).join('')}`;
  }
  return '';
}

/* ---------------- WhatsApp ---------------- */
const waNumber = () => String(CFG.whatsappNumber || '').replace(/\D/g, '');
const waUrl = text => `https://wa.me/${waNumber()}?text=${encodeURIComponent(text)}`;
const pName = p => p.name[lang] || p.name.ar;

/* ---------------- static text & config ---------------- */
function applyI18n() {
  const html = document.documentElement;
  html.lang = lang; html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  $('#langBtn').textContent = lang === 'ar' ? 'EN' : 'ع';
  $$('[data-wa="general"]').forEach(a => { a.href = waUrl(t('wa.general')); });
  const addr = CFG.address || {};
  $('#addressText').textContent = addr[lang] || addr.ar || '';
  document.title = lang === 'ar' ? 'العطار للتنمية الزراعية | Al-Attar Agricultural Development' : 'Al-Attar Agricultural Development | العطار للتنمية الزراعية';
  renderProducts();
  renderCart();
  sceneApi && sceneApi.setDirection(lang === 'ar');
}

function applyConfig() {
  const ph = $('#phoneLink');
  ph.textContent = CFG.phoneDisplay || '';
  ph.href = 'tel:' + String(CFG.phoneDisplay || '').replace(/[^\d+]/g, '');
  const sp = $('#supportLink');
  sp.textContent = CFG.supportDisplay || '';
  sp.href = 'tel:' + String(CFG.supportDisplay || '').replace(/[^\d+]/g, '');
  sp.closest('li').hidden = !CFG.supportDisplay;
  const em = $('#emailLink');
  em.textContent = CFG.email || ''; em.href = 'mailto:' + (CFG.email || '');
  em.closest('li').hidden = !CFG.email;
  const people = (CFG.people || []).filter(p => p.linkedin);
  $('#peopleLinks').innerHTML = people.map(p => `<a href="${p.linkedin}" target="_blank" rel="noopener" class="person-link">${ICONS.linkedin}<span>Founder: ${p.name}</span></a>`).join('');
  $('#peopleLinks').closest('li').hidden = !people.length;
  const soc = CFG.social || {};
  const html = Object.entries(soc).filter(([, url]) => url)
    .map(([k, url]) => `<a href="${url}" target="_blank" rel="noopener" aria-label="${k}" class="soc soc-${k}">${ICONS[k] || ''}</a>`).join('')
    + `<a data-wa="general" target="_blank" rel="noopener" aria-label="whatsapp" class="soc soc-whatsapp">${ICONS.whatsapp}</a>`;
  $$('[data-socials]').forEach(el => { el.innerHTML = html; });
  $('#year').textContent = new Date().getFullYear();
}

/* ---------------- shop ---------------- */
let filter = 'all';
const grid = $('#grid');

function renderProducts() {
  const list = PRODUCTS.filter(p => filter === 'all' || p.category === filter);
  grid.innerHTML = list.map((p, i) => {
    const badgeKey = p.status ? 'badge.' + p.status : 'badge.' + p.category;
    const other = lang === 'ar' ? p.name.en : p.name.ar;
    const media = p.image ? `<img src="${p.image}" alt="${pName(p)}" loading="lazy" class="${p.imageFit ? 'fit-' + p.imageFit : ''}" style="object-position:${p.imagePos || 'center'}">` : `<svg viewBox="0 0 200 190" class="art">${art(p)}</svg>`;
    const soon = p.category === 'soon' || p.status === 'unavailable';
    const actions = soon
      ? `<button class="btn btn-ghost btn-block" data-notify="${p.id}" type="button"><span data-icon="whatsapp"></span>${t('card.notify')}</button>`
      : `<div class="order-row">
           <div class="qty" aria-label="${t('card.qty')}"><button type="button" data-step="-1">−</button><input type="number" min="1" value="1" inputmode="numeric"><button type="button" data-step="1">+</button></div>
           <select class="unit">${p.units.map(u => `<option value="${u}">${t('unit.' + u)}</option>`).join('')}</select>
         </div>
         <small class="sack-note">${p.units.includes('sack') ? t('card.sackNote') : ''}</small>
         <div class="card-actions">
           <button class="btn btn-primary" data-add="${p.id}" type="button"><span data-icon="bag"></span>${t('card.add')}</button>
           <button class="btn btn-icon" data-ask="${p.id}" type="button" title="${t('card.ask')}" aria-label="${t('card.ask')}"><span data-icon="whatsapp"></span></button>
         </div>`;
    return `<article class="product cat-${p.category}${p.status === 'unavailable' ? ' is-unavailable' : ''}" data-id="${p.id}" style="--d:${i * 60}ms">
      <div class="product-media">${media}<span class="badge badge-${p.status || p.category}">${t(badgeKey)}</span></div>
      <div class="product-body">
        <div class="title-row"><h3>${pName(p)}</h3><span class="alt-name">${other}</span></div>
        <p>${p.desc[lang] || p.desc.ar}</p>
        <ul class="tags">${(p.tags[lang] || p.tags.ar).map(x => `<li>${x}</li>`).join('')}</ul>
        ${actions}
      </div>
    </article>`;
  }).join('');
  fillIcons(grid);
  requestAnimationFrame(() => $$('.product', grid).forEach(el => el.classList.add('in')));
}

$('#filters').addEventListener('click', e => {
  const b = e.target.closest('[data-filter]'); if (!b) return;
  filter = b.dataset.filter;
  $$('#filters .chip').forEach(c => c.classList.toggle('active', c === b));
  renderProducts();
});

grid.addEventListener('click', e => {
  const card = e.target.closest('.product'); if (!card) return;
  const p = PRODUCTS.find(x => x.id === card.dataset.id);
  const step = e.target.closest('[data-step]');
  if (step) {
    const inp = $('input', card);
    inp.value = Math.max(1, (parseInt(inp.value, 10) || 1) + Number(step.dataset.step));
    return;
  }
  if (e.target.closest('[data-add]')) {
    const qty = Math.max(1, parseInt($('input', card).value, 10) || 1);
    addToCart(p.id, qty, $('select', card).value, e.target.closest('[data-add]'));
    return;
  }
  if (e.target.closest('[data-ask]')) { window.open(waUrl(`${t('wa.ask')} ${pName(p)} (${p.name.en})`), '_blank', 'noopener'); return; }
  if (e.target.closest('[data-notify]')) { window.open(waUrl(`${t('wa.notify')} ${pName(p)} (${p.name.en})`), '_blank', 'noopener'); }
});

/* 3D tilt on product cards */
grid.addEventListener('pointermove', e => {
  const card = e.target.closest('.product'); if (!card || e.pointerType !== 'mouse') return;
  const r = card.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  card.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
  card.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
  card.style.setProperty('--mx', ((x + .5) * 100).toFixed(1) + '%');
  card.style.setProperty('--my', ((y + .5) * 100).toFixed(1) + '%');
});
grid.addEventListener('pointerout', e => {
  const card = e.target.closest('.product');
  if (card && !card.contains(e.relatedTarget)) { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); }
});

/* ---------------- cart ---------------- */
let cart = store.get('alattar-cart', []).filter(it => PRODUCTS.some(p => p.id === it.id && p.units.includes(it.unit)));
const saveCart = () => store.set('alattar-cart', cart);

function addToCart(id, qty, unit, fromEl) {
  const found = cart.find(it => it.id === id && it.unit === unit);
  if (found) found.qty += qty; else cart.push({ id, qty, unit });
  saveCart(); renderCart(); toast(t('toast.added'));
  flyToCart(fromEl);
  const btn = $('#cartBtn'); btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump');
}

function flyToCart(fromEl) {
  if (!fromEl) return;
  const a = fromEl.getBoundingClientRect(), b = $('#cartBtn').getBoundingClientRect();
  const dot = document.createElement('div'); dot.className = 'fly-dot';
  document.body.appendChild(dot);
  const sx = a.left + a.width / 2, sy = a.top + a.height / 2, ex = b.left + b.width / 2, ey = b.top + b.height / 2;
  dot.animate([
    { transform: `translate(${sx}px, ${sy}px) scale(1)`, opacity: 1 },
    { transform: `translate(${(sx + ex) / 2}px, ${Math.min(sy, ey) - 120}px) scale(1.3)`, opacity: 1, offset: .5 },
    { transform: `translate(${ex}px, ${ey}px) scale(.4)`, opacity: .4 }
  ], { duration: 750, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = () => dot.remove();
}

function renderCart() {
  const count = cart.reduce((s, it) => s + 1, 0);
  $('#cartCount').textContent = count;
  $('#cartCount').classList.toggle('show', count > 0);
  $('#cartEmpty').style.display = cart.length ? 'none' : '';
  $('#cartList').innerHTML = cart.map((it, i) => {
    const p = PRODUCTS.find(x => x.id === it.id);
    return `<li class="cart-item">
      <div class="ci-art">${p.image ? `<img src="${p.image}" alt="" class="${p.imageFit ? 'fit-' + p.imageFit : ''}">` : `<svg viewBox="0 0 200 190">${art({ ...p, id: p.id + 'c' })}</svg>`}</div>
      <div class="ci-info"><b>${pName(p)}</b>
        <div class="ci-controls">
          <div class="qty sm"><button type="button" data-cstep="-1" data-i="${i}">−</button><input type="number" min="1" value="${it.qty}" data-cqty="${i}"><button type="button" data-cstep="1" data-i="${i}">+</button></div>
          <span class="ci-unit">${t('unit.' + it.unit)}</span>
        </div>
      </div>
      <button class="icon-btn danger" type="button" data-remove="${i}" aria-label="remove">${ICONS.trash}</button>
    </li>`;
  }).join('');
}

$('#cartList').addEventListener('click', e => {
  const st = e.target.closest('[data-cstep]');
  if (st) { const it = cart[+st.dataset.i]; it.qty = Math.max(1, it.qty + Number(st.dataset.cstep)); saveCart(); renderCart(); return; }
  const rm = e.target.closest('[data-remove]');
  if (rm) { cart.splice(+rm.dataset.remove, 1); saveCart(); renderCart(); }
});
$('#cartList').addEventListener('change', e => {
  const inp = e.target.closest('[data-cqty]'); if (!inp) return;
  cart[+inp.dataset.cqty].qty = Math.max(1, parseInt(inp.value, 10) || 1); saveCart(); renderCart();
});

const openCart = () => { document.body.classList.add('cart-open'); };
const closeCart = () => { document.body.classList.remove('cart-open'); };
$('#cartBtn').addEventListener('click', openCart);
$('#closeCart').addEventListener('click', closeCart);
$('#overlay').addEventListener('click', () => { closeCart(); document.body.classList.remove('nav-open'); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

$('#clearCart').addEventListener('click', () => { cart = []; saveCart(); renderCart(); toast(t('toast.cleared')); });

const form = $('#orderForm');
const savedForm = store.get('alattar-form', {});
Object.entries(savedForm).forEach(([k, v]) => { if (form.elements[k]) form.elements[k].value = v; });
form.addEventListener('input', () => store.set('alattar-form', Object.fromEntries(new FormData(form))));

$('#sendOrder').addEventListener('click', () => {
  if (!cart.length) { toast(t('cart.needItems')); return; }
  const f = Object.fromEntries(new FormData(form));
  if (!String(f.name || '').trim()) { toast(t('cart.needName')); form.elements.name.focus(); return; }
  const lines = cart.map((it, i) => {
    const p = PRODUCTS.find(x => x.id === it.id);
    return `${i + 1}) ${pName(p)} (${p.name.en}) — ${it.qty} ${t('unit.' + it.unit)}${it.unit === 'sack' ? ' ' + t('wa.sackNote') : ''}`;
  });
  const info = [
    `${t('wa.name')}: ${f.name}`,
    f.phone && `${t('wa.phone')}: ${f.phone}`,
    f.gov && `${t('wa.gov')}: ${f.gov}`,
    f.notes && `${t('wa.notes')}: ${f.notes}`
  ].filter(Boolean);
  const msg = [t('wa.order'), '', ...lines, '', ...info, '', t('wa.thanks')].join('\n');
  window.open(waUrl(msg), '_blank', 'noopener');
});

/* ---------------- gallery lightbox ---------------- */
const lb = $('#lightbox');
$('#gallery').addEventListener('click', e => {
  const fig = e.target.closest('figure'); if (!fig) return;
  $('img', lb).src = $('img', fig).src;
  $('figcaption', lb).textContent = $('figcaption', fig).textContent;
  lb.classList.add('open');
});
lb.addEventListener('click', () => lb.classList.remove('open'));
addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
$('#gallery').addEventListener('pointermove', e => {
  const fig = e.target.closest('figure'); if (!fig || e.pointerType !== 'mouse') return;
  const r = fig.getBoundingClientRect();
  fig.style.setProperty('--rx', (-((e.clientY - r.top) / r.height - .5) * 8).toFixed(2) + 'deg');
  fig.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 10).toFixed(2) + 'deg');
});
$('#gallery').addEventListener('pointerout', e => {
  const fig = e.target.closest('figure');
  if (fig && !fig.contains(e.relatedTarget)) { fig.style.setProperty('--rx', '0deg'); fig.style.setProperty('--ry', '0deg'); }
});

/* ---------------- toast ---------------- */
let toastTimer;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ---------------- header, nav, reveal, counters ---------------- */
const header = $('#header');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 30), { passive: true });
$('#menuBtn').addEventListener('click', () => document.body.classList.toggle('nav-open'));
$('#nav').addEventListener('click', e => { if (e.target.closest('a')) document.body.classList.remove('nav-open'); });

$('#langBtn').addEventListener('click', () => {
  lang = lang === 'ar' ? 'en' : 'ar'; store.set('alattar-lang', lang);
  document.body.classList.add('lang-switching');
  setTimeout(() => { applyI18n(); document.body.classList.remove('lang-switching'); }, 180);
});

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); revealObs.unobserve(en.target); } });
}, { threshold: 0.15 });
$$('.reveal').forEach(el => revealObs.observe(el));

const countObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, to = +el.dataset.count, from = +(el.dataset.from || 0), suf = el.dataset.suffix || '';
    const t0 = performance.now(), dur = 1400;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * e) + (k === 1 ? suf : '');
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countObs.unobserve(el);
  });
}, { threshold: 0.6 });
$$('[data-count]').forEach(el => countObs.observe(el));

const sections = $$('main section[id]');
const navObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) $$('#nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => navObs.observe(s));

/* ---------------- boot ---------------- */
let sceneApi = null;
const hideLoader = () => document.body.classList.add('loaded');
setTimeout(hideLoader, 4500);

fillIcons();
applyConfig();
applyI18n();

import('./scene.js?v=10')
  .then(m => { sceneApi = m.initScene({ onReady: () => setTimeout(hideLoader, 250) }); sceneApi.setDirection(lang === 'ar'); })
  .catch(err => { console.warn('3D scene unavailable:', err); document.body.classList.add('no-webgl'); hideLoader(); });
