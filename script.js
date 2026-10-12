const sb = supabase.createClient('https://gzftaclifoyjilemqslo.supabase.co','sb_publishable_3ebaW8KmCEBCZ_WjaGhHgA_sMyWh14z');

// Menu
document.getElementById('menu-toggle')?.addEventListener('click', () => {
  document.getElementById('nav')?.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => document.getElementById('nav')?.classList.remove('open')));

async function loadListings() {
  const { data } = await sb.from('listings').select('*').order('id',{ascending:false});
  const lands = (data||[]).filter(l => !l.type || l.type.includes('land'));
  const apts = (data||[]).filter(l => l.type && l.type.includes('apt'));
  render('lands-grid', lands);
  render('apts-grid', apts);
}
function render(id, items) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = items.length ? items.map(card).join('') : '<p style="text-align:center;color:#888;padding:20px">لا توجد عروض</p>';
}
function card(item) {
  const img = item.image_url ? `<img src="${item.image_url}" style="width:100%;height:100%;object-fit:cover">` : `<span style="font-size:3rem">🏠</span>`;
  return `<div class="listing-card" style="background:#111;border-radius:12px;overflow:hidden;margin:8px 0">
    <div class="listing-img" style="height:160px;background:#1a1a1a;display:flex;align-items:center;justify-content:center">${img}</div>
    <div style="padding:14px">
      <h3 style="margin:0 0 6px">${item.title||''}</h3>
      <div style="color:#888;font-size:.85rem">📍 ${item.location||''}<br>📐 ${item.area||'-'}</div>
      <div style="color:#2ecc71;font-weight:bold;margin:8px 0">${item.price||''}</div>
      <a href="tel:${item.phone||''}" style="background:linear-gradient(90deg,#1e90ff,#2ecc71);color:#fff;padding:8px 16px;border-radius:20px;text-decoration:none;display:inline-block">تواصل</a>
    </div>
  </div>`;
}

document.getElementById('contact-form')?.addEventListener('submit', e => { e.preventDefault(); alert('تم الإرسال'); e.target.reset(); });
document.getElementById('btn-sell')?.addEventListener('click', () => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'}));
document.getElementById('btn-buy')?.addEventListener('click', () => document.getElementById('lands')?.scrollIntoView({behavior:'smooth'}));

loadListings();
