var STORAGE_KEY = 'souq_listings';
var CONTACTS_KEY = 'souq_contacts';
var AUTH_KEY = 'souq_admin_auth';
var PASS_KEY = 'souq_admin_pass';

function uuid() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}

function getListings() {
  var raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  return [];
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

function getPassword() {
  return localStorage.getItem(PASS_KEY) || 'admin123';
}

function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}

function typeLabel(type) {
  var map = { 'land-farm': 'أرض زراعية', 'land-building': 'أرض مباني', 'apt-sale': 'شقة تمليك', 'apt-rent': 'شقة إيجار' };
  return map[type] || type;
}

function statusLabel(s) {
  var map = { active: 'نشط', pending: 'قيد المراجعة', sold: 'تم البيع', hidden: 'مخفي', 'new': 'جديد', contacted: 'تم التواصل', closed: 'مغلق' };
  return map[s] || s;
}

function formatDate(d) {
  if (!d) return '-';
  return d.replace('T', ' ').slice(0, 16);
}

function checkAuth() {
  if (localStorage.getItem(AUTH_KEY) === '1') {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    loadStats();
    loadListings();
    loadContacts();
  }
}

document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  var username = document.getElementById('login-user').value;
  var password = document.getElementById('login-pass').value;
  var errEl = document.getElementById('login-error');
  errEl.textContent = '';
  if (username === 'admin' && password === getPassword()) {
    localStorage.setItem(AUTH_KEY, '1');
    checkAuth();
    showToast('تم تسجيل الدخول بنجاح');
  } else {
    errEl.textContent = 'اسم المستخدم أو كلمة المرور خطأ';
  }
});

document.getElementById('logout-btn').addEventListener('click', function() {
  localStorage.removeItem(AUTH_KEY);
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
});

document.querySelectorAll('.nav-item[data-page]').forEach(function(item) {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    var page = item.dataset.page;
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    item.classList.add('active');
    document.querySelectorAll('.page').forEach(function(p) { p.classList.add('hidden'); });
    document.getElementById('page-' + page).classList.remove('hidden');
    var titles = { stats: 'الإحصائيات', listings: 'الإعلانات', contacts: 'الطلبات', settings: 'الإعدادات' };
    document.getElementById('page-title').textContent = titles[page] || '';
    document.getElementById('btn-add-listing').style.display = page === 'listings' ? 'inline-flex' : 'none';
  });
});

function loadStats() {
  var listings = getListings();
  var contacts = getContacts();
  document.getElementById('stat-total').textContent = listings.length;
  document.getElementById('stat-active').textContent = listings.filter(function(l) { return l.status === 'active'; }).length;
  document.getElementById('stat-lands').textContent = listings.filter(function(l) { return l.type.indexOf('land') === 0 && l.status === 'active'; }).length;
  document.getElementById('stat-apts').textContent = listings.filter(function(l) { return l.type.indexOf('apt') === 0 && l.status === 'active'; }).length;
  var newContacts = contacts.filter(function(c) { return c.status === 'new'; }).length;
  document.getElementById('stat-contacts').textContent = newContacts;
  document.getElementById('contacts-badge').textContent = newContacts;
  document.getElementById('contacts-badge').style.display = newContacts > 0 ? 'inline' : 'none';
}

var allListings = [];

function loadListings() {
  allListings = getListings();
  renderListings();
}

function renderListings() {
  var typeFilter = document.getElementById('filter-type').value;
  var statusFilter = document.getElementById('filter-status').value;
  var search = document.getElementById('search-listings').value.trim().toLowerCase();
  var filtered = allListings;
  if (typeFilter) filtered = filtered.filter(function(l) { return l.type === typeFilter; });
  if (statusFilter) filtered = filtered.filter(function(l) { return l.status === statusFilter; });
  if (search) {
    filtered = filtered.filter(function(l) {
      return (l.title || '').toLowerCase().indexOf(search) !== -1 ||
        (l.location || '').toLowerCase().indexOf(search) !== -1 ||
        (l.phone || '').indexOf(search) !== -1;
    });
  }
  var tbody = document.getElementById('listings-tbody');
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#888;padding:40px">لا توجد إعلانات</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map(function(l) {
    return '<tr><td><strong>' + (l.icon || '') + ' ' + l.title + '</strong></td>' +
      '<td><span class="type-label">' + typeLabel(l.type) + '</span></td>' +
      '<td>' + l.location + '</td>' +
      '<td style="font-weight:700;white-space:nowrap">' + l.price + '</td>' +
      '<td><span class="status-badge status-' + l.status + '">' + statusLabel(l.status) + '</span></td>' +
      '<td>' + (l.views || 0) + '</td>' +
      '<td style="white-space:nowrap;font-size:0.8rem;color:#888">' + formatDate(l.created_at) + '</td>' +
      '<td class="actions">' +
      '<button class="btn btn-sm btn-outline" onclick="editListing(\'' + l.id + '\')">تعديل</button> ' +
      '<button class="btn btn-sm btn-danger" onclick="deleteListing(\'' + l.id + '\')">حذف</button>' +
      '</td></tr>';
  }).join('');
}

document.getElementById('search-listings').addEventListener('input', renderListings);
document.getElementById('filter-type').addEventListener('change', renderListings);
document.getElementById('filter-status').addEventListener('change', renderListings);

var modal = document.getElementById('listing-modal');

