// Agent prospects KlarDrive — qualification + scoring (sans API externe)
// Usage : collez le message puis ligne vide + Entrée  |  echo "msg" | node qualify.js
const readline = require('readline');

const MODELS = ['x1','x3','x5','q3','q5','tiguan','rav 4','rav4','glc','gle','macan','cayenne','a3','a4','golf','polo','c-hr','chr','formentor','captur','208','t-roc','troc','tucson','sportage','duster','kuga','x-trail','xtrail','classe a','classe c','serie 1','serie 3','m3','m5','ix3','model y','eqa','arkana','jimny','land cruiser'];
const URGENT = ['dringend','sofort','diese woche','urgent','vite','rapidement','cette semaine','quickly','asap','eilig'];

function qualify(raw) {
  const t = ' ' + raw.toLowerCase() + ' ';
  const lead = { modele_recherche: null, budget_max: null, delai: null,
    financement: false, reprise: false, langue: 'de', score: 0, statut: 'froid' };

  if (/\b(je|cherche|bonjour|voiture|merci|avez|disponible|prix|combien|suis|juste|renseignement|horaires|tarif)\b/.test(t)) lead.langue = 'fr';
  else if (/\b(the|hello|looking|price|available|interested|car)\b/.test(t)) lead.langue = 'en';

  for (const m of MODELS) { if (t.includes(m)) { lead.modele_recherche = m.toUpperCase(); break; } }
  const b = raw.match(/(\d[\d\s.]{3,})\s*(€|eur|euros|euro)/i);
  if (b) lead.budget_max = parseInt(b[1].replace(/[\s.]/g, ''), 10);
  const d = raw.match(/(cette semaine|diese woche|this week|sous \d+ jours?|in \d+ tagen|urgent|dringend|ce mois|diesen monat|this month)/i);
  if (d) lead.delai = d[0];
  if (/(finanz|kredit|raten|finanzierung|financement|crédit|credit|mensualit|monatsrate)/i.test(t)) lead.financement = true;
  if (/(reprise|inzah|tausch|eintausch|trade.in|ancien|alte)/i.test(t)) lead.reprise = true;

  let s = 20;
  if (lead.modele_recherche) s += 25;
  if (lead.budget_max) s += 15;
  if (lead.financement) s += 10;
  if (lead.reprise) s += 5;
  if (URGENT.some(w => t.includes(w)) || d) s += 20;
  if (/\b(info|juste|nur mal schauen|just looking|renseignement)\b/.test(t)) s -= 10;
  lead.score = Math.max(0, Math.min(100, s));
  lead.statut = lead.score >= 70 ? 'chaud' : (lead.score >= 40 ? 'tiède' : 'froid');
  lead.prochaine_action = lead.score >= 70
    ? 'Rappeler sous 1h : proposer 2 créneaux d’essai + devis.'
    : (lead.score >= 40 ? 'Envoyer 2-3 véhicules ciblés + relance J+1.' : 'Réponse info + relance J+3.');
  return lead;
}

function out(text) { console.log(JSON.stringify(qualify(text.trim()), null, 2)); }

if (!process.stdin.isTTY) {
  let data = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', c => { data += c; });
  process.stdin.on('end', () => out(data));
} else {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log('Collez le message du prospect (ligne vide = analyser) :');
  const lines = [];
  rl.on('line', l => { if (!l.trim()) rl.close(); else lines.push(l); });
  rl.on('close', () => out(lines.join('\n')));
}
