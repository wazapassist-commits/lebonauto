// Client Supabase minimal (REST brut, sans dépendance) — LeBonAuto.
// Lecture publique (catalogue/blog), écriture réservée à l'admin connecté (Auth email).
// Utilisé par : le site public (lecture + repli statique) et le dashboard admin.
(function(){
'use strict';

function baseCfg(){
  var o = {};
  try { o = JSON.parse(localStorage.getItem('lba-sb') || '{}'); } catch (e) {}
  var url = (o.url || (window.SB_CONFIG && window.SB_CONFIG.url) || '').replace(/\/+$/, '');
  var key = o.key || (window.SB_CONFIG && window.SB_CONFIG.key) || '';
  return { url: url, key: key };
}
function configured(){
  var c = baseCfg();
  return !!(c.url && c.key);
}
function session(){
  try { return JSON.parse(localStorage.getItem('lba-sb-session') || 'null'); } catch (e) { return null; }
}
function saveSession(s){ try { localStorage.setItem('lba-sb-session', JSON.stringify(s)); } catch (e) {} }
function clearSession(){ try { localStorage.removeItem('lba-sb-session'); } catch (e) {} }
function tokenAlive(s){
  return !!(s && s.access_token && s.at && (Date.now() - s.at) < ((s.expires_in || 3600) - 60) * 1000);
}

async function raw(path, opts){
  opts = opts || {};
  var c = baseCfg();
  if(!c.url || !c.key) throw new Error('Supabase non configuré');
  var ctrl = null, timer = null;
  if(opts.timeout){
    ctrl = new AbortController();
    timer = setTimeout(function(){ ctrl.abort(); }, opts.timeout);
  }
  try {
    var r = await fetch(c.url + path, {
      method: opts.method || 'GET',
      headers: opts.headers || {},
      body: opts.body,
      signal: ctrl ? ctrl.signal : undefined
    });
    return r;
  } finally { if(timer) clearTimeout(timer); }
}
function apiHeaders(extra, withBearer){
  var c = baseCfg();
  var h = { 'apikey': c.key, 'Content-Type': 'application/json' };
  if(extra) for(var k in extra) h[k] = extra[k];
  if(withBearer){
    var s = session();
    if(!s || !s.access_token) throw new Error('Non connecté');
    h['Authorization'] = 'Bearer ' + s.access_token;
  }
  return h;
}
async function readJson(r){
  var txt = '';
  try { txt = await r.text(); } catch (e) {}
  var j = null;
  try { j = txt ? JSON.parse(txt) : null; } catch (e) {}
  if(!r.ok){
    var msg = (j && (j.message || j.error)) || txt || ('HTTP ' + r.status);
    throw new Error('Supabase ' + r.status + ' : ' + String(msg).slice(0, 200));
  }
  return j;
}

// ---------- lecture publique ----------
async function select(table, order, timeoutMs){
  var q = '/' + table + '?select=*';
  if(order) q += '&order=' + encodeURIComponent(order);
  var r = await raw('/rest/v1' + q, { headers: apiHeaders(), timeout: timeoutMs || 6000 });
  var j = await readJson(r);
  return Array.isArray(j) ? j : [];
}

// ---------- écriture admin (connecté requis) ----------
async function authed(method, path, body, extraHeaders){
  var r = await raw('/rest/v1' + path, { method: method, headers: apiHeaders(extraHeaders, true), body: body ? JSON.stringify(body) : undefined, timeout: 15000 });
  if(r.status === 401){
    if(await refresh()){
      r = await raw('/rest/v1' + path, { method: method, headers: apiHeaders(extraHeaders, true), body: body ? JSON.stringify(body) : undefined, timeout: 15000 });
    }
  }
  return readJson(r);
}
async function upsert(table, row){
  return authed('POST', '/' + table, row, { 'Prefer': 'resolution=merge-duplicates,return=representation' });
}
async function remove(table, col, val){
  return authed('DELETE', '/' + table + '?' + col + '=eq.' + encodeURIComponent(val), null, { 'Prefer': 'return=representation' });
}

// ---------- auth email ----------
async function signIn(email, password){
  var c = baseCfg();
  if(!c.url || !c.key) throw new Error('Supabase non configuré');
  var r = await fetch(c.url + '/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: { 'apikey': c.key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: password })
  });
  var j = await readJson(r);
  if(!j || !j.access_token) throw new Error('Identifiants invalides');
  saveSession({ access_token: j.access_token, refresh_token: j.refresh_token, expires_in: j.expires_in || 3600, at: Date.now(), email: (j.user && j.user.email) || email });
  return session();
}
async function refresh(){
  try {
    var c = baseCfg(), s = session();
    if(!c.url || !c.key || !s || !s.refresh_token) return false;
    var r = await fetch(c.url + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { 'apikey': c.key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: s.refresh_token })
    });
    var j = await readJson(r);
    if(!j || !j.access_token) return false;
    saveSession({ access_token: j.access_token, refresh_token: j.refresh_token || s.refresh_token, expires_in: j.expires_in || 3600, at: Date.now(), email: s.email });
    return true;
  } catch (e) { return false; }
}
async function me(){
  var s = session();
  if(!tokenAlive(s)){
    if(!(await refresh())){ clearSession(); return null; }
    s = session();
  }
  try {
    var c = baseCfg();
    var r = await fetch(c.url + '/auth/v1/user', { headers: { 'apikey': c.key, 'Authorization': 'Bearer ' + s.access_token } });
    var j = await readJson(r);
    return j && j.email ? j : { email: s.email };
  } catch (e) { clearSession(); return null; }
}
function signOut(){
  var c = baseCfg(), s = session();
  clearSession();
  if(c.url && c.key && s && s.access_token){
    fetch(c.url + '/auth/v1/logout', { method: 'POST', headers: { 'apikey': c.key, 'Authorization': 'Bearer ' + s.access_token } }).catch(function(){});
  }
}

// ---------- stockage photos (bucket public "vehicules") ----------
async function uploadPhoto(repoPath, bytes, contentType){
  var c = baseCfg();
  var s = session();
  if(!c.url || !c.key) throw new Error('Supabase non configuré');
  if(!s || !s.access_token) throw new Error('Non connecté');
  var put = async function(tok){
    return fetch(c.url + '/storage/v1/object/vehicules/' + repoPath, {
      method: 'PUT',
      headers: { 'apikey': c.key, 'Authorization': 'Bearer ' + tok, 'Content-Type': contentType || 'image/jpeg' },
      body: bytes
    });
  };
  var r = await put(s.access_token);
  if(r.status === 401 && await refresh()) r = await put(session().access_token);
  await readJson(r);
  return c.url + '/storage/v1/object/public/vehicules/' + repoPath;
}
async function deletePhoto(repoPath){
  var c = baseCfg();
  var s = session();
  if(!s || !s.access_token) return;
  try {
    await fetch(c.url + '/storage/v1/object/vehicules/' + repoPath, {
      method: 'DELETE',
      headers: { 'apikey': c.key, 'Authorization': 'Bearer ' + s.access_token }
    });
  } catch (e) {}
}

window.SB = {
  configured: configured, cfg: baseCfg, session: session,
  select: select, upsert: upsert, remove: remove,
  signIn: signIn, signOut: signOut, refresh: refresh, me: me,
  uploadPhoto: uploadPhoto, deletePhoto: deletePhoto
};
})();
