// ===== Data (localStorage) =====
const STORAGE_KEY = 'souq_listings';
const CONTACTS_KEY = 'souq_contacts';

function uuid() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}

function getListings() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  const seed = [
    { id: uuid(), type: 'land-farm', title: 'أرض زراعية 3 فدان', location: 'كفر العرب - طريق المحلة', area: '3 فدان', price: '1,850,000 ج.م', description: 'أرض زراعية ممتازة', phone: '01001234567', icon: '🌾', status: 'active', views: 0, created_at: new Date().toISOString() },
    { id: uuid(), type: 'land-building', title: 'أرض مباني 200 متر', location: 'كفر العرب - وسط البلد', area: '200 م²', price: '950,000 ج.م', description: 'أرض مباني موقع ممتاز', phone: '01009876543', icon: '🏗️', status: 'active', views: 0, created_at: new Date().toISOString() },
    { id: uuid(), type: 'land-farm', title: 'أرض زراعية 1.5 فدان', location: 'كفر العرب - بجوار الترعة', area: '1.5 فدان', price: '980,000 ج.م', description: 'أرض على الترعة', phone: '01112345678', icon: '🌿', status: 'active', views: 0, created_at: new Date().toISOString() },
    { id: uuid(), type: 'land-building', title: 'أرض مباني 150 متر', location: 'كفر العرب - منطقة المدارس', area: '150 م²', price: '720,000 ج.م', description: 'قريبة من المدارس', phone: '01223456789', icon: '🏡', status: 'active', views: 0, created_at: new Date().toISOString() },
    { id: uuid(), type: 'land-farm', title: 'أرض زراعية 5 فدان', location: 'كفر العرب - الطريق الزراعي', area: '5 فدان', price: '3,100,000 ج.م', description: 'مساحة كبيرة', phone: '01005678901', icon: '🌳', status: 'active', views: 0, created_at: new Date().toISOString() },
    { id: uuid(), type: 'land-building', title: 'أرض مباني 300 متر', location: 'كفر العرب - أمام الجامع الكبير', area: '300 م²', price: '1,450,000 ج.م', description: 'موقع مميز', phone: '01116789012', icon: '🏢', status: 'active', views: 0, created_at: new Date().toISOString() },
    { id: uuid(), type: 'apt-sale', title: 'شقة تمليك 120 متر', location: 'كفر العرب - الدور الثالث', area: '120 م²', price: '780,000 ج.م', description: '3 غرف وصالة', phone: '01007890123', icon: '🏠', status: 'active', views: 0, created_at: new Date().toISOString() },
    { id: uuid(), type: 'apt-rent', title: 'شقة إيجار مفروشة', location: 'كفر العرب - قرب السوق', area: '90 م²', price: '3,500 ج.م / شهر', description: 'مفروشة بالكامل', phone: '01228901234', icon: '🔑', status: 'active', views: 0, created_at: new Date().toISOString() },
    { id: uuid(), type: 'apt-sale', title: 'شقة تمليك 150 متر', location: 'كفر العرب - تشطيب سوبر لوكس', area: '150 م²', price: '1,150,000 ج.م', description: 'سوبر لوكس', phone: '01009012345', icon: '🏡', status: 'active', views: 0, created_at: new Date().toISOString() },
    { id: uuid(), type: 'apt-rent', title: 'شقة إيجار سنوي', location: 'كفر العرب - هادئة', area: '110 م²', price: '28,000 ج.م / سنة', description: 'هادئة ومريحة', phone: '01110123456', icon: '🚪', status: 'active', views: 0, created_at: new Date().toISOString() },
    { id: uuid(), type: 'apt-sale', title: 'شقة تمليك 100 متر', location: 'كفر العرب - دور أول', area: '100 م²', price: '620,000 ج.م', description: 'للعائلات الصغيرة', phone: '01221234567', icon: '🏢', status: 'active', views: 0, created_at: new Date().toISOString() },
    { id: uuid(), type: 'apt-rent', title: 'شقة إيجار يومي', location: 'كفر العرب - مفروشة', area: '80 م²', price: '350 ج.م / يوم', description: 'للزوار', phone: '01002345678', icon: '🛏️', status: 'active', views: 0, created_at: new Date().toISOString() }
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

function saveListings(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function getContacts() {
  return JSON.parse(localStorage.getItem(CONTACTS_KEY) || '[]');
}

function saveContacts(list) {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(list));
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

function typeToBadge(type) {
  if (type === 'apt-rent') return { badge: 'rent', text: 'للإيجار' };
  return { badge: 'sale', text: 'للبيع' };
}

function createCard(item) {
  const { badge, text } = typeToBadge(item.type);
  return '<article class="listing-card" data-type="' + item.type + '" data-id="' + item.id + '">' +
    '<div class="listing-img"><span>' + (item.icon || '🏠') + '</span>' +
    '<span class="listing-badge ' + badge + '">' + text + '</span></div>' +
    '<div class="listing-body"><h3>' + item.title + '</h3>' +
    '<div class="listing-meta"><span>📍 ' + item.location + '</span><span>📐 ' + (item.area || '-') + '</span></div>' +
    '<div class="listing-price">' + item.price + '</div>' +
    '<div class="listing-actions">' +
    '<a href="tel:' + item.phone + '" class="btn btn-primary">تواصل</a>' +
    '<button class="btn btn-outline" onclick="showToast(\'تم حفظ الإعلان\')">حفظ</button>' +
    '</div></div></article>';
}

function loadLands(filter) {
  filter = filter || 'all';
  const grid = document.getElementById('lands-grid');
  var data = getListings().filter(function(l) { return l.status === 'active' && l.type.indexOf('land') === 0; });
  if (filter === 'farm') data = data.filter(function(l) { return l.type === 'land-farm'; });
  if (filter === 'building') data = data.filter(function(l) { return l.type === 'land-building'; });
  if (!data.length) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888">لا توجد عروض حالياً</p>';
    return;
  }
  grid.innerHTML = data.map(createCard).join('');
}

function loadApts(filter) {
  filter = filter || 'all';
  const grid = document.getElementById('apts-grid');
  var data = getListings().filter(function(l) { return l.status === 'active' && l.type.indexOf('apt') === 0; });
  if (filter === 'sale') data = data.filter(function(l) { return l.type === 'apt-sale'; });
  if (filter === 'rent') data = data.filter(function(l) { return l.type === 'apt-rent'; });
  if (!data.length) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888">لا توجد عروض حالياً</p>';
    return;
  }
  grid.innerHTML = data.map(createCard).join('');
}

