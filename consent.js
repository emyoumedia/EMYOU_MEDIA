(function () {
  const GA_ID = 'G-XXXXXXXXXX';          // your GA4 Measurement ID
  const PIXEL_ID = 'XXXXXXXXXXXXXXXX';   // your Meta Pixel ID
  const KEY = 'emyou_consent_v1';

  // ── Google Consent Mode v2: everything denied by default ──
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied',
    wait_for_update: 500
  });

  let gaLoaded = false, pixelLoaded = false;

  function loadGA() {
    if (gaLoaded) return; gaLoaded = true;
    const s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function loadPixel() {
    if (pixelLoaded) return; pixelLoaded = true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  function apply(c) {
    gtag('consent', 'update', {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied'
    });
    if (c.analytics) loadGA();
    if (c.marketing) loadPixel();
  }

  function save(c) {
    localStorage.setItem(KEY, JSON.stringify(c));
    apply(c);
    const b = document.getElementById('cc-banner');
    if (b) b.remove();
  }

  function showBanner() {
    if (document.getElementById('cc-banner')) return;
    const el = document.createElement('div');
    el.id = 'cc-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Cookie consent');
    el.innerHTML = `
      <div class="cc-text">
        <strong>We value your privacy</strong>
        <p>We use cookies to understand how you use our site and to measure our ads.
        Choose what you're happy with. <a href="privacy.html">Privacy Policy</a></p>
        <div class="cc-opts" hidden>
          <label><input type="checkbox" checked disabled> Essential (always on)</label>
          <label><input type="checkbox" id="cc-an"> Analytics (Google Analytics)</label>
          <label><input type="checkbox" id="cc-mk"> Marketing (Meta Pixel)</label>
        </div>
      </div>
      <div class="cc-btns">
        <button id="cc-custom" class="cc-ghost">Customise</button>
        <button id="cc-reject" class="cc-ghost">Reject all</button>
        <button id="cc-accept" class="cc-main">Accept all</button>
      </div>`;
    document.body.appendChild(el);

    const opts = el.querySelector('.cc-opts');
    const customBtn = el.querySelector('#cc-custom');
    customBtn.onclick = () => {
      if (opts.hidden) { opts.hidden = false; customBtn.textContent = 'Save choices'; }
      else save({ analytics: el.querySelector('#cc-an').checked, marketing: el.querySelector('#cc-mk').checked });
    };
    el.querySelector('#cc-reject').onclick = () => save({ analytics: false, marketing: false });
    el.querySelector('#cc-accept').onclick = () => save({ analytics: true, marketing: true });
  }

  // Footer link: <a href="#" onclick="openCookieSettings();return false">Cookie Settings</a>
  window.openCookieSettings = showBanner;

  // ── Styles ──
  const css = document.createElement('style');
  css.textContent = `
  #cc-banner{position:fixed;left:1rem;right:1rem;bottom:1rem;max-width:760px;margin:0 auto;z-index:9999;
    background:var(--primary-dark,#0d0a1a);border:1px solid rgba(123,47,247,.35);color:#fff;
    padding:1.25rem 1.5rem;display:flex;gap:1.25rem;align-items:center;flex-wrap:wrap;
    box-shadow:0 10px 40px rgba(0,0,0,.5);font-family:var(--fb,sans-serif)}
  #cc-banner .cc-text{flex:1 1 320px}
  #cc-banner strong{font-size:.95rem}
  #cc-banner p{font-size:.78rem;line-height:1.6;color:rgba(255,255,255,.65);margin:.35rem 0 0}
  #cc-banner a{color:var(--purple,#7b2ff7)}
  #cc-banner .cc-opts{margin-top:.75rem;display:grid;gap:.4rem;font-size:.78rem}
  #cc-banner .cc-btns{display:flex;gap:.5rem;flex-wrap:wrap}
  #cc-banner button{font:600 .72rem var(--fb,sans-serif);padding:11px 18px;cursor:pointer;border:1px solid rgba(123,47,247,.5)}
  #cc-banner .cc-main{background:var(--grad,#7b2ff7);color:#fff;border-color:transparent}
  #cc-banner .cc-ghost{background:transparent;color:#fff}
  @media(max-width:600px){#cc-banner .cc-btns{width:100%}#cc-banner button{flex:1}}`;
  document.head.appendChild(css);

  // ── Init ──
  const saved = localStorage.getItem(KEY);
  if (saved) { try { apply(JSON.parse(saved)); } catch (e) { showBanner(); } }
  else showBanner();
})();