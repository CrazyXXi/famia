// Contenu ludique pour les élèves (dès la 3ème) : ton simple, bienveillant, sans jugement.
// À faire relire par un professionnel de santé / l'infirmier·e scolaire avant déploiement.

// [question, [choix], index de la bonne réponse, explication]
export const QCM = [
  ['À quel moment une fille peut-elle tomber enceinte ?', ['Seulement après 18 ans', 'Dès le début de la puberté, parfois même avant les premières règles', 'Jamais la première fois'], 1, 'L’ovulation commence avant les premières règles : une grossesse est possible dès les premiers rapports non protégés.'],
  ['Quelle méthode protège à la fois d’une grossesse et des IST ?', ['La pilule', 'Le préservatif', 'L’implant'], 1, 'Le préservatif est la seule méthode qui protège des deux en même temps.'],
  ['Qui doit être d’accord pour un rapport ?', ['Seulement la fille', 'Les deux, librement', 'Le plus âgé des deux'], 1, 'Le consentement est l’affaire des deux, et on peut toujours changer d’avis.'],
  ['Combien dure en moyenne un cycle menstruel ?', ['7 jours', 'Environ 28 jours', '90 jours'], 1, 'En moyenne 28 jours, et entre 21 et 35 jours reste normal.'],
  ['Se laver après un rapport empêche une grossesse. C’est…', ['Vrai', 'Faux', 'Ça dépend du savon'], 1, 'Faux : les spermatozoïdes sont déjà en route. Seule une contraception protège.'],
  ['Où trouver des infos fiables et confidentielles ?', ['Les rumeurs de la cour', 'Un centre de santé, l’infirmier·e de l’école ou FamIA', 'Des vidéos au hasard'], 1, 'Les professionnels de santé et les sources fiables sont là pour toi, sans te juger.'],
  ['Les règles, c’est…', ['Sale', 'Naturel et normal', 'Une maladie'], 1, 'Les règles sont un phénomène naturel et sain. Il n’y a aucune honte.'],
  ['Si quelqu’un te met la pression, tu peux…', ['Dire non : c’est ton droit', 'Céder pour ne pas le/la perdre', 'Te taire'], 0, 'Dire non est toujours ton droit. Et en parler à un adulte de confiance aide.'],
]

// Mises en situation « Le bon choix » : [situation, [[choix, points (0–2), retour]]]
export const SCENARIOS = [
  ['Ton ou ta petit·e ami·e insiste pour aller plus loin, mais tu n’es pas prêt·e.', [
    ['Tu cèdes pour ne pas le/la perdre', 0, 'Ton accord compte. Quelqu’un qui tient à toi respecte ton non.'],
    ['Tu dis non clairement et tu en parles à une personne de confiance', 2, 'Excellent réflexe : dire non est ton droit, et en parler te soutient.'],
    ['Tu changes de sujet et tu évites', 1, 'Ça peut aider sur le moment, mais dire clairement non est plus sûr.'],
  ]],
  ['Une amie pense être enceinte et a peur d’en parler.', [
    ['Tu lui conseilles une tisane trouvée sur internet', 0, 'Les remèdes « maison » sont dangereux. Un test et un professionnel de santé sont la bonne voie.'],
    ['Tu l’accompagnes pour faire un test et voir un professionnel de santé', 2, 'Parfait : être présent·e et l’orienter vers un centre, sans la juger.'],
    ['Tu gardes le secret et tu ne fais rien', 1, 'Rester proche est bien, mais il faut aussi l’orienter vers un test et un centre de santé.'],
  ]],
  ['Dans la cour, on dit que la contraception rend stérile.', [
    ['Tu y crois : tout le monde le dit', 0, 'Faux : les méthodes modernes ne rendent pas stérile.'],
    ['Tu demandes d’où vient l’info et tu vérifies auprès d’un centre de santé ou de FamIA', 2, 'Bravo : vérifier une rumeur, c’est le meilleur réflexe.'],
    ['Tu ris sans rien dire', 1, 'Mieux que d’y croire, mais tu peux aussi aider les autres en corrigeant la rumeur.'],
  ]],
  ['Tu as un doute après un rapport sans protection.', [
    ['Tu attends sans rien dire', 0, 'Plus on agit tôt, mieux c’est : la contraception d’urgence marche jusqu’à 5 jours, et un dépistage est possible.'],
    ['Tu vas vite dans un centre de santé ou une pharmacie, et tu en parles à un adulte de confiance', 2, 'Excellent : agir vite protège ta santé.'],
    ['Tu demandes conseil à des amis seulement', 1, 'Les amis peuvent soutenir, mais seul un professionnel peut te donner la bonne réponse.'],
  ]],
  ['Un garçon de ta classe dit que la contraception, « c’est un truc de filles ».', [
    ['Tu es d’accord : ça ne le concerne pas', 0, 'Ça concerne les deux : respect, préservatif, dialogue.'],
    ['Tu expliques que c’est l’affaire des deux', 2, 'Super : responsabiliser les garçons change les mentalités.'],
    ['Tu changes de sujet', 1, 'Pourquoi pas, mais tu peux aussi corriger l’idée reçue avec calme.'],
  ]],
]

// « Le saviez-vous ? » affiché sur l'accueil.
export const FACTS = [
  'Les premières règles arrivent entre 9 et 15 ans, et chaque corps a son rythme.',
  'Le préservatif est la seule méthode qui protège à la fois d’une grossesse et des IST.',
  'Dire non est toujours ton droit, même après avoir dit oui avant.',
  'Beaucoup d’IST n’ont aucun signe visible : seul le dépistage permet de savoir.',
  'Attendre au moins 2 ans entre deux grossesses protège la maman et le bébé.',
]
