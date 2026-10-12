const sb = supabase.createClient('https://gzftaclifoyjilemqslo.supabase.co','sb_publishable_3ebaW8KmCEBCZ_WjaGhHgA_sMyWh14z');

async function loadListings() {
  const el = document.getElementById('lands-grid');
  if (!el) { alert('عنصر lands-grid مش موجود'); return; }
  el.innerHTML = '<p style="color:#fff">جاري التحميل...</p>';
  const { data, error } = await sb.from('listings').select('*');
  if (error) {
    el.innerHTML = '<p style="color:#e74c3c">خطأ: ' + error.message + '</p>';
    return;
  }
  if (!data || !data.length) {
    el.innerHTML = '<p style="color:#888">لا توجد بيانات في الجدول</p>';
    return;
  }
  el.innerHTML = data.map(l => `<div style="background:#111;padding:12px;margin:8px;border-radius:8px"><b>${l.title||'بدون عنوان'}</b><br>${l.price||''}</div>`).join('');
}

// Menu
document.getElementById('menu-toggle')?.addEventListener('click', () => {
  document.getElementById('nav')?.classList.toggle('open');
});

loadListings();