document.querySelectorAll('#lands .filter-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('#lands .filter-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    loadLands(btn.dataset.filter);
  });
});

document.querySelectorAll('#apartments .filter-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('#apartments .filter-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    loadApts(btn.dataset.filter);
  });
});

var modal = document.getElementById('modal');
var modalTitle = document.getElementById('modal-title');
var modalClose = document.getElementById('modal-close');
var listingForm = document.getElementById('listing-form');

function openModal(title) {
  modalTitle.textContent = title || 'أضف إعلان';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  listingForm.reset();
}

document.getElementById('add-land').addEventListener('click', function() { openModal('أضف أرض للبيع'); });
document.getElementById('add-apt').addEventListener('click', function() { openModal('أضف شقة'); });
document.getElementById('btn-sell').addEventListener('click', function() { openModal('أعلن عن بيع'); });
document.getElementById('btn-buy').addEventListener('click', function() {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });

listingForm.addEventListener('submit', function(e) {
  e.preventDefault();
  var fd = new FormData(listingForm);
  var contacts = getContacts();
  contacts.unshift({
    id: uuid(),
    name: 'إعلان جديد من الموقع',
    phone: fd.get('phone'),
    type: fd.get('propertyType'),
    details: 'الموقع: ' + fd.get('location') + ' | المساحة: ' + (fd.get('area') || '-') + ' | السعر: ' + (fd.get('price') || '-') + ' | ' + (fd.get('description') || ''),
    status: 'new',
    created_at: new Date().toISOString()
  });
  saveContacts(contacts);
  closeModal();
  showToast('تم استلام إعلانك! هنتواصل معاك قريب بعد المراجعة');
});

document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  var fd = new FormData(e.target);
  var contacts = getContacts();
  contacts.unshift({
    id: uuid(),
    name: fd.get('name'),
    phone: fd.get('phone'),
    type: fd.get('type'),
    details: fd.get('details'),
    status: 'new',
    created_at: new Date().toISOString()
  });
  saveContacts(contacts);
  e.target.reset();
  showToast('تم إرسال طلبك بنجاح! هنتواصل معاك في أقرب وقت');
});

var menuToggle = document.getElementById('menu-toggle');
var nav = document.getElementById('nav');
menuToggle.addEventListener('click', function() { nav.classList.toggle('open'); });
nav.querySelectorAll('.nav-link').forEach(function(link) {
  link.addEventListener('click', function() { nav.classList.remove('open'); });
});

var sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', function() {
  var scrollY = window.scrollY + 100;
  sections.forEach(function(sec) {
    var top = sec.offsetTop;
    var height = sec.offsetHeight;
    var id = sec.getAttribute('id');
    var link = document.querySelector('.nav-link[href="#' + id + '"]');
    if (link && scrollY >= top && scrollY < top + height) {
      document.querySelectorAll('.nav-link').forEach(function(l) { l.classList.remove('active'); });
      link.classList.add('active');
    }
  });
});

loadLands();
loadApts();
