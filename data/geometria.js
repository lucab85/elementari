export const forme = [
  { name: 'Quadrato', emoji: '🟦', lati: 4, angoli: 4, facts: ['Ha 4 lati uguali', 'Ha 4 angoli retti (90°)', 'Il perimetro = lato × 4', 'L\'area = lato × lato'] },
  { name: 'Rettangolo', emoji: '🟧', lati: 4, angoli: 4, facts: ['Ha 2 lati lunghi e 2 corti', 'Ha 4 angoli retti', 'Il perimetro = (base + altezza) × 2', 'L\'area = base × altezza'] },
  { name: 'Triangolo', emoji: '🔺', lati: 3, angoli: 3, facts: ['Ha 3 lati e 3 angoli', 'La somma degli angoli è sempre 180°', 'L\'area = (base × altezza) ÷ 2', 'Può essere equilatero, isoscele o scaleno'] },
  { name: 'Cerchio', emoji: '🔵', lati: 0, angoli: 0, facts: ['Non ha lati né angoli', 'Ha un centro e un raggio', 'La circonferenza = diametro × π', 'L\'area = raggio × raggio × π'] },
  { name: 'Rombo', emoji: '🔷', lati: 4, angoli: 4, facts: ['Ha 4 lati uguali', 'Ha 2 angoli acuti e 2 ottusi', 'Le diagonali si incrociano al centro', 'L\'area = (d1 × d2) ÷ 2'] },
  { name: 'Trapezio', emoji: '⬛', lati: 4, angoli: 4, facts: ['Ha 2 lati paralleli (basi)', 'Le due basi hanno lunghezze diverse', 'L\'area = (base maggiore + base minore) × altezza ÷ 2', 'Può essere rettangolo o isoscele'] },
  { name: 'Pentagono', emoji: '⬠', lati: 5, angoli: 5, facts: ['Ha 5 lati e 5 angoli', 'Se è regolare tutti i lati sono uguali', 'La somma degli angoli interni è 540°', 'Si trova nella natura: i fiori di gelsomino'] },
  { name: 'Esagono', emoji: '⬡', lati: 6, angoli: 6, facts: ['Ha 6 lati e 6 angoli', 'Le api costruiscono celle esagonali', 'Se è regolare tutti i lati sono uguali', 'La somma degli angoli interni è 720°'] },
];

export const geometriaQuiz = [
  { question: 'Quanti lati ha un triangolo?', options: ['2', '3', '4', '5'], correct: 1 },
  { question: 'Quanti angoli retti ha un quadrato?', options: ['2', '3', '4', '0'], correct: 2 },
  { question: 'L\'area del rettangolo si calcola...', options: ['base + altezza', 'base × altezza', 'base ÷ altezza', 'base − altezza'], correct: 1 },
  { question: 'Quale forma non ha lati?', options: ['Quadrato', 'Triangolo', 'Cerchio', 'Rombo'], correct: 2 },
  { question: 'Il perimetro del quadrato è...', options: ['lato × 2', 'lato × 3', 'lato × 4', 'lato × lato'], correct: 2 },
  { question: 'Quanti lati ha un esagono?', options: ['4', '5', '6', '8'], correct: 2 },
  { question: 'Un triangolo con tutti i lati uguali è...', options: ['Isoscele', 'Scaleno', 'Equilatero', 'Rettangolo'], correct: 2 },
  { question: 'Le api costruiscono celle di forma...', options: ['Quadrata', 'Triangolare', 'Esagonale', 'Circolare'], correct: 2 },
  { question: 'Il rombo ha...', options: ['4 lati uguali', '4 lati diversi', '3 lati', '6 lati'], correct: 0 },
  { question: 'La somma degli angoli di un triangolo è...', options: ['90°', '180°', '360°', '270°'], correct: 1 },
];
