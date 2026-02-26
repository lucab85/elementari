export const verbiEssere = {
  title: 'Verbo ESSERE',
  emoji: '🔵',
  conjugation: {
    'Io': 'sono',
    'Tu': 'sei',
    'Lui/Lei': 'è',
    'Noi': 'siamo',
    'Voi': 'siete',
    'Loro': 'sono',
  },
  questions: [
    { sentence: 'Io ___ un bambino.', options: ['sono', 'sei', 'è', 'siamo'], correct: 0 },
    { sentence: 'Tu ___ molto bravo.', options: ['sono', 'sei', 'è', 'siete'], correct: 1 },
    { sentence: 'Maria ___ la mia amica.', options: ['sono', 'sei', 'è', 'siamo'], correct: 2 },
    { sentence: 'Noi ___ in classe.', options: ['sono', 'siamo', 'siete', 'è'], correct: 1 },
    { sentence: 'Voi ___ simpatici.', options: ['siamo', 'siete', 'sono', 'sei'], correct: 1 },
    { sentence: 'I gatti ___ sul divano.', options: ['è', 'sei', 'sono', 'siamo'], correct: 2 },
    { sentence: 'Io e Marco ___ amici.', options: ['sono', 'siamo', 'siete', 'è'], correct: 1 },
    { sentence: 'La maestra ___ gentile.', options: ['sono', 'sei', 'è', 'siamo'], correct: 2 },
    { sentence: 'Tu e Luca ___ alti.', options: ['siamo', 'siete', 'sono', 'è'], correct: 1 },
    { sentence: 'Io ___ contento!', options: ['sono', 'sei', 'è', 'siamo'], correct: 0 },
  ],
};

export const verbiAvere = {
  title: 'Verbo AVERE',
  emoji: '🔴',
  conjugation: {
    'Io': 'ho',
    'Tu': 'hai',
    'Lui/Lei': 'ha',
    'Noi': 'abbiamo',
    'Voi': 'avete',
    'Loro': 'hanno',
  },
  questions: [
    { sentence: 'Io ___ un cane.', options: ['ho', 'hai', 'ha', 'abbiamo'], correct: 0 },
    { sentence: 'Tu ___ fame?', options: ['ho', 'hai', 'ha', 'avete'], correct: 1 },
    { sentence: 'Lui ___ gli occhi blu.', options: ['ho', 'hai', 'ha', 'hanno'], correct: 2 },
    { sentence: 'Noi ___ molti amici.', options: ['ho', 'abbiamo', 'avete', 'hanno'], correct: 1 },
    { sentence: 'Voi ___ ragione.', options: ['abbiamo', 'avete', 'hanno', 'hai'], correct: 1 },
    { sentence: 'Le bambine ___ le bambole.', options: ['ha', 'hai', 'hanno', 'abbiamo'], correct: 2 },
    { sentence: 'Io ___ freddo.', options: ['ho', 'hai', 'ha', 'abbiamo'], correct: 0 },
    { sentence: 'La nonna ___ i capelli bianchi.', options: ['ho', 'hai', 'ha', 'hanno'], correct: 2 },
    { sentence: 'Tu ___ una sorella.', options: ['ho', 'hai', 'ha', 'avete'], correct: 1 },
    { sentence: 'Noi ___ un compito da fare.', options: ['ho', 'abbiamo', 'avete', 'hanno'], correct: 1 },
  ],
};

export const nomiPlurali = {
  title: 'Singolare → Plurale',
  emoji: '📝',
  questions: [
    { word: 'il gatto', options: ['i gatti', 'le gatte', 'i gatto'], correct: 0 },
    { word: 'la casa', options: ['le case', 'le casa', 'i casi'], correct: 0 },
    { word: 'il libro', options: ['i libri', 'le libre', 'i libra'], correct: 0 },
    { word: 'la penna', options: ['i penni', 'le penne', 'la penne'], correct: 1 },
    { word: 'il bambino', options: ['i bambini', 'le bambine', 'i bambine'], correct: 0 },
    { word: 'la mela', options: ['le mele', 'i meli', 'la mele'], correct: 0 },
    { word: 'il fiore', options: ['le fiori', 'i fiori', 'i fiore'], correct: 1 },
    { word: 'la stella', options: ['le stelle', 'i stelli', 'la stelle'], correct: 0 },
    { word: 'l\'albero', options: ['gli alberi', 'le albere', 'i alberi'], correct: 0 },
    { word: 'l\'amica', options: ['le amiche', 'le amice', 'gli amici'], correct: 0 },
    { word: 'il pesce', options: ['i pesci', 'le pesce', 'i pesche'], correct: 0 },
    { word: 'la notte', options: ['le notti', 'i notti', 'le notte'], correct: 0 },
  ],
};

export const articoli = {
  title: 'Articoli (il, lo, la, i, gli, le)',
  emoji: '📎',
  questions: [
    { word: '___ zaino', options: ['il', 'lo', 'la'], correct: 1 },
    { word: '___ scuola', options: ['il', 'lo', 'la'], correct: 2 },
    { word: '___ amico', options: ['il', 'lo', 'l\''], correct: 2 },
    { word: '___ gatto', options: ['il', 'lo', 'la'], correct: 0 },
    { word: '___ gnomo', options: ['il', 'lo', 'la'], correct: 1 },
    { word: '___ psicologo', options: ['il', 'lo', 'la'], correct: 1 },
    { word: '___ quaderno', options: ['il', 'lo', 'la'], correct: 0 },
    { word: '___ studente', options: ['il', 'lo', 'la'], correct: 1 },
    { word: '___ amici', options: ['i', 'gli', 'le'], correct: 1 },
    { word: '___ bambine', options: ['i', 'gli', 'le'], correct: 2 },
    { word: '___ libri', options: ['i', 'gli', 'le'], correct: 0 },
    { word: '___ zaini', options: ['i', 'gli', 'le'], correct: 1 },
  ],
};
