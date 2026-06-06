/* ═══════════════════════════════════════════════════════════
   EMYOU MEDIA — main.js
   Nav · Mobile Menu · Reveal · Stats · Process · Form (Web3Forms)
   Toast notifications — no browser alerts
═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────
   BRANDED TOAST SYSTEM
───────────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    #em-toast-wrap {
      position: fixed;
      top: 88px;
      right: 1.25rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: .6rem;
      pointer-events: none;
    }
    .em-toast {
      display: flex;
      align-items: flex-start;
      gap: .75rem;
      min-width: 280px;
      max-width: 360px;
      padding: 1rem 1.25rem;
      border-radius: 12px;
      font-family: 'Poppins', sans-serif;
      font-size: .78rem;
      line-height: 1.5;
      color: #fff;
      pointer-events: all;
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(255,255,255,.10);
      box-shadow: 0 8px 32px rgba(0,0,0,.35);
      animation: toastIn .35s cubic-bezier(.34,1.56,.64,1) forwards;
      position: relative;
      overflow: hidden;
    }
    .em-toast::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
    }
    .em-toast.error   { background: rgba(15,5,40,.92); }
    .em-toast.error::before { background: linear-gradient(90deg,#ef4444,#f97316); }
    .em-toast.success { background: rgba(5,30,20,.92); }
    .em-toast.success::before { background: linear-gradient(90deg,#22c55e,#16a34a); }
    .em-toast.info    { background: rgba(10,5,50,.92); }
    .em-toast.info::before { background: linear-gradient(90deg,#7B2FF7,#D946EF,#FF8C42); }
    .em-toast-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: .05rem; }
    .em-toast-body { flex: 1; }
    .em-toast-title {
      font-weight: 700;
      font-size: .80rem;
      margin-bottom: .15rem;
      color: #fff;
    }
    .em-toast-msg { color: rgba(255,255,255,.65); }
    .em-toast-close {
      background: none; border: none; cursor: pointer;
      color: rgba(255,255,255,.35); font-size: .85rem;
      padding: 0; line-height: 1; flex-shrink: 0;
      transition: color .2s;
    }
    .em-toast-close:hover { color: #fff; }
    .em-toast.out { animation: toastOut .3s ease forwards; }
    @keyframes toastIn {
      from { opacity:0; transform:translateX(24px) scale(.95); }
      to   { opacity:1; transform:translateX(0) scale(1); }
    }
    @keyframes toastOut {
      from { opacity:1; transform:translateX(0) scale(1); }
      to   { opacity:0; transform:translateX(24px) scale(.95); }
    }
    /* field error highlight */
    .em-field-error {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239,68,68,.12) !important;
    }
    /* shake animation for invalid submit */
    @keyframes emShake {
      0%,100% { transform: translateX(0); }
      20%     { transform: translateX(-6px); }
      40%     { transform: translateX(6px); }
      60%     { transform: translateX(-4px); }
      80%     { transform: translateX(4px); }
    }
    .em-shake { animation: emShake .4s ease; }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.id = 'em-toast-wrap';
  document.body.appendChild(wrap);

  window.emToast = function (type, title, msg, duration) {
    duration = duration || 4500;
    const icons = { error: '⚠️', success: '✅', info: 'ℹ️' };
    const t = document.createElement('div');
    t.className = 'em-toast ' + type;
    t.innerHTML = `
      <span class="em-toast-icon">${icons[type] || '💬'}</span>
      <div class="em-toast-body">
        <div class="em-toast-title">${title}</div>
        <div class="em-toast-msg">${msg}</div>
      </div>
      <button class="em-toast-close" aria-label="Close">✕</button>
    `;
    const close = t.querySelector('.em-toast-close');
    const dismiss = () => {
      t.classList.add('out');
      t.addEventListener('animationend', () => t.remove(), { once: true });
    };
    close.addEventListener('click', dismiss);
    setTimeout(dismiss, duration);
    wrap.appendChild(t);
  };
})();


