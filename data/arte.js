// Arte data
export const coloriPrimari = [
  { name: 'Rosso', emoji: '🔴', hex: '#E74C3C', desc: 'Colore primario caldo' },
  { name: 'Giallo', emoji: '🟡', hex: '#F1C40F', desc: 'Colore primario caldo' },
  { name: 'Blu', emoji: '🔵', hex: '#3498DB', desc: 'Colore primario freddo' },
];

export const coloriSecondari = [
  { name: 'Arancione', emoji: '🟠', hex: '#E67E22', mix: 'Rosso + Giallo', desc: 'Colore secondario caldo' },
  { name: 'Verde', emoji: '🟢', hex: '#2ECC71', mix: 'Giallo + Blu', desc: 'Colore secondario freddo' },
  { name: 'Viola', emoji: '🟣', hex: '#9B59B6', mix: 'Rosso + Blu', desc: 'Colore secondario freddo' },
];

export const arteQuiz = [
  { q: 'Quali sono i colori primari?', options: ['Rosso, Verde, Blu', 'Rosso, Giallo, Blu', 'Rosso, Giallo, Verde', 'Arancione, Verde, Viola'], correct: 1 },
  { q: 'Rosso + Giallo = ?', options: ['Verde', 'Viola', 'Arancione', 'Marrone'], correct: 2 },
  { q: 'Giallo + Blu = ?', options: ['Arancione', 'Verde', 'Viola', 'Rosa'], correct: 1 },
  { q: 'Rosso + Blu = ?', options: ['Verde', 'Arancione', 'Viola', 'Grigio'], correct: 2 },
  { q: 'Quanti sono i colori primari?', options: ['2', '3', '4', '5'], correct: 1 },
  { q: 'L\'arancione è un colore...', options: ['Primario', 'Secondario', 'Terziario', 'Neutro'], correct: 1 },
  { q: 'Il bianco e il nero sono colori...', options: ['Primari', 'Secondari', 'Caldi', 'Neutri'], correct: 3 },
  { q: 'Quale colore primario è freddo?', options: ['Rosso', 'Giallo', 'Blu', 'Arancione'], correct: 2 },
  { q: 'Quale tecnica usa i puntini?', options: ['Acquerello', 'Puntinismo', 'Collage', 'Affresco'], correct: 1 },
  { q: 'Chi ha dipinto la Gioconda?', options: ['Michelangelo', 'Raffaello', 'Leonardo da Vinci', 'Caravaggio'], correct: 2 },
];