function openModal(title) {
  document.getElementById('modal-title').textContent = title || 'إضافة إعلان جديد';
  modal.classList.add('open');
}

function closeModal() {
  modal.classList.remove('open');
  document.getElementById('listing-form').reset();
  document.getElementById('edit-id').value = '';
  document.getElementById('f-icon').value = '🏠';
}

document.getElementById('btn-add-listing').addEventListener('click', function() { openModal(); });
document.getElementById('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });

window.editListing = function(id) {
  var l = allListings.find(function(x) { return x.id === id; });
  if (!l) return;
  document.getElementById('edit-id').value = l.id;
  document.getElementById('f-type').value = l.type;
  document.getElementById('f-status').value = l.status;
  document.getElementById('f-title').value = l.title;
  document.getElementById('f-location').value = l.location;
  document.getElementById('f-area').value = l.area || '';
  document.getElementById('f-price').value = l.price;
  document.getElementById('f-phone').value = l.phone;
  document.getElementById('f-icon').value = l.icon || '🏠';
  document.getElementById('f-description').value = l.description || '';
  openModal('تعديل الإعلان');
};

window.deleteListing = function(id) {
  if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
  var list = getListings().filter(function(l) { return l.id !== id; });
  saveListings(list);
  showToast('تم حذف الإعلان');
  loadListings();
  loadStats();
};

document.getElementById('listing-form').addEventListener('submit', function(e) {
  e.preventDefault();
  var id = document.getElementById('edit-id').value;
  var body = {
    type: document.getElementById('f-type').value,
    status: document.getElementById('f-status').value,
    title: document.getElementById('f-title').value,
    location: document.getElementById('f-location').value,
    area: document.getElementById('f-area').value,
    price: document.getElementById('f-price').value,
    phone: document.getElementById('f-phone').value,
    icon: document.getElementById('f-icon').value,
    description: document.getElementById('f-description').value
  };
  var list = getListings();
  if (id) {
    var idx = list.findIndex(function(l) { return l.id === id; });
    if (idx !== -1) {
      for (var k in body) list[idx][k] = body[k];
    }
    showToast('تم تحديث الإعلان');
  } else {
    body.id = uuid();
    body.views = 0;
    body.created_at = new Date().toISOString();
    list.unshift(body);
    showToast('تم إضافة الإعلان');
  }
  saveListings(list);
  closeModal();
  loadListings();
  loadStats();
});

function loadContacts() {
  renderContacts();
}

function renderContacts() {
  var allContacts = getContacts();
  var tbody = document.getElementById('contacts-tbody');
  if (allContacts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#888;padding:40px">لا توجد طلبات</td></tr>';
    return;
  }
  var typeMap = { 'buy-land': 'شراء أرض', 'sell-land': 'بيع أرض', 'buy-apt': 'شراء شقة', 'rent-apt': 'إيجار شقة', 'sell-apt': 'بيع شقة', 'other': 'استفسار', 'land-farm': 'أرض زراعية', 'land-building': 'أرض مباني', 'apt-sale': 'شقة تمليك', 'apt-rent': 'شقة إيجار' };
  tbody.innerHTML = allContacts.map(function(c) {
    return '<tr><td><strong>' + c.name + '</strong></td>' +
      '<td><a href="tel:' + c.phone + '" style="color:#1e90ff">' + c.phone + '</a></td>' +
      '<td>' + (typeMap[c.type] || c.type || '-') + '</td>' +
      '<td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + (c.details || '') + '">' + (c.details || '-') + '</td>' +
      '<td><span class="status-badge status-' + c.status + '">' + statusLabel(c.status) + '</span></td>' +
      '<td style="white-space:nowrap;font-size:0.8rem;color:#888">' + formatDate(c.created_at) + '</td>' +
      '<td class="actions">' +
      (c.status === 'new' ? '<button class="btn btn-sm btn-primary" onclick="updateContact(\'' + c.id + '\',\'contacted\')">تم التواصل</button> ' : '') +
      (c.status !== 'closed' ? '<button class="btn btn-sm btn-outline" onclick="updateContact(\'' + c.id + '\',\'closed\')">إغلاق</button> ' : '') +
      '<button class="btn btn-sm btn-danger" onclick="deleteContact(\'' + c.id + '\')">حذف</button>' +
      '</td></tr>';
  }).join('');
}

window.updateContact = function(id, status) {
  var list = getContacts();
  var c = list.find(function(x) { return x.id === id; });
  if (c) c.status = status;
  saveContacts(list);
  showToast('تم تحديث الحالة');
  loadContacts();
  loadStats();
};

window.deleteContact = function(id) {
  if (!confirm('حذف هذا الطلب؟')) return;
  saveContacts(getContacts().filter(function(c) { return c.id !== id; }));
  showToast('تم الحذف');
  loadContacts();
  loadStats();
};

document.getElementById('password-form').addEventListener('submit', function(e) {
  e.preventDefault();
  var current = document.getElementById('curr-pass').value;
  var newPassword = document.getElementById('new-pass').value;
  var msg = document.getElementById('pass-msg');
  msg.textContent = '';
  if (current !== getPassword()) {
    msg.textContent = 'كلمة المرور الحالية خطأ';
    msg.style.color = '#e74c3c';
    return;
  }
  localStorage.setItem(PASS_KEY, newPassword);
  msg.textContent = 'تم تغيير كلمة المرور بنجاح';
  msg.style.color = '#2ecc71';
  document.getElementById('password-form').reset();
});

checkAuth();
