'use strict';

/* ── Page router ── */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const t = document.getElementById('page-' + id);
  if (!t) return;
  t.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  document.querySelectorAll('[data-page]').forEach(a => {
    a.classList.toggle('an', a.dataset.page === id && !!a.closest('.nls'));
  });
  triggerReveal();
  history.replaceState(null,'','#'+id);
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-page]');
  if (el) { e.preventDefault(); showPage(el.dataset.page); closeDrawer(); }
});

const startHash = location.hash.replace('#','');
if (startHash && document.getElementById('page-'+startHash)) showPage(startHash);

/* ── Mobile nav ── */
const hbg = document.getElementById('hbg');
const nd  = document.getElementById('nd');
function closeDrawer() { hbg.setAttribute('aria-expanded','false'); nd.classList.remove('open'); }
hbg.addEventListener('click', () => { const o = nd.classList.toggle('open'); hbg.setAttribute('aria-expanded',String(o)); });
document.addEventListener('click', e => { if (!hbg.contains(e.target)&&!nd.contains(e.target)) closeDrawer(); });

/* ── Equipment tabs (Equipment page) ── */
document.addEventListener('click', e => {
  const tab = e.target.closest('.eqtab');
  if (!tab) return;
  const parent = tab.closest('.container') || tab.closest('.eq');
  if (!parent) return;
  parent.querySelectorAll('.eqtab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
  parent.querySelectorAll('.ep').forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  tab.setAttribute('aria-selected','true');
  const id = 'tab-' + tab.dataset.tab;
  const panel = document.getElementById(id);
  if (panel) { panel.classList.add('active'); triggerReveal(); }
});

/* ── Home page category drill-down ── */
const CAT_NAMES = {
  construction: 'Construction &amp; Earthmoving',
  agriculture:  'Agriculture &amp; Landscaping',
  warehouse:    'Warehouse &amp; Logistics',
  access:       'Access &amp; Site Support'
};

document.addEventListener('click', e => {
  // Category tile clicked
  const tile = e.target.closest('.cat-tile');
  if (tile && tile.closest('#cat-tiles')) {
    const cat = tile.dataset.cat;
    const tiles  = document.getElementById('cat-tiles');
    const detail = document.getElementById('cat-detail');
    if (!tiles || !detail) return;
    // Hide tiles, show detail
    tiles.style.display = 'none';
    detail.style.display = 'block';
    // Update heading
    document.getElementById('catDetailTag').textContent = 'Equipment';
    document.getElementById('catDetailTitle').innerHTML = CAT_NAMES[cat] || cat;
    // Show correct tab panel
    detail.querySelectorAll('.ep').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('tab-' + cat);
    if (panel) { panel.classList.add('active'); }
    triggerReveal();
    return;
  }
  // Back button clicked
  const back = e.target.closest('#catBack');
  if (back) {
    const tiles  = document.getElementById('cat-tiles');
    const detail = document.getElementById('cat-detail');
    if (tiles && detail) {
      detail.style.display = 'none';
      detail.querySelectorAll('.ep').forEach(p => p.classList.remove('active'));
      tiles.style.display = 'grid';
    }
  }
});

/* ── Scroll reveal ── */
let obs;
function triggerReveal() {
  if (obs) obs.disconnect();
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.sr').forEach(el => el.classList.add('vis')); return;
  }
  obs = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('vis'); obs.unobserve(en.target); } });
  }, {threshold:0.07,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.page.active .sr:not(.vis)').forEach(el => obs.observe(el));
}
triggerReveal();

/* ── Contact form ── */
const form = document.getElementById('contactForm');
const ok   = document.getElementById('formSuccess');
const sub  = form.querySelector('button[type=submit]');
const okEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

form.addEventListener('submit', async e => {
  e.preventDefault();
  const n = document.getElementById('fname').value.trim();
  const ph = document.getElementById('fphone').value.trim();
  const em = document.getElementById('femail').value.trim();
  if (!n||!ph||!em) { alert('Please fill in all required fields.'); return; }
  if (!okEmail(em)) { alert('Please enter a valid email address.'); return; }
  if (form.action.includes('YOUR_FORM_ID')) { alert('Contact form not yet configured.\nPlease call or email us directly.'); return; }
  sub.textContent = 'Sending…'; sub.disabled = true;
  try {
    const r = await fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}});
    if (r.ok) { form.style.display='none'; ok.style.display='block'; }
    else throw new Error();
  } catch { sub.textContent='Send Enquiry →'; sub.disabled=false; alert('Something went wrong. Please call or email us directly.'); }
});

