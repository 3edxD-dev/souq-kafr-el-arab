const KEY = 'souq_listings';
function getListings() {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  const seed = [
    {id:1,type:'land',title:'أرض زراعية 3 فدان',location:'كفر العرب - طريق المحلة',area:'3 فدان',price:'1,850,000 ج.م',phone:'01001234567',image:'',icon:'🌾'},
    {id:2,type:'land',title:'أرض مباني 200 متر',location:'كفر العرب - وسط البلد',area:'200 م²',price:'950,000 ج.م',phone:'01009876543',image:'',icon:'🏗️'},
    {id:3,type:'apt',title:'شقة تمليك 120 متر',location:'كفر العرب - الدور الثالث',area:'120 م²',price:'780,000 ج.م',phone:'01007890123',image:'',icon:'🏠'},
    {id:4,type:'apt',title:'شقة إيجار مفروشة',location:'كفر العرب - قرب السوق',area:'90 م²',price:'3,500 ج.م / شهر',phone:'01228901234',image:'',icon:'🔑'}
  ];
  localStorage.setItem(KEY, JSON.stringify(seed));
  return seed;
}
function card(item) {
  const img = item.image ? `<img src="${item.image}" alt="">` : `<span style="font-size:3.5rem">${item.icon||'🏠'}</span>`;
  return `<div class="listing-card"><div class="listing-img">${img}</div><div class="listing-body"><h3>${item.title}</h3><div class="listing-meta">📍 ${item.location}<br>📐 ${item.area||'-'}</div><div class="listing-price">${item.price}</div><a href="tel:${item.phone}" class="btn btn-gradient">تواصل</a></div></div>`;
}
function load() {
  const list = getListings();
  document.getElementById('lands-grid').innerHTML = list.filter(l=>l.type==='land').map(card).join('') || '<p style="text-align:center;color:#888">لا توجد عروض</p>';
  document.getElementById('apts-grid').innerHTML = list.filter(l=>l.type==='apt').map(card).join('') || '<p style="text-align:center;color:#888">لا توجد عروض</p>';
}
document.getElementById('contact-form').onsubmit = e => { e.preventDefault(); alert('تم الإرسال بنجاح'); e.target.reset(); };
load();
