// Binance Pay — KlarDrive
// État : PRÉ-CÂBLÉ. Le checkout live exige un compte marchand Binance + un backend
// (voir docs/paiement-binance.md). En attendant, requestCryptoPayment() ouvre un
// e-mail pré-rempli vers contact@klardrive.de.
(function(){
"use strict";
var CONFIG = {
  configured: false,      // passer à true après création du compte marchand
  merchantPayId: "796342841", // Pay ID KlarDrive (encaissement manuel)
  currency: "EUR",
  backendOrderUrl: "",    // ex. "https://xxx.supabase.co/functions/v1/binance-order"
  backendWebhookSecret: ""// NE JAMAIS exposer de clé secrète ici : uniquement côté backend
};

function eur(n){ try{ return n.toLocaleString('de-DE') + ' €'; }catch(e){ return n + ' €'; } }

function requestCryptoPayment(ref, amountEUR){
  var subject = 'Paiement Binance Pay - ' + ref + ' - ' + eur(amountEUR);
  var body = 'Bonjour KlarDrive,%0AJe souhaite payer en Binance Pay :'
    + '%0ARéférence : ' + encodeURIComponent(ref)
    + '%0AMontant : ' + encodeURIComponent(eur(amountEUR))
    + '%0AMerci de me transmettre votre identifiant marchand et le montant exact en crypto.';
  window.location.href = 'mailto:contact@klardrive.de?subject='
    + encodeURIComponent(subject) + '&body=' + body;
}

// Checkout live (requiert backend configuré : signature HMAC côté serveur).
async function createOrder(ref, amountEUR){
  if(!CONFIG.configured || !CONFIG.backendOrderUrl){
    requestCryptoPayment(ref, amountEUR);
    return null;
  }
  const res = await fetch(CONFIG.backendOrderUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: ref, amount: amountEUR, currency: CONFIG.currency })
  });
  if(!res.ok) throw new Error('order failed: ' + res.status);
  const data = await res.json();
  if(data.checkoutUrl) window.location.href = data.checkoutUrl;
  return data;
}

window.KD_BINANCE = { config: CONFIG, request: requestCryptoPayment, order: createOrder };
})();
