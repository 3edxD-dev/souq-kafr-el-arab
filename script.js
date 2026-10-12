const sb = supabase.createClient('https://gzftaclifoyjilemqslo.supabase.co','sb_publishable_3ebaW8KmCEBCZ_WjaGhHgA_sMyWh14z');

document.getElementById('menu-toggle')?.addEventListener('click', function() {
  var nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('open');
});

function loadListings() {
  sb.from('listings').select('*').order('id', {ascending: false}).then(function(res) {
    var data = res.data || [];
    var landsEl = document.getElementById('lands-grid');
    var aptsEl = document.getElementById('apts-grid');
    if (landsEl) {
      var lands = data.filter(function(l) { return !l.type || l.type.indexOf('land') !== -1; });
      landsEl.innerHTML = lands.length ? lands.map(makeCard).join('') : '<p style="text-align:center;color:#888;padding:20px">لا توجد عروض</p>';
    }
    if (aptsEl) {
      var apts = data.filter(function(l) { return l.type && l.type.indexOf('apt') !== -1; });
      aptsEl.innerHTML = apts.length ? apts.map(makeCard).join('') : '<p style="text-align:center;color:#888;padding:20px">لا توجد عروض</p>';
    }
  });
}

function makeCard(item) {
  var img = item.image_url ? '<img src="'+item.image_url+'" style="width:100%;height:100%;object-fit:cover">' : '<span style="font-size:3rem">🏠</span>';
  return '<div style="background:#111;border-radius:12px;overflow:hidden;margin:10px 0">' +
    '<div style="height:160px;background:#1a1a1a;display:flex;align-items:center;justify-content:center">'+img+'</div>' +
    '<div style="padding:14px">' +
      '<h3 style="margin:0 0 6px">'+ (item.title||'') +'</h3>' +
      '<div style="color:#888;font-size:.85rem">📍 '+ (item.location||'') +'<br>📐 '+ (item.area||'-') +'</div>' +
      '<div style="color:#2ecc71;font-weight:bold;margin:8px 0">'+ (item.price||'') +'</div>' +
      '<a href="tel:'+(item.phone||'')+'" style="background:linear-gradient(90deg,#1e90ff,#2ecc71);color:#fff;padding:8px 16px;border-radius:20px;text-decoration:none">تواصل</a>' +
    '</div></div>';
}

var form = document.getElementById('contact-form');
if (form) form.addEventListener('submit', function(e) { e.preventDefault(); alert('تم الإرسال'); form.reset(); });

loadListings();
