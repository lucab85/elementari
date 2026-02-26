import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { hapticCorrect, hapticWrong, hapticTap, getCorrectMessage, getWrongMessage } from '../../components/KidsFeedback';

const romanNumerals = [
  { arabic: 1, roman: 'I' }, { arabic: 2, roman: 'II' }, { arabic: 3, roman: 'III' },
  { arabic: 4, roman: 'IV' }, { arabic: 5, roman: 'V' }, { arabic: 6, roman: 'VI' },
  { arabic: 7, roman: 'VII' }, { arabic: 8, roman: 'VIII' }, { arabic: 9, roman: 'IX' },
  { arabic: 10, roman: 'X' }, { arabic: 11, roman: 'XI' }, { arabic: 12, roman: 'XII' },
  { arabic: 14, roman: 'XIV' }, { arabic: 15, roman: 'XV' }, { arabic: 16, roman: 'XVI' },
  { arabic: 19, roman: 'XIX' }, { arabic: 20, roman: 'XX' }, { arabic: 25, roman: 'XXV' },
  { arabic: 30, roman: 'XXX' }, { arabic: 40, roman: 'XL' }, { arabic: 50, roman: 'L' },
  { arabic: 60, roman: 'LX' }, { arabic: 90, roman: 'XC' }, { arabic: 100, roman: 'C' },
  { arabic: 500, roman: 'D' }, { arabic: 1000, roman: 'M' },
];

function generate() {
  const item = romanNumerals[Math.floor(Math.random() * romanNumerals.length)];
  const toRoman = Math.random() > 0.5;
  if (toRoman) {
    // Show arabic, ask for roman
    const wrongs = romanNumerals.filter((r) => r.roman !== item.roman).sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [item.roman, ...wrongs.map((w) => w.roman)].sort(() => Math.random() - 0.5);
    return { question: `${item.arabic} in numeri romani?`, answer: item.roman, options, correct: options.indexOf(item.roman) };
  } else {
    // Show roman, ask for arabic
    const wrongs = romanNumerals.filter((r) => r.arabic !== item.arabic).sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [String(item.arabic), ...wrongs.map((w) => String(w.arabic))].sort(() => Math.random() - 0.5);
    return { question: `${item.roman} in numeri arabi?`, answer: String(item.arabic), options, correct: options.indexOf(String(item.arabic)) };
  }
}

export default function NumeriRomani() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState(generate());
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const handleAnswer = (i) => {
    if (feedback !== null) return;
    const correct = i === q.correct;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) hapticCorrect(); else hapticWrong();
    setTotal(total + 1);
    if (correct) {
      setScore(score + 1);
      Animated.sequence([
        Animated.spring(bounceAnim, { toValue: 1.2, useNativeDriver: true }),
        Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
    setTimeout(() => { setQ(generate()); setFeedback(null); }, correct ? 800 : 2000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <Animated.Text style={[styles.scoreText, { transform: [{ scale: bounceAnim }] }]}>⭐ {score}/{total}</Animated.Text>
      </View>
      <Text style={styles.title}>🏛️ Numeri Romani</Text>

      <View style={styles.refBox}>
        <Text style={styles.refText}>I=1  V=5  X=10  L=50  C=100  D=500  M=1000</Text>
      </View>

      <View style={styles.questionBox}>
        <Text style={styles.questionText}>{q.question}</Text>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Grande! 💪</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>💡 Era: {q.answer}</Text>}

      <View style={styles.options}>
        {q.options.map((opt, i) => (
          <TouchableOpacity key={i}
            style={[styles.optionBtn, feedback && i === q.correct && styles.optionCorrect, feedback === 'wrong' && i !== q.correct && styles.optionFaded]}
            onPress={() => handleAnswer(i)} activeOpacity={0.7}>
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  backText: { fontSize: 16, color: COLORS.math, fontWeight: '600' },
  scoreText: { fontSize: 20, fontWeight: '700', color: COLORS.math },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.math, marginBottom: 12 },
  refBox: { backgroundColor: COLORS.mathLight, borderRadius: 16, padding: 12, marginBottom: 20 },
  refText: { fontSize: 14, color: COLORS.math, fontWeight: '600', textAlign: 'center' },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 24, padding: 32, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  questionText: { fontSize: 32, fontWeight: '800', color: COLORS.text },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { gap: 12 },
  optionBtn: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: COLORS.mathLight },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 28, fontWeight: '700', color: COLORS.math },
});
