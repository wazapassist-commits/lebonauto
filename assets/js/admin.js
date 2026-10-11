// Dashboard admin — LeBonAuto (Supabase : données + photos en direct).
// Source de vérité : tables Supabase (vehicles, articles) + bucket Storage (vehicules).
// Le site public lit Supabase avec repli statique intégré.
// Interface en français (outil interne).
(function(){
'use strict';

var CATS = ['SUV', 'Berline', 'Monospace', 'Camping-car'];
var FUELS = ['Essence', 'Diesel', 'Hybride', 'Électrique'];
var GEARS = ['Automatique', 'Manuelle'];

var data = { vehicles: [], blog: [] };   // données live (Supabase, sinon repli statique)
var readonly = false;                     // vrai si Supabase injoignable (repli statique)
var editing = null; // {kind:'veh'|'blog', id: string|'new'}

// ---------- utils ----------
function $(s, r){ return (r || document).querySelector(s); }
function $all(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function esc(s){
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function clone(o){ return JSON.parse(JSON.stringify(o)); }
function toast(msg, isErr){
  var box = $('#toast');
  var d = document.createElement('div');
  if (isErr) d.className = 'err';
  d.textContent = msg;
  box.appendChild(d);
  setTimeout(function(){ d.remove(); }, 4200);
}
function loadLS(k, fb){ try { var v = localStorage.getItem(k); return v == null ? fb : JSON.parse(v); } catch (e) { return fb; } }
function saveLS(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
var IMG_PH = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='72'><rect width='96' height='72' fill='%23E9EDF2'/></svg>";
function slugify(s){
  var t = String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  return t;
}

// ---------- formes ----------
function canonVehicle(v){
  return {
    id: v.id, gallery: v.gallery || [], marque: v.marque, modele: v.modele,
    version: v.version || '', prix: Number(v.prix) || 0,
    annee: v.annee == null || v.annee === '' ? null : Number(v.annee),
    km: v.km == null || v.km === '' ? null : Number(v.km),
    carburant: v.carburant || '', boite: v.boite || '', puissance: v.puissance || '',
    img: v.img, cat: v.cat || '', badge: v.badge || '', desc: v.desc || ''
  };
}
function canonArticle(a){
  return { slug: a.slug, titre: a.titre, date: a.date, img: a.img, resume: a.resume || '', contenu: a.contenu || [] };
}
function toVehicleRow(v){
  var c = canonVehicle(v);
  return { id: c.id, marque: c.marque, modele: c.modele, version: c.version, prix: c.prix,
    annee: c.annee, km: c.km, carburant: c.carburant, boite: c.boite, puissance: c.puissance,
    img: c.img, gallery: c.gallery, cat: c.cat, badge: c.badge, description: c.desc };
}
function fromVehicleRow(r){
  return canonVehicle({
    id: r.id, gallery: r.gallery, marque: r.marque, modele: r.modele,
    version: r.version, prix: r.prix, annee: r.annee, km: r.km,
    carburant: r.carburant, boite: r.boite, puissance: r.puissance,
    img: r.img, cat: r.cat, badge: r.badge,
    desc: (r.description !== undefined && r.description !== null) ? r.description : r.desc
  });
}
function toArticleRow(a){
  var c = canonArticle(a);
  return { slug: c.slug, titre: c.titre, date: c.date || null, img: c.img, resume: c.resume, contenu: c.contenu };
}
function curVehicles(){ return data.vehicles; }
function curBlog(){ return data.blog; }
function storagePath(u){
  var m = String(u || '').match(/\/storage\/v1\/object\/public\/vehicules\/(.+)$/);
  return m ? m[1] : null;
}
function dropStorageUrl(u){
  try {
    var p = storagePath(u);
    if (p && window.SB) SB.deletePhoto(p);
  } catch (e) {}
}

// ---------- chargement ----------
async function loadAll(){
  readonly = false;
  try {
    var vs = await SB.select('vehicles', 'created_at.asc', 8000);
    var as = await SB.select('articles', 'created_at.asc', 8000);
    data.vehicles = vs.map(fromVehicleRow);
    data.blog = as.map(canonArticle);
  } catch (e) {
    // repli statique embarqué (lecture seule effective : les écritures échoueront avec message)
    try { if (typeof VEHICLES !== 'undefined') data.vehicles = clone(VEHICLES).map(canonVehicle); } catch (e2) {}
    try { if (typeof ARTICLES !== 'undefined') data.blog = clone(ARTICLES).map(canonArticle); } catch (e3) {}
    readonly = true;
    toast('Supabase injoignable : données statiques affichées. ' + e.message, true);
  }
}

// ---------- rendu ----------
function renderAll(){ renderStats(); renderVehicles(); renderBlog(); }
function renderStats(){
  var vs = curVehicles(), tot = vs.reduce(function(s, v){ return s + (Number(v.prix) || 0); }, 0);
  $('#st-count').textContent = vs.length;
  $('#st-value').textContent = (window.fmt ? window.fmt(tot) : tot + ' €');
  $('#st-avg').textContent = vs.length ? (window.fmt ? window.fmt(Math.round(tot / vs.length)) : Math.round(tot / vs.length) + ' €') : '—';
  $('#st-blog').textContent = curBlog().length;
}
function renderVehicles(){
  var q = ($('#veh-search').value || '').toLowerCase().trim();
  var list = curVehicles().filter(function(v){
    return !q || ((v.marque + ' ' + v.modele + ' ' + (v.version || '') + ' ' + v.id + ' ' + v.cat).toLowerCase().indexOf(q) >= 0);
  });
  var grid = $('#admin-veh-grid');
  grid.innerHTML = list.map(function(v){
    var h = (window.cardHTML ? window.cardHTML(v) : '<div class="card"><div class="card-body"><h3>' + esc(v.marque + ' ' + v.modele) + '</h3></div></div>');
    return '<div class="card admin-card"><div class="veh-wrap">' + h + '</div>'
      + '<div class="card-body" style="padding-top:0"><div class="row-actions">'
      + '<button class="btn btn-dark" data-act="edit" data-id="' + esc(v.id) + '">Éditer</button>'
      + '<button class="btn btn-dark" data-act="dup" data-id="' + esc(v.id) + '">Dupliquer</button>'
      + '<button class="btn btn-whatsapp" data-act="del" data-id="' + esc(v.id) + '">Supprimer</button>'
      + '</div></div></div>';
  }).join('') || '<p>Aucun véhicule. Cliquez « + Nouveau véhicule ».</p>';
  // neutralise la navigation vers la fiche publique
  $all('.veh-wrap .veh-card', grid).forEach(function(c){ c.removeAttribute('onclick'); c.removeAttribute('onkeydown'); c.style.cursor = 'default'; });
  $all('[data-act]', grid).forEach(function(b){
    b.addEventListener('click', function(){
      var id = b.getAttribute('data-id'), act = b.getAttribute('data-act');
      if (act === 'edit') openVehicleModal(id);
      else if (act === 'dup') duplicateVehicle(id);
      else if (act === 'del') deleteVehicle(id);
    });
  });
}
function renderBlog(){
  var list = curBlog().slice().sort(function(a, b){ return (b.date || '').localeCompare(a.date || ''); });
  $('#admin-blog-list').innerHTML = list.map(function(a){
    return '<div class="blog-row"><img src="' + esc(a.img) + '" alt="" loading="lazy"><div class="grow">'
      + '<h3>' + esc(a.titre) + '</h3><p class="meta">' + esc(a.date) + ' · ' + esc(a.slug) + '</p></div>'
      + '<button class="btn btn-dark" data-bact="edit" data-id="' + esc(a.slug) + '">Éditer</button>'
      + '<button class="btn btn-whatsapp" data-bact="del" data-id="' + esc(a.slug) + '">Supprimer</button></div>';
  }).join('') || '<p>Aucun article.</p>';
  $all('[data-bact]', $('#admin-blog-list')).forEach(function(b){
    b.addEventListener('click', function(){
      if (b.getAttribute('data-bact') === 'edit') openBlogModal(b.getAttribute('data-id'));
      else deleteArticle(b.getAttribute('data-id'));
    });
  });
}

// ---------- modales ----------
function openModal(title, bodyHTML){
  $('#modal-title').textContent = title;
  $('#modal-body').innerHTML = bodyHTML;
  $('#form-err').style.display = 'none';
  var btn = $('#modal-save');
  btn.disabled = false; btn.textContent = 'Enregistrer';
  $('#modal-back').classList.add('open');
}
function closeModal(){ $('#modal-back').classList.remove('open'); editing = null; }
function formError(msg){ var e = $('#form-err'); e.textContent = msg; e.style.display = 'block'; }
function selOpts(list, cur){
  return list.map(function(o){ return '<option' + (o === cur ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('');
}
function openVehicleModal(id){
  var v = id === 'new' ? { id: '', gallery: [], marque: '', modele: '', version: '', prix: '', annee: '', km: '', carburant: 'Essence', boite: 'Automatique', puissance: '', img: '', cat: 'SUV', badge: '', desc: '' }
    : clone(curVehicles().find(function(x){ return x.id === id; }));
  if (!v) return;
  editing = { kind: 'veh', id: id };
  openModal(id === 'new' ? 'Nouveau véhicule' : 'Éditer — ' + v.marque + ' ' + v.modele,
    '<div class="fgrid">'
    + '<div><label>Identifiant (URL)</label><input id="vf-id" value="' + esc(v.id) + '" placeholder="ex. peugeot-3008"></div>'
    + '<div><label>Badge</label><input id="vf-badge" value="' + esc(v.badge) + '" placeholder="ex. Bon plan"></div>'
    + '<div><label>Marque *</label><input id="vf-marque" value="' + esc(v.marque) + '"></div>'
    + '<div><label>Modèle *</label><input id="vf-modele" value="' + esc(v.modele) + '"></div>'
    + '<div class="full"><label>Version / finition</label><input id="vf-version" value="' + esc(v.version) + '"></div>'
    + '<div><label>Prix (€) *</label><input id="vf-prix" type="number" min="1" step="1" value="' + esc(v.prix) + '"></div>'
    + '<div><label>Catégorie</label><select id="vf-cat">' + selOpts(CATS, v.cat) + '</select></div>'
    + '<div><label>Année (vide = sur demande)</label><input id="vf-annee" type="number" min="1950" max="2030" value="' + (v.annee == null ? '' : v.annee) + '"></div>'
    + '<div><label>Kilométrage (vide = sur demande)</label><input id="vf-km" type="number" min="0" step="1" value="' + (v.km == null ? '' : v.km) + '"></div>'
    + '<div><label>Carburant</label><select id="vf-carb">' + selOpts(FUELS, v.carburant) + '</select></div>'
    + '<div><label>Boîte</label><select id="vf-boite">' + selOpts(GEARS, v.boite) + '</select></div>'
    + '<div><label>Puissance</label><input id="vf-puiss" value="' + esc(v.puissance) + '" placeholder="ex. 150 ch"></div>'
    + '<div><label>Image principale *</label>'
    + '<div style="display:flex;gap:.6rem;align-items:center">'
    + '<img id="vf-img-prev" src="' + (v.img ? esc(v.img) : IMG_PH) + '" alt="Aperçu" style="width:96px;height:72px;object-fit:cover;border-radius:4px;border:1px solid var(--line);background:#F4F6F9;flex:none">'
    + '<div><input type="file" id="vf-img-file" accept="image/*">'
    + '<p class="help" id="vf-img-status" style="margin:.2rem 0 0">Uploadez la photo : envoyée au stockage, ajoutée à la galerie.</p></div>'
    + '</div>'
    + '<input type="hidden" id="vf-img" value="' + esc(v.img) + '">'
    + '<details style="margin-top:.3rem"><summary class="help" style="cursor:pointer">ou coller un chemin / URL</summary><input id="vf-img-url" value="' + esc(v.img) + '" placeholder="assets/img/….jpg ou https://…" style="width:100%;padding:.65rem .7rem;border:1px solid var(--line);border-radius:4px;font:inherit;margin-top:.3rem"></details></div>'
    + '<div class="full"><label>Photos</label>'
    + '<div id="vf-thumbs" style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem"></div>'
    + '<input type="file" id="vf-files" accept="image/*" multiple style="margin-bottom:.3rem">'
    + '<p class="help" id="vf-up-status" style="margin:.2rem 0 .5rem">Uploadez depuis votre téléphone/PC : les photos sont redimensionnées puis envoyées au stockage. Ou collez des URLs ci-dessous, une par ligne (la 1ʳᵉ = image principale).</p>'
    + '<textarea id="vf-gal" rows="4">' + esc((v.gallery || []).join('\n')) + '</textarea></div>'
    + '<div class="full"><label>Description</label><textarea id="vf-desc" rows="3">' + esc(v.desc) + '</textarea></div>'
    + '</div>');
  bindGallery();
}
// ---------- galerie photos + upload (Storage Supabase) ----------
function galleryLines(){
  var el = document.getElementById('vf-gal');
  if (!el) return [];
  return el.value.split('\n').map(function(s){ return s.trim(); }).filter(Boolean);
}
function renderThumbs(){
  var box = document.getElementById('vf-thumbs');
  if (!box) return;
  var lines = galleryLines(), main = val('vf-img');
  box.innerHTML = lines.map(function(u, i){
    var border = (u === main) ? 'var(--gold)' : 'var(--line)';
    return '<div style="position:relative;width:96px;height:72px">'
      + '<img src="' + esc(u) + '" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:4px;border:2px solid ' + border + '">'
      + '<button type="button" data-th="main" data-i="' + i + '" title="Définir comme image principale" style="position:absolute;left:2px;bottom:2px;font-size:.75rem;line-height:1;padding:.2rem .35rem">★</button>'
      + '<button type="button" data-th="del" data-i="' + i + '" title="Retirer de la galerie" style="position:absolute;right:2px;bottom:2px;font-size:.75rem;line-height:1;padding:.2rem .35rem">✕</button>'
      + '</div>';
  }).join('') || '<span class="help">Aucune photo pour le moment.</span>';
  $all('[data-th]', box).forEach(function(b){
    b.addEventListener('click', function(){
      var lines2 = galleryLines(), i = Number(b.getAttribute('data-i'));
      if (b.getAttribute('data-th') === 'del') {
        dropStorageUrl(lines2[i]);
        lines2.splice(i, 1);
        document.getElementById('vf-gal').value = lines2.join('\n');
        renderThumbs();
      } else setMainImage(lines2[i]);
    });
  });
}
function setMainImage(u){
  u = (u || '').trim();
  var h = document.getElementById('vf-img'), t = document.getElementById('vf-img-url'), p = document.getElementById('vf-img-prev');
  if (h) h.value = u;
  if (t) t.value = u;
  if (p) p.src = u || IMG_PH;
  renderThumbs();
}
function bindGallery(){
  renderThumbs();
  var gal = document.getElementById('vf-gal'), url = document.getElementById('vf-img-url'),
      files = document.getElementById('vf-files'), imgFile = document.getElementById('vf-img-file');
  if (gal) gal.addEventListener('input', renderThumbs);
  if (url) url.addEventListener('input', function(){ setMainImage(url.value); });
  if (files) files.addEventListener('change', function(){ uploadFiles(files.files); files.value = ''; });
  if (imgFile) imgFile.addEventListener('change', function(){ uploadMain(imgFile.files[0]); imgFile.value = ''; });
}
function b64bytes(bytes){
  var bin = '', i, CH = 0x8000;
  for (i = 0; i < bytes.length; i += CH) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
  return btoa(bin);
}
// Redimensionne côté navigateur (max 1600px, JPEG 82 % sauf PNG).
function resizeImage(file){
  return new Promise(function(resolve){
    var MAX = 1600;
    function fallbackOrig(){
      var fr = new FileReader();
      fr.onload = function(){
        var ext = String(file.name.split('.').pop() || 'jpg').toLowerCase();
        if (ext === 'jpeg') ext = 'jpg';
        if (['jpg', 'png', 'webp', 'gif'].indexOf(ext) < 0) ext = 'jpg';
        resolve({ bytes: new Uint8Array(fr.result), ext: '.' + ext });
      };
      fr.onerror = function(){ resolve(null); };
      fr.readAsArrayBuffer(file);
    }
    function done(src, w, h){
      try {
        var scale = Math.min(1, MAX / Math.max(w, h));
        var cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));
        var cv = document.createElement('canvas');
        cv.width = cw; cv.height = ch;
        cv.getContext('2d').drawImage(src, 0, 0, cw, ch);
        var isPng = file.type === 'image/png';
        cv.toBlob(function(b){
          if (!b) { fallbackOrig(); return; }
          b.arrayBuffer().then(
            function(ab){ resolve({ bytes: new Uint8Array(ab), ext: isPng ? '.png' : '.jpg' }); },
            function(){ fallbackOrig(); }
          );
        }, isPng ? 'image/png' : 'image/jpeg', 0.82);
      } catch (e) { fallbackOrig(); }
    }
    function viaImg(){
      try {
        var url = URL.createObjectURL(file), im = new Image();
        im.onload = function(){ URL.revokeObjectURL(url); done(im, im.naturalWidth || im.width, im.naturalHeight || im.height); };
        im.onerror = function(){ URL.revokeObjectURL(url); fallbackOrig(); };
        im.src = url;
      } catch (e) { fallbackOrig(); }
    }
    if (file.type === 'image/svg+xml') { fallbackOrig(); return; }
    if (window.createImageBitmap) { window.createImageBitmap(file).then(function(b){ done(b, b.width, b.height); }).catch(viaImg); }
    else viaImg();
  });
}
function uploadName(origName){
  var parts = String(origName || 'photo').split('.');
  var base = slugify(parts.slice(0, -1).join('.')).slice(0, 40) || 'photo';
  return base + '-' + Date.now().toString(36);
}
var uploading = false;
// Envoie un fichier vers le bucket Storage, retourne son URL publique.
async function uploadOnePhoto(f){
  if (!SB.session()) throw new Error('Connectez-vous pour uploader.');
  if (f.size > 15 * 1024 * 1024) throw new Error('Image >15 Mo : ' + f.name);
  var r = await resizeImage(f);
  if (!r) throw new Error('Lecture impossible : ' + f.name);
  var repoPath = uploadName(f.name) + r.ext;
  return SB.uploadPhoto(repoPath, r.bytes, r.ext === '.png' ? 'image/png' : 'image/jpeg');
}
// Image principale : upload immédiat + aperçu + ajout en tête de galerie
async function uploadMain(f){
  if (!f) return;
  var st = document.getElementById('vf-img-status');
  if (st) st.textContent = 'Envoi de ' + f.name + '…';
  try {
    var old = val('vf-img');
    var url = await uploadOnePhoto(f);
    var lines = galleryLines();
    if (lines.indexOf(url) < 0) { lines.unshift(url); document.getElementById('vf-gal').value = lines.join('\n'); }
    setMainImage(url);
    dropStorageUrl(old);
    toast('Photo principale uploadée.');
  } catch (e) { toast('Échec envoi : ' + e.message, true); }
  if (st) st.textContent = 'Uploadez la photo : envoyée au stockage, ajoutée à la galerie.';
}
async function uploadFiles(fileList){
  var files = Array.prototype.slice.call(fileList || []).filter(function(f){ return f.type.indexOf('image/') === 0; });
  if (!files.length) return;
  if (uploading) { toast('Envoi déjà en cours…'); return; }
  if (!SB.session()) { toast('Connectez-vous pour uploader.', true); return; }
  var st = document.getElementById('vf-up-status');
  uploading = true;
  var done = 0;
  try {
    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      if (st) st.textContent = 'Envoi ' + (i + 1) + '/' + files.length + ' : ' + f.name + '…';
      try {
        var url = await uploadOnePhoto(f);
        var lines = galleryLines();
        lines.push(url);
        document.getElementById('vf-gal').value = lines.join('\n');
        if (!val('vf-img')) setMainImage(url);
        done++;
      } catch (e) { toast('Échec envoi : ' + e.message, true); }
    }
    renderThumbs();
    toast(done ? done + ' photo(s) uploadée(s). Pensez à Enregistrer.' : 'Aucune photo envoyée.', !done);
  } catch (e) {
    toast('Échec envoi : ' + e.message, true);
  }
  uploading = false;
  if (st) st.textContent = 'Uploadez depuis votre téléphone/PC : les photos sont redimensionnées puis envoyées au stockage. Ou collez des URLs ci-dessous, une par ligne (la 1ʳᵉ = image principale).';
}
function openBlogModal(slug){
  var a = slug === 'new' ? { slug: '', titre: '', date: new Date().toISOString().slice(0, 10), img: '', resume: '', contenu: [] }
    : clone(curBlog().find(function(x){ return x.slug === slug; }));
  if (!a) return;
  editing = { kind: 'blog', id: slug };
  openBlogModalBody(a, slug);
}
function openBlogModalBody(a, slug){
  openModal(slug === 'new' ? 'Nouvel article' : 'Éditer — ' + a.titre,
    '<div class="fgrid">'
    + '<div><label>Slug (URL)</label><input id="bf-slug" value="' + esc(a.slug) + '" placeholder="mon-article"></div>'
    + '<div><label>Date</label><input id="bf-date" type="date" value="' + esc(a.date) + '"></div>'
    + '<div class="full"><label>Titre *</label><input id="bf-titre" value="' + esc(a.titre) + '"></div>'
    + '<div class="full"><label>Image *</label><input id="bf-img" value="' + esc(a.img) + '" placeholder="https://…"></div>'
    + '<div class="full"><label>Résumé *</label><textarea id="bf-resume" rows="2">' + esc(a.resume) + '</textarea></div>'
    + '<div class="full"><label>Contenu — un paragraphe par bloc (ligne vide = nouveau paragraphe)</label><textarea id="bf-contenu" rows="8">' + esc((a.contenu || []).join('\n\n')) + '</textarea></div>'
    + '</div>');
}
function saveModal(){
  if (!editing) return;
  if (editing.kind === 'veh') saveVehicleForm();
  else saveBlogForm();
}
function val(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; }
async function saveVehicleForm(){
  var isNew = editing.id === 'new';
  var id = slugify(val('vf-id')) || slugify(val('vf-marque') + '-' + val('vf-modele')) || 'sans-titre';
  var others = curVehicles().filter(function(x){ return x.id !== editing.id; });
  if (!id) return formError('Identifiant requis (ou renseignez marque + modèle).');
  if (others.some(function(x){ return x.id === id; })) return formError('Identifiant déjà utilisé : ' + id);
  var marque = val('vf-marque'), modele = val('vf-modele'), prix = Number(val('vf-prix')), img = val('vf-img');
  if (!marque || !modele) return formError('Marque et modèle sont obligatoires.');
  if (!(prix > 0)) return formError('Prix invalide.');
  if (!img) return formError('Image principale obligatoire.');
  var annee = val('vf-annee'), km = val('vf-km');
  if (annee && (Number(annee) < 1950 || Number(annee) > 2031)) return formError('Année invalide.');
  if (km && Number(km) < 0) return formError('Kilométrage invalide.');
  var gal = val('vf-gal').split('\n').map(function(s){ return s.trim(); }).filter(Boolean);
  if (gal.indexOf(img) < 0) gal.unshift(img);
  var v = canonVehicle({
    id: id, gallery: gal.length ? gal : [img], marque: marque, modele: modele,
    version: val('vf-version'), prix: prix,
    annee: annee === '' ? null : Number(annee), km: km === '' ? null : Number(km),
    carburant: val('vf-carb'), boite: val('vf-boite'), puissance: val('vf-puiss'),
    img: img, cat: val('vf-cat'), badge: val('vf-badge'), desc: val('vf-desc')
  });
  var btn = $('#modal-save');
  btn.disabled = true; btn.textContent = 'Enregistrement…';
  try {
    await SB.upsert('vehicles', toVehicleRow(v));
    if (!isNew && v.id !== editing.id) {
      try { await SB.remove('vehicles', 'id', editing.id); } catch (e) {}
      data.vehicles = data.vehicles.filter(function(x){ return x.id !== editing.id; });
    }
    if (isNew) data.vehicles.unshift(v);
    else {
      var i = data.vehicles.findIndex(function(x){ return x.id === (isNew ? v.id : v.id); });
      if (i >= 0) data.vehicles[i] = v; else data.vehicles.unshift(v);
    }
    closeModal(); renderAll();
    toast(isNew ? 'Véhicule ajouté — en ligne !' : 'Véhicule enregistré — en ligne !');
  } catch (e) { formError('Sauvegarde : ' + e.message); }
  btn.disabled = false; btn.textContent = 'Enregistrer';
}
async function saveBlogForm(){
  var isNew = editing.id === 'new';
  var slug = slugify(val('bf-slug')) || slugify(val('bf-titre')) || 'sans-titre';
  var others = curBlog().filter(function(x){ return x.slug !== editing.id; });
  if (!slug) return formError('Slug requis (ou renseignez un titre).');
  if (others.some(function(x){ return x.slug === slug; })) return formError('Slug déjà utilisé : ' + slug);
  var titre = val('bf-titre'), date = val('bf-date'), img = val('bf-img'), resume = val('bf-resume');
  if (!titre || !date || !img || !resume) return formError('Titre, date, image et résumé sont obligatoires.');
  var contenu = val('bf-contenu').split(/\n\s*\n/).map(function(s){ return s.trim(); }).filter(Boolean);
  if (!contenu.length) return formError('Contenu vide (au moins un paragraphe).');
  var a = canonArticle({ slug: slug, titre: titre, date: date, img: img, resume: resume, contenu: contenu });
  var btn = $('#modal-save');
  btn.disabled = true; btn.textContent = 'Enregistrement…';
  try {
    await SB.upsert('articles', toArticleRow(a));
    if (!isNew && a.slug !== editing.id) {
      try { await SB.remove('articles', 'slug', editing.id); } catch (e) {}
      data.blog = data.blog.filter(function(x){ return x.slug !== editing.id; });
    }
    if (isNew) data.blog.unshift(a);
    else {
      var i = data.blog.findIndex(function(x){ return x.slug === a.slug; });
      if (i >= 0) data.blog[i] = a; else data.blog.unshift(a);
    }
    closeModal(); renderAll();
    toast(isNew ? 'Article ajouté — en ligne !' : 'Article enregistré — en ligne !');
  } catch (e) { formError('Sauvegarde : ' + e.message); }
  btn.disabled = false; btn.textContent = 'Enregistrer';
}
async function duplicateVehicle(id){
  var src = curVehicles().find(function(x){ return x.id === id; });
  if (!src) return;
  var base = src.id + '-copie', nid = base, n = 2;
  var ids = curVehicles().map(function(x){ return x.id; });
  while (ids.indexOf(nid) >= 0) nid = base + '-' + (n++);
  try {
    var copy = clone(src); copy.id = nid;
    await SB.upsert('vehicles', toVehicleRow(copy));
    data.vehicles.unshift(copy);
    renderAll();
    toast('Dupliqué : ' + nid + ' — en ligne !');
  } catch (e) { toast('Duplication : ' + e.message, true); }
}
async function deleteVehicle(id){
  var v = curVehicles().find(function(x){ return x.id === id; });
  if (!v || !confirm('Supprimer « ' + v.marque + ' ' + v.modele + ' » ?')) return;
  try {
    await SB.remove('vehicles', 'id', id);
    (v.gallery || []).concat([v.img]).forEach(dropStorageUrl);
    data.vehicles = data.vehicles.filter(function(x){ return x.id !== id; });
    renderAll();
    toast('Véhicule supprimé.');
  } catch (e) { toast('Suppression : ' + e.message, true); }
}
async function deleteArticle(slug){
  var a = curBlog().find(function(x){ return x.slug === slug; });
  if (!a || !confirm('Supprimer « ' + a.titre + ' » ?')) return;
  try {
    await SB.remove('articles', 'slug', slug);
    data.blog = data.blog.filter(function(x){ return x.slug !== slug; });
    renderAll();
    toast('Article supprimé.');
  } catch (e) { toast('Suppression : ' + e.message, true); }
}

// ---------- export / import (via Supabase) ----------
function download(name, text){
  var b = new Blob([text], { type: 'application/json' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(b); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function importFile(file){
  var rd = new FileReader();
  rd.onload = function(){
    (async function(){
      try {
        var arr = JSON.parse(rd.result);
        if (!Array.isArray(arr) || !arr.length) throw new Error('JSON vide ou invalide.');
        var first = arr[0];
        var kind = null;
        if (first.marque && first.modele && first.id) kind = 'vehicles';
        else if (first.slug && first.titre && first.contenu) kind = 'blog';
        else throw new Error('Format non reconnu (ni véhicules, ni articles).');
        if (!confirm('Importer ' + arr.length + ' entrée(s) vers Supabase (écrase les doublons) ?')) return;
        toast('Import en cours…');
        for (var i = 0; i < arr.length; i++) {
          if (kind === 'vehicles') await SB.upsert('vehicles', toVehicleRow(canonVehicle(arr[i])));
          else await SB.upsert('articles', toArticleRow(canonArticle(arr[i])));
        }
        await loadAll(); renderAll();
        toast(arr.length + ' entrée(s) importée(s) — en ligne !');
      } catch (e) { toast('Import : ' + e.message, true); }
    })();
  };
  rd.readAsText(file);
}

// ---------- auth ----------
function showOverlay(mode){
  var ov = $('#auth-overlay');
  ov.style.display = 'grid';
  $('#auth-form').hidden = mode !== 'login';
  $('#auth-setup').hidden = mode !== 'setup';
}
function hideOverlay(){ $('#auth-overlay').style.display = 'none'; }
function refreshSbStatus(){
  var el = $('#sb-status');
  if (!el) return;
  var c = SB.cfg(), s = SB.session();
  el.textContent = 'Base : ' + (c.url || '—') + ' · ' + (s && s.email ? 'connecté : ' + s.email : 'non connecté');
}
async function doLogin(){
  var em = $('#auth-email').value.trim(), pw = $('#auth-pass').value, err = $('#auth-err');
  err.textContent = '';
  if (!em || !pw) { err.textContent = 'Email et mot de passe requis.'; return; }
  var btn = $('#auth-btn');
  btn.disabled = true; btn.textContent = 'Connexion…';
  try {
    var s = await SB.signIn(em, pw);
    hideOverlay();
    await loadAll(); renderAll(); refreshSbStatus();
    toast('Connecté : ' + (s.email || em));
  } catch (e) { err.textContent = e.message; }
  btn.disabled = false; btn.textContent = 'Se connecter';
}
function doLogout(){
  SB.signOut();
  location.reload();
}

// ---------- onglets / divers ----------
function switchTab(name){
  $all('.admin-tab').forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-tab') === name); });
  $('#tab-veh').hidden = name !== 'veh';
  $('#tab-blog').hidden = name !== 'blog';
  $('#tab-cfg').hidden = name !== 'cfg';
}

function fillSb(){
  var n = loadLS('lba-sb', {});
  if (n.url) $('#cfg-sb-url').value = n.url;
  if (n.key) $('#cfg-sb-key').value = n.key;
}
var booted = false;
async function boot(){
  if (booted) return; booted = true;
  fillSb();
  if (!SB.configured()) { showOverlay('setup'); return; }
  showOverlay('login');
  try {
    var me = await SB.me();
    if (me && me.email) {
      hideOverlay();
      await loadAll(); renderAll(); refreshSbStatus();
      toast('Connecté : ' + me.email);
      return;
    }
  } catch (e) {}
  refreshSbStatus();
}

document.addEventListener('DOMContentLoaded', function(){
  bindStatic();
  $('#auth-btn').addEventListener('click', doLogin);
  $('#auth-email').addEventListener('keydown', function(e){ if (e.key === 'Enter') doLogin(); });
  $('#auth-pass').addEventListener('keydown', function(e){ if (e.key === 'Enter') doLogin(); });
  $('#logout-btn').addEventListener('click', doLogout);
  boot();
});

function bindStatic(){
  if (bindStatic.done) return; bindStatic.done = true;
  $all('.admin-tab').forEach(function(b){ b.addEventListener('click', function(){ switchTab(b.getAttribute('data-tab')); }); });
  $('#veh-search').addEventListener('input', renderVehicles);
  $('#veh-new').addEventListener('click', function(){ openVehicleModal('new'); });
  $('#blog-new').addEventListener('click', function(){ openBlogModal('new'); });
  $('#modal-cancel').addEventListener('click', closeModal);
  $('#modal-back').addEventListener('click', function(e){ if (e.target.id === 'modal-back') closeModal(); });
  $('#modal-save').addEventListener('click', saveModal);
  $('#cfg-sb-save').addEventListener('click', function(){
    saveLS('lba-sb', { url: $('#cfg-sb-url').value.trim(), key: $('#cfg-sb-key').value.trim() });
    toast('Supabase enregistré — reconnexion…');
    SB.signOut();
    setTimeout(function(){ location.reload(); }, 600);
  });
  $('#cfg-sb-test').addEventListener('click', async function(){
    var st = $('#sb-status');
    st.textContent = 'Test en cours…';
    try {
      var me = await SB.me();
      st.textContent = me && me.email ? 'OK, connecté : ' + me.email : 'Base joignable (non connecté).';
      refreshSbStatus();
    } catch (e) { st.textContent = 'Échec : ' + e.message; }
  });
  $('#exp-veh').addEventListener('click', function(){ download('vehicles.json', JSON.stringify(curVehicles(), null, 2)); });
  $('#exp-blog').addEventListener('click', function(){ download('blog.json', JSON.stringify(curBlog(), null, 2)); });
  $('#imp-file').addEventListener('change', function(e){ if (e.target.files[0]) importFile(e.target.files[0]); e.target.value = ''; });
}
window.LBA_ADMIN = window.GAC_ADMIN = { loadAll: loadAll };
})();
