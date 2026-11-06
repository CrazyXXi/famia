// Base de connaissances locale — informations générales uniquement.
// `a` = réponse complète (chat), `u` = version courte (USSD, ~160 caractères).
// À FAIRE VALIDER par un professionnel de santé avant tout déploiement.

export const KB = [
  {
    id: 'body',
    label: 'Mon corps',
    k: ['regles', 'cycle', 'menstru', 'ovulation', 'periode fertile', 'fertile', 'puberte', 'corps', 'seins', 'menarche'],
    a: "Le cycle dure en moyenne 28 jours (entre 21 et 35 jours, c'est normal) et les règles durent 3 à 7 jours. L'ovulation a lieu environ 14 jours avant les règles suivantes. Les jours fertiles sont les ~5 jours avant l'ovulation et le jour même, mais si ton cycle est irrégulier, compter les jours n'est pas fiable pour éviter une grossesse. Les règles ne sont pas « sales » ni honteuses : c'est un fonctionnement normal du corps. Si elles sont très douloureuses ou très abondantes, parles-en à un agent de santé.",
    u: 'Cycle moyen: 28j (21-35 ok). Regles: 3-7j. Ovulation ~14j avant les prochaines regles. Cycle irregulier = calcul peu fiable.',
  },
  {
    id: 'contra',
    label: 'Contraception',
    k: ['contracep', 'pilule', 'implant', 'injection', 'injectable', 'sterilet', 'diu', 'preservatif', 'eviter grossesse', 'empecher', 'planning', 'proteger'],
    a: "Il existe plusieurs méthodes : préservatif (le seul qui protège aussi des IST/VIH), pilule, injection, implant, stérilet (DIU), méthodes naturelles. Aucune n'est « la meilleure » pour tout le monde : le choix dépend de ta santé, de ton rythme de vie et de tes projets. Les méthodes modernes ne rendent pas stérile et la fertilité revient en général rapidement après l'arrêt. Un centre de santé ou de planification familiale peut t'expliquer chaque méthode, souvent gratuitement et en toute confidentialité.",
    u: 'Methodes: preservatif (protege aussi des IST), pilule, injection, implant, sterilet. Elles ne rendent pas sterile. Centre de sante = conseil confidentiel.',
  },
  {
    id: 'urgence',
    label: 'Pilule du lendemain',
    k: ['lendemain', 'urgence contracep', 'rapport non protege', 'sans protection', 'capote percee', 'oublie pilule', "j'ai oublie"],
    a: "Après un rapport non protégé, la contraception d'urgence (« pilule du lendemain ») peut réduire le risque de grossesse : plus elle est prise tôt, mieux elle marche, et jusqu'à 5 jours après selon le produit. Elle n'est pas abortive : elle n'agit pas sur une grossesse déjà installée. Demande-la en pharmacie ou en centre de santé. Pense aussi à un dépistage des IST si le rapport n'était pas protégé.",
    u: "Pilule du lendemain: le plus tot possible, jusqu'a 5 jours. Non abortive. Pharmacie ou centre de sante.",
  },
  {
    id: 'pregnancy',
    label: 'Grossesse',
    k: ['enceinte', 'grossesse', 'retard de regles', 'retard regles', 'nausee', 'test de grossesse', 'prenatal', 'accouch', 'bebe', 'premier enfant'],
    a: "Signes possibles d'une grossesse : retard de règles, nausées, seins tendus, fatigue. Un test de grossesse (pharmacie, centre de santé) permet de confirmer. Si tu es enceinte et que tu veux poursuivre, commence vite le suivi prénatal : l'OMS recommande au moins 8 contacts avec un professionnel de santé pendant la grossesse. Évite tout médicament ou produit traditionnel sans avis médical.",
    u: 'Retard de regles, nausees, fatigue: faire un test. Suivi prenatal des que possible (OMS: 8 contacts min).',
  },
  {
    id: 'espace',
    label: 'Espacement des naissances',
    k: ['espacement', 'espacer', 'entre deux enfants', 'combien de temps attendre', 'quand refaire', 'nouvelle grossesse', 'deuxieme enfant'],
    a: "L'OMS recommande d'attendre au moins 24 mois après une naissance avant de commencer une nouvelle grossesse : cela protège la santé de la maman et du bébé (moins de risques de prématurité et d'anémie). Un agent de santé peut te proposer une méthode adaptée, y compris pendant l'allaitement.",
    u: "OMS: attendre au moins 24 mois apres une naissance avant une nouvelle grossesse.",
  },
  {
    id: 'allait',
    label: 'Allaitement',
    k: ['allaitement', 'allaiter', 'je donne le sein', 'lait'],
    a: "Allaiter protège un peu contre une nouvelle grossesse, mais seulement dans des conditions strictes (bébé de moins de 6 mois, allaitement exclusif jour et nuit, règles pas revenues). Sinon, ce n'est pas fiable. Des méthodes compatibles avec l'allaitement existent : demande conseil au centre de santé.",
    u: 'Allaiter ne protege que sous conditions strictes (bebe < 6 mois, exclusif, sans regles). Sinon utiliser une methode.',
  },
  {
    id: 'ist',
    label: 'IST / VIH',
    k: ['ist', 'mst', 'vih', 'sida', 'infection', 'demangeaison', 'ecoulement', 'depistage', 'maladie sexuelle', 'brulure'],
    a: "Les infections sexuellement transmissibles (IST) et le VIH se transmettent lors de rapports non protégés. Le préservatif réduit fortement le risque. Beaucoup d'IST n'ont aucun signe visible : le dépistage est le seul moyen de savoir, il est souvent gratuit et confidentiel, et la plupart des IST se soignent. Si tu as des écoulements, brûlures ou démangeaisons, consulte sans attendre : personne ne te jugera.",
    u: 'Preservatif = protection IST/VIH. Depistage confidentiel au centre de sante. La plupart des IST se soignent.',
  },
  {
    id: 'myths',
    label: 'Rumeurs',
    k: ['contraception fait grossir', 'fait grossir', 'grossir', 'prise de poids', 'poids', 'mythe', 'rumeur', 'vrai ou faux', 'on dit que', 'il parait', 'premiere fois', 'debout', 'lavage', 'sterile', 'sterilite'],
    a: "« La contraception fait grossir » : pour la plupart des méthodes, aucune prise de poids n'est démontrée ; avec l'injection, certaines femmes prennent un peu de poids, et un autre choix existe si cela te gêne. Autres rumeurs fausses : on peut tomber enceinte dès la première fois ; faire l'amour debout ou se laver après n'empêche pas une grossesse ; les méthodes modernes ne rendent pas stérile ; les règles ne rendent pas « impure ». Teste-toi dans la section « Jouer » pour démonter d'autres idées reçues !",
    u: 'Faux: 1ere fois sans risque, se laver apres, contraception=sterilite. Vrai: grossesse possible des la 1ere fois.',
  },
  {
    id: 'consent',
    label: 'Consentement',
    k: ['consent', 'force', 'viol', 'harcel', 'abus', 'contrainte', 'pression', 'violence', "on m'a force"],
    a: "Personne n'a le droit de te forcer, quel que soit ton âge ou ta relation. Dire non est toujours ton droit, et ce qui s'est passé n'est jamais ta faute. Si tu es en danger ou si tu as subi des violences, parles-en à une personne de confiance, à un centre de santé ou à une ligne d'écoute de ton pays. Après une agression, consulte rapidement (idéalement dans les 72 h) : des soins existent.",
    u: "Personne ne peut te forcer. Ce n'est jamais ta faute. Centre de sante: consulter vite (72h).",
  },
  {
    id: 'garcons',
    label: 'Garçons & couples',
    k: ['garcon', 'homme', 'partenaire', 'mon copain', 'mon mari', 'pere', 'responsab'],
    a: "La planification familiale concerne les deux : les garçons et les hommes ont un rôle clé (respect du consentement, préservatif, dialogue en couple, soutien pendant la grossesse). En parler tôt aide à construire des relations sans pression ni honte. Le préservatif est la seule méthode masculine qui protège aussi des IST.",
    u: 'Les garcons aussi: consentement, preservatif, dialogue en couple.',
  },
  {
    id: 'sos',
    label: 'Urgence',
    k: ['saignement abondant', 'douleur forte', 'forte fievre', 'evanoui', 'hemorragie', 'douleur au ventre', 'perte de sang', 'convulsion'],
    a: "⚠️ Ce que tu décris peut être urgent. Rends-toi dès maintenant dans un centre de santé ou aux urgences, ou demande à quelqu'un de t'y emmener. Ne reste pas seule et n'attends pas que ça passe.",
    u: 'URGENT: allez maintenant au centre de sante ou aux urgences.',
  },
]

export const FALLBACK =
  "Je n'ai pas bien compris, mais ta question compte. Essaie avec d'autres mots (règles, contraception, grossesse, IST, espacement des naissances…) ou choisis un sujet ci-dessus. Pour une situation personnelle, un agent de santé est le mieux placé pour t'aider."

export const WHERE = 'Pour un avis personnalisé : centre de santé le plus proche, planning familial, ou pharmacie.'

export const SAFE_REFUSAL =
  "Je ne peux pas donner de méthode ni de recette pour interrompre une grossesse : les produits « maison » peuvent tuer ou causer des dégâts graves. Mais tu n'es pas seule et je ne te juge pas. Si tu penses être enceinte et que tu ne veux pas l'être, va rapidement dans un centre de santé : on t'expliquera les options légales et sûres dans ton pays, de façon confidentielle. En cas de saignements, de fortes douleurs ou de fièvre, c'est une urgence : consulte tout de suite."

export const CHAT_CHIPS = ['Mes règles', 'Contraception', 'Je crois être enceinte', 'Pilule du lendemain', 'IST / VIH', 'Espacer les naissances']
