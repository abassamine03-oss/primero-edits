/* ============================================================
   Primero Edits — app logic
   Vanilla JS, no framework, no inline handlers, no innerHTML
   with user data. All dynamic text is written via textContent.
   ============================================================ */

(function () {
  "use strict";

  /* ----------------------------- config ----------------------------- */

  var PHONE = "201003974781";
  var WA_BASE = "https://wa.me/" + PHONE;

  var MAX_MINUTES = 10000;
  var RATE = { podcast: 1.2, youtube: 2 };
  var MIN_PRICE = { podcast: 20, youtube: 30 };
  var CAPTION_RATE = 0.5, CAPTION_CAP = 40;
  var BROLL_RATE = 0.5, BROLL_CAP = 50;
  var THUMB_PRICE = 10;
  var MENA_DISCOUNT = 0.2;
  var BIG_DISCOUNT = 0.1;
  var BIG_THRESHOLD = 100;      // 10% off above this subtotal
  var SPECIAL_THRESHOLD = 350;  // above this: no auto discount, special quote

  var THROTTLE_MS = 4000;       // min gap between booking clicks
  var WINDOW_MS = 60000;        // rolling window
  var MAX_CLICKS = 12;          // max bookings per window

  /* ----------------------------- i18n ----------------------------- */

  var I18N = {
    ar: {
      tagline: "نحول ساعات التسجيل الطويلة لفيديو نظيف يتشاف للآخر",
      slogan: "Primero Edits - Less Noise More Story",
      tools: "عباس أمين - Video Editor | CapCut Mobile Pro, Ai Tools, Meta AI, ChatGPT, Thumbnail Generation Tools",
      whatsapp: "واتساب",
      calculate: "احسب سعرك",
      ownerLine: "عباس أمين • مونتير فيديو",
      paynote: "الدفع بعد التسليم - عينة بعلامة مائية",
      choose: "اختار نوع مشروعك",
      youtubeLong: "YOUTUBE LONG",
      youtubePrice: "$2/دقيقة",
      podcastEdit: "PODCAST EDIT",
      podcastPrice: "$1.2/دقيقة",
      cleanStory: "قصة نظيفة",
      cleanAudio: "تنظيف صوت",
      clickDetails: "اضغط للتفاصيل",
      detailsYoutube: "مونتاج يوتيوب طويل: تقطيع اللحظات الميتة، تنظيم القصة، إيقاع سريع يخلي المشاهد يكمل للآخر. تنظيف صوت احترافي وتراك B-roll مدروس.",
      detailsPodcast: "مونتاج بودكاست: نحول الساعات الطويلة لحلقة مركزة، قص الحشو والتكرار، موازنة الصوت وإزالة الضوضاء، جاهز للنشر.",
      calcYouTube: "احسب يوتيوب",
      calcPodcast: "احسب بودكاست",
      aboutTitle: "About Me",
      aboutText: "Hi I'm Abbas Amin, Video Editor focused on clean storytelling. I cut long recordings into watchable videos, remove noise, add captions, B-roll, and deliver ready for upload. Tools: CapCut Mobile Pro, Ai Tools, Meta AI, ChatGPT, Thumbnail Generation Tools. Less Noise, More Story — ده مبدأ شغلي.",
      calcTitle: "حاسبة الأسعار",
      calcSub: "مفتوحة بدون حدود - كتابة عادية",
      projectTypeLabel: "نوع المشروع",
      podcast: "PODCAST $1.2/min",
      youtube: "YOUTUBE $2/min",
      duration: "المدة (بالدقائق)",
      captionLabel: "ترجمة",
      captionPrice: "+$0.5/دقيقة (حد أقصى $40)",
      brollLabel: "لقطات إضافية",
      brollPrice: "+$0.5/دقيقة (حد أقصى $50)",
      thumbLabel: "صورة مصغرة",
      thumbPrice: "$10",
      subtotal: "المجموع الفرعي",
      total: "الإجمالي",
      mena: "خصم MENA 20%",
      big: "10% Off",
      largeBanner: "مشروعك فوق $350؟ واتساب لخصم خاص",
      bookPrefix: "💬 احجز - $",
      bookSuffix: " واتساب",
      bookQuote: "💬 اطلب عرض خاص - واتساب",
      bookEmpty: "💬 احجز واتساب",
      bookBlocked: "اهدى شوية — حاول بعد ثواني",
      needMinutes: "اكتب مدة المشروع الأول",
      servicesTitle: "الخدمات",
      s1: "تقطيع بودكاست",
      s1d: "قص احترافي + تنظيف صوت",
      s2: "يوتيوب طويل",
      s2d: "قصة نظيفة تتشاف للآخر",
      s3: "B-Roll $0.5/د (حد أقصى $50)",
      s3d: "لقطات تدعم القصة",
      s4: "ثامبنيل $10",
      s4d: "صورة مصغرة تشد النقر",
      footer: "Primero Edits - Abbas Amin • Less Noise More Story",
      minNotePod: "الحد الأدنى $20",
      minNoteYou: "الحد الأدنى $30",
      hint: "اكتب 60 أو 60.5 أو ١٢٠"
    },
    en: {
      tagline: "We turn long recordings into clean videos people watch till the end",
      slogan: "Primero Edits - Less Noise More Story",
      tools: "Abbas Amin - Video Editor | CapCut Mobile Pro, Ai Tools, Meta AI, ChatGPT, Thumbnail Generation Tools",
      whatsapp: "WhatsApp",
      calculate: "Calculate",
      ownerLine: "Abbas Amin • Video Editor",
      paynote: "Pay after delivery - watermarked sample",
      choose: "Choose your project type",
      youtubeLong: "YOUTUBE LONG",
      youtubePrice: "$2/min",
      podcastEdit: "PODCAST EDIT",
      podcastPrice: "$1.2/min",
      cleanStory: "Clean story",
      cleanAudio: "Audio cleanup",
      clickDetails: "Click for details",
      detailsYoutube: "Long YouTube editing: cut dead moments, structure the story, fast pacing that keeps viewers till the end. Pro audio cleanup and curated B-roll.",
      detailsPodcast: "Podcast editing: turn long hours into focused episodes, remove filler and repetition, balance audio and denoise, ready to publish.",
      calcYouTube: "Calculate YouTube",
      calcPodcast: "Calculate Podcast",
      aboutTitle: "About Me",
      aboutText: "Hi I'm Abbas Amin, Video Editor focused on clean storytelling. I cut long recordings into watchable videos, remove noise, add captions, B-roll, and deliver ready for upload. Tools: CapCut Mobile Pro, Ai Tools, Meta AI, ChatGPT, Thumbnail Generation Tools.",
      calcTitle: "Price Calculator",
      calcSub: "Open, no limits - normal input",
      projectTypeLabel: "Project Type",
      podcast: "PODCAST $1.2/min",
      youtube: "YOUTUBE $2/min",
      duration: "Duration (minutes)",
      captionLabel: "Captions",
      captionPrice: "+$0.5/min (max $40)",
      brollLabel: "B-Roll",
      brollPrice: "+$0.5/min (max $50)",
      thumbLabel: "Thumbnail",
      thumbPrice: "$10",
      subtotal: "Subtotal",
      total: "Total",
      mena: "MENA 20% Off",
      big: "10% Off",
      largeBanner: "Project over $350? WhatsApp for a special discount",
      bookPrefix: "💬 Book - $",
      bookSuffix: " WhatsApp",
      bookQuote: "💬 Request a special quote - WhatsApp",
      bookEmpty: "💬 Book on WhatsApp",
      bookBlocked: "Slow down — try again in a few seconds",
      needMinutes: "Enter the project duration first",
      servicesTitle: "Services",
      s1: "Podcast Cut",
      s1d: "Pro cut + audio cleanup",
      s2: "YouTube Long",
      s2d: "Clean story people finish",
      s3: "B-Roll $0.5/m (max $50)",
      s3d: "Story-supporting shots",
      s4: "Thumbnail $10",
      s4d: "Click-driving thumbnail",
      footer: "Primero Edits - Abbas Amin • Less Noise More Story",
      minNotePod: "Min $20",
      minNoteYou: "Min $30",
      hint: "Type 60 or 60.5"
    }
  };

  /* ----------------------------- state ----------------------------- */

  var state = {
    lang: "ar",
    type: "podcast",
    minutesRaw: "",
    caption: false,
    broll: false,
    thumb: false
  };

  var lastResult = null;

  /* ----------------------------- helpers ----------------------------- */

  function t(key) {
    var pack = I18N[state.lang] || I18N.ar;
    return Object.prototype.hasOwnProperty.call(pack, key) ? pack[key] : key;
  }

  function $(id) { return document.getElementById(id); }

  function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }

  function money(n) { return "$" + n.toFixed(2); }

  /**
   * Accepts "60", "60.5", "60,5", "٦٠", "۶۰٫۵", " 60 min ".
   * Returns 0 for invalid / empty, and clamps to MAX_MINUTES.
   */
  function parseMinutes(raw) {
    if (raw === null || raw === undefined) return 0;

    var s = String(raw).trim();
    if (!s) return 0;

    // Arabic-Indic digits
    s = s.replace(/[\u0660-\u0669]/g, function (d) {
      return String("\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669".indexOf(d));
    });

    // Extended Arabic-Indic (Persian) digits
    s = s.replace(/[\u06F0-\u06F9]/g, function (d) {
      return String("\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9".indexOf(d));
    });

    // Arabic decimal separator + comma -> dot
    s = s.replace(/[\u066B,]/g, ".");

    // keep digits and dots only
    s = s.replace(/[^0-9.]/g, "");

    // keep only the first dot
    var firstDot = s.indexOf(".");
    if (firstDot !== -1) {
      s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, "");
    }

    var n = parseFloat(s);
    if (!isFinite(n) || n <= 0) return 0;

    return Math.min(n, MAX_MINUTES);
  }

  function isMena() {
    try {
      var lang = (navigator.language || "").toLowerCase();
      var tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "").toLowerCase();
      return lang.indexOf("ar") === 0 ||
        ["cairo", "africa", "egypt", "riyadh", "dubai"].some(function (z) {
          return tz.indexOf(z) !== -1;
        });
    } catch (err) {
      return false;
    }
  }

  /* ----------------------------- pricing ----------------------------- */

  function compute() {
    var mins = parseMinutes(state.minutesRaw);
    var sub = 0;

    if (mins > 0) {
      sub = RATE[state.type] * mins;

      if (state.caption) sub += Math.min(CAPTION_RATE * mins, CAPTION_CAP);
      if (state.broll) sub += Math.min(BROLL_RATE * mins, BROLL_CAP);
      if (state.thumb) sub += THUMB_PRICE;

      if (sub < MIN_PRICE[state.type]) sub = MIN_PRICE[state.type];
    }

    sub = round2(sub);

    var disc = 0;
    var kind = null;

    if (mins > 0) {
      if (isMena()) {
        disc = MENA_DISCOUNT;
        kind = "mena";
      } else if (sub > BIG_THRESHOLD) {
        disc = BIG_DISCOUNT;
        kind = "big";
      }
    }

    var total = round2(sub * (1 - disc));
    var large = false;

    // Big projects: no automatic discount, invite a special quote instead.
    if (total > SPECIAL_THRESHOLD) {
      total = sub;
      disc = 0;
      kind = null;
      large = true;
    }

    return { mins: mins, sub: sub, total: total, disc: disc, kind: kind, large: large };
  }

  function buildWaUrl(result) {
    if (!result || !result.mins) return WA_BASE;

    var amount = result.large
      ? (state.lang === "ar" ? "أطلب عرض خاص" : "Special quote requested")
      : money(result.total);

    var msg = state.lang === "ar"
      ? "مرحبا عباس\nالنوع: " + state.type + "\nالمدة: " + result.mins + " دقيقة\nالإجمالي: " + amount
      : "Hi Abbas\nType: " + state.type + "\nDuration: " + result.mins + " min\nTotal: " + amount;

    return WA_BASE + "?text=" + encodeURIComponent(msg);
  }

  /* ----------------------------- render ----------------------------- */

  function render() {
    var r = compute();
    lastResult = r;

    $("subtotal").textContent = money(r.sub);
    $("total").textContent = money(r.total);

    // discount row
    var discountRow = $("discountRow");
    if (r.kind) {
      discountRow.hidden = false;
      $("discountLabel").textContent = r.kind === "mena" ? t("mena") : t("big");
      $("discountVal").textContent = "-" + Math.round(r.disc * 100) + "%";
    } else {
      discountRow.hidden = true;
      $("discountLabel").textContent = "";
      $("discountVal").textContent = "";
    }

    $("menaBadge").hidden = r.kind !== "mena";
    $("bigBadge").hidden = r.kind !== "big";
    $("largeBanner").hidden = !r.large;

    $("minNote").textContent = state.type === "podcast" ? t("minNotePod") : t("minNoteYou");

    // booking button label
    var bookBtn = $("bookBtn");
    if (r.mins <= 0) {
      bookBtn.textContent = t("bookEmpty");
    } else if (r.large) {
      bookBtn.textContent = t("bookQuote");
    } else {
      bookBtn.textContent = t("bookPrefix") + r.total.toFixed(2) + t("bookSuffix");
    }

    // all WhatsApp links carry the current quote
    var url = buildWaUrl(r);
    var links = document.querySelectorAll("[data-wa]");
    for (var i = 0; i < links.length; i++) links[i].setAttribute("href", url);
  }

  function applyLang(lang) {
    state.lang = lang === "en" ? "en" : "ar";

    var root = document.documentElement;
    root.lang = state.lang;
    root.dir = state.lang === "ar" ? "rtl" : "ltr";

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      nodes[i].textContent = t(key);
    }

    var placeholders = document.querySelectorAll("[data-i18n-placeholder]");
    for (var j = 0; j < placeholders.length; j++) {
      var pkey = placeholders[j].getAttribute("data-i18n-placeholder");
      placeholders[j].setAttribute("placeholder", t(pkey));
    }

    var buttons = document.querySelectorAll(".lang-btn");
    for (var k = 0; k < buttons.length; k++) {
      buttons[k].setAttribute("aria-pressed", String(buttons[k].getAttribute("data-lang") === state.lang));
    }

    render();
  }

  function syncTypePills() {
    var pills = document.querySelectorAll(".radio-pill");
    for (var i = 0; i < pills.length; i++) {
      var isActive = pills[i].getAttribute("data-type-label") === state.type;
      pills[i].classList.toggle("is-active", isActive);
    }
  }

  /* ----------------------------- toast ----------------------------- */

  var toastTimer = null;

  function showToast(message) {
    var el = $("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove("show");
    }, 2600);
  }

  /* ----------------------------- anti-spam guard ----------------------------- */

  var clickLog = [];

  function guardBooking(event) {
    var now = Date.now();

    if (!lastResult || !lastResult.mins) {
      event.preventDefault();
      showToast(t("needMinutes"));
      return;
    }

    clickLog = clickLog.filter(function (ts) { return now - ts < WINDOW_MS; });

    var tooSoon = clickLog.length > 0 && now - clickLog[clickLog.length - 1] < THROTTLE_MS;

    if (tooSoon || clickLog.length >= MAX_CLICKS) {
      event.preventDefault();
      showToast(t("bookBlocked"));
      return;
    }

    clickLog.push(now);
  }

  /* ----------------------------- wiring ----------------------------- */

  function init() {
    // language buttons
    var langButtons = document.querySelectorAll(".lang-btn");
    for (var i = 0; i < langButtons.length; i++) {
      langButtons[i].addEventListener("click", function () {
        applyLang(this.getAttribute("data-lang"));
      });
    }

    // project type radios
    var radios = document.querySelectorAll('input[name="projectType"]');
    for (var j = 0; j < radios.length; j++) {
      radios[j].addEventListener("change", function () {
        if (!this.checked) return;
        state.type = this.value === "youtube" ? "youtube" : "podcast";
        syncTypePills();
        render();
      });
    }

    // duration
    var minutes = $("minutes");
    minutes.addEventListener("input", function () {
      state.minutesRaw = this.value;
      render();
    });

    // extras
    $("caption").addEventListener("change", function () {
      state.caption = this.checked;
      render();
    });
    $("broll").addEventListener("change", function () {
      state.broll = this.checked;
      render();
    });
    $("thumb").addEventListener("change", function () {
      state.thumb = this.checked;
      render();
    });

    // details toggles
    var toggles = document.querySelectorAll(".link-toggle");
    for (var k = 0; k < toggles.length; k++) {
      toggles[k].addEventListener("click", function () {
        var panel = $(this.getAttribute("aria-controls"));
        if (!panel) return;
        var expanded = this.getAttribute("aria-expanded") === "true";
        this.setAttribute("aria-expanded", String(!expanded));
        panel.hidden = expanded;
      });
    }

    // "calculate" shortcuts inside the cards
    var calcButtons = document.querySelectorAll("[data-calc]");
    for (var m = 0; m < calcButtons.length; m++) {
      calcButtons[m].addEventListener("click", function () {
        var type = this.getAttribute("data-calc");
        state.type = type === "youtube" ? "youtube" : "podcast";

        var input = document.querySelector('input[name="projectType"][value="' + state.type + '"]');
        if (input) input.checked = true;

        syncTypePills();
        render();

        var target = $("calculator");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        $("minutes").focus({ preventScroll: true });
      });
    }

    // booking links
    var waLinks = document.querySelectorAll("[data-wa]");
    for (var n = 0; n < waLinks.length; n++) {
      waLinks[n].addEventListener("click", guardBooking);
    }

    // initial paint
    syncTypePills();
    applyLang(state.lang);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