/* ── Nav search ── */
const SEARCH_INDEX = [
  {name:'Excavators',cat:'Construction',page:'equipment',tab:'eq-construction'},
  {name:'Compact Track Loaders',cat:'Construction',page:'equipment',tab:'eq-construction'},
  {name:'Bulldozers',cat:'Construction',page:'equipment',tab:'eq-construction'},
  {name:'Motor Graders',cat:'Construction',page:'equipment',tab:'eq-construction'},
  {name:'Compactors & Rollers',cat:'Construction',page:'equipment',tab:'eq-construction'},
  {name:'Dumpers',cat:'Construction',page:'equipment',tab:'eq-construction'},
  {name:'Tractors',cat:'Agriculture',page:'equipment',tab:'eq-agriculture'},
  {name:'Wheel Loaders',cat:'Agriculture',page:'equipment',tab:'eq-agriculture'},
  {name:'Mini Loaders',cat:'Agriculture',page:'equipment',tab:'eq-agriculture'},
  {name:'Telehandlers',cat:'Agriculture',page:'equipment',tab:'eq-agriculture'},
  {name:'Forklifts',cat:'Warehouse',page:'equipment',tab:'eq-warehouse'},
  {name:'Rough Terrain Forklifts',cat:'Warehouse',page:'equipment',tab:'eq-warehouse'},
  {name:'Scissor Lifts',cat:'Warehouse',page:'equipment',tab:'eq-warehouse'},
  {name:'Pallet Stackers',cat:'Warehouse',page:'equipment',tab:'eq-warehouse'},
  {name:'Boom Lifts',cat:'Access',page:'equipment',tab:'eq-access'},
  {name:'Telescopic Boom Lifts',cat:'Access',page:'equipment',tab:'eq-access'},
  {name:'Light Towers',cat:'Access',page:'equipment',tab:'eq-access'},
  {name:'Generators',cat:'Access',page:'equipment',tab:'eq-access'},
  {name:'Warranty',cat:'Info',page:'warranty',tab:null},
  {name:'Finance & Rent to Own',cat:'Info',page:'finance',tab:null},
  {name:'Contact Us',cat:'Info',page:'contact',tab:null},
];

const navInput = document.getElementById('navSearch');
const navResults = document.getElementById('nsearchResults');

function runSearch(q) {
  q = q.trim().toLowerCase();
  navResults.innerHTML = '';
  if (q.length < 2) { navResults.style.display='none'; return; }
  const hits = SEARCH_INDEX.filter(i => i.name.toLowerCase().includes(q) || i.cat.toLowerCase().includes(q));
  if (!hits.length) { navResults.style.display='none'; return; }
  hits.slice(0,8).forEach(item => {
    const el = document.createElement('a');
    el.className = 'nsr-item';
    el.href = '#';
    el.innerHTML = '<div><div class="nsr-name">' + item.name + '</div><div class="nsr-cat">' + item.cat + '</div></div>';
    el.addEventListener('click', e => {
      e.preventDefault();
      navInput.value = '';
      navResults.style.display = 'none';
      showPage(item.page);
      if (item.tab) {
        setTimeout(() => {
          const btn = document.querySelector('.eqtab[data-tab="' + item.tab + '"]');
          if (btn) btn.click();
        }, 80);
      }
      closeDrawer();
    });
    navResults.appendChild(el);
  });
  navResults.style.display = 'block';
}

if (navInput) {
  navInput.addEventListener('input', () => runSearch(navInput.value));
  navInput.addEventListener('focus', () => { if (navInput.value.length >= 2) navResults.style.display='block'; });
  document.addEventListener('click', e => {
    if (!navInput.contains(e.target) && !navResults.contains(e.target)) navResults.style.display='none';
  });
}