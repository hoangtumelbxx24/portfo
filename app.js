// ===================================================================
// DAO DUC MANH - VIBRANT PORTFOLIO LOGIC & INTERACTIVITY
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  initCanvasBackground();
  initTypingEffect();
  initCounterAnimations();
  init3DTilt();
  initWorkflowInteractive();
  initSkillFilters();
  initExcelSimulator();
  initCopyButtons();
  initThemeToggle();
  initMobileMenu();
});

/* ---------------------------------------------------------
   1. Interactive Trade-Network Canvas Background
   --------------------------------------------------------- */
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.floor(Math.min(width, 1200) / 18);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(6, 182, 212, ' : 'rgba(99, 102, 241, '
    });
  }

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.18 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      // Draw particle
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse attraction / repel
      const mdx = mouse.x - p.x;
      const mdy = mouse.y - p.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 140) {
        p.x -= (mdx / mdist) * 0.8;
        p.y -= (mdy / mdist) * 0.8;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.7)';
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ---------------------------------------------------------
   2. Typing Effect for Hero Section
   --------------------------------------------------------- */
function initTypingEffect() {
  const textElem = document.getElementById('typing-text');
  if (!textElem) return;

  const roles = [
    'Global Supply Chains',
    'Warehouse Fulfillment & WMS',
    'Import & Export Documentation',
    'SAP ERP Product Lifecycles',
    'Customer Service Operations'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function typeLoop() {
    const current = roles[roleIdx];

    if (isDeleting) {
      textElem.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typeSpeed = 45;
    } else {
      textElem.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at end of word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 500; // Pause before typing next
    }

    setTimeout(typeLoop, typeSpeed);
  }

  typeLoop();
}

/* ---------------------------------------------------------
   3. Animated Metric Counters
   --------------------------------------------------------- */
function initCounterAnimations() {
  const metricNumbers = document.querySelectorAll('.metric-number');
  let animated = false;

  function runCounters() {
    metricNumbers.forEach((elem) => {
      const target = parseFloat(elem.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 1600;
      const startTime = performance.now();

      function updateNumber(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeOut * target;

        elem.textContent = isDecimal ? currentVal.toFixed(2) : Math.floor(currentVal);

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          elem.textContent = isDecimal ? target.toFixed(2) : target;
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      runCounters();
    }
  }, { threshold: 0.4 });

  const metricsSection = document.querySelector('.hero-metrics');
  if (metricsSection) observer.observe(metricsSection);
}

/* ---------------------------------------------------------
   4. 3D Tilt Effect on Profile Card
   --------------------------------------------------------- */
function init3DTilt() {
  const card = document.getElementById('profile-card');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ---------------------------------------------------------
   5. Interactive Logistics Workflow Pipeline
   --------------------------------------------------------- */
const workflowData = {
  1: {
    tag: 'Stage 01 of 05',
    title: 'Customer Inquiry & Order Intake',
    desc: 'Reviewing client requirements, confirming item specifications against inventory or BOM master lists, and establishing priority shipping windows to guarantee customer satisfaction from minute one.',
    bullets: [
      'Rapid customer inquiry triage & communication',
      'Order verification against supply limitations',
      'Payment checking & initial clearance'
    ],
    consoleHeader: 'Console :: Order_Intake.sys',
    terminal: [
      '<span class="t-prompt">$</span> <span class="t-cmd">init_order_stream</span> --channel=ecommerce',
      '<span class="t-cyan">[OK] Received customer inquiry #VN-88291</span>',
      '<span class="t-yellow">[VERIFIED] Bill of Lading & Payment Receipt attached</span>',
      '<span class="t-green">> Routing to WMS Warehouse Fulfillment Buffer...</span>'
    ],
    progress: '20%'
  },
  2: {
    tag: 'Stage 02 of 05',
    title: 'WMS & SAP ERP System Synchronization',
    desc: 'Executing end-to-end fulfillment for e-commerce and bulk dispatches in the Warehouse Management System (WMS). Logging accurate status updates and aligning with SAP ERP master data.',
    bullets: [
      'Accurate data entry & document version control',
      'Cross-checking Bill of Materials (BOM) & specifications',
      'Real-time inventory reserve and picking order triggers'
    ],
    consoleHeader: 'Console :: WMS_SAP_Sync.sh',
    terminal: [
      '<span class="t-prompt">$</span> <span class="t-cmd">sap_sync_data</span> --bom_rev=v3.2 --batch=BATCH-09',
      '<span class="t-cyan">[WMS] 10+ daily e-commerce dispatches queued</span>',
      '<span class="t-green">[SYNC COMPLETE] Warehouse staging bay allocated</span>',
      '<span class="t-yellow">> Flagging dispatch tickets for Quality Assurance (QA)...</span>'
    ],
    progress: '40%'
  },
  3: {
    tag: 'Stage 03 of 05',
    title: 'Import/Export Documentation & Customs Clearance',
    desc: 'Auditing shipping documents, including Bill of Lading (B/L), Commercial Invoice, Packing List, and Cargo Insurance coverage to eliminate customs delays or regulatory discrepancies.',
    bullets: [
      'Comprehensive verification of Bill of Lading (B/L)',
      'Checking cargo insurance (ICC Clauses) & Incoterms 2020 compliance',
      'Ensuring operational records support data consistency'
    ],
    consoleHeader: 'Console :: Docs_Audit.log',
    terminal: [
      '<span class="t-prompt">$</span> <span class="t-cmd">audit_trade_docs</span> --type=Bill_Of_Lading',
      '<span class="t-cyan">[DOCS OK] Marine Cargo Insurance verified</span>',
      '<span class="t-green">[CUSTOMS PASS] Port clearance documentation certified</span>',
      '<span class="t-yellow">> Forwarding to Freight & Transportation Carriers...</span>'
    ],
    progress: '65%'
  },
  4: {
    tag: 'Stage 04 of 05',
    title: 'Dispatch, Transportation & Transit Tracking',
    desc: 'Collaborating closely with warehouse crews and transport drivers. Proactively monitoring GPS progress and identifying delayed shipments before they escalate.',
    bullets: [
      'Cross-functional coordination with drivers & forwarders',
      'Proactive delay intervention and route re-sequencing',
      'Milestone notifications sent to dispatch tracking center'
    ],
    consoleHeader: 'Console :: Transit_Monitor.py',
    terminal: [
      '<span class="t-prompt">$</span> <span class="t-cmd">track_vessel_fleet</span> --route=HCMC-BinhDuong',
      '<span class="t-cyan">[GPS LIVE] Fleet Unit 04 in transit (On Schedule)</span>',
      '<span class="t-green">[ETA PREDICTION] Delivery scheduled within 45 mins</span>',
      '<span class="t-yellow">> Notifying Customer Service team of arrival window...</span>'
    ],
    progress: '85%'
  },
  5: {
    tag: 'Stage 05 of 05',
    title: 'Customer Service Resolution & Post-Fulfillment',
    desc: 'Closing the loop with the client. Handling delivery confirmations, resolving special inquiries, updating case records, and delivering accurate, timely post-service satisfaction.',
    bullets: [
      'Dedicated case tracking and resolution logging',
      'Customer-focused bilingual communication (Vietnamese/English IELTS 7.0)',
      'Post-delivery metrics consolidation into Excel management reports'
    ],
    consoleHeader: 'Console :: Case_Resolution.db',
    terminal: [
      '<span class="t-prompt">$</span> <span class="t-cmd">confirm_fulfillment</span> --case_status=resolved',
      '<span class="t-green">[SUCCESS] Order delivered and signed by consignee</span>',
      '<span class="t-cyan">[EXCEL REPORT] Weekly KPI updated: 100% On-time resolution</span>',
      '<span class="t-green">>> Case closed with 5-star customer feedback!</span>'
    ],
    progress: '100%'
  }
};

function initWorkflowInteractive() {
  const buttons = document.querySelectorAll('.step-btn');
  const stageTag = document.getElementById('stage-tag');
  const stageTitle = document.getElementById('stage-title');
  const stageDesc = document.getElementById('stage-desc');
  const stageBullets = document.getElementById('stage-bullets');
  const mockupTitle = document.getElementById('mockup-header-title');
  const mockupBody = document.getElementById('mockup-body');

  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const step = btn.getAttribute('data-step');
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const data = workflowData[step];
      if (!data) return;

      stageTag.textContent = data.tag;
      stageTitle.textContent = data.title;
      stageDesc.textContent = data.desc;
      mockupTitle.textContent = data.consoleHeader;

      // Update bullets
      stageBullets.innerHTML = data.bullets.map((b) => `<li>${b}</li>`).join('');

      // Update terminal
      mockupBody.innerHTML = `
        ${data.terminal.map((line) => `<div class="terminal-line">${line}</div>`).join('')}
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width: ${data.progress};"></div>
        </div>
      `;
    });
  });
}

