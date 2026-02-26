export const animals = [
  {
    name: 'Dimetrodonte',
    emoji: '🦎',
    period: 'Permiano (295-272 milioni di anni fa)',
    facts: [
      'Aveva le dimensioni degli attuali coccodrilli',
      'Aveva sul dorso una grande e misteriosa vela di spine',
      'La vela serviva probabilmente per regolare la temperatura',
      'Si è estinto dieci milioni di anni prima della comparsa dei dinosauri',
      'Non era un dinosauro ma un sinapside, più vicino ai mammiferi!',
    ],
  },
  {
    name: 'Chalicoterio',
    emoji: '🐴',
    period: 'Eocene-Pliocene (55-3 milioni di anni fa)',
    facts: [
      'Era un antico mammifero con le dimensioni tra un cavallo e un moderno elefante',
      'Sembrava un incrocio tra un cavallo e un gorilla',
      'Le zampe anteriori erano lunghissime',
      'Si spostava appoggiandosi sulle nocche come i gorilla',
      'Usava i suoi lunghi artigli per tirare giù i rami dagli alberi',
    ],
  },
  {
    name: 'Basilosauro',
    emoji: '🐋',
    period: 'Eocene (40-34 milioni di anni fa)',
    facts: [
      'Era l\'antenato della balena',
      'Aveva la forma di un\'anguilla con dieci denti enormi',
      'Poteva raggiungere 18 metri di lunghezza!',
      'La sua testa era relativamente piccola',
      'Nonostante il nome, non era un rettile ma un mammifero',
    ],
  },
  {
    name: 'Uccelli del Terrore',
    emoji: '🦅',
    period: 'Paleocene-Pleistocene (62-1.8 milioni di anni fa)',
    facts: [
      'Erano i più grandi predatori dell\'America meridionale',
      'Erano alti più di una persona (fino a 3 metri!)',
      'Avevano un becco enorme e potentissimo',
      'Non potevano volare',
      'Correvano velocissimi grazie alle zampe forti',
    ],
  },
  {
    name: 'Tirannosauro Rex',
    emoji: '🦖',
    period: 'Cretaceo (68-66 milioni di anni fa)',
    facts: [
      'Era uno dei più grandi predatori terrestri di sempre',
      'Aveva denti lunghi fino a 30 centimetri',
      'Le sue braccia erano cortissime rispetto al corpo',
      'Pesava come un autobus (circa 8 tonnellate)',
      'Il suo morso era il più potente di qualsiasi animale terrestre',
    ],
  },
  {
    name: 'Mammut',
    emoji: '🦣',
    period: 'Pliocene-Olocene (5 milioni - 4000 anni fa)',
    facts: [
      'Era coperto da una pelliccia folta per resistere al freddo',
      'Aveva zanne curve lunghe fino a 5 metri',
      'Si è estinto circa 4000 anni fa',
      'I mammut vivevano durante le ere glaciali',
      'Gli uomini preistorici li cacciavano e li dipingevano nelle caverne',
    ],
  },
  {
    name: 'Triceratopo',
    emoji: '🦕',
    period: 'Cretaceo (68-66 milioni di anni fa)',
    facts: [
      'Aveva tre corna sulla testa e un grande collare osseo',
      'Era erbivoro e pesava fino a 12 tonnellate',
      'Le corna servivano per difendersi dai predatori',
      'Viveva nello stesso periodo del T-Rex',
      'Il suo nome significa "faccia con tre corna"',
    ],
  },
  {
    name: 'Pteranodonte',
    emoji: '🦇',
    period: 'Cretaceo (86-84 milioni di anni fa)',
    facts: [
      'Non era un dinosauro ma un rettile volante (pterosauro)',
      'Aveva un\'apertura alare di oltre 7 metri!',
      'Si nutriva di pesce come un pellicano',
      'Aveva una lunga cresta sulla testa',
      'Non aveva denti, il suo becco era liscio',
    ],
  },
  {
    name: 'Megalodon',
    emoji: '🦈',
    period: 'Miocene-Pliocene (23-3.6 milioni di anni fa)',
    facts: [
      'Era il più grande squalo mai esistito',
      'Poteva raggiungere i 18 metri di lunghezza',
      'I suoi denti erano grandi come una mano!',
      'Si nutriva di balene e altri grandi animali marini',
      'Si è estinto probabilmente per il raffreddamento degli oceani',
    ],
  },
  {
    name: 'Dodo',
    emoji: '🐦',
    period: 'Olocene (estinto nel 1681)',
    facts: [
      'Viveva solo sull\'isola di Mauritius',
      'Non sapeva volare perché non aveva predatori sull\'isola',
      'Era alto circa un metro e pesava 20 kg',
      'Si è estinto a causa dell\'uomo e degli animali che ha portato',
      'È diventato il simbolo degli animali estinti',
    ],
  },
];

