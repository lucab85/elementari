import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { hapticCorrect, hapticWrong, hapticTap, getCorrectMessage, getWrongMessage } from '../../components/KidsFeedback';

const pairs = [
  { num: 2, double: 4 }, { num: 5, double: 10 }, { num: 7, double: 14 },
  { num: 8, double: 16 }, { num: 9, double: 18 }, { num: 12, double: 24 },
  { num: 15, double: 30 }, { num: 20, double: 40 }, { num: 25, double: 50 },
  { num: 30, double: 60 }, { num: 35, double: 70 }, { num: 50, double: 100 },
  { num: 45, double: 90 }, { num: 11, double: 22 }, { num: 13, double: 26 },
];

function generate() {
  const p = pairs[Math.floor(Math.random() * pairs.length)];
  const isDouble = Math.random() > 0.5;
  if (isDouble) {
    const answer = p.double;
    const w1 = answer + Math.floor(Math.random() * 10) + 1;
    const w2 = Math.max(1, answer - Math.floor(Math.random() * 10) - 1);
    const opts = [String(answer), String(w1), String(w2)].sort(() => Math.random() - 0.5);
    return { question: `Il doppio di ${p.num}`, answer: String(answer), options: opts, correct: opts.indexOf(String(answer)) };
  } else {
    const answer = p.num;
    const w1 = answer + Math.floor(Math.random() * 5) + 1;
    const w2 = Math.max(1, answer - Math.floor(Math.random() * 5) - 1);
    const opts = [String(answer), String(w1), String(w2)].sort(() => Math.random() - 0.5);
    return { question: `La metà di ${p.double}`, answer: String(answer), options: opts, correct: opts.indexOf(String(answer)) };
  }
}

export default function DoppioMeta() {
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
      Animated.sequence([Animated.spring(bounceAnim, { toValue: 1.2, useNativeDriver: true }), Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true })]).start();
    }
    setTimeout(() => { setQ(generate()); setFeedback(null); }, correct ? 800 : 2000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
        <Animated.Text style={[styles.scoreText, { transform: [{ scale: bounceAnim }] }]}>⭐ {score}/{total}</Animated.Text>
      </View>
      <Text style={styles.title}>✖️➗ Doppio e Metà</Text>
      <View style={styles.questionBox}>
        <Text style={styles.questionText}>{q.question}</Text>
      </View>
      {feedback === 'correct' && <Text style={styles.correctText}>✅ Bravissimo! 🌟</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>💡 Era: {q.answer}</Text>}
      <View style={styles.options}>
        {q.options.map((opt, i) => (
          <TouchableOpacity key={i} style={[styles.optionBtn, feedback && i === q.correct && styles.optionCorrect, feedback === 'wrong' && i !== q.correct && styles.optionFaded]}
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
  title: { fontSize: 28, fontWeight: '800', color: COLORS.math, marginBottom: 20 },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 24, padding: 32, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  questionText: { fontSize: 30, fontWeight: '800', color: COLORS.text },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { gap: 12 },
  optionBtn: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: COLORS.mathLight },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 28, fontWeight: '700', color: COLORS.math },
});
