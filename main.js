/* ═══════════════════════════════════════════════════════════
   EMYOU MEDIA — main.js (shared across all pages)
═══════════════════════════════════════════════════════════ */

/* ── Nav scroll ── */
const nav = document.getElementById('nav');
function handleNavScroll() {
  if (nav) nav.classList.toggle('sc', window.scrollY > 60);
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ── Hamburger / mobile menu ── */
const ham = document.getElementById('ham');
const mm  = document.getElementById('mm');

if (ham && mm) {
  ham.addEventListener('click', () => {
    const open = ham.classList.toggle('open');
    mm.classList.toggle('open', open);
    mm.setAttribute('aria-hidden', String(!open));
    ham.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

function closeMobileMenu() {
  if (!ham || !mm) return;
  ham.classList.remove('open');
  mm.classList.remove('open');
  mm.setAttribute('aria-hidden', 'true');
  ham.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ── Reveal on scroll ── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.rv').forEach(el => revObs.observe(el));

/* ── Stat cells reveal ── */
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      statObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stat-cell').forEach(el => statObs.observe(el));

/* ── Process step highlight ── */
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

/* ── Active nav link ── */
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = document.querySelectorAll('.nlinks a');

function updateNav() {
  const sp = window.scrollY + 90;
  let cur = sections[0];
  sections.forEach(s => { if (s.offsetTop <= sp) cur = s; });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + (cur && cur.id)) a.classList.add('active');
  });
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── Contact form submit (shared) ── */
const cfrm = document.getElementById('cfrm');
if (cfrm) {
  cfrm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name    = (document.getElementById('cn') || {}).value?.trim();
    const email   = (document.getElementById('ce') || {}).value?.trim();
    const message = (document.getElementById('cm') || {}).value?.trim();

    if (name !== undefined && !name) {
      alert('Please enter your name.');
      document.getElementById('cn').focus(); return;
    }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== undefined && (!email || !emailRx.test(email))) {
      alert('Please enter a valid email address.');
      document.getElementById('ce').focus(); return;
    }
    if (message !== undefined && !message) {
      alert('Please enter your message.');
      document.getElementById('cm').focus(); return;
    }

    const btn = this.querySelector('.bsub');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(this) });
      const data = await res.json();

      if (data.success) {
        this.style.display = 'none';
        document.getElementById('form-success').style.display = 'block';
        setTimeout(() => {
          document.getElementById('form-success').style.display = 'none';
          this.reset();
          this.style.display = 'block';
          btn.textContent = 'Send Message →';
          btn.disabled = false;
        }, 4500);
      } else {
        alert('Something went wrong. Please try again.');
        btn.textContent = 'Send Message →';
        btn.disabled = false;
      }
    } catch {
      alert('Network error. Please try again.');
      btn.textContent = 'Send Message →';
      btn.disabled = false;
    }
  });
}