/* ---------------------------------------------------------
   6. Skills Filter Logic
   --------------------------------------------------------- */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ---------------------------------------------------------
   7. Live Excel / Logistics Data Simulator
   --------------------------------------------------------- */
function initExcelSimulator() {
  const addBtn = document.getElementById('add-shipment-btn');
  const resetBtn = document.getElementById('reset-shipment-btn');
  const tbody = document.getElementById('sim-tbody');
  const feedback = document.getElementById('sim-feedback');

  if (!addBtn || !tbody) return;

  const defaultRows = tbody.innerHTML;
  let count = 3;

  const randomDestinations = [
    'Hai Phong Dinh Vu Port',
    'Cai Mep Deepwater Terminal',
    'Da Nang International Airport',
    'Binh Duong ICD Song Than',
    'Dong Nai Logistics Hub'
  ];

  const statuses = [
    { text: 'Cleared', class: 'success', action: 'Dispatched to Fleet' },
    { text: 'Under Customs Review', class: 'info', action: 'Submit Commercial Invoice' },
    { text: 'Pending Payment', class: 'warning', action: 'XLOOKUP payment slip' },
    { text: 'Priority Dispatch', class: 'success', action: 'WMS Express Staging' }
  ];

  addBtn.addEventListener('click', () => {
    count++;
    const randomDest = randomDestinations[Math.floor(Math.random() * randomDestinations.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const shipmentId = `#EXP-2026-${String(Math.floor(Math.random() * 800) + 100).padStart(3, '0')}`;

    const newTr = document.createElement('tr');
    newTr.innerHTML = `
      <td><code>${shipmentId}</code></td>
      <td>${randomDest}</td>
      <td>Today, ${String(Math.floor(Math.random() * 8) + 14)}:00</td>
      <td><span class="status-chip ${randomStatus.class}">${randomStatus.text}</span></td>
      <td>${randomStatus.action}</td>
    `;

    tbody.prepend(newTr);
    feedback.textContent = `${count} live shipments tracked in memory. (Simulated Excel Lookup Success)`;
    feedback.style.color = '#38bdf8';
  });

  resetBtn.addEventListener('click', () => {
    tbody.innerHTML = defaultRows;
    count = 3;
    feedback.textContent = '3 live shipments tracked in memory.';
    feedback.style.color = 'var(--text-faint)';
  });
}

/* ---------------------------------------------------------
   8. Quick Copy Buttons & Contact Action
   --------------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check" style="color:#34d399"></i>';
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
          btn.innerHTML = originalIcon;
          if (window.lucide) lucide.createIcons();
        }, 2000);
      });
    });
  });
}

window.handleContactSubmit = function () {
  const name = document.getElementById('sender-name').value;
  const email = document.getElementById('sender-email').value;
  const message = document.getElementById('sender-message').value;
  const feedback = document.getElementById('form-feedback');

  const subject = encodeURIComponent(`Opportunity Inquiry for Dao Duc Manh from ${name}`);
  const body = encodeURIComponent(`Hello Manh,\n\n${message}\n\nSender: ${name}\nEmail: ${email}`);

  feedback.style.display = 'block';
  feedback.style.color = '#34d399';
  feedback.textContent = 'Opening your email client to dispatch to manhdd.h.2023@gmail.com...';

  setTimeout(() => {
    window.location.href = `mailto:manhdd.h.2023@gmail.com?subject=${subject}&body=${body}`;
  }, 900);
};

/* ---------------------------------------------------------
   9. Color Palette / Glow Theme Switcher
   --------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const themes = ['theme-neon-cyber', 'theme-sunset', 'theme-emerald'];
  let currentThemeIdx = 0;

  toggleBtn.addEventListener('click', () => {
    document.body.classList.remove(themes[currentThemeIdx]);
    currentThemeIdx = (currentThemeIdx + 1) % themes.length;
    document.body.classList.add(themes[currentThemeIdx]);
  });
}

/* ---------------------------------------------------------
   10. Mobile Menu Toggle
   --------------------------------------------------------- */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!mobileBtn || !navLinks) return;

  mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
    });
  });
}
