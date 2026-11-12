// ===== Mahyad Mirzabagheri — Portfolio interactions =====
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Nav: scrolled state + scroll progress + active link
const nav = document.getElementById('nav');
const progress = document.querySelector('.progress');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.links a[href^="#"]')];
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 30);
  const h = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
  let current = '';
  sections.forEach(s => { if (y >= s.offsetTop - 160) current = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const links = document.querySelector('.links');
menuBtn.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
links.addEventListener('click', e => {
  if (e.target.tagName === 'A') { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); }
});

// CV dropdown
const dd = document.querySelector('.dropdown');
dd.querySelector('button').addEventListener('click', e => {
  e.stopPropagation();
  const open = dd.classList.toggle('open');
  e.currentTarget.setAttribute('aria-expanded', open);
});
document.addEventListener('click', () => dd.classList.remove('open'));

// Reveal on scroll (with stagger inside grids)
const revealEls = document.querySelectorAll('.reveal');
document.querySelectorAll('.skills-grid, .cards3, .stats, .about-cards, .edu-side, .hero-text').forEach(group => {
  group.querySelectorAll('.reveal').forEach((el, i) => el.style.setProperty('--d', `${i * 0.08}s`));
});
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('in');
      if (en.target.querySelector('[data-count]') || en.target.matches('.stat')) countUp(en.target);
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => io.observe(el));

// Count-up numbers
function countUp(scope) {
  scope.querySelectorAll('[data-count]').forEach(el => {
    const end = +el.dataset.count, suffix = el.dataset.suffix || (end === 10 ? '' : '');
    if (reduce) { el.textContent = end + suffix + (end === 10 ? '' : ''); return; }
    const dur = 1400, t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else if (end === 10) el.textContent = '10';
    })(t0);
  });
}

// Typed roles
const roles = ['IT Support Specialist', 'Software Engineer', 'Web Developer', 'Networking & VPN', 'Cloud & DevOps (AWS)'];
const typed = document.getElementById('typed');
if (reduce) typed.textContent = roles[0];
else {
  let r = 0, i = 0, del = false;
  (function type() {
    const word = roles[r];
    typed.textContent = word.slice(0, i);
    if (!del && i < word.length) i++;
    else if (del && i > 0) i--;
    else if (!del) { del = true; return setTimeout(type, 1600); }
    else { del = false; r = (r + 1) % roles.length; }
    setTimeout(type, del ? 40 : 75);
  })();
}

// Terminal animation
const term = document.getElementById('term');
const lines = [
  ['<span class="p">$</span> whoami', 400],
  ['mahyad — IT Specialist & Software Engineer', 300],
  ['<span class="p">$</span> cat profile.json', 400],
  ['{', 80],
  ['  <span class="k">"experience"</span>: <span class="s">"~10 years in IT"</span>,', 80],
  ['  <span class="k">"degree"</span>: <span class="s">"MSc Software Eng (Distinction)"</span>,', 80],
  ['  <span class="k">"support"</span>: [<span class="s">"Windows"</span>, <span class="s">"M365"</span>, <span class="s">"Networking"</span>],', 80],
  ['  <span class="k">"build"</span>: [<span class="s">"Python"</span>, <span class="s">"C#/.NET"</span>, <span class="s">"Docker"</span>, <span class="s">"AWS"</span>],', 80],
  ['  <span class="k">"location"</span>: <span class="s">"Stoke-on-Trent, UK"</span>', 80],
  ['}', 300],
  ['<span class="p">$</span> ./status --open-to-work', 400],
  ['<span class="c">✔ Available for IT & software roles</span>', 0],
];
if (reduce) term.innerHTML = lines.map(l => l[0]).join('\n');
else {
  let n = 0;
  (function next() {
    if (n >= lines.length) return;
    term.innerHTML += (n ? '\n' : '') + lines[n][0];
    setTimeout(next, lines[n++][1] + 120);
  })();
}

// 3D tilt on terminal
const tilt = document.querySelector('.tilt');
if (tilt && !reduce && matchMedia('(hover:hover)').matches) {
  const wrap = tilt.parentElement;
  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  wrap.addEventListener('mouseleave', () => tilt.style.transform = '');
}

// Spotlight on skill cards
document.querySelectorAll('.skill-card').forEach(c => c.addEventListener('mousemove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', `${e.clientX - r.left}px`);
  c.style.setProperty('--my', `${e.clientY - r.top}px`);
}));

// Skill tabs
document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  const cat = tab.dataset.tab;
  document.querySelectorAll('.skill-card').forEach(c => {
    c.classList.toggle('hide', cat !== 'all' && c.dataset.cat !== cat);
    c.classList.add('in');
  });
}));

// Copy email
const toast = document.querySelector('.toast');
document.getElementById('copyEmail').addEventListener('click', async e => {
  try { await navigator.clipboard.writeText(e.currentTarget.dataset.email); toast.textContent = 'Email copied to clipboard ✓'; }
  catch { toast.textContent = e.currentTarget.dataset.email; }
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});
