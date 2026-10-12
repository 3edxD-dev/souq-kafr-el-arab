// Supabase
const sb = supabase.createClient('https://gzftaclifoyjilemqslo.supabase.co','sb_publishable_3ebaW8KmCEBCZ_WjaGhHgA_sMyWh14z');

// Menu toggle
document.getElementById('menu-toggle')?.addEventListener('click', () => {
  document.getElementById('nav')?.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => document.getElementById('nav')?.classList.remove('open'));
});

// Load listings from Supabase
async function loadListings() {
  const { data } = await sb.from('listings').select('*').eq('status','active').order('id',{ascending:false});
  const lands = (data||[]).filter(l => l.type && l.type.startsWith('land'));
  const apts = (data||[]).filter(l => l.type && l.type.startsWith('apt'));
  const landsEl = document.getElementById('lands-grid');
  const aptsEl = document.getElementById('apts-grid');
  if (landsEl) landsEl.innerHTML = lands.length ? lands.map(card).join('') : '<p style="text-align:center;color:#888">لا توجد عروض</p>';
  if (aptsEl) aptsEl.innerHTML = apts.length ? apts.map(card).join('') : '<p style="text-align:center;color:#888">لا توجد عروض</p>';
}
function card(item) {
  const img = item.image_url ? `<img src="${item.image_url}" style="width:100%;height:100%;object-fit:cover">` : `<span style="font-size:3.5rem">🏠</span>`;
  return `<div class="listing-card"><div class="listing-img">${img}</div><div class="listing-body"><h3>${item.title||''}</h3><div class="listing-meta">📍 ${item.location||''}<br>📐 ${item.area||'-'}</div><div class="listing-price">${item.price||''}</div><a href="tel:${item.phone||''}" class="btn btn-gradient">تواصل</a></div></div>`;
}

// Contact form
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  alert('تم الإرسال بنجاح');
  e.target.reset();
});

loadListings();
