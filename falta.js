/* ===== FALTA — shared engine (theme + i18n + chrome) ===== */
(function(){
  "use strict";

  // ---- payment logos (inline SVG strings) ----
  window.FALTA_PAY = {
    visa:'<span class="pay-chip" title="Visa"><svg viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg"><text x="0" y="13" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="700" font-style="italic" fill="#1A1F71">VISA</text></svg></span>',
    mastercard:'<span class="pay-chip" title="Mastercard"><svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg"><circle cx="15" cy="12" r="9" fill="#EB001B"/><circle cx="25" cy="12" r="9" fill="#F79E1B"/><path d="M20 5a9 9 0 010 14 9 9 0 000-14z" fill="#FF5F00"/></svg></span>',
    paypal:'<span class="pay-chip" title="PayPal"><svg viewBox="0 0 64 16" xmlns="http://www.w3.org/2000/svg"><text x="0" y="13" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="800" font-style="italic" fill="#003087">Pay</text><text x="26" y="13" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="800" font-style="italic" fill="#009CDE">Pal</text></svg></span>'
  };

  // ---- common dictionary (nav, footer, controls) ----
  var COMMON = {
    fr:{
      "nav.home":"Accueil","nav.project":"Le projet","nav.concept":"Le concept",
      "nav.reviews":"Avis","nav.subscribe":"Se pré-inscrire","nav.fill":"Remplir la demande",
      "foot.tagline":"Des kits éducatifs scientifiques et d'ingénierie livrés chaque mois pour faire grandir la curiosité des enfants tunisiens.",
      "foot.explore":"Explorer","foot.company":"Société","foot.contact":"Contact",
      "foot.about":"À propos","foot.mission":"Notre mission","foot.press":"Presse","foot.jobs":"Carrières","foot.subscribe":"Se pré-inscrire",
      "foot.pay":"Paiements acceptés","foot.rights":"Falta — Prototype présenté au concours Injez.",
      "foot.made":"Fait avec curiosité à Tunis 🇹🇳",
      "theme.toggle":"Changer de thème"
    },
    en:{
      "nav.home":"Home","nav.project":"The project","nav.concept":"How it works",
      "nav.reviews":"Reviews","nav.subscribe":"Pre-register","nav.fill":"Fill the request",
      "foot.tagline":"Educational science and engineering kits delivered every month to grow the curiosity of Tunisian children.",
      "foot.explore":"Explore","foot.company":"Company","foot.contact":"Contact",
      "foot.about":"About","foot.mission":"Our mission","foot.press":"Press","foot.jobs":"Careers","foot.subscribe":"Pre-register",
      "foot.pay":"Accepted payments","foot.rights":"Falta — Prototype presented at the Injez competition.",
      "foot.made":"Made with curiosity in Tunis 🇹🇳",
      "theme.toggle":"Switch theme"
    },
    ar:{
      "nav.home":"الرئيسية","nav.project":"المشروع","nav.concept":"كيف يعمل",
      "nav.reviews":"الآراء","nav.subscribe":"سجّل مسبقاً","nav.fill":"املأ الطلب",
      "foot.tagline":"علب تعليمية علمية وهندسية تصل كل شهر لتنمية فضول الأطفال التونسيين.",
      "foot.explore":"استكشف","foot.company":"الشركة","foot.contact":"اتصل بنا",
      "foot.about":"من نحن","foot.mission":"مهمتنا","foot.press":"الصحافة","foot.jobs":"وظائف","foot.subscribe":"سجّل مسبقاً",
      "foot.pay":"وسائل الدفع المقبولة","foot.rights":"فلته — نموذج مقدّم في مسابقة إنجاز.",
      "foot.made":"صُنع بفضول في تونس 🇹🇳",
      "theme.toggle":"تغيير المظهر"
    }
  };

  var LANGS = ["fr","en","ar"];

  function store(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  function read(k){try{return localStorage.getItem(k)}catch(e){return null}}

  // merge page dict (window.PAGE_I18N) with common
  function dictFor(lang){
    var d = {};
    var c = COMMON[lang]||{}; for(var k in c) d[k]=c[k];
    var p = (window.PAGE_I18N&&window.PAGE_I18N[lang])||{}; for(var k2 in p) d[k2]=p[k2];
    return d;
  }

  function applyLang(lang){
    if(LANGS.indexOf(lang)<0) lang="fr";
    var d = dictFor(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang==="ar") ? "rtl" : "ltr";
    // text content
    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var key = el.getAttribute("data-i18n");
      if(d[key]!=null) el.innerHTML = d[key];
    });
    // attributes: data-i18n-ph (placeholder), data-i18n-title
    document.querySelectorAll("[data-i18n-ph]").forEach(function(el){
      var key=el.getAttribute("data-i18n-ph"); if(d[key]!=null) el.setAttribute("placeholder",d[key]);
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function(el){
      var key=el.getAttribute("data-i18n-html"); if(d[key]!=null) el.innerHTML=d[key];
    });
    // active button
    document.querySelectorAll(".lang-switch button").forEach(function(b){
      b.classList.toggle("active", b.getAttribute("data-lang")===lang);
    });
    store("falta-lang",lang);
    window.FALTA_LANG = lang;
    if(typeof window.onFaltaLang==="function") window.onFaltaLang(lang,d);
  }

  function applyTheme(theme){
    document.documentElement.setAttribute("data-theme", theme==="dark"?"dark":"light");
    store("falta-theme", theme);
  }

  function buildControls(){
    // inject controls into element with id="faltaControls" if present
    var holder = document.getElementById("faltaControls");
    if(!holder) return;
    var ls = document.createElement("div");
    ls.className="lang-switch";
    ["FR","EN","AR"].forEach(function(lbl,i){
      var b=document.createElement("button");
      b.textContent=lbl; b.setAttribute("data-lang",LANGS[i]);
      b.addEventListener("click",function(){applyLang(LANGS[i])});
      ls.appendChild(b);
    });
    var tt=document.createElement("button");
    tt.className="theme-toggle"; tt.setAttribute("aria-label","theme");
    tt.innerHTML='<svg class="moon" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" fill="currentColor"/></svg>'
      +'<svg class="sun" width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M16.9 16.9l2.1 2.1M19.1 4.9l-2.1 2.1M7 16.9l-2.1 2.1"/></g></svg>';
    tt.addEventListener("click",function(){
      var now=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";
      applyTheme(now);
    });
    holder.appendChild(ls);
    holder.appendChild(tt);
  }

  function initChrome(){
    // mobile burger
    var burger=document.getElementById("burger"), nav=document.getElementById("nav");
    if(burger&&nav){
      burger.addEventListener("click",function(){nav.classList.toggle("open");burger.classList.toggle("x")});
      nav.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){nav.classList.remove("open");burger.classList.remove("x")})});
    }
    // smooth page transitions
    document.querySelectorAll('a[href$=".html"]').forEach(function(a){
      a.addEventListener("click",function(e){
        if(a.target==="_blank"||e.metaKey||e.ctrlKey||e.shiftKey) return;
        e.preventDefault();
        var href=a.getAttribute("href");
        document.body.classList.add("leaving");
        setTimeout(function(){location.href=href},280);
      });
    });
    // reveal on scroll
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});
    document.querySelectorAll(".reveal").forEach(function(el){io.observe(el)});
    // year
    var yr=document.getElementById("yr"); if(yr) yr.textContent=new Date().getFullYear();
    // payment chips
    document.querySelectorAll("[data-pay]").forEach(function(el){
      el.innerHTML = window.FALTA_PAY.visa + window.FALTA_PAY.mastercard + window.FALTA_PAY.paypal;
    });
  }

  function boot(){
    buildControls();
    initChrome();
    applyTheme(read("falta-theme")|| (window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"));
    applyLang(read("falta-lang")||"fr");
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot);
  else boot();

  window.FALTA = {applyLang:applyLang, applyTheme:applyTheme, langs:LANGS};
})();
