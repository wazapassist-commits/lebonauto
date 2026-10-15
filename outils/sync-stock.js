// Contrôle stock : compare les fiches live autoverkauf-import-export.com au catalogue local.
// Usage : node outils/sync-stock.js  (génère sync-report.md + sync-state.json)
// Réseau requis. Même propriétaire des deux sites (preuve hPanel vérifiée).
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const REMOTE = 'https://autoverkauf-import-export.com';
const STATE = path.join(__dirname, 'sync-state.json');

const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const normBrand = s => norm(s).replace('mercedesbenz', 'mercedes');
const num = s => { const m = String(s || '').match(/[\d.]+/); return m ? parseInt(m[0].replace(/\./g, ''), 10) : null; };
const strip = s => s.replace(/<[^>]+>/g, ' ').replace(/<!--.*?-->/g, ' ').replace(/\s+/g, ' ').trim();

async function get(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.text();
}

async function remoteInventory() {
  const sm = await get(REMOTE + '/sitemap.xml');
  const slugs = [...new Set([...sm.matchAll(/\/fahrzeuge\/([a-z0-9-]+)/g)].map(m => m[1]))];
  const out = [];
  for (let i = 0; i < slugs.length; i += 6) {
    const batch = await Promise.all(slugs.slice(i, i + 6).map(async slug => {
      try {
        const html = await get(REMOTE + '/fahrzeuge/' + slug);
        const specs = {};
        for (const m of html.matchAll(/text-slate-500 font-medium">([^<]+)<\/div><div class="font-semibold mt-0\.5">([^<]+)<\/div>/g))
          specs[m[1].trim()] = m[2].trim();
        if (!Object.keys(specs).length) return { slug, gone: true };
        const amounts = [...html.matchAll(/(\d{1,3}(?:\.\d{3})+)\s*€/g)].map(m => parseInt(m[1].replace(/\./g, ''), 10));
        const imgs = [...new Set([...html.matchAll(/\/fahrzeuge\/[a-z0-9-]+\.(?:jpg|jpeg|png|webp)/gi)].map(m => REMOTE + m[0]))];
        let brand = null;
        const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
        const brands = ['BMW', 'Mercedes-Benz', 'Mercedes', 'Audi', 'Volkswagen', 'Toyota', 'Tesla', 'Lexus', 'Porsche', 'Nissan', 'Volvo', 'Renault', 'Fiat', 'Suzuki', 'Cupra', 'Skoda', 'Ford', 'Opel', 'Peugeot'];
        if (h1) {
          const before = html.slice(Math.max(0, html.indexOf(h1[0]) - 600), html.indexOf(h1[0]));
          const cands = [...before.matchAll(/>([A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]{2,})</g)].map(m => m[1].trim());
          brand = cands.reverse().find(c => brands.includes(c)) || null;
        }
        return { slug, brand, model: h1 ? strip(h1[1]) : null, price: amounts.length ? Math.max(...amounts) : null,
          year: specs['Erstzulassung'] || null, km: specs['Kilometerstand'] || null,
          fuel: specs['Kraftstoff'] || null, gear: specs['Getriebe'] || null,
          power: specs['Leistung'] || null, images: imgs.slice(0, 10) };
      } catch (e) { return { slug, error: String(e).slice(0, 60) }; }
    }));
    out.push(...batch);
  }
  return out;
}

function loadLocal() {
  const src = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'vehicles.js'), 'utf8');
  const objs = [];
  const re = /\{"id":.*?\}(?=,?\s*(?:\n|$))/gs;
  // parse ligne par ligne (objets une-ligne)
  for (const line of src.split('\n')) {
    const s = line.trim();
    if (!s.startsWith('{"id"')) continue;
    try { objs.push(JSON.parse(s.replace(/,$/, ''))); } catch (e) {}
  }
  return objs;
}

