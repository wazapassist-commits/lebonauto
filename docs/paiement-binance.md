# Binance Pay — guide d'activation KlarDrive

Le site affiche déjà Binance Pay (onglet paiement, FAQ, bon de commande).
Le checkout automatique exige 3 éléments ci-dessous. En attendant,
`requestCryptoPayment()` envoie un e-mail pré-rempli (aucune clé exposée).

## 1. Compte marchand Binance (vous, ~30 min)
1. Compte Binance vérifié (KYC entreprise : statuts, HRB, pièce du gérant).
2. Activer **Binance Pay** → **Merchant** : https://pay.binance.com → Business.
3. Noter le **Merchant Pay ID** (ex. `581234567`) → coller dans
   `assets/js/binance-pay.js` (`merchantPayId`) + `configured: true`.
4. Créer une **clé API marchand** (API Key + Secret) : à garder **côté serveur uniquement**.

## 2. Backend obligatoire (les secrets ne vont jamais dans le navigateur)
Créer un endpoint POST `/binance-order` (ex. Supabase Edge Function, petit VPS) :
- reçoit `{ref, amount, currency: "EUR"}` ;
- signe la requête (HMAC-SHA512, doc : `POST /binancepay/openapi/v2/order`,
  params : `merchantTradeNo=ref`, `orderAmount`, `currency=EUR`,
  `goodsDetails`, `returnUrl`, `cancelUrl`) ;
- renvoie `{checkoutUrl}` au site.
- renseigner son URL dans `backendOrderUrl`.

## 3. Webhook de confirmation (ne livrer que sur paiement confirmé)
- Endpoint POST `/binance-webhook` : vérifie la signature Binance,
  `status == "PAID"` → marquer la commande payée (table `orders`) ;
- **ne jamais remettre le véhicule sur simple capture d'écran client.**

## 4. Facturation (DE)
- Facture **en euros** (montant converti au taux du jour, noter date/heure + tx).
- La crypto est un moyen de paiement, pas une devise de facturation.
- Conserver tx-hash + reçu : pièces comptables (Steuerberater).

## 5. Recette avant mise en live
- [ ] `merchantPayId` renseigné, `configured: true`
- [ ] commande test petit montant → webhook PAID reçu → statut mis à jour
- [ ] mentions FAQ + bon de commande relues par votre conseil
