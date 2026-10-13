# Agent prospects KlarDrive — acheteurs B2C

## Principe (légal)
- **Jamais** de démarchage WhatsApp/SMS/e-mail sans consentement (interdit en DE : UWG §7, amendes + Abmahnung).
- L'agent travaille sur **vos canaux** (site, WhatsApp entrant, annonces) : il **qualifie, score et relance** les contacts existants, et vous guide pour capter les demandes publiques (annonces « recherche »).

## Routine quotidienne (30 min)
1. **09h00 — Boîte WhatsApp** : pour chaque nouveau message, lancez `node qualify.js` (collez le texte) → fiche + score + prochaine action.
2. **Relances** : tout lead « tiède » sans réponse → séquence J+1 / J+3 / J+7 (`messages.md`).
3. **Chasse** (15 min) : Kleinanzeigen → catégorie Auto → filtre « Gesuche » + « Frankfurt / Bad Homburg » ; groupes Facebook « Auto gesucht Frankfurt / Hochtaunus » ; ne contactez que les auteurs d'annonces de recherche, en réponse publique ou via le canal prévu par la plateforme.
4. **Annonces** : chaque véhicule vedette = 1 vidéo 30 s (TikTok/Reels/Shorts) + lien WhatsApp.

## Fichiers
- `prospects.sql` — table `leads` Supabase (à exécuter une fois après `schema.sql`).
- `qualify.js` — collez un message → JSON : intention, budget, modèle, délai, financement, reprise, score /100, statut (chaud/tiède/froid), action suivante.
- `messages.md` — modèles DE + FR : accueil, relances, demande d'avis.
