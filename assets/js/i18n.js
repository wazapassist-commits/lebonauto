// i18n — LeBonAuto (FR / EN / ES / PT)
// Langue persistée : localStorage 'lba-lang' + ?lang= prioritaire, sinon navigateur.
(function(){
"use strict";
var SUPPORTED = ['fr','en','es','pt','de'];
var LOCALES = {fr:'fr-FR', en:'en-IE', es:'es-ES', pt:'pt-PT', de:'de-DE'};
// Drapeaux SVG inline (pas d'emoji : rendu incohérent sur Windows/Android)
var LANG_META = {
  fr: { code:'FR', name:'Français', flag:'<svg viewBox="0 0 18 12" aria-hidden="true"><rect width="18" height="12" fill="#fff"/><rect width="6" height="12" fill="#0055A4"/><rect x="12" width="6" height="12" fill="#EF4135"/></svg>' },
  en: { code:'EN', name:'English', flag:'<svg viewBox="0 0 18 12" aria-hidden="true"><rect width="18" height="12" fill="#012169"/><path d="M0,0L18,12M18,0L0,12" stroke="#fff" stroke-width="2.4"/><path d="M0,0L18,12M18,0L0,12" stroke="#C8102E" stroke-width="0.9"/><path d="M9,0V12M0,6H18" stroke="#fff" stroke-width="3.6"/><path d="M9,0V12M0,6H18" stroke="#C8102E" stroke-width="2"/></svg>' },
  es: { code:'ES', name:'Español', flag:'<svg viewBox="0 0 18 12" aria-hidden="true"><rect width="18" height="12" fill="#AA151B"/><rect y="3" width="18" height="6" fill="#F1BF00"/></svg>' },
  pt: { code:'PT', name:'Português', flag:'<svg viewBox="0 0 18 12" aria-hidden="true"><rect width="18" height="12" fill="#DA291C"/><rect width="7" height="12" fill="#046A38"/><circle cx="7" cy="6" r="2.4" fill="#FFE900" stroke="#000" stroke-width="0.4"/></svg>' },
  de: { code:'DE', name:'Deutsch', flag:'<svg viewBox="0 0 18 12" aria-hidden="true"><rect width="18" height="12" fill="#FFCE00"/><rect width="18" height="8" fill="#DD0000"/><rect width="18" height="4" fill="#000000"/></svg>' }
};

var T = {
fr: {
  'topbar.deals':"Réductions exclusives",
  'topbar.financing':"Financement dès 139 €/mois",
  'topbar.online':"visiteurs en ligne",
  'nav.home':"Accueil",'nav.catalogue':"Catalogue",'nav.about':"À propos",'nav.contact':"Contact",'nav.blog':"Blog",'nav.faq':"FAQ",
  'nav.cta.cars':"Voir nos véhicules",'nav.cta.contact':"Nous contacter",
  'footer.desc':"Votre destination de confiance pour des véhicules de qualité premium. Plus de 6 ans d'expérience.",
  'footer.nav':"Navigation",'footer.hours':"Horaires",'footer.contact':"Contact rapide",'footer.services':"Services",
  'footer.h1':"Lun – Ven : 9h – 18h",'footer.h2':"Sam : sur rendez-vous",'footer.h3':"Dim : fermé",
  'footer.quote':"Demander un devis",'footer.rights':"Tous droits réservés.",
  'footer.cgu':"Conditions générales",'footer.legal':"Mentions légales",
  'footer.brand':"LEBONAUTO",
  'ser.fin':"Financement 6-84 mois",'ser.war':"Garantie 12 mois min",'ser.del':"Livraison 3-5 j",'ser.ctl':"Contrôle 250 points",
  'devis':"Devis",'contact.us':"Contactez-nous",
  'meta.title.index':"LeBonAuto — Vente automobile à Divatte-sur-Loire | Voitures d'occasion fiables",
  'meta.title.catalogue':"Catalogue véhicules d'occasion | LeBonAuto Divatte-sur-Loire",
  'meta.title.about':"À propos | LeBonAuto Divatte-sur-Loire",
  'meta.title.contact':"Contact | LeBonAuto Divatte-sur-Loire",
  'meta.title.faq':"FAQ : achat, garantie, livraison, financement | LeBonAuto",
  'meta.title.blog':"Blog auto : conseils d'achat, hybride, entretien | LeBonAuto",
  'hero.eyebrow':"visiteurs consultent nos offres",
  'hero.title':"LeBonAuto<br>Vente d'automobiles à Divatte-sur-Loire",
  'hero.lead':"Trouvez votre prochaine voiture facilement dans votre garage de confiance. Véhicules contrôlés, historique vérifié, garantie et transparence.",
  'hero.cta.cars':"Voir nos véhicules →",
  'hero.cta.now':"Appelez maintenant",
  'trust.t1':"avis clients",'trust.t2':"Garantie 12 mois",'trust.t2b':"minimum",
  'trust.t3':"Livraison",'trust.t3b':"toute l'Europe",
  'trust.t4':"d'expérience",
  'stats.s1':"véhicules vendus / an",'stats.s2':"satisfaction client",'stats.s3':"d'expérience",'stats.s4':"livraison suivie",
  'universe.kicker':"Notre univers",'universe.title':"Nos catégories",
  'universe.sub':"Choisissez parmi notre sélection variée, adaptée à chaque style de conduite.",
  'cat.b1.badge':"Berlines",'cat.b1.title':"Berlines & breaks premium",
  'cat.b1.desc':"Audi, BMW, Mercedes : confort et élégance.",
  'cat.b2.badge':"SUV",'cat.b2.title':"Robustes & familiaux",
  'cat.b2.desc':"X1, Q3, Tiguan, RAV 4, Macan et plus.",
  'cat.b3.badge':"Grands volumes",'cat.b3.title':"Monospaces & camping-car",
  'cat.b3.desc':"Classe V 8 places, camping-car Etrusco.",
  'cat.discover':"Découvrir",
  'fav.kicker':"Sélection du moment",'fav.title':"Nos coups de cœur",
  'fav.sub':"Une sélection de véhicules d'exception, prêts à prendre la route.",
  'fav.all':"Voir toutes les voitures →",
  'why.kicker':"Nos engagements",'why.title':"Pourquoi nous choisir ?",
  'why.sub':"Qualité, transparence et proximité.",
  'why.1t':"Contrôle 250 points",'why.1d':"Moteur, sécurité, électronique, châssis + diagnostic complet.",
  'why.2t':"Financement flexible",'why.2d':"De 6 à 84 mois, 30 % d'acompte à la réservation.",
  'why.3t':"Livraison suivie",'why.3d':"Partout en Europe sous 3-5 jours, 200 € frais fixes.",
  'why.4t':"Support client",'why.4d':"À l'écoute avant, pendant et après votre achat.",
  'rev.kicker':"Ils nous font confiance",'rev.title':"Avis clients",
  'rev.sub':"Ce que nos clients pensent de nous.",
  'rev.r1':"« Très professionnel, véhicule conforme à l'annonce. Livraison rapide à Nantes. Je recommande ! »",
  'rev.r2':"« Achat en ligne simple et rassurant, financement obtenu en 24h. Merci à toute l'équipe. »",
  'rev.r3':"« GLC impeccable, contrôle complet fourni. Prix honnête. Garage sérieux. »",
  'rev.more':"Avis certifiés",
  'journal.kicker':"Le journal",'journal.title':"Nos conseils auto",
  'journal.sub':"Guides d'achat, hybride vs électrique, entretien : les conseils de nos experts.",
  'journal.all':"Tous les articles →",
  'cta.title':"Prêt à trouver votre véhicule idéal ?",
  'cta.sub':"Notre équipe est à votre disposition pour vous accompagner. Réponse en moins d'1h ouvrée.",
  'cta.imgalt':"Essai véhicule",
  'cat.kicker':"véhicules disponibles",
  'cat.title':"Notre catalogue",
  'filters.search':"Rechercher un véhicule…",
  'filters.cat.all':"Toutes catégories",'filters.fuel.all':"Tous carburants",
  'filters.fuel.petrol':"Essence",'filters.fuel.diesel':"Diesel",'filters.fuel.hybrid':"Hybride",'filters.fuel.electric':"Électrique",
  'filters.sort.rel':"Trier : pertinence",'filters.sort.asc':"Prix croissant",'filters.sort.desc':"Prix décroissant",
  'filters.sort.km':"Faible kilométrage",'filters.sort.year':"Plus récent",
  'filters.title':"Filtres",
  'filters.all':"Toutes",
  'f.brand':"Marque",'f.model':"Modèle",
  'f.priceMin':"Prix minimum",'f.priceMax':"Prix maximum",
  'f.yearMin':"Année minimum",'f.yearMax':"Année maximum",
  'f.kmMax':"Kilométrage maximum",
  'f.fuel':"Carburant",'f.gear':"Boîte de vitesses",'f.body':"Type de carrosserie",
  'f.allBrands':"Toutes marques",'f.allModels':"Tous modèles",
  'f.apply':"Appliquer les filtres",
  'f.sortBy':"Trier par",'f.close':"Fermer",
  'filters.reset':"Réinitialiser",
  'cat.count':"véhicule(s) disponible(s) à Divatte-sur-Loire",
  'cat.empty':"Aucun véhicule trouvé.",
  'cat.empty.cta':"Demandez-nous sur WhatsApp",
  'cat.empty.end':", on vous trouve votre modèle !",
  'card.details':"Détails",'card.km.na':"Km sur demande",'card.contact':"Contacter",
  'v.back':"← Retour au catalogue",
  'v.available':"Disponible",'v.from':"ou dès",'v.permonth':"€/mois",
  'v.fin':"Financement 6 à 84 mois · 30 % d'acompte à la réservation",
  'v.viewing':"personnes consultent ce véhicule",
  'v.year':"Année",'v.km':"Kilométrage",'v.fuel':"Carburant",'v.gear':"Boîte",'v.power':"Puissance",'v.control':"Contrôle",
  'v.year.na':"Année sur demande",'v.km.na':"Kilométrage sur demande",
  'v.call':"Appeler",'v.book':"Réserver",
  'v.tab1':"Véhicule",'v.tab2':"Contrôle & Qualité",'v.tab3':"Documents",
  'v.tab4':"Livraison",'v.tab5':"Paiement",'v.tab6':"Garantie",
  'v.hist1':"Historique vérifié",'v.hist2':"Kilométrage attesté",'v.hist3':"Contrôle technique de moins de 6 mois",
  'v.steps.title':"Votre commande en 4 étapes",
  'v.s1t':"1. Devis validé",'v.s1d':"On bloque le véhicule pour vous",
  'v.s2t':"2. Signature + acompte",'v.s2d':"Électronique, 30 % sécurisé",
  'v.s3t':"3. Préparation finale",'v.s3d':"Contrôle + nettoyage pro",
  'v.s4t':"4. Remise 3-5 jours",'v.s4d':"Avec numéro de suivi",
  'v.reco.kicker':"Poursuivre votre visite",'v.reco.title':"Vous aimerez aussi",
  'v.ctl.html':"<li><b>80 %</b> de nos véhicules proviennent de fournisseurs certifiés en Europe</li><li>Jusqu'à <b>250 points de contrôle</b> : moteur, sécurité, électronique, châssis</li><li><b>Diagnostic électronique complet</b> effectué systématiquement</li><li>Préparation mécanique + carrosserie + <b>nettoyage professionnel</b></li><li>Contrôle final effectué <b>en votre présence</b> le jour de la remise</li><li>Non-conformité majeure : <b>échange ou remboursement immédiat</b></li>",
  'v.doc.html':"<li>Carte grise française + plaque définitive</li><li>Certificat de non-gage officiel</li><li>Contrôle technique valide (moins de 6 mois)</li><li>Carnet d'entretien + historique vérifié</li><li>Certificat de cession</li><li>Attestation kilométrique conforme</li>",
  'v.del.html':"<li>Prise en charge possible dans <b>toute l'Europe</b></li><li>Délai moyen : <b>3 à 5 jours ouvrés</b></li><li>Frais fixes : <b>200 €</b> (transport assuré et sécurisé)</li><li>Numéro de suivi transmis par e-mail / SMS</li><li>Ordinateur de bord configuré en <b>français</b> (ou langue choisie)</li>",
  'v.pay.html':"<li>Virement bancaire sécurisé</li><li>Paiement comptant ou facilité de paiement</li><li><b>30 % d'acompte</b> requis pour réserver ce véhicule</li><li>Financement de <b>6 à 84 mois</b> possible selon profil</li>",
  'v.war.html':"<li>Garantie légale : <b>minimum 12 mois</b></li><li>Extensions possibles jusqu'à <b>36 mois</b></li><li>Réseau de garages partenaires proche de votre domicile</li><li>Délai de rétractation : <b>15 jours</b></li><li>Remboursement intégral en cas de vice non déclaré</li>",
  'c.title':"Contactez-nous",
  'c.sub':"Une question ? On vous aide à trouver le véhicule parfait. Réponse en moins d'1h ouvrée.",
  'form.name':"Nom",'form.name.ph':"Votre nom",'form.tel':"Téléphone",
  'form.subject':"Sujet",'form.msg':"Message",'form.msg.ph':"Bonjour, je cherche...",
  'form.send':"Envoyer via WhatsApp",
  'form.ok':"Message prêt dans WhatsApp, on vous répond vite.",
  'subj.1':"Acheter un véhicule",'subj.2':"Financement",'subj.3':"Livraison",'subj.4':"Autre",
  'info.title':"Contacts directs",'cta.call2':"Appeler",'cta.mail':"Email",
  'a.title':"Qui sommes-nous ?",
  'a.text':"LeBonAuto, votre partenaire pour l'achat de véhicules en ligne, simple et fiable. Large gamme adaptée à tous vos besoins, financement flexible, expérience d'achat agréable et sans tracas.",
  'a.s1t':"Vente en ligne",'a.s1d':"Achetez depuis chez vous en quelques clics.",
  'a.s2t':"Livraison suivie",'a.s2d':"Partout en Europe sous 3 à 5 jours, 200 € fixes.",
  'a.s3t':"Support client",'a.s3d':"Accompagnement à chaque étape.",
  'a.s4t':"Garantie",'a.s4d':"12 mois minimum, extension possible 36 mois.",
  'a.place':"Notre lieu",
  'about.img1':"Porsche Macan en vente au garage",'about.img2':"Audi A3 en vente au garage",'about.img3':"BMW X1 en vente au garage",
  'f.kicker':"On vous dit tout",'f.title':"Questions fréquentes",
  'f.sub':"Achat, garantie, livraison, financement : les réponses claires de l'équipe LeBonAuto.",
  'f.cta.kicker':"Encore une question ?",'f.cta.title':"Parlons de votre projet",
  'f.cta.sub':"Réponse en moins d'1h ouvrée, sans engagement.",
  'b.kicker':"Le journal",'b.title':"Blog : conseils & actualités",
  'b.sub':"Guides d'achat, comparatifs et entretien, par l'équipe LeBonAuto.",
  'b.read':"Lire l'article →",'b.read2':"Lire →",
  'b.all':"← Tous les articles",'b.others':"Autres articles",
  'b.cta.title':"Une question sur votre futur véhicule ?",
  'b.cta.sub':"Appelez-nous ou écrivez sur WhatsApp, réponse en moins d'1h ouvrée.",
  'wa.msg':"Bonjour LeBonAuto, je suis intéressé par",
  'wa.msg.end':"Est-il disponible ?"
},
en: {
  'topbar.deals':"Exclusive deals",
  'topbar.financing':"Financing from €139/mo",
  'topbar.online':"visitors online",
  'nav.home':"Home",'nav.catalogue':"Catalog",'nav.about':"About",'nav.contact':"Contact",'nav.blog':"Blog",'nav.faq':"FAQ",
  'nav.cta.cars':"Browse our cars",'nav.cta.contact':"Contact us",
  'footer.desc':"Your trusted destination for premium quality vehicles. Over 6 years of experience.",
  'footer.nav':"Navigation",'footer.hours':"Opening hours",'footer.contact':"Quick contact",'footer.services':"Services",
  'footer.h1':"Mon – Fri: 9am – 6pm",'footer.h2':"Sat: by appointment",'footer.h3':"Sun: closed",
  'footer.quote':"Request a quote",'footer.rights':"All rights reserved.",
  'footer.cgu':"Terms & conditions",'footer.legal':"Legal notice",
  'footer.brand':"LEBONAUTO",
  'ser.fin':"Financing 6-84 months",'ser.war':"12-month warranty min",'ser.del':"Delivery in 3-5 days",'ser.ctl':"250-point inspection",
  'devis':"Quote",'contact.us':"Contact us",
  'meta.title.index':"LeBonAuto — Car dealer in Divatte-sur-Loire | Reliable used cars",
  'meta.title.catalogue':"Used cars catalog | LeBonAuto Divatte-sur-Loire",
  'meta.title.about':"About us | LeBonAuto Divatte-sur-Loire",
  'meta.title.contact':"Contact | LeBonAuto Divatte-sur-Loire",
  'meta.title.faq':"FAQ: purchase, warranty, delivery, financing | LeBonAuto",
  'meta.title.blog':"Car blog: buying tips, hybrid, maintenance | LeBonAuto",
  'hero.eyebrow':"visitors are viewing our offers",
  'hero.title':"LeBonAuto<br>Car sales in Divatte-sur-Loire",
  'hero.lead':"Find your next car easily at your trusted dealership. Inspected vehicles, verified history, warranty and transparency.",
  'hero.cta.cars':"Browse our cars →",
  'hero.cta.now':"Call now",
  'trust.t1':"customer reviews",'trust.t2':"12-month warranty",'trust.t2b':"minimum",
  'trust.t3':"Delivery",'trust.t3b':"across Europe",
  'trust.t4':"of experience",
  'stats.s1':"cars sold / year",'stats.s2':"customer satisfaction",'stats.s3':"of experience",'stats.s4':"tracked delivery",
  'universe.kicker':"Our world",'universe.title':"Our categories",
  'universe.sub':"Choose from our varied selection, suited to every driving style.",
  'cat.b1.badge':"Sedans",'cat.b1.title':"Premium sedans & wagons",
  'cat.b1.desc':"Audi, BMW, Mercedes: comfort and elegance.",
  'cat.b2.badge':"SUV",'cat.b2.title':"Sturdy & family-friendly",
  'cat.b2.desc':"X1, Q3, Tiguan, RAV 4, Macan and more.",
  'cat.b3.badge':"Large volumes",'cat.b3.title':"Minivans & motorhome",
  'cat.b3.desc':"8-seater Classe V, Etrusco motorhome.",
  'cat.discover':"Discover",
  'fav.kicker':"Right now",'fav.title':"Our favourites",
  'fav.sub':"A selection of exceptional vehicles, ready to hit the road.",
  'fav.all':"See all cars →",
  'why.kicker':"Our commitments",'why.title':"Why choose us?",
  'why.sub':"Quality, transparency and personal service.",
  'why.1t':"250-point inspection",'why.1d':"Engine, safety, electronics, chassis + full diagnostics.",
  'why.2t':"Flexible financing",'why.2d':"From 6 to 84 months, 30% deposit on reservation.",
  'why.3t':"Tracked delivery",'why.3d':"Across Europe in 3-5 days, €200 flat fee.",
  'why.4t':"Customer support",'why.4d':"Here for you before, during and after your purchase.",
  'rev.kicker':"They trust us",'rev.title':"Customer reviews",
  'rev.sub':"What our customers say about us.",
  'rev.r1':"“Very professional, vehicle matches the listing. Fast delivery to Nantes. I recommend!”",
  'rev.r2':"“Simple and reassuring online purchase, financing approved in 24h. Thanks to the whole team.”",
  'rev.r3':"“Immaculate GLC, full inspection provided. Honest price. Serious dealership.”",
  'rev.more':"Certified reviews",
  'journal.kicker':"The journal",'journal.title':"Our car tips",
  'journal.sub':"Buying guides, hybrid vs electric, maintenance: advice from our experts.",
  'journal.all':"All articles →",
  'cta.title':"Ready to find your ideal car?",
  'cta.sub':"Our team is here to help you. Reply in under 1 business hour.",
  'cta.imgalt':"Test drive",
  'cat.kicker':"vehicles available",
  'cat.title':"Our catalog",
  'filters.search':"Search for a vehicle…",
  'filters.cat.all':"All categories",'filters.fuel.all':"All fuels",
  'filters.fuel.petrol':"Petrol",'filters.fuel.diesel':"Diesel",'filters.fuel.hybrid':"Hybrid",'filters.fuel.electric':"Electric",
  'filters.sort.rel':"Sort: relevance",'filters.sort.asc':"Price: low to high",'filters.sort.desc':"Price: high to low",
  'filters.sort.km':"Lowest mileage",'filters.sort.year':"Newest",
  'filters.title':"Filters",
  'filters.all':"All",
  'f.brand':"Make",'f.model':"Model",
  'f.priceMin':"Min price",'f.priceMax':"Max price",
  'f.yearMin':"Min year",'f.yearMax':"Max year",
  'f.kmMax':"Max mileage",
  'f.fuel':"Fuel",'f.gear':"Gearbox",'f.body':"Body type",
  'f.allBrands':"All makes",'f.allModels':"All models",
  'f.apply':"Apply filters",
  'f.sortBy':"Sort by",'f.close':"Close",
  'filters.reset':"Reset",
  'cat.count':"vehicle(s) available in Divatte-sur-Loire",
  'cat.empty':"No vehicles found.",
  'cat.empty.cta':"Ask us on WhatsApp",
  'cat.empty.end':", we'll find your model!",
  'card.details':"Details",'card.km.na':"Mileage on request",'card.contact':"Contact",
  'v.back':"← Back to catalog",
  'v.available':"Available",'v.from':"or from",'v.permonth':"€/mo",
  'v.fin':"Financing 6 to 84 months · 30% deposit on reservation",
  'v.viewing':"people are viewing this car",
  'v.year':"Year",'v.km':"Mileage",'v.fuel':"Fuel",'v.gear':"Gearbox",'v.power':"Power",'v.control':"Inspection",
  'v.year.na':"Year on request",'v.km.na':"Mileage on request",
  'v.call':"Call",'v.book':"Reserve",
  'v.tab1':"Vehicle",'v.tab2':"Inspection & Quality",'v.tab3':"Documents",
  'v.tab4':"Delivery",'v.tab5':"Payment",'v.tab6':"Warranty",
  'v.hist1':"Verified history",'v.hist2':"Certified mileage",'v.hist3':"Technical inspection less than 6 months old",
  'v.steps.title':"Your order in 4 steps",
  'v.s1t':"1. Approved quote",'v.s1d':"We hold the car for you",
  'v.s2t':"2. Signature + deposit",'v.s2d':"Electronic, 30% secured",
  'v.s3t':"3. Final preparation",'v.s3d':"Inspection + pro detailing",
  'v.s4t':"4. Handover in 3-5 days",'v.s4d':"With tracking number",
  'v.reco.kicker':"Continue browsing",'v.reco.title':"You may also like",
  'v.ctl.html':"<li><b>80%</b> of our vehicles come from certified suppliers in Europe</li><li>Up to <b>250 inspection points</b>: engine, safety, electronics, chassis</li><li><b>Full electronic diagnostics</b> performed systematically</li><li>Mechanical + bodywork preparation + <b>professional detailing</b></li><li>Final inspection carried out <b>in your presence</b> on handover day</li><li>Major non-conformity: <b>immediate exchange or refund</b></li>",
  'v.doc.html':"<li>French registration + final plate</li><li>Official non-pledge certificate</li><li>Valid technical inspection (less than 6 months)</li><li>Service book + verified history</li><li>Transfer certificate</li><li>Compliant mileage certificate</li>",
  'v.del.html':"<li>Collection possible across <b>Europe</b></li><li>Average lead time: <b>3 to 5 business days</b></li><li>Flat fee: <b>€200</b> (insured, secure transport)</li><li>Tracking number sent by email / SMS</li><li>On-board computer set to <b>English</b> (or your chosen language)</li>",
  'v.pay.html':"<li>Secure bank transfer</li><li>Cash payment or payment plan</li><li><b>30% deposit</b> required to reserve this vehicle</li><li><b>6 to 84 month</b> financing possible depending on profile</li>",
  'v.war.html':"<li>Legal warranty: <b>12 months minimum</b></li><li>Extensions possible up to <b>36 months</b></li><li>Network of partner garages near your home</li><li>Withdrawal period: <b>15 days</b></li><li>Full refund for any undisclosed defect</li>",
  'c.title':"Contact us",
  'c.sub':"A question? We'll help you find the perfect car. Reply in under 1 business hour.",
  'form.name':"Name",'form.name.ph':"Your name",'form.tel':"Phone",
  'form.subject':"Subject",'form.msg':"Message",'form.msg.ph':"Hello, I'm looking for...",
  'form.send':"Send via WhatsApp",
  'form.ok':"Message ready in WhatsApp, we'll reply quickly.",
  'subj.1':"Buy a car",'subj.2':"Financing",'subj.3':"Delivery",'subj.4':"Other",
  'info.title':"Direct contacts",'cta.call2':"Call",'cta.mail':"Email",
  'a.title':"Who are we?",
  'a.text':"LeBonAuto, your partner for simple and reliable online car buying. A wide range for every need, flexible financing and a smooth, hassle-free buying experience.",
  'a.s1t':"Online sales",'a.s1d':"Buy from home in just a few clicks.",
  'a.s2t':"Tracked delivery",'a.s2d':"Across Europe in 3 to 5 days, €200 flat fee.",
  'a.s3t':"Customer support",'a.s3d':"Guidance at every step.",
  'a.s4t':"Warranty",'a.s4d':"12 months minimum, extendable to 36 months.",
  'a.place':"Our location",
  'about.img1':"Porsche Macan for sale at the dealership",'about.img2':"Audi A3 for sale at the dealership",'about.img3':"BMW X1 for sale at the dealership",
  'f.kicker':"Everything explained",'f.title':"Frequently asked questions",
  'f.sub':"Purchase, warranty, delivery, financing: clear answers from the LeBonAuto team.",
  'f.cta.kicker':"Still have a question?",'f.cta.title':"Let's talk about your project",
  'f.cta.sub':"Reply in under 1 business hour, no commitment.",
  'b.kicker':"The journal",'b.title':"Blog: tips & news",
  'b.sub':"Buying guides, comparisons and maintenance, by the LeBonAuto team.",
  'b.read':"Read the article →",'b.read2':"Read →",
  'b.all':"← All articles",'b.others':"Other articles",
  'b.cta.title':"A question about your future car?",
  'b.cta.sub':"Call us or message us on WhatsApp, reply in under 1 business hour.",
  'wa.msg':"Hello LeBonAuto, I'm interested in",
  'wa.msg.end':"Is it available?"
},
es: {
  'topbar.deals':"Descuentos exclusivos",
  'topbar.financing':"Financiación desde 139 €/mes",
  'topbar.online':"visitantes en línea",
  'nav.home':"Inicio",'nav.catalogue':"Catálogo",'nav.about':"Nosotros",'nav.contact':"Contacto",'nav.blog':"Blog",'nav.faq':"FAQ",
  'nav.cta.cars':"Ver nuestros vehículos",'nav.cta.contact':"Contáctanos",
  'footer.desc':"Su destino de confianza para vehículos premium de calidad. Más de 6 años de experiencia.",
  'footer.nav':"Navegación",'footer.hours':"Horarios",'footer.contact':"Contacto rápido",'footer.services':"Servicios",
  'footer.h1':"Lun – Vie: 9h – 18h",'footer.h2':"Sáb: con cita",'footer.h3':"Dom: cerrado",
  'footer.quote':"Solicitar presupuesto",'footer.rights':"Todos los derechos reservados.",
  'footer.cgu':"Condiciones generales",'footer.legal':"Aviso legal",
  'footer.brand':"LEBONAUTO",
  'ser.fin':"Financiación 6-84 meses",'ser.war':"Garantía 12 meses mín.",'ser.del':"Entrega 3-5 días",'ser.ctl':"Control de 250 puntos",
  'devis':"Presupuesto",'contact.us':"Contáctanos",
  'meta.title.index':"LeBonAuto — Venta de coches en Divatte-sur-Loire | Coches de ocasión fiables",
  'meta.title.catalogue':"Catálogo de coches de ocasión | LeBonAuto Divatte-sur-Loire",
  'meta.title.about':"Quiénes somos | LeBonAuto Divatte-sur-Loire",
  'meta.title.contact':"Contacto | LeBonAuto Divatte-sur-Loire",
  'meta.title.faq':"FAQ: compra, garantía, entrega, financiación | LeBonAuto",
  'meta.title.blog':"Blog auto: consejos de compra, híbrido, mantenimiento | LeBonAuto",
  'hero.eyebrow':"visitantes están viendo nuestras ofertas",
  'hero.title':"LeBonAuto<br>Venta de automóviles en Divatte-sur-Loire",
  'hero.lead':"Encuentre su próximo coche fácilmente en su concesionario de confianza. Vehículos revisados, historial verificado, garantía y transparencia.",
  'hero.cta.cars':"Ver nuestros vehículos →",
  'hero.cta.now':"Llamar ahora",
  'trust.t1':"opiniones de clientes",'trust.t2':"Garantía de 12 meses",'trust.t2b':"mínimo",
  'trust.t3':"Entrega",'trust.t3b':"en toda Europa",
  'trust.t4':"de experiencia",
  'stats.s1':"vehículos vendidos / año",'stats.s2':"satisfacción del cliente",'stats.s3':"de experiencia",'stats.s4':"entrega con seguimiento",
  'universe.kicker':"Nuestro universo",'universe.title':"Nuestras categorías",
  'universe.sub':"Elija entre nuestra variada selección, adaptada a cada estilo de conducción.",
  'cat.b1.badge':"Berlina",'cat.b1.title':"Berlina y familiares premium",
  'cat.b1.desc':"Audi, BMW, Mercedes: confort y elegancia.",
  'cat.b2.badge':"SUV",'cat.b2.title':"Robustos y familiares",
  'cat.b2.desc':"X1, Q3, Tiguan, RAV 4, Macan y más.",
  'cat.b3.badge':"Gran volumen",'cat.b3.title':"Monovolúmenes y autocaravana",
  'cat.b3.desc':"Clase V de 8 plazas, autocaravana Etrusco.",
  'cat.discover':"Descubrir",
  'fav.kicker':"Selección actual",'fav.title':"Nuestros favoritos",
  'fav.sub':"Una selección de vehículos excepcionales, listos para salir a la carretera.",
  'fav.all':"Ver todos los coches →",
  'why.kicker':"Nuestros compromisos",'why.title':"¿Por qué elegirnos?",
  'why.sub':"Calidad, transparencia y cercanía.",
  'why.1t':"Control de 250 puntos",'why.1d':"Motor, seguridad, electrónica, chasis + diagnóstico completo.",
  'why.2t':"Financiación flexible",'why.2d':"De 6 a 84 meses, 30 % de anticipo al reservar.",
  'why.3t':"Entrega con seguimiento",'why.3d':"En toda Europa en 3-5 días, 200 € gastos fijos.",
  'why.4t':"Atención al cliente",'why.4d':"A su lado antes, durante y después de la compra.",
  'rev.kicker':"Confían en nosotros",'rev.title':"Opiniones de clientes",
  'rev.sub':"Lo que nuestros clientes piensan de nosotros.",
  'rev.r1':"«Muy profesional, vehículo conforme al anuncio. Entrega rápida en Nantes. ¡Lo recomiendo!»",
  'rev.r2':"«Compra en línea sencilla y tranquilizadora, financiación obtenida en 24h. Gracias a todo el equipo.»",
  'rev.r3':"«GLC impecable, control completo entregado. Precio honesto. Concesionario serio.»",
  'rev.more':"Opiniones certificadas",
  'journal.kicker':"El diario",'journal.title':"Nuestros consejos auto",
  'journal.sub':"Guías de compra, híbrido vs eléctrico, mantenimiento: los consejos de nuestros expertos.",
  'journal.all':"Todos los artículos →",
  'cta.title':"¿Listo para encontrar su vehículo ideal?",
  'cta.sub':"Nuestro equipo está a su disposición. Respuesta en menos de 1h laborable.",
  'cta.imgalt':"Prueba de vehículo",
  'cat.kicker':"vehículos disponibles",
  'cat.title':"Nuestro catálogo",
  'filters.search':"Buscar un vehículo…",
  'filters.cat.all':"Todas las categorías",'filters.fuel.all':"Todos los carburantes",
  'filters.fuel.petrol':"Gasolina",'filters.fuel.diesel':"Diésel",'filters.fuel.hybrid':"Híbrido",'filters.fuel.electric':"Eléctrico",
  'filters.sort.rel':"Ordenar: relevancia",'filters.sort.asc':"Precio ascendente",'filters.sort.desc':"Precio descendente",
  'filters.sort.km':"Menor kilometraje",'filters.sort.year':"Más reciente",
  'filters.title':"Filtros",
  'filters.all':"Todas",
  'f.brand':"Marca",'f.model':"Modelo",
  'f.priceMin':"Precio mínimo",'f.priceMax':"Precio máximo",
  'f.yearMin':"Año mínimo",'f.yearMax':"Año máximo",
  'f.kmMax':"Kilometraje máximo",
  'f.fuel':"Carburante",'f.gear':"Caja de cambios",'f.body':"Tipo de carrocería",
  'f.allBrands':"Todas las marcas",'f.allModels':"Todos los modelos",
  'f.apply':"Aplicar filtros",
  'f.sortBy':"Ordenar por",'f.close':"Cerrar",
  'filters.reset':"Restablecer",
  'cat.count':"vehículo(s) disponible(s) en Divatte-sur-Loire",
  'cat.empty':"No se encontró ningún vehículo.",
  'cat.empty.cta':"Pregúntenos por WhatsApp",
  'cat.empty.end':", ¡le encontramos su modelo!",
  'card.details':"Detalles",'card.km.na':"Km a consultar",'card.contact':"Contactar",
  'v.back':"← Volver al catálogo",
  'v.available':"Disponible",'v.from':"o desde",'v.permonth':"€/mes",
  'v.fin':"Financiación de 6 a 84 meses · 30 % de anticipo al reservar",
  'v.viewing':"personas están viendo este vehículo",
  'v.year':"Año",'v.km':"Kilometraje",'v.fuel':"Carburante",'v.gear':"Caja de cambios",'v.power':"Potencia",'v.control':"Control",
  'v.year.na':"Año a consultar",'v.km.na':"Kilometraje a consultar",
  'v.call':"Llamar",'v.book':"Reservar",
  'v.tab1':"Vehículo",'v.tab2':"Control y calidad",'v.tab3':"Documentos",
  'v.tab4':"Entrega",'v.tab5':"Pago",'v.tab6':"Garantía",
  'v.hist1':"Historial verificado",'v.hist2':"Kilometraje certificado",'v.hist3':"Inspección técnica de menos de 6 meses",
  'v.steps.title':"Su pedido en 4 pasos",
  'v.s1t':"1. Presupuesto validado",'v.s1d':"Bloqueamos el vehículo para usted",
  'v.s2t':"2. Firma + anticipo",'v.s2d':"Electrónica, 30 % seguro",
  'v.s3t':"3. Preparación final",'v.s3d':"Control + limpieza profesional",
  'v.s4t':"4. Entrega en 3-5 días",'v.s4d':"Con número de seguimiento",
  'v.reco.kicker':"Continúe su visita",'v.reco.title':"También le gustará",
  'v.ctl.html':"<li>El <b>80 %</b> de nuestros vehículos procede de proveedores certificados en Europa</li><li>Hasta <b>250 puntos de control</b>: motor, seguridad, electrónica, chasis</li><li><b>Diagnóstico electrónico completo</b> sistemático</li><li>Preparación mecánica + carrocería + <b>limpieza profesional</b></li><li>Control final realizado <b>en su presencia</b> el día de la entrega</li><li>No conformidad grave: <b>cambio o reembolso inmediato</b></li>",
  'v.doc.html':"<li>Permiso de circulación francés + matrícula definitiva</li><li>Certificado oficial de no embargo</li><li>Inspección técnica válida (menos de 6 meses)</li><li>Libro de mantenimiento + historial verificado</li><li>Certificado de cesión</li><li>Certificado de kilometraje conforme</li>",
  'v.del.html':"<li>Recogida posible en <b>toda Europa</b></li><li>Plazo medio: <b>3 a 5 días laborables</b></li><li>Gastos fijos: <b>200 €</b> (transporte asegurado y seguro)</li><li>Número de seguimiento por email / SMS</li><li>Ordenador de a bordo configurado en <b>español</b> (o idioma elegido)</li>",
  'v.pay.html':"<li>Transferencia bancaria segura</li><li>Pago al contado o facilidades de pago</li><li><b>30 % de anticipo</b> para reservar este vehículo</li><li>Financiación de <b>6 a 84 meses</b> posible según perfil</li>",
  'v.war.html':"<li>Garantía legal: <b>12 meses mínimo</b></li><li>Ampliaciones posibles hasta <b>36 meses</b></li><li>Red de talleres asociados cerca de su domicilio</li><li>Plazo de desistimiento: <b>15 días</b></li><li>Reembolso íntegro por vicio no declarado</li>",
  'c.title':"Contáctenos",
  'c.sub':"¿Una pregunta? Le ayudamos a encontrar el vehículo perfecto. Respuesta en menos de 1h laborable.",
  'form.name':"Nombre",'form.name.ph':"Su nombre",'form.tel':"Teléfono",
  'form.subject':"Asunto",'form.msg':"Mensaje",'form.msg.ph':"Hola, estoy buscando...",
  'form.send':"Enviar por WhatsApp",
  'form.ok':"Mensaje listo en WhatsApp, le respondemos rápido.",
  'subj.1':"Comprar un vehículo",'subj.2':"Financiación",'subj.3':"Entrega",'subj.4':"Otro",
  'info.title':"Contactos directos",'cta.call2':"Llamar",'cta.mail':"Email",
  'a.title':"¿Quiénes somos?",
  'a.text':"LeBonAuto, su socio para comprar vehículos en línea de forma simple y fiable. Amplia gama para todas sus necesidades, financiación flexible y una experiencia de compra agradable y sin complicaciones.",
  'a.s1t':"Venta en línea",'a.s1d':"Compre desde casa en unos clics.",
  'a.s2t':"Entrega con seguimiento",'a.s2d':"En toda Europa en 3 a 5 días, 200 € fijos.",
  'a.s3t':"Atención al cliente",'a.s3d':"Acompañamiento en cada etapa.",
  'a.s4t':"Garantía",'a.s4d':"12 meses mínimo, ampliable a 36 meses.",
  'a.place':"Nuestra dirección",
  'about.img1':"Porsche Macan en venta en el concesionario",'about.img2':"Audi A3 en venta en el concesionario",'about.img3':"BMW X1 en venta en el concesionario",
  'f.kicker':"Se lo contamos todo",'f.title':"Preguntas frecuentes",
  'f.sub':"Compra, garantía, entrega, financiación: las respuestas claras del equipo LeBonAuto.",
  'f.cta.kicker':"¿Otra pregunta?",'f.cta.title':"Hablemos de su proyecto",
  'f.cta.sub':"Respuesta en menos de 1h laborable, sin compromiso.",
  'b.kicker':"El diario",'b.title':"Blog: consejos y novedades",
  'b.sub':"Guías de compra, comparativas y mantenimiento, por el equipo de LeBonAuto.",
  'b.read':"Leer el artículo →",'b.read2':"Leer →",
  'b.all':"← Todos los artículos",'b.others':"Otros artículos",
  'b.cta.title':"¿Una pregunta sobre su futuro vehículo?",
  'b.cta.sub':"Llámenos o escríbanos por WhatsApp, respuesta en menos de 1h laborable.",
  'wa.msg':"Hola LeBonAuto, estoy interesado en",
  'wa.msg.end':"¿Sigue disponible?"
},
pt: {
  'topbar.deals':"Descontos exclusivos",
  'topbar.financing':"Financiamento desde 139 €/mês",
  'topbar.online':"visitantes online",
  'nav.home':"Início",'nav.catalogue':"Catálogo",'nav.about':"Sobre nós",'nav.contact':"Contacto",'nav.blog':"Blog",'nav.faq':"FAQ",
  'nav.cta.cars':"Ver os nossos veículos",'nav.cta.contact':"Contacte-nos",
  'footer.desc':"O seu destino de confiança para veículos premium de qualidade. Mais de 6 anos de experiência.",
  'footer.nav':"Navegação",'footer.hours':"Horários",'footer.contact':"Contacto rápido",'footer.services':"Serviços",
  'footer.h1':"Seg – Sex: 9h – 18h",'footer.h2':"Sáb: mediante marcação",'footer.h3':"Dom: encerrado",
  'footer.quote':"Pedir orçamento",'footer.rights':"Todos os direitos reservados.",
  'footer.cgu':"Condições gerais",'footer.legal':"Aviso legal",
  'footer.brand':"LEBONAUTO",
  'ser.fin':"Financiamento 6-84 meses",'ser.war':"Garantia 12 meses mín.",'ser.del':"Entrega 3-5 dias",'ser.ctl':"Inspeção de 250 pontos",
  'devis':"Orçamento",'contact.us':"Contacte-nos",
  'meta.title.index':"LeBonAuto — Venda de automóveis em Divatte-sur-Loire | Usados fiáveis",
  'meta.title.catalogue':"Catálogo de usados | LeBonAuto Divatte-sur-Loire",
  'meta.title.about':"Sobre nós | LeBonAuto Divatte-sur-Loire",
  'meta.title.contact':"Contacto | LeBonAuto Divatte-sur-Loire",
  'meta.title.faq':"FAQ: compra, garantia, entrega, financiamento | LeBonAuto",
  'meta.title.blog':"Blog auto: dicas de compra, híbrido, manutenção | LeBonAuto",
  'hero.eyebrow':"visitantes estão a ver as nossas ofertas",
  'hero.title':"LeBonAuto<br>Venda de automóveis em Divatte-sur-Loire",
  'hero.lead':"Encontre o seu próximo carro facilmente no seu stand de confiança. Veículos inspecionados, histórico verificado, garantia e transparência.",
  'hero.cta.cars':"Ver os nossos veículos →",
  'hero.cta.now':"Ligar agora",
  'trust.t1':"opiniões de clientes",'trust.t2':"Garantia de 12 meses",'trust.t2b':"mínimo",
  'trust.t3':"Entrega",'trust.t3b':"em toda a Europa",
  'trust.t4':"de experiência",
  'stats.s1':"veículos vendidos / ano",'stats.s2':"satisfação do cliente",'stats.s3':"de experiência",'stats.s4':"entrega acompanhada",
  'universe.kicker':"O nosso universo",'universe.title':"As nossas categorias",
  'universe.sub':"Escolha entre a nossa seleção variada, adaptada a cada estilo de condução.",
  'cat.b1.badge':"Berlina",'cat.b1.title':"Berlina e carrinhas premium",
  'cat.b1.desc':"Audi, BMW, Mercedes: conforto e elegância.",
  'cat.b2.badge':"SUV",'cat.b2.title':"Robustos e familiares",
  'cat.b2.desc':"X1, Q3, Tiguan, RAV 4, Macan e mais.",
  'cat.b3.badge':"Grandes volumes",'cat.b3.title':"Monovolumes e autocaravana",
  'cat.b3.desc':"Classe V de 8 lugares, autocaravana Etrusco.",
  'cat.discover':"Descobrir",
  'fav.kicker':"Seleção do momento",'fav.title':"Os nossos favoritos",
  'fav.sub':"Uma seleção de veículos excecionais, prontos para a estrada.",
  'fav.all':"Ver todos os carros →",
  'why.kicker':"Os nossos compromissos",'why.title':"Porquê escolher-nos?",
  'why.sub':"Qualidade, transparência e proximidade.",
  'why.1t':"Inspeção de 250 pontos",'why.1d':"Motor, segurança, eletrónica, chassis + diagnóstico completo.",
  'why.2t':"Financiamento flexível",'why.2d':"De 6 a 84 meses, 30% de entrada na reserva.",
  'why.3t':"Entrega acompanhada",'why.3d':"Em toda a Europa em 3-5 dias, 200 € taxa fixa.",
  'why.4t':"Apoio ao cliente",'why.4d':"Ao seu lado antes, durante e após a compra.",
  'rev.kicker':"Confiam em nós",'rev.title':"Opiniões de clientes",
  'rev.sub':"O que os nossos clientes pensam de nós.",
  'rev.r1':"«Muito profissional, veículo conforme o anúncio. Entrega rápida em Nantes. Recomendo!»",
  'rev.r2':"«Compra online simples e tranquilizadora, financiamento obtido em 24h. Obrigado a toda a equipa.»",
  'rev.r3':"«GLC impecável, inspeção completa fornecida. Preço honesto. Stand sério.»",
  'rev.more':"Opiniões certificadas",
  'journal.kicker':"O jornal",'journal.title':"As nossas dicas auto",
  'journal.sub':"Guias de compra, híbrido vs elétrico, manutenção: as dicas dos nossos especialistas.",
  'journal.all':"Todos os artigos →",
  'cta.title':"Pronto para encontrar o seu veículo ideal?",
  'cta.sub':"A nossa equipa está à sua disposição. Resposta em menos de 1h útil.",
  'cta.imgalt':"Ensaio de veículo",
  'cat.kicker':"veículos disponíveis",
  'cat.title':"O nosso catálogo",
  'filters.search':"Pesquisar um veículo…",
  'filters.cat.all':"Todas as categorias",'filters.fuel.all':"Todos os combustíveis",
  'filters.fuel.petrol':"Gasolina",'filters.fuel.diesel':"Diesel",'filters.fuel.hybrid':"Híbrido",'filters.fuel.electric':"Elétrico",
  'filters.sort.rel':"Ordenar: relevância",'filters.sort.asc':"Preço crescente",'filters.sort.desc':"Preço decrescente",
  'filters.sort.km':"Menor quilometragem",'filters.sort.year':"Mais recente",
  'filters.title':"Filtros",
  'filters.all':"Todas",
  'f.brand':"Marca",'f.model':"Modelo",
  'f.priceMin':"Preço mínimo",'f.priceMax':"Preço máximo",
  'f.yearMin':"Ano mínimo",'f.yearMax':"Ano máximo",
  'f.kmMax':"Quilometragem máxima",
  'f.fuel':"Combustível",'f.gear':"Caixa de velocidades",'f.body':"Tipo de carroçaria",
  'f.allBrands':"Todas as marcas",'f.allModels':"Todos os modelos",
  'f.apply':"Aplicar filtros",
  'f.sortBy':"Ordenar por",'f.close':"Fechar",
  'filters.reset':"Repor",
  'cat.count':"veículo(s) disponível(eis) em Divatte-sur-Loire",
  'cat.empty':"Nenhum veículo encontrado.",
  'cat.empty.cta':"Pergunte-nos no WhatsApp",
  'cat.empty.end':", encontramos o seu modelo!",
  'card.details':"Detalhes",'card.km.na':"Km sob consulta",'card.contact':"Contactar",
  'v.back':"← Voltar ao catálogo",
  'v.available':"Disponível",'v.from':"ou desde",'v.permonth':"€/mês",
  'v.fin':"Financiamento de 6 a 84 meses · 30% de entrada na reserva",
  'v.viewing':"pessoas estão a ver este veículo",
  'v.year':"Ano",'v.km':"Quilometragem",'v.fuel':"Combustível",'v.gear':"Caixa",'v.power':"Potência",'v.control':"Inspeção",
  'v.year.na':"Ano sob consulta",'v.km.na':"Quilometragem sob consulta",
  'v.call':"Ligar",'v.book':"Reservar",
  'v.tab1':"Veículo",'v.tab2':"Inspeção e qualidade",'v.tab3':"Documentos",
  'v.tab4':"Entrega",'v.tab5':"Pagamento",'v.tab6':"Garantia",
  'v.hist1':"Histórico verificado",'v.hist2':"Quilometragem certificada",'v.hist3':"Inspeção técnica com menos de 6 meses",
  'v.steps.title':"O seu pedido em 4 passos",
  'v.s1t':"1. Orçamento validado",'v.s1d':"Bloqueamos o veículo para si",
  'v.s2t':"2. Assinatura + entrada",'v.s2d':"Eletrónica, 30% seguro",
  'v.s3t':"3. Preparação final",'v.s3d':"Inspeção + limpeza profissional",
  'v.s4t':"4. Entrega em 3-5 dias",'v.s4d':"Com número de seguimento",
  'v.reco.kicker':"Continue a sua visita",'v.reco.title':"Também vai gostar",
  'v.ctl.html':"<li><b>80%</b> dos nossos veículos vêm de fornecedores certificados na Europa</li><li>Até <b>250 pontos de inspeção</b>: motor, segurança, eletrónica, chassis</li><li><b>Diagnóstico eletrónico completo</b> sistemático</li><li>Preparação mecânica + carroçaria + <b>limpeza profissional</b></li><li>Inspeção final feita <b>na sua presença</b> no dia da entrega</li><li>Não conformidade grave: <b>troca ou reembolso imediato</b></li>",
  'v.doc.html':"<li>Documento francês + matrícula definitiva</li><li>Certificado oficial de ausência de encargos</li><li>Inspeção técnica válida (menos de 6 meses)</li><li>Livro de revisões + histórico verificado</li><li>Certificado de transmissão</li><li>Certificado de quilometragem conforme</li>",
  'v.del.html':"<li>Recolha possível em <b>toda a Europa</b></li><li>Prazo médio: <b>3 a 5 dias úteis</b></li><li>Taxa fixa: <b>200 €</b> (transporte assegurado e seguro)</li><li>Número de seguimento por email / SMS</li><li>Computador de bordo configurado em <b>português</b> (ou idioma à escolha)</li>",
  'v.pay.html':"<li>Transferência bancária segura</li><li>Pagamento a pronto ou facilidades</li><li><b>30% de entrada</b> para reservar este veículo</li><li>Financiamento de <b>6 a 84 meses</b> possível conforme perfil</li>",
  'v.war.html':"<li>Garantia legal: <b>12 meses mínimo</b></li><li>Extensões possíveis até <b>36 meses</b></li><li>Rede de oficinas parceiras perto da sua casa</li><li>Prazo de desistência: <b>15 dias</b></li><li>Reembolso integral por defeito não declarado</li>",
  'c.title':"Contacte-nos",
  'c.sub':"Uma pergunta? Ajudamos a encontrar o veículo perfeito. Resposta em menos de 1h útil.",
  'form.name':"Nome",'form.name.ph':"O seu nome",'form.tel':"Telefone",
  'form.subject':"Assunto",'form.msg':"Mensagem",'form.msg.ph':"Olá, estou à procura de...",
  'form.send':"Enviar via WhatsApp",
  'form.ok':"Mensagem pronta no WhatsApp, respondemos rápido.",
  'subj.1':"Comprar um veículo",'subj.2':"Financiamento",'subj.3':"Entrega",'subj.4':"Outro",
  'info.title':"Contactos diretos",'cta.call2':"Ligar",'cta.mail':"Email",
  'a.title':"Quem somos?",
  'a.text':"LeBonAuto, o seu parceiro para comprar veículos online de forma simples e fiável. Vasta gama para todas as necessidades, financiamento flexível e uma experiência de compra agradável e sem complicações.",
  'a.s1t':"Venda online",'a.s1d':"Compre a partir de casa em poucos cliques.",
  'a.s2t':"Entrega acompanhada",'a.s2d':"Em toda a Europa em 3 a 5 dias, 200 € fixos.",
  'a.s3t':"Apoio ao cliente",'a.s3d':"Acompanhamento em cada etapa.",
  'a.s4t':"Garantia",'a.s4d':"12 meses mínimo, extensível a 36 meses.",
  'a.place':"A nossa morada",
  'about.img1':"Porsche Macan à venda no stand",'about.img2':"Audi A3 à venda no stand",'about.img3':"BMW X1 à venda no stand",
  'f.kicker':"Contamos-lhe tudo",'f.title':"Perguntas frequentes",
  'f.sub':"Compra, garantia, entrega, financiamento: as respostas claras da equipa LeBonAuto.",
  'f.cta.kicker':"Ainda tem uma pergunta?",'f.cta.title':"Falemos do seu projeto",
  'f.cta.sub':"Resposta em menos de 1h útil, sem compromisso.",
  'b.kicker':"O jornal",'b.title':"Blog: dicas e novidades",
  'b.sub':"Guias de compra, comparativos e manutenção, pela equipa LeBonAuto.",
  'b.read':"Ler o artigo →",'b.read2':"Ler →",
  'b.all':"← Todos os artigos",'b.others':"Outros artigos",
  'b.cta.title':"Uma pergunta sobre o seu futuro veículo?",
  'b.cta.sub':"Ligue-nos ou escreva no WhatsApp, resposta em menos de 1h útil.",
  'wa.msg':"Olá LeBonAuto, estou interessado em",
  'wa.msg.end':"Ainda está disponível?"
}
,
de: {
  'topbar.deals':"Exklusive Angebote",
  'topbar.financing':"Finanzierung ab 139 €/Monat",
  'topbar.online':"Besucher online",
  'nav.home':"Startseite",'nav.catalogue':"Katalog",'nav.about':"Über uns",'nav.contact':"Kontakt",'nav.blog':"Blog",'nav.faq':"FAQ",
  'nav.cta.cars':"Unsere Fahrzeuge ansehen",'nav.cta.contact':"Kontaktieren Sie uns",
  'footer.desc':"Ihr vertrauenswürdiger Partner für hochwertige Premium-Fahrzeuge. Über 6 Jahre Erfahrung.",
  'footer.nav':"Navigation",'footer.hours':"Öffnungszeiten",'footer.contact':"Schnellkontakt",'footer.services':"Leistungen",
  'footer.h1':"Mo – Fr: 9 – 18 Uhr",'footer.h2':"Sa: nach Vereinbarung",'footer.h3':"So: geschlossen",
  'footer.quote':"Angebot anfordern",'footer.rights':"Alle Rechte vorbehalten.",
  'footer.cgu':"AGB",'footer.legal':"Impressum",
  'footer.brand':"LEBONAUTO",
  'ser.fin':"Finanzierung 6–84 Monate",'ser.war':"12 Monate Garantie min.",'ser.del':"Lieferung 3–5 Tage",'ser.ctl':"250-Punkte-Prüfung",
  'devis':"Kostenvoranschlag",'contact.us':"Kontaktieren Sie uns",
  'meta.title.index':"LeBonAuto — Autohändler in Divatte-sur-Loire | Zuverlässige Gebrauchtwagen",
  'meta.title.catalogue':"Gebrauchtwagen-Katalog | LeBonAuto Divatte-sur-Loire",
  'meta.title.about':"Über uns | LeBonAuto Divatte-sur-Loire",
  'meta.title.contact':"Kontakt | LeBonAuto Divatte-sur-Loire",
  'meta.title.faq':"FAQ: Kauf, Garantie, Lieferung, Finanzierung | LeBonAuto",
  'meta.title.blog':"Auto-Blog: Kauftipps, Hybrid, Wartung | LeBonAuto",
  'hero.eyebrow':"Besucher sehen sich unsere Angebote an",
  'hero.title':"LeBonAuto<br>Autoverkauf in Divatte-sur-Loire",
  'hero.lead':"Finden Sie Ihr nächstes Auto ganz einfach bei Ihrem vertrauenswürdigen Händler. Geprüfte Fahrzeuge, verifizierte Historie, Garantie und Transparenz.",
  'hero.cta.cars':"Unsere Fahrzeuge ansehen →",
  'hero.cta.now':"Jetzt anrufen",
  'trust.t1':"Kundenbewertungen",'trust.t2':"12 Monate Garantie",'trust.t2b':"mindestens",
  'trust.t3':"Lieferung",'trust.t3b':"in ganz Europa",
  'trust.t4':"Erfahrung",
  'stats.s1':"verkaufte Fahrzeuge / Jahr",'stats.s2':"Kundenzufriedenheit",'stats.s3':"Erfahrung",'stats.s4':"verfolgte Lieferung",
  'universe.kicker':"Unsere Welt",'universe.title':"Unsere Kategorien",
  'universe.sub':"Wählen Sie aus unserer vielfältigen Auswahl, passend zu jedem Fahrstil.",
  'cat.b1.badge':"Limousinen",'cat.b1.title':"Premium-Limousinen & Kombis",
  'cat.b1.desc':"Audi, BMW, Mercedes: Komfort und Eleganz.",
  'cat.b2.badge':"SUV",'cat.b2.title':"Robust & familienfreundlich",
  'cat.b2.desc':"X1, Q3, Tiguan, RAV 4, Macan und mehr.",
  'cat.b3.badge':"Großvolumen",'cat.b3.title':"Vans & Wohnmobil",
  'cat.b3.desc':"Classe V mit 8 Plätzen, Etrusco-Wohnmobil.",
  'cat.discover':"Entdecken",
  'fav.kicker':"Aktuelle Auswahl",'fav.title':"Unsere Favoriten",
  'fav.sub':"Eine Auswahl außergewöhnlicher Fahrzeuge, bereit für die Straße.",
  'fav.all':"Alle Autos ansehen →",
  'why.kicker':"Unsere Versprechen",'why.title':"Warum uns wählen?",
  'why.sub':"Qualität, Transparenz und Nähe.",
  'why.1t':"250-Punkte-Prüfung",'why.1d':"Motor, Sicherheit, Elektronik, Fahrwerk + komplette Diagnose.",
  'why.2t':"Flexible Finanzierung",'why.2d':"Von 6 bis 84 Monaten, 30 % Anzahlung bei Reservierung.",
  'why.3t':"Verfolgte Lieferung",'why.3d':"In ganz Europa in 3–5 Tagen, 200 € Pauschale.",
  'why.4t':"Kundenservice",'why.4d':"Für Sie da – vor, während und nach Ihrem Kauf.",
  'rev.kicker':"Sie vertrauen uns",'rev.title':"Kundenbewertungen",
  'rev.sub':"Was unsere Kunden über uns sagen.",
  'rev.r1':"«Sehr professionell, Fahrzeug entspricht der Anzeige. Schnelle Lieferung nach Nantes. Ich empfehle!»",
  'rev.r2':"«Einfacher und beruhigender Online-Kauf, Finanzierung in 24h erhalten. Danke an das ganze Team.»",
  'rev.r3':"«Makelloser GLC, komplette Prüfung vorgelegt. Ehrlicher Preis. Seriöses Autohaus.»",
  'rev.more':"Mehr Bewertungen →",
  'journal.kicker':"Das Journal",'journal.title':"Unsere Auto-Tipps",
  'journal.sub':"Kaufberatung, Hybrid vs. Elektro, Wartung: die Tipps unserer Experten.",
  'journal.all':"Alle Artikel →",
  'cta.title':"Bereit, Ihr ideales Fahrzeug zu finden?",
  'cta.sub':"Unser Team steht Ihnen zur Verfügung. Antwort in unter 1 Arbeitsstunde.",
  'cta.imgalt':"Probefahrt",
  'cat.kicker':"verfügbare Fahrzeuge",
  'cat.title':"Unser Katalog",
  'filters.search':"Fahrzeug suchen…",
  'filters.cat.all':"Alle Kategorien",'filters.fuel.all':"Alle Kraftstoffe",
  'filters.fuel.petrol':"Benzin",'filters.fuel.diesel':"Diesel",'filters.fuel.hybrid':"Hybrid",'filters.fuel.electric':"Elektro",
  'filters.sort.rel':"Sortieren: Relevanz",'filters.sort.asc':"Preis aufsteigend",'filters.sort.desc':"Preis absteigend",
  'filters.sort.km':"Geringste Laufleistung",'filters.sort.year':"Neueste",
  'filters.reset':"Zurücksetzen",
  'filters.title':"Filter",
  'filters.all':"Alle",
  'f.brand':"Marke",'f.model':"Modell",
  'f.priceMin':"Mindestpreis",'f.priceMax':"Höchstpreis",
  'f.yearMin':"Mindestjahr",'f.yearMax':"Höchstjahr",
  'f.kmMax':"Max. Laufleistung",
  'f.fuel':"Kraftstoff",'f.gear':"Getriebe",'f.body':"Karosserieform",
  'f.allBrands':"Alle Marken",'f.allModels':"Alle Modelle",
  'f.apply':"Filter anwenden",
  'f.sortBy':"Sortieren",'f.close':"Schließen",
  'cat.count':"Fahrzeug(e) verfügbar in Divatte-sur-Loire",
  'cat.empty':"Keine Fahrzeuge gefunden.",
  'cat.empty.cta':"Fragen Sie uns auf WhatsApp",
  'cat.empty.end':", wir finden Ihr Modell!",
  'card.details':"Details",'card.km.na':"Km auf Anfrage",'card.contact':"Kontaktieren",
  'v.back':"← Zurück zum Katalog",
  'v.available':"Verfügbar",'v.from':"oder ab",'v.permonth':"€/Monat",
  'v.fin':"Finanzierung 6 bis 84 Monate · 30 % Anzahlung bei Reservierung",
  'v.viewing':"Personen sehen sich dieses Fahrzeug an",
  'v.year':"Jahr",'v.km':"Kilometerstand",'v.fuel':"Kraftstoff",'v.gear':"Getriebe",'v.power':"Leistung",'v.control':"Prüfung",
  'v.year.na':"Jahr auf Anfrage",'v.km.na':"Kilometerstand auf Anfrage",
  'v.call':"Anrufen",'v.book':"Reservieren",
  'v.tab1':"Fahrzeug",'v.tab2':"Prüfung & Qualität",'v.tab3':"Dokumente",
  'v.tab4':"Lieferung",'v.tab5':"Zahlung",'v.tab6':"Garantie",
  'v.hist1':"Geprüfte Historie",'v.hist2':"Zertifizierter Kilometerstand",'v.hist3':"HU-Bericht jünger als 6 Monate",
  'v.steps.title':"Ihre Bestellung in 4 Schritten",
  'v.s1t':"1. Angebot bestätigt",'v.s1d':"Wir halten das Auto für Sie bereit",
  'v.s2t':"2. Unterschrift + Anzahlung",'v.s2d':"Elektronisch, 30 % gesichert",
  'v.s3t':"3. Endaufbereitung",'v.s3d':"Prüfung + Profi-Reinigung",
  'v.s4t':"4. Übergabe in 3–5 Tagen",'v.s4d':"Mit Sendungsnummer",
  'v.reco.kicker':"Stöbern Sie weiter",'v.reco.title':"Das könnte Ihnen gefallen",
  'v.ctl.html':"<li><b>80 %</b> unserer Fahrzeuge stammen von zertifizierten Lieferanten in Europa</li><li>Bis zu <b>250 Prüfpunkte</b>: Motor, Sicherheit, Elektronik, Fahrwerk</li><li><b>Komplette elektronische Diagnose</b>, systematisch durchgeführt</li><li>Mechanische + Karosserie-Aufbereitung + <b>professionelle Reinigung</b></li><li>Endkontrolle <b>in Ihrer Anwesenheit</b> am Tag der Übergabe</li><li>Erhebliche Abweichung: <b>sofortiger Umtausch oder Rückerstattung</b></li>",
  'v.doc.html':"<li>Französische Zulassung + endgültiges Kennzeichen</li><li>Offizielle Unbedenklichkeitsbescheinigung</li><li>Gültige Hauptuntersuchung (jünger als 6 Monate)</li><li>Scheckheft + verifizierte Historie</li><li>Kaufvertrag</li><li>Konforme Kilometerstandsbescheinigung</li>",
  'v.del.html':"<li>Abholung in <b>ganz Europa</b> möglich</li><li>Durchschnittlich: <b>3 bis 5 Werktage</b></li><li>Pauschale: <b>200 €</b> (versicherter, sicherer Transport)</li><li>Sendungsnummer per E-Mail / SMS</li><li>Bordcomputer auf <b>Deutsch</b> eingestellt (oder Wunschsprache)</li>",
  'v.pay.html':"<li>Sichere Banküberweisung</li><li>Barzahlung oder Zahlungsplan</li><li><b>30 % Anzahlung</b> zur Reservierung dieses Fahrzeugs erforderlich</li><li><b>6 bis 84 Monate</b> Finanzierung je nach Profil möglich</li>",
  'v.war.html':"<li>Gesetzliche Garantie: <b>mindestens 12 Monate</b></li><li>Verlängerungen bis <b>36 Monate</b> möglich</li><li>Netzwerk von Partnerwerkstätten in Ihrer Nähe</li><li>Widerrufsfrist: <b>15 Tage</b></li><li>Volle Rückerstattung bei nicht genanntem Mangel</li>",
  'c.title':"Kontaktieren Sie uns",
  'c.sub':"Eine Frage? Wir helfen Ihnen, das perfekte Auto zu finden. Antwort in unter 1 Arbeitsstunde.",
  'form.name':"Name",'form.name.ph':"Ihr Name",'form.tel':"Telefon",
  'form.subject':"Betreff",'form.msg':"Nachricht",'form.msg.ph':"Hallo, ich suche...",
  'form.send':"Per WhatsApp senden",
  'form.ok':"Nachricht in WhatsApp bereit, wir antworten schnell.",
  'subj.1':"Auto kaufen",'subj.2':"Finanzierung",'subj.3':"Lieferung",'subj.4':"Sonstiges",
  'info.title':"Direktkontakt",'cta.call2':"Anrufen",'cta.mail':"E-Mail",
  'a.title':"Wer sind wir?",
  'a.text':"LeBonAuto, Ihr Partner für einfachen und zuverlässigen Online-Autokauf. Breite Auswahl für jeden Bedarf, flexible Finanzierung und ein angenehmes Kauf-Erlebnis ohne Komplikationen.",
  'a.s1t':"Online-Verkauf",'a.s1d':"Kaufen Sie von zu Hause in wenigen Klicks.",
  'a.s2t':"Verfolgte Lieferung",'a.s2d':"In ganz Europa in 3 bis 5 Tagen, 200 € pauschal.",
  'a.s3t':"Kundenservice",'a.s3d':"Begleitung in jeder Phase.",
  'a.s4t':"Garantie",'a.s4d':"12 Monate mindestens, erweiterbar auf 36 Monate.",
  'a.place':"Unser Standort",
  'about.img1':"Porsche Macan zu verkaufen beim Autohaus",'about.img2':"Audi A3 zu verkaufen beim Autohaus",'about.img3':"BMW X1 zu verkaufen beim Autohaus",
  'f.kicker':"Wir sagen Ihnen alles",'f.title':"Häufige Fragen",
  'f.sub':"Kauf, Garantie, Lieferung, Finanzierung: die klaren Antworten des Teams von LeBonAuto.",
  'f.cta.kicker':"Noch eine Frage?",'f.cta.title':"Sprechen wir über Ihr Projekt",
  'f.cta.sub':"Antwort in unter 1 Arbeitsstunde, unverbindlich.",
  'b.kicker':"Das Journal",'b.title':"Blog: Tipps & Neuheiten",
  'b.sub':"Kaufberatung, Vergleiche und Wartung vom Team von LeBonAuto.",
  'b.read':"Artikel lesen →",'b.read2':"Lesen →",
  'b.all':"← Alle Artikel",'b.others':"Weitere Artikel",
  'b.cta.title':"Eine Frage zu Ihrem zukünftigen Auto?",
  'b.cta.sub':"Rufen Sie uns an oder schreiben Sie uns auf WhatsApp, Antwort in unter 1 Arbeitsstunde.",
  'wa.msg':"Hallo LeBonAuto, ich interessiere mich für",
  'wa.msg.end':"Ist es noch verfügbar?"
}
};

// FAQ + blog : traductions de contenu (titres/résumés ; paragraphes détaillés restent en FR en attendant)
var FAQ_I18N = {
en: {
 q1:"How do I reserve a vehicle?", a1:"Approve the quote, sign electronically and pay a secure <b>30%</b> deposit. The vehicle is then held for you and final preparation begins.",
 q2:"Are the vehicles really inspected?", a2:"Yes: up to <b>250 inspection points</b> (engine, safety, electronics, chassis), systematic electronic diagnostics and mechanical + bodywork preparation + professional detailing. 80% of our vehicles come from certified suppliers in Europe.",
 q3:"Which documents are provided?", a3:"French registration + final plate, official non-pledge certificate, technical inspection less than 6 months old, service book + verified history, transfer certificate and compliant mileage certificate.",
 q4:"What warranty do I get?", a4:"Legal warranty of <b>12 months minimum</b>, with extensions up to <b>36 months</b> and a network of partner garages near your home.",
 q5:"Do you deliver near me?", a5:"Anywhere in <b>Europe</b> within <b>3 to 5 business days</b>, for a €200 flat fee (insured, secure transport), with a tracking number by email and SMS.",
 q6:"Can I finance my purchase?", a6:"Yes: secure transfer, cash payment or payment plan, and <b>financing from 6 to 84 months</b> depending on your profile.",
 q7:"What if the vehicle is not as described?", a7:"The final inspection takes place <b>in your presence</b> on handover day. Major non-conformity: <b>immediate exchange or refund</b>. You also have a 15-day withdrawal period and a full refund for any undisclosed defect.",
 q8:"How can I contact you?", a8:"By phone or WhatsApp on <b>06 52 24 22 78</b>, by email at contact@lebonauto.fr, or at 8 Rue de l'industrie, 44450 Divatte-sur-Loire (Mon–Fri 9am–6pm). Reply in under one business hour."
},
es: {
 q1:"¿Cómo reservo un vehículo?", a1:"Valide el presupuesto, firme electrónicamente y abone un anticipo seguro del <b>30 %</b>. El vehículo queda bloqueado para usted y comienza la preparación final.",
 q2:"¿Los vehículos están realmente revisados?", a2:"Sí: hasta <b>250 puntos de control</b> (motor, seguridad, electrónica, chasis), diagnóstico electrónico sistemático y preparación mecánica + carrocería + limpieza profesional. El 80 % de nuestros vehículos procede de proveedores certificados en Europa.",
 q3:"¿Qué documentos se entregan?", a3:"Permiso de circulación francés + matrícula definitiva, certificado oficial de no embargo, inspección técnica de menos de 6 meses, libro de mantenimiento + historial verificado, certificado de cesión y certificado de kilometraje conforme.",
 q4:"¿Qué garantía tengo?", a4:"Garantía legal de <b>12 meses mínimo</b>, ampliable hasta <b>36 meses</b>, con una red de talleres asociados cerca de su domicilio.",
 q5:"¿Entregan cerca de mi domicilio?", a5:"En toda <b>Europa</b> en <b>3 a 5 días laborables</b>, por 200 € gastos fijos (transporte asegurado y seguro), con número de seguimiento por email y SMS.",
 q6:"¿Puedo financiar mi compra?", a6:"Sí: transferencia segura, pago al contado o facilidades de pago, y <b>financiación de 6 a 84 meses</b> según su perfil.",
 q7:"¿Y si el vehículo no es conforme?", a7:"El control final se realiza <b>en su presencia</b> el día de la entrega. No conformidad grave: <b>cambio o reembolso inmediato</b>. También dispone de 15 días de desistimiento y reembolso íntegro por vicio no declarado.",
 q8:"¿Cómo puedo contactarles?", a8:"Por teléfono o WhatsApp al <b>06 52 24 22 78</b>, por email a contact@lebonauto.fr, o en 8 Rue de l'industrie, 44450 Divatte-sur-Loire (lun–vie 9h–18h). Respuesta en menos de una hora laborable."
},
pt: {
 q1:"Como reservo um veículo?", a1:"Valide o orçamento, assine eletronicamente e pague uma entrada segura de <b>30%</b>. O veículo fica bloqueado para si e começa a preparação final.",
 q2:"Os veículos são mesmo inspecionados?", a2:"Sim: até <b>250 pontos de inspeção</b> (motor, segurança, eletrónica, chassis), diagnóstico eletrónico sistemático e preparação mecânica + carroçaria + limpeza profissional. 80% dos nossos veículos vêm de fornecedores certificados na Europa.",
 q3:"Que documentos são fornecidos?", a3:"Documento francês + matrícula definitiva, certificado oficial de ausência de encargos, inspeção técnica com menos de 6 meses, livro de revisões + histórico verificado, certificado de transmissão e certificado de quilometragem conforme.",
 q4:"Que garantia tenho?", a4:"Garantia legal de <b>12 meses mínimo</b>, extensível até <b>36 meses</b>, com rede de oficinas parceiras perto da sua casa.",
 q5:"Entregam perto de mim?", a5:"Em toda a <b>Europa</b> em <b>3 a 5 dias úteis</b>, por 200 € taxa fixa (transporte assegurado e seguro), com número de seguimento por email e SMS.",
 q6:"Posso financiar a minha compra?", a6:"Sim: transferência segura, pagamento a pronto ou facilidades, e <b>financiamento de 6 a 84 meses</b> conforme o seu perfil.",
 q7:"E se o veículo não estiver conforme?", a7:"A inspeção final é feita <b>na sua presença</b> no dia da entrega. Não conformidade grave: <b>troca ou reembolso imediato</b>. Tem ainda 15 dias para desistir e reembolso integral por defeito não declarado.",
 q8:"Como posso contactar-vos?", a8:"Por telefone ou WhatsApp: <b>06 52 24 22 78</b>, por email: contact@lebonauto.fr, ou em 8 Rue de l'industrie, 44450 Divatte-sur-Loire (seg–sex 9h–18h). Resposta em menos de uma hora útil."
}
,
de: {
 q1:"Wie reserviere ich ein Fahrzeug?", a1:"Bestätigen Sie das Angebot, unterschreiben Sie elektronisch und zahlen Sie <b>30 %</b> Anzahlung. Das Fahrzeug wird dann für Sie reserviert und die Endaufbereitung beginnt.",
 q2:"Werden die Fahrzeuge wirklich geprüft?", a2:"Ja: bis zu <b>250 Prüfpunkte</b> (Motor, Sicherheit, Elektronik, Fahrwerk), systematische elektronische Diagnose sowie mechanische + Karosserie-Aufbereitung + professionelle Reinigung. 80 % unserer Fahrzeuge stammen von zertifizierten Lieferanten in Europa.",
 q3:"Welche Dokumente werden mitgeliefert?", a3:"Französische Zulassung + endgültiges Kennzeichen, offizielle Unbedenklichkeitsbescheinigung, Hauptuntersuchung jünger als 6 Monate, Scheckheft + verifizierte Historie, Kaufvertrag und konforme Kilometerstandsbescheinigung.",
 q4:"Welche Garantie habe ich?", a4:"Gesetzliche Garantie von <b>mindestens 12 Monaten</b>, erweiterbar bis <b>36 Monate</b>, mit einem Netzwerk von Partnerwerkstätten in Ihrer Nähe.",
 q5:"Liefern Sie auch zu mir?", a5:"In ganz <b>Europa</b> in <b>3 bis 5 Werktagen</b>, für 200 € pauschal (versicherter, sicherer Transport), mit Sendungsnummer per E-Mail und SMS.",
 q6:"Kann ich meinen Kauf finanzieren?", a6:"Ja: sichere Überweisung, Barzahlung oder Zahlungsplan sowie <b>Finanzierung von 6 bis 84 Monaten</b> je nach Profil.",
 q7:"Was, wenn das Fahrzeug nicht entspricht?", a7:"Die Endkontrolle findet <b>in Ihrer Anwesenheit</b> am Tag der Übergabe statt. Bei erheblicher Abweichung: <b>sofortiger Umtausch oder Rückerstattung</b>. Dazu 15 Tage Widerrufsrecht und volle Rückerstattung bei nicht genanntem Mangel.",
 q8:"Wie kann ich Sie kontaktieren?", a8:"Per Telefon oder WhatsApp unter <b>06 52 24 22 78</b>, per E-Mail an contact@lebonauto.fr oder in der 8 Rue de l'industrie, 44450 Divatte-sur-Loire (Mo–Fr 9–18 Uhr). Antwort in unter einer Arbeitsstunde."
}
};

var BLOG_I18N = {
en: {
 "acheter-a-distance-confiance":{titre:"Buying your car remotely with confidence",resume:"Secure deposit, delivery tracking, handover inspection and withdrawal rights: how to buy serenely without travelling."},
 "documents-verifier-occasion":{titre:"Used cars: 6 documents to check before buying",resume:"Registration, non-pledge certificate, technical inspection, service book: the document checklist for a safe used-car purchase."},
 "acheter-voiture-budget":{titre:"10 tips for buying a good car while staying on budget",resume:"Set a realistic budget, compare models and choose a recent used car with verified history: the guide to buying without overspending."},
 "bien-choisir-occasion":{titre:"How to choose the right used car?",resume:"Sedan, SUV or city car? Reliability, inspection, test drive and negotiation: the method for a safe used-car purchase."},
 "hybride-ou-electrique":{titre:"Hybrid or electric: which to choose?",resume:"Range, cost, maintenance, ecology: the comparison to choose between hybrid and electric for your daily use and budget."},
 "entretenir-sa-voiture":{titre:"Caring for your car: the essential steps",resume:"Oil, tyres, brakes, seasonal maintenance: simple checks that extend your car's life, safety and value."}
},
es: {
 "acheter-a-distance-confiance":{titre:"Comprar su coche a distancia con total confianza",resume:"Anticipo seguro, seguimiento de entrega, control en la entrega y desistimiento: cómo comprar con tranquilidad sin desplazarse."},
 "documents-verifier-occasion":{titre:"Ocasión: los 6 documentos que debe verificar antes de comprar",resume:"Permiso de circulación, certificado de no embargo, inspección técnica, libro de mantenimiento: la lista de documentos para una compra segura."},
 "acheter-voiture-budget":{titre:"10 consejos para comprar un buen coche sin salirse del presupuesto",resume:"Definir un presupuesto realista, comparar modelos y apostar por ocasión reciente con historial verificado: la guía para comprar sin excederse."},
 "bien-choisir-occasion":{titre:"¿Cómo elegir bien su coche de ocasión?",resume:"¿Berlina, SUV o urbano? Fiabilidad, inspección, prueba de conducción y negociación: el método para una compra segura."},
 "hybride-ou-electrique":{titre:"¿Híbrido o eléctrico: cuál elegir?",resume:"Autonomía, coste, mantenimiento, ecología: la comparativa para elegir entre híbrido y eléctrico según su uso diario y presupuesto."},
 "entretenir-sa-voiture":{titre:"Mantener su coche: los gestos esenciales",resume:"Aceite, neumáticos, frenos, mantenimiento estacional: los controles simples que prolongan la vida, seguridad y valor de su vehículo."}
},
pt: {
 "acheter-a-distance-confiance":{titre:"Comprar o seu carro à distância com total confiança",resume:"Entrada segura, seguimento da entrega, inspeção na entrega e direito de desistência: como comprar com tranquilidade sem se deslocar."},
 "documents-verifier-occasion":{titre:"Usados: os 6 documentos a verificar antes de comprar",resume:"Documento, certificado de ausência de encargos, inspeção técnica, livro de revisões: a lista de documentos para uma compra segura."},
 "acheter-voiture-budget":{titre:"10 dicas para comprar um bom carro sem sair do orçamento",resume:"Definir um orçamento realista, comparar modelos e apostar num usado recente com histórico verificado: o guia para comprar sem exceder."},
 "bien-choisir-occasion":{titre:"Como escolher bem o seu carro usado?",resume:"Berlina, SUV ou citadino? Fiabilidade, inspeção, ensaio e negociação: o método para uma compra segura."},
 "hybride-ou-electrique":{titre:"Híbrido ou elétrico: qual escolher?",resume:"Autonomia, custo, manutenção, ecologia: o comparativo para escolher entre híbrido e elétrico conforme o seu uso diário e orçamento."},
 "entretenir-sa-voiture":{titre:"Manter o seu carro: os gestos essenciais",resume:"Óleo, pneus, travões, manutenção sazonal: as verificações simples que prolongam a vida, segurança e valor do seu veículo."}
}
,
de: {
 "acheter-a-distance-confiance":{titre:"Auto aus der Ferne kaufen – mit Vertrauen",resume:"Sichere Anzahlung, Lieferverfolgung, Kontrolle bei Übergabe und Widerrufsrecht: So kaufen Sie sorgenfrei, ohne anzureisen."},
 "documents-verifier-occasion":{titre:"Gebrauchtwagen: 6 Dokumente, die Sie vor dem Kauf prüfen müssen",resume:"Zulassung, Unbedenklichkeitsbescheinigung, HU-Bericht, Scheckheft: die Dokumenten-Checkliste für einen sicheren Gebrauchtwagenkauf."},
 "acheter-voiture-budget":{titre:"10 Tipps für ein gutes Auto im Budget",resume:"Realistisches Budget festlegen, Modelle vergleichen und auf junge Gebrauchte mit geprüfter Historie setzen: der Leitfaden ohne Kostenüberschreitung."},
 "bien-choisir-occasion":{titre:"Wie wählt man den richtigen Gebrauchtwagen?",resume:"Limousine, SUV oder Stadtauto? Zuverlässigkeit, Prüfung, Probefahrt und Verhandlung: die Methode für einen sicheren Kauf."},
 "hybride-ou-electrique":{titre:"Hybrid oder Elektro: Was passt zu mir?",resume:"Reichweite, Kosten, Wartung, Umwelt: der Vergleich für die Wahl zwischen Hybrid und Elektro nach Ihrem Alltag und Budget."},
 "entretenir-sa-voiture":{titre:"Auto richtig pflegen: die wichtigsten Schritte",resume:"Öl, Reifen, Bremsen, saisonale Wartung: einfache Kontrollen für ein langes, sicheres und wertstabiles Autoleben."}
}
};

function getLang(){
  try{
    var q = new URLSearchParams(location.search).get('lang');
    if(q && SUPPORTED.indexOf(q.toLowerCase())>=0){ localStorage.setItem('lba-lang', q.toLowerCase()); return q.toLowerCase(); }
    var s = localStorage.getItem('lba-lang');
    if(s && SUPPORTED.indexOf(s)>=0) return s;
  }catch(e){}
  var n = (navigator.language||navigator.userLanguage||'fr').slice(0,2).toLowerCase();
  return SUPPORTED.indexOf(n)>=0 ? n : 'fr';
}
function t(key){
  var l = getLang();
  if(T[l] && T[l][key] != null) return T[l][key];
  if(T.fr[key] != null) return T.fr[key];
  return key;
}
function faqT(lang, key){
  if(lang!=='fr' && FAQ_I18N[lang] && FAQ_I18N[lang][key]) return FAQ_I18N[lang][key];
  return null;
}
function blogT(lang, slug, field){
  if(lang!=='fr' && BLOG_I18N[lang] && BLOG_I18N[lang][slug] && BLOG_I18N[lang][slug][field]) return BLOG_I18N[lang][slug][field];
  return null;
}
function applyI18n(){
  var l = getLang();
  document.documentElement.lang = l;
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var v = t(el.getAttribute('data-i18n'));
    if(typeof v === 'string') el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(function(el){
    var v = t(el.getAttribute('data-i18n-html'));
    if(typeof v === 'string') el.innerHTML = v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el){ el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
  document.querySelectorAll('[data-i18n-aria]').forEach(function(el){ el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
  document.querySelectorAll('[data-i18n-alt]').forEach(function(el){ el.setAttribute('alt', t(el.getAttribute('data-i18n-alt'))); });
  document.querySelectorAll('[data-i18n-content]').forEach(function(el){ el.setAttribute('content', t(el.getAttribute('data-i18n-content'))); });
  // FAQ content (FR originals saved on first pass so switching back to FR restores them)
  document.querySelectorAll('[data-faq-q]').forEach(function(el){
    if(el.dataset.orig===undefined){
      var m0 = el.querySelector('.qmark');
      var txt = '';
      el.childNodes.forEach(function(n){ if(n!==m0) txt += n.textContent; });
      el.dataset.orig = txt.trim();
    }
    var v = faqT(l, el.getAttribute('data-faq-q'));
    var mark = el.querySelector('.qmark');
    el.innerHTML = '';
    if(mark) el.appendChild(mark);
    el.appendChild(document.createTextNode(v || el.dataset.orig));
  });
  document.querySelectorAll('[data-faq-a]').forEach(function(el){
    if(el.dataset.orig===undefined) el.dataset.orig = el.innerHTML;
    var v = faqT(l, el.getAttribute('data-faq-a'));
    el.innerHTML = v || el.dataset.orig;
  });
  // lang switcher state
  refreshSwitcher();
  try{ document.dispatchEvent(new CustomEvent('lba:lang',{detail:{lang:l}})); }catch(e){}
}
function setLang(l){
  if(SUPPORTED.indexOf(l)<0) return;
  try{ localStorage.setItem('lba-lang', l); }catch(e){}
  applyI18n();
}
// Sélecteur réductible : bouton langue courante (drapeau) + menu déroulant
function closeAllLangMenus(){
  document.querySelectorAll('.lang-switcher.open').forEach(function(sw){
    sw.classList.remove('open');
    var b = sw.querySelector('.lang-current');
    if(b) b.setAttribute('aria-expanded', 'false');
  });
}
function refreshSwitcher(){
  var l = getLang();
  document.querySelectorAll('.lang-switcher').forEach(function(sw){
    var btn = sw.querySelector('.lang-current');
    if(btn) btn.innerHTML = LANG_META[l].flag + '<span>' + LANG_META[l].code + '</span><span class="chev">▾</span>';
  });
  document.querySelectorAll('.lang-switcher [data-lang]').forEach(function(o){
    var on = o.getAttribute('data-lang') === l;
    o.classList.toggle('on', on);
    o.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}
function buildSwitchers(){
  document.querySelectorAll('.lang-switcher').forEach(function(sw){
    if(sw.dataset.built) return;
    sw.dataset.built = '1';
    sw.setAttribute('role', 'group');
    sw.setAttribute('aria-label', 'Language / Langue');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lang-current';
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Language / Langue');
    var menu = document.createElement('div');
    menu.className = 'lang-menu';
    menu.setAttribute('role', 'menu');
    SUPPORTED.forEach(function(l){
      var o = document.createElement('button');
      o.type = 'button';
      o.className = 'lang-opt';
      o.setAttribute('role', 'menuitem');
      o.setAttribute('data-lang', l);
      o.title = LANG_META[l].name;
      o.setAttribute('aria-label', LANG_META[l].name);
      o.innerHTML = LANG_META[l].flag + '<span>' + LANG_META[l].name + '</span>';
      o.addEventListener('click', function(ev){ ev.stopPropagation(); setLang(l); closeAllLangMenus(); });
      menu.appendChild(o);
    });
    btn.addEventListener('click', function(ev){
      ev.stopPropagation();
      var was = sw.classList.contains('open');
      closeAllLangMenus();
      if(!was){ sw.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
    sw.appendChild(btn);
    sw.appendChild(menu);
  });
  if(!window.__gacLangBound){
    window.__gacLangBound = true;
    document.addEventListener('click', closeAllLangMenus);
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeAllLangMenus(); });
  }
  refreshSwitcher();
}
function locale(){ return LOCALES[getLang()] || 'fr-FR'; }

if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', function(){ buildSwitchers(); applyI18n(); }); }
else { buildSwitchers(); applyI18n(); }

window.LBA_I18N = window.GAC_I18N = {get:getLang, set:setLang, t:t, locale:locale, apply:applyI18n, supported:SUPPORTED, faq:faqT, blog:blogT};
})();
