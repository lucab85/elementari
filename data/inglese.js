export const vocabulary = [
  {
    title: '🎨 Colors / Colori',
    words: [
      { en: 'Red', it: 'Rosso', emoji: '🔴' },
      { en: 'Blue', it: 'Blu', emoji: '🔵' },
      { en: 'Green', it: 'Verde', emoji: '🟢' },
      { en: 'Yellow', it: 'Giallo', emoji: '🟡' },
      { en: 'Orange', it: 'Arancione', emoji: '🟠' },
      { en: 'Purple', it: 'Viola', emoji: '🟣' },
      { en: 'White', it: 'Bianco', emoji: '⚪' },
      { en: 'Black', it: 'Nero', emoji: '⚫' },
      { en: 'Pink', it: 'Rosa', emoji: '🩷' },
      { en: 'Brown', it: 'Marrone', emoji: '🟤' },
    ],
  },
  {
    title: '🐾 Animals / Animali',
    words: [
      { en: 'Dog', it: 'Cane', emoji: '🐕' },
      { en: 'Cat', it: 'Gatto', emoji: '🐱' },
      { en: 'Bird', it: 'Uccello', emoji: '🐦' },
      { en: 'Fish', it: 'Pesce', emoji: '🐟' },
      { en: 'Horse', it: 'Cavallo', emoji: '🐴' },
      { en: 'Rabbit', it: 'Coniglio', emoji: '🐰' },
      { en: 'Bear', it: 'Orso', emoji: '🐻' },
      { en: 'Lion', it: 'Leone', emoji: '🦁' },
      { en: 'Elephant', it: 'Elefante', emoji: '🐘' },
      { en: 'Butterfly', it: 'Farfalla', emoji: '🦋' },
    ],
  },
  {
    title: '🍎 Food / Cibo',
    words: [
      { en: 'Apple', it: 'Mela', emoji: '🍎' },
      { en: 'Bread', it: 'Pane', emoji: '🍞' },
      { en: 'Water', it: 'Acqua', emoji: '💧' },
      { en: 'Milk', it: 'Latte', emoji: '🥛' },
      { en: 'Cheese', it: 'Formaggio', emoji: '🧀' },
      { en: 'Pizza', it: 'Pizza', emoji: '🍕' },
      { en: 'Ice cream', it: 'Gelato', emoji: '🍦' },
      { en: 'Cake', it: 'Torta', emoji: '🎂' },
      { en: 'Banana', it: 'Banana', emoji: '🍌' },
      { en: 'Egg', it: 'Uovo', emoji: '🥚' },
    ],
  },
  {
    title: '👨‍👩‍👧‍👦 Family / Famiglia',
    words: [
      { en: 'Mother', it: 'Madre/Mamma', emoji: '👩' },
      { en: 'Father', it: 'Padre/Papà', emoji: '👨' },
      { en: 'Sister', it: 'Sorella', emoji: '👧' },
      { en: 'Brother', it: 'Fratello', emoji: '👦' },
      { en: 'Grandmother', it: 'Nonna', emoji: '👵' },
      { en: 'Grandfather', it: 'Nonno', emoji: '👴' },
      { en: 'Friend', it: 'Amico/Amica', emoji: '🤝' },
      { en: 'Teacher', it: 'Maestro/Maestra', emoji: '👩‍🏫' },
    ],
  },
  {
    title: '🔢 Numbers / Numeri',
    words: [
      { en: 'One', it: 'Uno', emoji: '1️⃣' },
      { en: 'Two', it: 'Due', emoji: '2️⃣' },
      { en: 'Three', it: 'Tre', emoji: '3️⃣' },
      { en: 'Four', it: 'Quattro', emoji: '4️⃣' },
      { en: 'Five', it: 'Cinque', emoji: '5️⃣' },
      { en: 'Six', it: 'Sei', emoji: '6️⃣' },
      { en: 'Seven', it: 'Sette', emoji: '7️⃣' },
      { en: 'Eight', it: 'Otto', emoji: '8️⃣' },
      { en: 'Nine', it: 'Nove', emoji: '9️⃣' },
      { en: 'Ten', it: 'Dieci', emoji: '🔟' },
    ],
  },
  {
    title: '📅 Days & Months / Giorni e Mesi',
    words: [
      { en: 'Monday', it: 'Lunedì', emoji: '📅' },
      { en: 'Tuesday', it: 'Martedì', emoji: '📅' },
      { en: 'Wednesday', it: 'Mercoledì', emoji: '📅' },
      { en: 'Thursday', it: 'Giovedì', emoji: '📅' },
      { en: 'Friday', it: 'Venerdì', emoji: '📅' },
      { en: 'Saturday', it: 'Sabato', emoji: '📅' },
      { en: 'Sunday', it: 'Domenica', emoji: '📅' },
    ],
  },
];

// Quiz: English → Italian and Italian → English
export function generateEnglishQuiz(vocabTopics) {
  const questions = [];
  vocabTopics.forEach((topic) => {
    topic.words.forEach((w) => {
      // EN → IT
      const wrongIT = topic.words.filter((x) => x.it !== w.it).sort(() => Math.random() - 0.5).slice(0, 2).map((x) => x.it);
      const optionsIT = [w.it, ...wrongIT].sort(() => Math.random() - 0.5);
      questions.push({
        question: `Come si dice "${w.en}" in italiano?`,
        emoji: w.emoji,
        options: optionsIT,
        correct: optionsIT.indexOf(w.it),
      });
      // IT → EN
      const wrongEN = topic.words.filter((x) => x.en !== w.en).sort(() => Math.random() - 0.5).slice(0, 2).map((x) => x.en);
      const optionsEN = [w.en, ...wrongEN].sort(() => Math.random() - 0.5);
      questions.push({
        question: `Come si dice "${w.it}" in inglese?`,
        emoji: w.emoji,
        options: optionsEN,
        correct: optionsEN.indexOf(w.en),
      });
    });
  });
  return questions.sort(() => Math.random() - 0.5);
}