async function main() {
  const remote = await remoteInventory();
  const live = remote.filter(v => !v.gone && !v.error);
  const local = loadLocal();
  const report = { date: new Date().toISOString().slice(0, 10), news: [], solds: [], priceDiffs: [], matched: 0 };
  const words = s => norm(s).replace(/([a-z])([0-9])/g, '$1 $2').split(/[^a-z0-9]+/).filter(w => w.length >= 3 && !['avec', 'pour', 'dans', 'the', 'and', 'der', 'die', 'das', 'mit', 'fur'].includes(w));
  function bestMatch(r, used) {
    const cands = local.filter(l => !used.has(l.id) && normBrand(l.marque) === normBrand(r.brand) && String(l.annee) === String(r.year) && num(l.km) === num(r.km));
    if (!cands.length) return null;
    const rw = new Set(words((r.brand || '') + ' ' + (r.model || '')));
    let best = null, bestScore = -1, bestDiff = Infinity;
    for (const l of cands) {
      const lw = new Set(words(l.marque + ' ' + l.modele + ' ' + (l.version || '')));
      let s = 0;
      rw.forEach(w => { if (lw.has(w)) s++; });
      const ref = l.prix_barre || l.prix;
      const diff = (r.price && ref) ? Math.abs(r.price - ref) : Infinity;
      if (s > bestScore || (s === bestScore && diff < bestDiff)) { bestScore = s; bestDiff = diff; best = l; }
    }
    return bestScore > 0 ? best : cands[0];
  }
  const usedIds = new Set();
  for (const r of live) {
    const l = bestMatch(r, usedIds);
    if (!l) { report.news.push(r); continue; }
    usedIds.add(l.id);
    report.matched++;
    const ref = l.prix_barre || l.prix;
    if (r.price && ref && r.price !== ref) report.priceDiffs.push({ slug: r.slug, id: l.id, remote: r.price, localRef: ref });
  }
  let prev = {};
  try { prev = JSON.parse(fs.readFileSync(STATE, 'utf8')); } catch (e) {}
  const prevLive = new Set(prev.liveSlugs || []);
  const curLive = new Set(live.map(v => v.slug));
  const prevMap = {};
  (prev.vehicles || []).forEach(v => { prevMap[v.slug] = v; });
  for (const s of [...prevLive].filter(s => !curLive.has(s))) {
    const pv = prevMap[s];
    report.solds.push(pv ? { slug: s, brand: pv.brand, model: pv.model, price: pv.price } : { slug: s });
  }
  fs.writeFileSync(STATE, JSON.stringify({ date: report.date, liveSlugs: [...curLive], vehicles: live.map(v => ({ slug: v.slug, brand: v.brand, model: v.model, price: v.price, year: v.year, km: v.km })) }, null, 2));

  let md = `# Sync stock — ${report.date}\n\nComparaison autoverkauf-import-export.com (live: ${live.length}) vs catalogue local (${local.length}) : ${report.matched} appariés.\n\n`;
  md += `## Nouveautés là-bas (${report.news.length})\n` + (report.news.length ? report.news.map(v => `- **${v.brand || '?'} ${v.model || v.slug}** (${v.year || '?'}, ${v.km || '?'}) — ${v.price ? v.price + ' €' : 'prix ?'}`).join('\n') : 'Aucune.\n') + '\n\n';
  md += `## Vendus/retirés là-bas (${report.solds.length})\n` + (report.solds.length ? report.solds.map(v => `- ${v.brand || ''} ${v.model || v.slug} (${v.price ? v.price + ' €' : ''})`).join('\n') : 'Aucun nouveau retrait (vs dernier contrôle).\n') + '\n\n';
  md += `## Écarts de prix (${report.priceDiffs.length})\n` + (report.priceDiffs.length ? report.priceDiffs.map(d => `- ${d.id} : distant ${d.remote} € vs réf locale ${d.localRef} €`).join('\n') : 'Aucun.\n');
  fs.writeFileSync(path.join(__dirname, 'sync-report.md'), md);
  console.log(md);
}
main().catch(e => { console.error('SYNC ECHEC:', e.message); process.exit(1); });
