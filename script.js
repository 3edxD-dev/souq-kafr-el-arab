// Supabase client
const sb = supabase.createClient('https://gzftaclifoyjilemqslo.supabase.co','sb_publishable_3ebaW8KmCEBCZ_WjaGhHgA_sMyWh14z');

// ===== Menu Toggle =====
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// ===== Load Listings from Supabase =====
async function loadListings() {
  const { data, error } = await sb.from('listings').select('*').eq('status','active').order('id',{ascending:false});
  if (error) { console.error(error); return; }
  const lands = (data || []).filter(l => l.type && l.type.includes('land'));
  const apts = (data || []).filter(l => l.type && l.type.includes('apt'));
  renderGrid('lands-grid', lands);
  renderGrid('apts-grid', apts);
}
function renderGrid(id, items) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = items.length ? items.map(card).join('') : '<p style="text-align:center;color:#888;padding:20px">لا توجد عروض حالياً</p>';
}
function card(item) {
  const img = item.image_url
    ? `<img src="${item.image_url}" alt="" style="width:100%;height:100%;object-fit:cover">`
    : `<span style="font-size:3.5rem">${item.icon||'🏠'}</span>`;
  return `<div class="listing-card">
    <div class="listing-img">${img}</div>
    <div class="listing-body">
      <h3>${item.title||''}</h3>
      <div class="listing-meta">📍 ${item.location||''}<br>📐 ${item.area||'-'}</div>
      <div class="listing-price">${item.price||''}</div>
      <a href="tel:${item.phone||''}" class="btn btn-gradient">تواصل</a>
    </div>
  </div>`;
}

// ===== Contact Form =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    alert('تم الإرسال بنجاح، هنرد عليك قريب');
    contactForm.reset();
  });
}

// ===== Sell / Buy Buttons =====
document.getElementById('btn-sell')?.addEventListener('click', () => {
  document.getElementById('contact')?.scrollIntoView({behavior:'smooth'});
});
document.getElementById('btn-buy')?.addEventListener('click', () => {
  document.getElementById('lands')?.scrollIntoView({behavior:'smooth'});
});

// Init
loadListings();
