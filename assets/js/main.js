// Sprite d'icones SVG (ligne fine, premium) injecte sur toutes les pages
(function(){
const SPRITE = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'
+'<symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></symbol>'
+'<symbol id="i-chat" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></symbol>'
+'<symbol id="i-mail" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></symbol>'
+'<symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></symbol>'
+'<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol>'
+'<symbol id="i-eye" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></symbol>'
+'<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></symbol>'
+'<symbol id="i-truck" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></symbol>'
+'<symbol id="i-card" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></symbol>'
+'<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></symbol>'
+'<symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>'
+'<symbol id="i-doc" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/></symbol>'
+'<symbol id="i-lock" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></symbol>'
+'<symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></symbol>'
+'<symbol id="i-tool" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></symbol>'
+'<symbol id="i-activity" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></symbol>'
+'<symbol id="i-key" viewBox="0 0 24 24"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></symbol>'
+'<symbol id="i-award" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/></symbol>'
+'<symbol id="i-cal" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></symbol>'
+'<symbol id="i-refresh" viewBox="0 0 24 24"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></symbol>'
+'<symbol id="i-star" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></symbol>'
+'</defs></svg>';
if(document.body){document.body.insertAdjacentHTML('afterbegin', SPRITE);}
})();
// Menu mobile : le burger devient une croix quand le menu est ouvert
const ICO_MENU = '<svg class="ic" viewBox="0 0 24 24" style="width:26px;height:26px"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
const ICO_CLOSE = '<svg class="ic" viewBox="0 0 24 24" style="width:26px;height:26px"><path d="M6 6l12 12M18 6L6 18"/></svg>';
document.addEventListener('click',e=>{
  const b = e.target.closest('.burger');
  if(b){
    const nav = document.querySelector('.links');
    if(nav) nav.classList.toggle('open');
    const open = nav ? nav.classList.contains('open') : false;
    b.innerHTML = open ? ICO_CLOSE : ICO_MENU;
    b.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }
});
// Compteur visiteurs simulé (temps réel simulé)
// Re-interroge le DOM à chaque tick : les fiches produit injectent
// leur compteur après le chargement, il est donc pris en compte aussi.
(function(){
  let base = 14 + Math.floor(Math.random()*20);
  function tick(){
    base += Math.floor(Math.random()*5)-2;
    if(base<8) base=8; if(base>48) base=48;
    document.querySelectorAll('[data-visitors]').forEach(el=>el.textContent=base);
    // pulsation visible sur le compteur du hero (sensation temps réel)
    document.querySelectorAll('.eyebrow [data-visitors]').forEach(el=>{
      el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
      setTimeout(()=>el.classList.remove('bump'), 500);
    });
  }
  tick(); setInterval(tick, 15000);
  window.pokeVisitors = tick;
})();
// Année footer
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
// Formulaire -> WhatsApp
function handleContact(e){
  e.preventDefault();
  const f = new FormData(e.target);
  let L = 'fr'; try{ if(window.LBA_I18N) L = window.LBA_I18N.get(); }catch(err){}
  const hello = {fr:'Bonjour LeBonAuto,', en:'Hello LeBonAuto,', es:'Hola LeBonAuto,', pt:'Olá LeBonAuto,'}[L]||'Bonjour LeBonAuto,';
  const msg = `${encodeURIComponent(hello)}%0A Nom: ${encodeURIComponent(f.get('nom')||'')}%0A Téléphone: ${encodeURIComponent(f.get('tel')||'')}%0A Sujet: ${encodeURIComponent(f.get('sujet')||'')}%0A Message: ${encodeURIComponent(f.get('message')||'')}`;
  window.open(`https://wa.me/33652242278?text=${msg}`,'_blank');
  document.getElementById('form-ok').style.display='block';
  return false;
}
window.handleContact = handleContact;
// Révélation au scroll (équivalent Framer Motion, sans dépendance) :
// [data-reveal] s'anime à l'apparition, [data-reveal-group] anime ses enfants en cascade.
// Re-scanne après chaque injection (grilles véhicules, blog, traductions).
(function(){
  function each(arr, fn){ Array.prototype.forEach.call(arr, fn); }
  function markTargets(root){
    var scope = root && root.querySelectorAll ? root : document;
    each(scope.querySelectorAll('[data-reveal-group]'), function(g){
      // re-scanné à chaque fois : les enfants peuvent arriver après (grilles dynamiques)
      each(g.children, function(c, i){
        if(!c.hasAttribute('data-reveal')){
          c.setAttribute('data-reveal', '');
          c.style.transitionDelay = ((i % 6) * 70) + 'ms';
        }
      });
    });
  }
  function showAll(root){
    markTargets(root);
    var scope = root && root.querySelectorAll ? root : document;
    each(scope.querySelectorAll('[data-reveal]:not(.in)'), function(el){ el.classList.add('in'); });
    if(root && root.hasAttribute && root.hasAttribute('data-reveal')) root.classList.add('in');
  }
  function observeMutations(cb){
    if(!('MutationObserver' in window) || !document.body) return;
    // re-scan complet : les enfants de groupes arrivent après le marquage initial
    // (ajouts d'attributs/classes seuls ne redéclenchent pas childList : pas de boucle)
    new MutationObserver(function(){ cb(document); }).observe(document.body, { childList: true, subtree: true });
  }
  window.LBA_reveal = window.GAC_reveal = function(){ showAll(document); };
  if(!('IntersectionObserver' in window)){ showAll(document); observeMutations(showAll); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  function watch(root){
    markTargets(root);
    var scope = root && root.querySelectorAll ? root : document;
    each(scope.querySelectorAll('[data-reveal]:not(.in)'), function(el){ io.observe(el); });
    if(root && root.hasAttribute && root.hasAttribute('data-reveal')) io.observe(root);
  }
  window.LBA_reveal = window.GAC_reveal = function(){ watch(document); };
  watch(document);
  observeMutations(watch);
})();
