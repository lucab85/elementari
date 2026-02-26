// Musica data
export const noteMusical = [
  { name: 'DO', emoji: '🎵', color: '#E74C3C', position: 1, desc: 'La prima nota della scala' },
  { name: 'RE', emoji: '🎶', color: '#E67E22', position: 2, desc: 'La seconda nota' },
  { name: 'MI', emoji: '🎵', color: '#F1C40F', position: 3, desc: 'La terza nota' },
  { name: 'FA', emoji: '🎶', color: '#2ECC71', position: 4, desc: 'La quarta nota' },
  { name: 'SOL', emoji: '🎵', color: '#3498DB', position: 5, desc: 'La quinta nota' },
  { name: 'LA', emoji: '🎶', color: '#9B59B6', position: 6, desc: 'La sesta nota' },
  { name: 'SI', emoji: '🎵', color: '#E91E63', position: 7, desc: 'La settima nota' },
];

export const strumenti = [
  { name: 'Pianoforte', emoji: '🎹', famiglia: 'Tastiera', desc: 'Ha 88 tasti bianchi e neri' },
  { name: 'Chitarra', emoji: '🎸', famiglia: 'Corde', desc: 'Ha 6 corde' },
  { name: 'Violino', emoji: '🎻', famiglia: 'Corde', desc: 'Si suona con l\'archetto' },
  { name: 'Flauto', emoji: '🪈', famiglia: 'Fiati', desc: 'Strumento a fiato in legno' },
  { name: 'Tromba', emoji: '🎺', famiglia: 'Ottoni', desc: 'Strumento a fiato in ottone' },
  { name: 'Batteria', emoji: '🥁', famiglia: 'Percussioni', desc: 'Si suona con le bacchette' },
  { name: 'Sassofono', emoji: '🎷', famiglia: 'Fiati', desc: 'Inventato da Adolphe Sax' },
  { name: 'Arpa', emoji: '🪕', famiglia: 'Corde', desc: 'Ha 47 corde' },
];

export const musicaQuiz = [
  { q: 'Quante sono le note musicali?', options: ['5', '6', '7', '8'], correct: 2 },
  { q: 'Qual è la prima nota della scala?', options: ['RE', 'DO', 'MI', 'LA'], correct: 1 },
  { q: 'Il pianoforte è uno strumento a...', options: ['Corde', 'Fiato', 'Tastiera', 'Percussione'], correct: 2 },
  { q: 'Quante corde ha la chitarra?', options: ['4', '5', '6', '8'], correct: 2 },
  { q: 'Il violino si suona con...', options: ['Le mani', 'L\'archetto', 'Le bacchette', 'Il fiato'], correct: 1 },
  { q: 'Il flauto è uno strumento a...', options: ['Corde', 'Fiato', 'Tastiera', 'Percussione'], correct: 1 },
  { q: 'Qual è l\'ultima nota della scala?', options: ['LA', 'SOL', 'SI', 'DO'], correct: 2 },
  { q: 'La batteria è uno strumento a...', options: ['Corde', 'Fiato', 'Tastiera', 'Percussione'], correct: 3 },
  { q: 'Chi ha inventato il sassofono?', options: ['Mozart', 'Adolphe Sax', 'Beethoven', 'Vivaldi'], correct: 1 },
  { q: 'Quale nota viene dopo FA?', options: ['MI', 'LA', 'SOL', 'RE'], correct: 2 },
];
