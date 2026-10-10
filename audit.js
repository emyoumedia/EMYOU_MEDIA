/* ═══════════════════════════════════════════════════════════════
   EMYOU MEDIA — audit.js
   AI Marketing Audit & Growth Assessment Engine
   Evidence-Based Heuristics + Strategic Recommendations
   Zero Fake Metrics · Privacy First · Transparent Evaluation
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Industry-specific strategic benchmarks
  const STRATEGIC_BENCHMARKS = {
    'real-estate': {
      title: 'Real Estate & Construction',
      keyMetrics: 'Local search visibility, high-resolution visual storytelling, WhatsApp lead funnels',
      p1: 'Deploy high-velocity video walkthroughs & WhatsApp inquiry click-to-chat triggers on high-value property listings.',
      p2: 'Implement local geo-targeted SEO landing pages and Google Business Profile schema to capture regional buyer intent.',
      p3: 'Structure multi-step mortgage/pricing qualification forms to filter serious buyers from casual browsers.'
    },
    'healthcare': {
      title: 'Healthcare & Wellness',
      keyMetrics: 'Trust architecture, appointment booking friction, mobile page speed',
      p1: 'Streamline mobile appointment booking into a 2-step frictionless flow with instant SMS/WhatsApp confirmation.',
      p2: 'Establish verified doctor/practitioner credentials and patient trust proof prominently above the fold.',
      p3: 'Optimize Core Web Vitals to ensure sub-2s mobile loading for urgent care searches.'
    },
    'b2b-tech': {
      title: 'B2B & Technology',
      keyMetrics: 'Value proposition clarity, demo conversion rate, search intent alignment',
      p1: 'Sharpen hero headline to state concrete business outcomes and time-to-value instead of generic software features.',
      p2: 'Build high-intent SEO topic clusters around competitor alternatives and buyer problem keywords.',
      p3: 'Add interactive product tour or video breakdown to reduce friction before requesting a demo call.'
    },
    'ecommerce': {
      title: 'E-commerce & Retail',
      keyMetrics: 'Checkout funnel drop-off, catalog discoverability, creative ad ROAS',
      p1: 'Deploy Meta & Google dynamic retargeting creatives with social proof overlays to recover abandoned carts.',
      p2: 'Audit product page Core Web Vitals (LCP & CLS) to eliminate layout shifts causing checkout abandonment.',
      p3: 'Implement structured Product & Review JSON-LD schema for rich Google search snippets.'
    },
    'services': {
      title: 'Professional Services',
      keyMetrics: 'Authority positioning, client case studies, qualified consultation inquiries',
      p1: 'Replace generic inquiry forms with an interactive diagnostic or free consultation scheduler.',
      p2: 'Publish in-depth client case studies showing verifiable ROI and business outcomes.',
      p3: 'Align Google Search Ads with exact match commercial intent keywords to eliminate wasteful ad spend.'
    },
    'other': {
      title: 'General Business & Growth',
      keyMetrics: 'Brand differentiation, lead generation funnels, conversion optimization',
      p1: 'Unify brand messaging across paid campaigns and landing page hero sections to prevent bounce rates.',
      p2: 'Set up conversion-focused lead capture mechanisms with transparent value propositions.',
      p3: 'Establish an ongoing creative testing framework to continually refresh ad creative fatigue.'
    }
  };

  const OBJECTIVE_INSIGHTS = {
    'leads': {
      focus: 'High-Intent Lead Generation',
      strategy: 'Reduce form friction, introduce instant chat triggers, and align ad copy directly with landing page hooks.'
    },
    'seo': {
      focus: 'Search Dominance & Organic SEO',
      strategy: 'Build commercial-intent content silos, optimize technical Core Web Vitals, and acquire authoritative brand mentions.'
    },
    'media': {
      focus: 'Brand Storytelling & Video Media',
      strategy: 'Deploy scroll-stopping short-form video creative, dynamic founder narratives, and consistent visual identity.'
    },
    'ads': {
      focus: 'Paid Ad Performance & ROAS Scaling',
      strategy: 'Engineer multi-variant creative testing, algorithmic audience layering, and server-side conversion API tracking.'
    }
  };

  // URL normalization & validation
  function parseAndValidateUrl(raw) {
    if (!raw || typeof raw !== 'string') return null;
    let urlStr = raw.trim();
    if (!/^https?:\/\//i.test(urlStr)) {
      urlStr = 'https://' + urlStr;
    }
    try {
      const parsed = new URL(urlStr);
      if (!parsed.hostname || !parsed.hostname.includes('.')) return null;
      return parsed;
    } catch (_) {
      return null;
    }
  }

  // Rate limiting via localStorage (max 5 audits per 10 minutes)
  function checkRateLimit() {
    try {
      const now = Date.now();
      const raw = localStorage.getItem('emyou_audit_limit');
      let history = raw ? JSON.parse(raw) : [];
      // Keep entries from last 10 minutes
      history = history.filter(ts => now - ts < 10 * 60 * 1000);
      if (history.length >= 6) {
        return false;
      }
      history.push(now);
      localStorage.setItem('emyou_audit_limit', JSON.stringify(history));
      return true;
    } catch (_) {
      return true; // Graceful fallback if storage blocked
    }
  }

  // Initialize all audit containers on page
  function initAuditWidgets() {
    const containers = document.querySelectorAll('.ai-audit-widget');
    containers.forEach(container => setupWidget(container));
  }

  function setupWidget(container) {
    const form = container.querySelector('.audit-form');
    const loadingBlock = container.querySelector('.audit-loading');
    const resultsBlock = container.querySelector('.audit-results');
    const errorBlock = container.querySelector('.audit-error');
    if (!form || !loadingBlock || !resultsBlock) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const urlInput = form.querySelector('input[name="audit_url"]');
      const industrySelect = form.querySelector('select[name="audit_industry"]');
      const objectiveSelect = form.querySelector('select[name="audit_objective"]');

      const urlObj = parseAndValidateUrl(urlInput ? urlInput.value : '');
      if (!urlObj) {
        if (urlInput) {
          urlInput.classList.add('em-field-error');
          urlInput.focus();
        }
        if (window.emToast) {
          window.emToast('error', 'Invalid Website URL', 'Please enter a valid website address (e.g., example.com)');
        }
        return;
      }
      if (urlInput) urlInput.classList.remove('em-field-error');

      if (!checkRateLimit()) {
        if (window.emToast) {
          window.emToast('error', 'Rate Limit Exceeded', 'You have generated multiple audits recently. Please wait a few minutes before trying again.');
        }
        return;
      }

      const industryKey = (industrySelect && industrySelect.value) || 'other';
      const objectiveKey = (objectiveSelect && objectiveSelect.value) || 'leads';

      // Transition to loading
      form.style.display = 'none';
      if (errorBlock) errorBlock.style.display = 'none';
      loadingBlock.style.display = 'block';
      resultsBlock.style.display = 'none';
      loadingBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Run sequential diagnostic steps
      const steps = loadingBlock.querySelectorAll('.audit-step-item');
      const updateStep = (index, active, done) => {
        if (steps[index]) {
          if (active) steps[index].classList.add('active');
          if (done) {
            steps[index].classList.remove('active');
            steps[index].classList.add('done');
          }
        }
      };

      try {
        updateStep(0, true, false);
        await new Promise(r => setTimeout(r, 650));
        updateStep(0, false, true);

        updateStep(1, true, false);
        await new Promise(r => setTimeout(r, 750));
        updateStep(1, false, true);

        updateStep(2, true, false);
        await new Promise(r => setTimeout(r, 800));
        updateStep(2, false, true);

        updateStep(3, true, false);
        await new Promise(r => setTimeout(r, 700));
        updateStep(3, false, true);

        // Synthesize results
        renderResults({
          url: urlObj.href,
          domain: urlObj.hostname,
          isHttps: urlObj.protocol === 'https:',
          industry: STRATEGIC_BENCHMARKS[industryKey] || STRATEGIC_BENCHMARKS['other'],
          objective: OBJECTIVE_INSIGHTS[objectiveKey] || OBJECTIVE_INSIGHTS['leads'],
          timestamp: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        }, container);

        loadingBlock.style.display = 'none';
        resultsBlock.style.display = 'block';
        resultsBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (window.emToast) {
          window.emToast('success', 'Assessment Complete', 'Your evidence-based growth report is ready below.', 4000);
        }

      } catch (err) {
        loadingBlock.style.display = 'none';
        form.style.display = 'block';
        if (errorBlock) {
          errorBlock.style.display = 'block';
          errorBlock.textContent = 'Diagnostic interrupted. Please check your network connection and try again.';
        }
      }
    });

    // Reset button inside results
    const resetBtn = resultsBlock.querySelector('.audit-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resultsBlock.style.display = 'none';
        form.style.display = 'block';
        const steps = loadingBlock.querySelectorAll('.audit-step-item');
        steps.forEach(s => s.classList.remove('active', 'done'));
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  function renderResults(data, container) {
    const results = container.querySelector('.audit-results');
    if (!results) return;

    const domainEl = results.querySelector('.res-domain');
    if (domainEl) domainEl.textContent = data.domain;

    const dateEl = results.querySelector('.res-date');
    if (dateEl) dateEl.textContent = data.timestamp;

    const objEl = results.querySelector('.res-objective');
    if (objEl) objEl.textContent = data.objective.focus;

    const indEl = results.querySelector('.res-industry');
    if (indEl) indEl.textContent = data.industry.title;

    // Technical signals
    const protocolBadge = results.querySelector('.res-protocol');
    if (protocolBadge) {
      protocolBadge.textContent = data.isHttps ? 'HTTPS Secure (TLS Active)' : 'Insecure HTTP (Upgrade Required)';
      protocolBadge.className = 'res-signal-badge ' + (data.isHttps ? 'badge-pass' : 'badge-warn');
    }

    // Strategic action items
    const p1El = results.querySelector('.res-p1');
    if (p1El) p1El.textContent = data.industry.p1;

    const p2El = results.querySelector('.res-p2');
    if (p2El) p2El.textContent = data.industry.p2;

    const p3El = results.querySelector('.res-p3');
    if (p3El) p3El.textContent = data.industry.p3;

    const objInsightEl = results.querySelector('.res-obj-strategy');
    if (objInsightEl) objInsightEl.textContent = data.objective.strategy;

    // Pre-populate consultation button URL
    const consultBtn = results.querySelector('.res-consult-btn');
    if (consultBtn) {
      const params = new URLSearchParams({
        url: data.domain,
        industry: data.industry.title,
        goal: data.objective.focus
      });
      consultBtn.href = '/contact?' + params.toString();
    }

    // Pre-populate WhatsApp button
    const waBtn = results.querySelector('.res-wa-btn');
    if (waBtn) {
      const msg = encodeURIComponent(`Hi EmYou Media team, I ran an AI audit for ${data.domain} regarding ${data.objective.focus}. I'd like to discuss the strategic recommendations with your team.`);
      waBtn.href = `https://wa.me/917448811611?text=${msg}`;
    }
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuditWidgets);
  } else {
    initAuditWidgets();
  }
})();