export const quizQuestions = [
  {
    question: 'Quale animale aveva una vela di spine sul dorso?',
    options: ['Basilosauro', 'Dimetrodonte', 'Mammut', 'Triceratopo'],
    correct: 1,
  },
  {
    question: 'Il Chalicoterio si appoggiava sulle...?',
    options: ['Zampe', 'Nocche', 'Code', 'Corna'],
    correct: 1,
  },
  {
    question: 'Il Basilosauro era l\'antenato di quale animale?',
    options: ['Squalo', 'Balena', 'Delfino', 'Coccodrillo'],
    correct: 1,
  },
  {
    question: 'Gli Uccelli del Terrore potevano volare?',
    options: ['Sì, molto bene', 'No', 'Solo un po\'', 'Solo da piccoli'],
    correct: 1,
  },
  {
    question: 'Quanto erano lunghi i denti del T-Rex?',
    options: ['10 cm', '30 cm', '1 metro', '5 cm'],
    correct: 1,
  },
  {
    question: 'Il Mammut aveva la pelliccia folta per...?',
    options: ['Nuotare', 'Volare', 'Resistere al freddo', 'Nascondersi'],
    correct: 2,
  },
  {
    question: 'Quale animale sembrava un incrocio tra cavallo e gorilla?',
    options: ['Dimetrodonte', 'Mammut', 'Chalicoterio', 'Dodo'],
    correct: 2,
  },
  {
    question: 'Il Dimetrodonte è vissuto prima o dopo i dinosauri?',
    options: ['Prima', 'Dopo', 'Insieme', 'Nello stesso periodo'],
    correct: 0,
  },
  {
    question: 'Quante corna aveva il Triceratopo?',
    options: ['Una', 'Due', 'Tre', 'Quattro'],
    correct: 2,
  },
  {
    question: 'Il Megalodon era un tipo di...?',
    options: ['Balena', 'Dinosauro', 'Squalo', 'Delfino'],
    correct: 2,
  },
  {
    question: 'Dove viveva il Dodo?',
    options: ['Africa', 'Mauritius', 'Australia', 'Italia'],
    correct: 1,
  },
  {
    question: 'Lo Pteranodonte era...?',
    options: ['Un dinosauro', 'Un uccello', 'Un rettile volante', 'Un mammifero'],
    correct: 2,
  },
  {
    question: 'Cosa significa "Triceratopo"?',
    options: ['Tre denti', 'Faccia con tre corna', 'Tre zampe', 'Grande lucertola'],
    correct: 1,
  },
  {
    question: 'Il Basilosauro era un rettile?',
    options: ['Sì', 'No, era un mammifero', 'No, era un pesce', 'No, era un uccello'],
    correct: 1,
  },
  {
    question: 'Quando si è estinto il Mammut?',
    options: ['100 milioni di anni fa', '66 milioni di anni fa', '4000 anni fa', '1000 anni fa'],
    correct: 2,
  },
];
