export const poesie = [
  {
    title: 'La Neve',
    author: 'Ada Negri',
    emoji: '❄️',
    text: `Neve bella
fatta a stella,
bianca neve
lieve lieve
vienimi in mano
piano piano.
Sei per poco
dolce gioco,
dolce gioco
in mille fiocchi
che mi frullan
sotto gli occhi.`,
    questions: [
      { q: 'Di che forma è la neve secondo la poetessa?', options: ['Rotonda', 'A stella', 'A cuore'], correct: 1 },
      { q: 'Come arriva la neve?', options: ['Veloce', 'Lieve lieve', 'Con rumore'], correct: 1 },
      { q: 'La neve è un dolce...', options: ['Sogno', 'Gioco', 'Ricordo'], correct: 1 },
      { q: 'Chi ha scritto questa poesia?', options: ['Gianni Rodari', 'Ada Negri', 'Italo Calvino'], correct: 1 },
    ],
  },
  {
    title: 'Filastrocca del primo giorno di scuola',
    author: 'Gianni Rodari',
    emoji: '🏫',
    text: `Suona la satisfato sveglia,
la colazione è in fretta,
lo zaino sulla schiena,
la corsa alla banchina.

È il primo giorno di scuola,
tutto è nuovo e bello,
i quaderni son puliti
e l'astuccio è quello.`,
    questions: [
      { q: 'Cosa suona la mattina?', options: ['Il campanello', 'La sveglia', 'Il telefono'], correct: 1 },
      { q: 'Dove si mette lo zaino?', options: ['Sulla schiena', 'Per terra', 'Sul banco'], correct: 0 },
      { q: 'I quaderni sono...', options: ['Vecchi', 'Rotti', 'Puliti'], correct: 2 },
    ],
  },
];