/* ─────────────────────────────────────
   NAV SCROLL
───────────────────────────────────── */
const nav = document.getElementById('nav');
function handleNavScroll() {
  if (nav) nav.classList.toggle('sc', window.scrollY > 60);
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();


/* ─────────────────────────────────────
   HAMBURGER / MOBILE MENU
───────────────────────────────────── */
const ham = document.getElementById('ham');
const mm  = document.getElementById('mm');

function closeMobileMenu() {
  if (!ham || !mm) return;
  ham.classList.remove('open');
  mm.classList.remove('open');
  mm.setAttribute('aria-hidden', 'true');
  ham.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (ham && mm) {
  ham.addEventListener('click', () => {
    const open = ham.classList.toggle('open');
    mm.classList.toggle('open', open);
    mm.setAttribute('aria-hidden', String(!open));
    ham.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.addEventListener('click', e => {
    if (mm.classList.contains('open') && !mm.contains(e.target) && !ham.contains(e.target)) {
      closeMobileMenu();
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}


/* ─────────────────────────────────────
   REVEAL ON SCROLL
───────────────────────────────────── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.rv').forEach(el => revObs.observe(el));


/* ─────────────────────────────────────
   STAT CELLS
───────────────────────────────────── */
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); statObs.unobserve(e.target); }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stat-cell').forEach(el => statObs.observe(el));


/* ─────────────────────────────────────
   PROCESS STEPS HIGHLIGHT
───────────────────────────────────── */
const psteps = document.querySelectorAll('.proc-step');
if (psteps.length) {
  const procObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        psteps.forEach(s => s.classList.remove('on'));
        e.target.classList.add('on');
      }
    });
  }, { threshold: 0.6 });
  psteps.forEach(s => procObs.observe(s));
}


/* ─────────────────────────────────────
   SMOOTH ANCHOR SCROLL
───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav ? nav.offsetHeight + 16 : 80;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});


/* ─────────────────────────────────────
   FORM — VALIDATION + WEB3FORMS SUBMIT
   Works for: contact.html & careers.html
───────────────────────────────────── */
const FIELD_RULES = [
  { id: 'cn',   label: 'Full Name',          type: 'text'  },
  { id: 'ce',   label: 'Email Address',       type: 'email' },
  { id: 'cm',   label: 'Message / About You', type: 'text'  },
  { id: 'cr',   label: 'Role',                type: 'select'},
];

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(form) {
  let firstBad = null;
  let errors = [];

  FIELD_RULES.forEach(rule => {
    const el = form.querySelector('#' + rule.id);
    if (!el) return;                         // field not on this page
    if (!el.hasAttribute('required')) return; // not required

    const val = el.value.trim();
    el.classList.remove('em-field-error');

    if (!val) {
      el.classList.add('em-field-error');
      errors.push(rule.label + ' is required');
      if (!firstBad) firstBad = el;
    } else if (rule.type === 'email' && !emailRx.test(val)) {
      el.classList.add('em-field-error');
      errors.push('Please enter a valid email address');
      if (!firstBad) firstBad = el;
    }
  });

  // Also check any other [required] fields not in the static list
  form.querySelectorAll('[required]').forEach(el => {
    if (!el.value.trim()) {
      el.classList.add('em-field-error');
      if (!firstBad) firstBad = el;
    }
  });

  return { ok: errors.length === 0, firstBad, errors };
}

function getSubmitBtn(form) {
  // Prefer the primary submit button (not the secondary one)
  return form.querySelector('button[type="submit"].bsub') ||
         form.querySelector('.bsub') ||
         form.querySelector('button[type="submit"]');
}

document.querySelectorAll('form#cfrm').forEach(form => {
  const successBox = document.getElementById('form-success');

  // Clear error highlight on input
  form.addEventListener('input', e => {
    e.target.classList.remove('em-field-error');
  });
  form.addEventListener('change', e => {
    e.target.classList.remove('em-field-error');
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validate
    const { ok, firstBad, errors } = validateForm(this);
    if (!ok) {
      // Show first error as toast
      emToast('error', 'Please check your form', errors[0] || 'Fill in all required fields.');
      if (firstBad) {
        firstBad.focus();
        firstBad.closest('.fg, .contact-form-card')?.classList.add('em-shake');
        setTimeout(() => {
          firstBad.closest('.fg, .contact-form-card')?.classList.remove('em-shake');
        }, 500);
      }
      return;
    }

    // Loading state
    const btn = getSubmitBtn(this);
    const originalText = btn ? btn.textContent : '';
    if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; btn.style.opacity = '.7'; }

    emToast('info', 'Sending your message…', 'Please wait a moment.', 3000);

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(this)
      });
      const data = await res.json();

      if (data.success) {
        // Hide form, show success block
        this.style.display = 'none';
        if (successBox) {
          successBox.style.display = 'block';
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        emToast('success', 'Message sent!', 'We\'ll get back to you within 24 hours.', 6000);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      if (btn) { btn.textContent = originalText; btn.disabled = false; btn.style.opacity = ''; }
      emToast(
        'error',
        'Something went wrong',
        'Please try WhatsApp or email us at hello@emyoumedia.com',
        7000
      );
    }
  });
});