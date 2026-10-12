const SUPABASE_URL = 'https://gzftaclifoyjilemqslo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3ebaW8KmCEBCZ_WjaGhHgA_sMyWh14z';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadListings() {
  const { data, error } = await sb.from('listings').select('*').eq('status', 'active').order('id', { ascending: false });
  if (error || !data) {
    document.getElementById('lands-grid').innerHTML = '<p style="text-align:center;color:#888">لا توجد عروض</p>';
    document.getElementById('apts-grid').innerHTML = '<p style="text-align:center;color:#888">لا توجد عروض</p>';
    return;
  }
  const lands = data.filter(l => l.type && l.type.startsWith('land'));
  const apts = data.filter(l => l.type && l.type.startsWith('apt'));
  document.getElementById('lands-grid').innerHTML = lands.length ? lands.map(card).join('') : '<p style="text-align:center;color:#888">لا توجد عروض</p>';
  document.getElementById('apts-grid').innerHTML = apts.length ? apts.map(card).join('') : '<p style="text-align:center;color:#888">لا توجد عروض</p>';
}

function card(item) {
  const img = item.image_url ? `<img src="${item.image_url}" alt="" style="width:100%;height:100%;object-fit:cover">` : `<span style="font-size:3.5rem">${item.icon || '🏠'}</span>`;
  return `<div class="listing-card"><div class="listing-img">${img}</div><div class="listing-body"><h3>${item.title || ''}</h3><div class="listing-meta">📍 ${item.location || ''}<br>📐 ${item.area || '-'}</div><div class="listing-price">${item.price || ''}</div><a href="tel:${item.phone || ''}" class="btn btn-gradient">تواصل</a></div></div>`;
}

document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  alert('تم الإرسال بنجاح');
  e.target.reset();
});

loadListings();st.remove('active'); });
      link.classList.add('active');
    }
  });
});

loadLands();
loadApts();
