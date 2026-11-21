/* =========================================================
   المنتجات — أضف / عدّل / احذف من هنا
   category: "potato" تقاوي بطاطس | "crops" محاصيل | "soon" قريبًا
   status:   "unavailable" غير متاح حاليًا | "soon" | "planted"  (اختياري)
   image:    صورة المنتج.  imageFit: "exact" للصور المفرّغة (بدون خلفية)
   art:      رسم احتياطي يظهر لو مفيش صورة
   units:    sack شكارة (متوسط 50 كجم) | ton طن
   أوصاف وصور الأصناف من موقع الشركة alattarcrops.com
   صور المحاصيل الأخرى من Unsplash (رخصة مجانية للاستخدام التجاري) — انظر images/crops/CREDITS.md
   ========================================================= */
window.PRODUCTS = [
  {
    id: "spunta", category: "potato", art: "potato-long",
    image: "images/varieties/spunta.jpg", imageFit: "exact",
    name: { ar: "سبونتا", en: "Spunta" },
    desc: {
      ar: "صنف مرغوب جدًا في السوق المحلي، متعدد الأغراض وإنتاجيته عالية جدًا.",
      en: "Very popular on the local market — a multi-purpose variety with very high yield."
    },
    tags: { ar: ["إنتاجية عالية جدًا", "متعدد الأغراض", "السوق المحلي"], en: ["Very high yield", "Multi-purpose", "Local market"] },
    units: ["sack", "ton"]
  },
  {
    id: "caruso", category: "potato", art: "potato-oval",
    image: "images/varieties/caruso.png", imageFit: "exact",
    name: { ar: "كاروزو", en: "Caruso" },
    desc: {
      ar: "قشرة بيضاء وصلابة مرتفعة جدًا، إنتاجية مرتفعة ومقاوم للندوة المتأخرة. مرغوب جدًا في جميع مصانع الشيبسي.",
      en: "White skin and very high dry matter, high yield and resistant to late blight. Sought after by every crisps factory."
    },
    tags: { ar: ["مقاوم للندوة المتأخرة", "صلابة عالية جدًا", "شيبسي"], en: ["Late-blight resistant", "Very high dry matter", "Crisps"] },
    units: ["sack", "ton"]
  },
  {
    id: "rosita", category: "potato", art: "potato-red",
    image: "images/varieties/rosita.png", imageFit: "exact",
    name: { ar: "ليدي روزيتا", en: "Lady Rosetta" },
    desc: {
      ar: "من أفضل الأصناف التصنيعية خاصة لمصانع الشيبسي، صلابة مرتفعة جدًا وقشرة حمراء. من أصناف التصدير لمصانع أوروبا وروسيا.",
      en: "One of the best processing varieties, especially for crisps. Very high dry matter and red skin — exported to factories in Europe and Russia."
    },
    tags: { ar: ["قشرة حمراء", "تصدير", "شيبسي"], en: ["Red skin", "Export", "Crisps"] },
    units: ["sack", "ton"]
  },
  {
    id: "diamond", category: "potato", art: "potato-oval",
    image: "images/varieties/diamond.png", imageFit: "exact",
    name: { ar: "دايموند", en: "Diamond" },
    desc: {
      ar: "من أصناف المائدة المشهورة، أبيض اللون وإنتاجيته عالية، مقاوم للأمراض وسهل التعامل معه. يُستخدم أيضًا في مصانع البطاطس نصف المقلية.",
      en: "A well-known table variety: white, high-yielding, disease-resistant and easy to handle. Also used by par-fried (frozen fries) factories."
    },
    tags: { ar: ["مائدة", "مقاوم للأمراض", "نصف مقلية"], en: ["Table", "Disease-resistant", "Par-fried"] },
    units: ["sack", "ton"]
  },
  {
    id: "hermes", category: "potato", art: "potato-round",
    image: "images/varieties/hermes.png", imageFit: "exact",
    name: { ar: "هرمز", en: "Hermes" },
    desc: {
      ar: "من الأصناف التصنيعية، متوسط الصلابة وإنتاجيته مرتفعة، ومقاوم نوعًا ما للجفاف.",
      en: "A processing variety with medium dry matter and high yield, and some drought tolerance."
    },
    tags: { ar: ["تصنيعي", "إنتاجية مرتفعة", "يتحمل الجفاف"], en: ["Processing", "High yield", "Drought tolerant"] },
    units: ["sack", "ton"]
  },
  {
    id: "garlic", category: "crops", art: "garlic",
    image: "images/crops/garlic.jpg",
    name: { ar: "الثوم", en: "Garlic" },
    desc: { ar: "ثوم عالي الجودة بفصوص ممتلئة ونكهة قوية.", en: "High-quality garlic with full cloves and a strong flavour." },
    tags: { ar: ["فصوص ممتلئة", "نكهة قوية"], en: ["Full cloves", "Strong flavour"] },
    units: ["sack", "ton"]
  },
  {
    id: "peanut", category: "crops", art: "peanut", image: "images/crops/peanut.jpg",
    name: { ar: "الفول السوداني", en: "Peanuts" },
    desc: { ar: "فول سوداني من حقولنا بقرون ممتلئة وحبوب متجانسة.", en: "Peanuts from our own fields, with well-filled pods and uniform kernels." },
    tags: { ar: ["من حقولنا", "قرون ممتلئة"], en: ["Our fields", "Filled pods"] },
    units: ["sack", "ton"]
  },
  {
    id: "beet", category: "crops", art: "beet",
    image: "images/crops/beet.jpg",
    name: { ar: "البنجر", en: "Beetroot" },
    desc: { ar: "بنجر من إنتاجنا بلون أحمر عميق وجذور متجانسة.", en: "Beetroot from our farms — deep red with uniform roots." },
    tags: { ar: ["متاح الآن", "جذور متجانسة"], en: ["Available now", "Uniform roots"] },
    units: ["sack", "ton"]
  },
  {
    id: "seeds", category: "crops", art: "seeds",
    image: "images/crops/yellow-seeds.jpg",
    name: { ar: "اللب الأصفر", en: "Yellow Seeds (Lob)" },
    desc: { ar: "لب أصفر من إنتاج العطار، متاح للطلب.", en: "Yellow seeds from Al-Attar, available to order." },
    tags: { ar: ["متاح الآن"], en: ["Available now"] },
    units: ["sack", "ton"]
  },
  {
    id: "passion", category: "crops", art: "passion", status: "unavailable",
    image: "images/crops/passion-fruit.jpg",
    name: { ar: "الباشون فروت", en: "Passion Fruit" },
    desc: { ar: "فاكهة استوائية بطعم مميز — غير متاحة حاليًا، اطلب إبلاغك عند توفرها.", en: "A tropical fruit with a distinctive taste — currently unavailable; ask to be notified." },
    tags: { ar: ["غير متاح حاليًا"], en: ["Currently unavailable"] },
    units: ["sack", "ton"]
  },
  {
    id: "dragon", category: "crops", art: "passion", status: "unavailable",
    image: "images/crops/dragon-fruit.jpg",
    name: { ar: "الدراجون فروت", en: "Dragon Fruit" },
    desc: { ar: "فاكهة التنين بلونها الوردي المميز — غير متاحة حاليًا، اطلب إبلاغك عند توفرها.", en: "Dragon fruit with its striking pink colour — currently unavailable; ask to be notified." },
    tags: { ar: ["غير متاح حاليًا"], en: ["Currently unavailable"] },
    units: ["sack", "ton"]
  },
  {
    id: "onion", category: "soon", art: "onion", status: "soon",
    image: "images/crops/onion.jpg",
    name: { ar: "البصل", en: "Onion" },
    desc: { ar: "قريبًا — بصل بجودة العطار.", en: "Coming soon — onions with Al-Attar quality." },
    tags: { ar: ["قريبًا"], en: ["Coming soon"] },
    units: ["sack", "ton"]
  }
];
