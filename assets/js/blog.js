// Articles du blog — LeBonAuto
// Données modifiables depuis le dashboard admin (admin.html) — garder les marqueurs intacts.
/*ADMIN-DATA-START*/
const ARTICLES = [
  {
    "slug": "acheter-a-distance-confiance",
    "titre": "Acheter sa voiture à distance en toute confiance",
    "date": "2026-10-02",
    "img": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=70",
    "resume": "Acompte sécurisé, suivi de livraison, contrôle à la remise et rétractation : comment acheter sereinement sans vous déplacer.",
    "contenu": [
      "Acheter un véhicule à distance est devenu simple et sûr à condition de passer par un professionnel transparent. Chez LeBonAuto, tout commence par un devis détaillé puis une signature électronique, avec un acompte sécurisé de 30 % pour réserver le véhicule.",
      "La préparation finale comprend le contrôle des 250 points, la préparation mécanique et carrosserie ainsi qu'un nettoyage professionnel. La mise à disposition intervient sous 3 à 5 jours ouvrés, partout en Europe, avec un numéro de suivi transmis par e-mail et SMS.",
      "Le jour de la remise, le contrôle final est effectué en votre présence. Et en cas de non-conformité majeure, l'échange ou le remboursement est immédiat, avec un délai de rétractation de 15 jours.",
      "Une question avant de vous lancer ? Écrivez-nous sur WhatsApp au 06 52 24 22 78 : réponse en moins d'une heure ouvrée."
    ]
  },
  {
    "slug": "documents-verifier-occasion",
    "titre": "Occasion : les 6 documents à vérifier avant d'acheter",
    "date": "2026-09-26",
    "img": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=70",
    "resume": "Carte grise, non-gage, contrôle technique, carnet d'entretien : la check-list des documents qui sécurisent votre achat d'occasion.",
    "contenu": [
      "Un achat d'occasion serein repose d'abord sur les documents. Exigez systématiquement la carte grise française, le certificat de non-gage officiel et un contrôle technique de moins de 6 mois.",
      "Demandez aussi le carnet d'entretien et l'historique du véhicule : ils prouvent le suivi et la régularité des révisions. Le certificat de cession formalise la vente, et l'attestation kilométrique garantit la conformité du compteur.",
      "Chez LeBonAuto, ces 6 documents sont fournis avec chaque véhicule, sans exception, avec un historique vérifié et un kilométrage attesté.",
      "Un doute sur un document ? Notre équipe à Divatte-sur-Loire vous répond au 06 52 24 22 78, avant, pendant et après votre achat."
    ]
  },
  {
    "slug": "acheter-voiture-budget",
    "titre": "10 conseils pour acheter une bonne voiture tout en restant dans son budget",
    "date": "2026-09-19",
    "img": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=70",
    "resume": "Définir un budget réaliste, comparer les modèles et miser sur l'occasion récente avec historique vérifié : le guide pour acheter sans dépasser son budget.",
    "contenu": [
      "Acheter une voiture nécessite une préparation rigoureuse pour éviter les mauvaises surprises financières. Il faut définir un budget réaliste en analysant revenus, dépenses fixes et variables, sans oublier assurance, entretien, carburant et réparations.",
      "Une fois le budget établi, comparez les modèles : avis clients, fiabilité, confort et coûts d'entretien. L'occasion récente offre un excellent rapport qualité-prix grâce à une décote plus faible.",
      "Vérifiez toujours l'historique du véhicule : entretiens, accidents, kilométrage. Négociez sur la base de la valeur réelle du marché et méfiez-vous des prix anormalement bas.",
      "Chez LeBonAuto, chaque véhicule est contrôlé et son historique vérifié : contactez-nous sur WhatsApp au 06 52 24 22 78 pour être accompagné dans votre achat."
    ]
  },
  {
    "slug": "bien-choisir-occasion",
    "titre": "Comment bien choisir sa voiture d'occasion ?",
    "date": "2026-09-19",
    "img": "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=70",
    "resume": "Berline, SUV ou citadine ? Fiabilité, inspection, essai routier et négociation : la méthode pour sécuriser votre achat d'occasion.",
    "contenu": [
      "Choisir une voiture d'occasion commence par définir ses besoins : trajets quotidiens, familiaux ou loisirs, et son budget global avec assurance, entretien et carburant.",
      "Étudiez ensuite la fiabilité : rapports spécialisés, avis utilisateurs et classements d'experts pour évaluer durabilité et coût d'entretien de chaque modèle.",
      "Avant l'achat, inspectez la carrosserie, les documents, le contrôle technique et l'historique, puis réalisez un essai routier pour tester maniabilité et confort.",
      "Enfin, négociez selon la valeur marché et finalisez avec un contrat et un transfert de propriété en règle. Notre équipe à Divatte-sur-Loire vous accompagne à chaque étape."
    ]
  },
  {
    "slug": "hybride-ou-electrique",
    "titre": "Véhicule hybride ou électrique : que choisir ?",
    "date": "2026-09-19",
    "img": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=70",
    "resume": "Autonomie, coût, entretien, écologie : le comparatif pour choisir entre hybride et électrique selon votre usage quotidien et votre budget.",
    "contenu": [
      "Les hybrides combinent moteur thermique et électrique pour optimiser l'énergie et réduire les émissions, tandis que les électriques fonctionnent uniquement sur batterie, sans émissions à l'usage.",
      "Les hybrides offrent plus d'autonomie et de flexibilité pour les longs trajets, avec moins de carburant qu'une essence, mais un coût d'achat plus élevé.",
      "Les électriques affichent zéro émission, moins de carburant et moins d'entretien, mais autonomie et recharge restent des points de vigilance.",
      "Le choix dépend de vos trajets (urbains ou longs), de votre budget, des aides disponibles et des infrastructures de recharge. Venez essayer nos modèles hybrides et électriques à Divatte-sur-Loire."
    ]
  },
  {
    "slug": "entretenir-sa-voiture",
    "titre": "Entretenir sa voiture : les gestes essentiels",
    "date": "2026-09-19",
    "img": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=70",
    "resume": "Huile, pneus, freins, entretien saisonnier : les contrôles simples qui prolongent la durée de vie, la sécurité et la valeur de votre véhicule.",
    "contenu": [
      "Un véhicule bien entretenu est plus sûr, plus économique et garde une meilleure valeur de revente.",
      "Contrôlez le niveau d'huile moteur chaque mois, la pression et l'état des pneus chaque semaine, et nettoyez régulièrement intérieur et extérieur contre la corrosion.",
      "Restez attentif aux bruits, vibrations ou voyants inhabituels. L'entretien saisonnier est essentiel : batterie et climatisation au printemps, refroidissement et freins en été, visibilité en automne, chauffage et freins en hiver.",
      "En cas de choc ou de panne complexe, confiez votre véhicule à un professionnel pour un diagnostic et un entretien préventif. Contactez LeBonAuto au 06 52 24 22 78."
    ]
  }
];
/*ADMIN-DATA-END*/
// Données live Supabase (repli statique intégré si hors ligne / non configuré)
(function(){
  function mapA(r){
    return {slug:r.slug, titre:r.titre||'', date:r.date||'', img:r.img||'',
      resume:r.resume||'', contenu:Array.isArray(r.contenu)?r.contenu:[]};
  }
  async function loadRemote(){
    try{
      if(!window.SB || !SB.configured()) return;
      var rows = await SB.select('articles', 'created_at.asc', 6000);
      if(!Array.isArray(rows) || !rows.length) return;
      var mapped = rows.map(mapA).filter(function(a){ return a.slug && a.titre; });
      if(!mapped.length) return;
      ARTICLES.length = 0;
      mapped.forEach(function(a){ ARTICLES.push(a); });
      document.dispatchEvent(new CustomEvent('lba:data'));
    }catch(e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', loadRemote);
  else loadRemote();
})();
