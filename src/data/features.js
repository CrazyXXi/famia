// Les sections de FamIA : un seul parcours, cinq espaces clairs.
export const HOME = { id: 'accueil', n: '00', title: 'Accueil', desc: 'Ton parcours en un coup d’œil', to: '/app/accueil' }

export const FEATURES = [
  { id: 'discuter', n: '01', title: 'Discuter', desc: 'Pose tes questions en secret, par la voix ou par écrit', to: '/app/discuter' },
  { id: 'jouer', n: '02', title: 'Jouer', desc: 'Quiz, vrai ou faux et mises en situation, avec des points', to: '/app/jouer' },
  { id: 'centres', n: '03', title: 'Les centres', desc: 'Les centres de santé autour de toi, sur la carte', to: '/app/centres' },
  { id: 'rendez-vous', n: '04', title: 'Rendez-vous', desc: 'Réserve un créneau, sans montrer ton nom', to: '/app/rendez-vous' },
]

// Suggestions affichées à l'ouverture de l'assistant : un clic pose la question.
export const SUGGESTIONS = [
  { label: 'Contraception', q: 'Quelles méthodes de contraception existent ?' },
  { label: 'Retard de règles', q: "J'ai un retard de règles, que faire ?" },
  { label: 'Pilule du lendemain', q: "C'est quoi la pilule du lendemain ?" },
  { label: 'Rumeurs', q: 'Est-ce que la contraception fait grossir ?' },
  { label: 'IST et dépistage', q: 'Où faire un dépistage IST en toute discrétion ?' },
  { label: 'En couple', q: 'Comment parler de contraception avec mon partenaire ?' },
]

// Questions fréquentes de l'accueil : un clic ouvre « Discuter » avec la question déjà posée.
export const QUICK_QUESTIONS = [
  'Est-ce que la contraception fait grossir ?',
  "J'ai un retard de règles, que faire ?",
  "C'est quoi la pilule du lendemain ?",
  'Comment parler de contraception avec mon partenaire ?',
  'Où faire un dépistage IST en toute discrétion ?',
  'Combien de temps attendre entre deux enfants ?',
]
