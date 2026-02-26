import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

function generate() {
  const level = Math.random();
  let a, b;
  if (level < 0.3) {
    a = Math.floor(Math.random() * 100);
    b = Math.floor(Math.random() * 100);
  } else if (level < 0.6) {
    a = Math.floor(Math.random() * 1000);
    b = Math.floor(Math.random() * 1000);
  } else {
    a = Math.floor(Math.random() * 10000);
    b = Math.floor(Math.random() * 10000);
  }
  // Avoid equal numbers most of the time
  if (a === b) b += 1;
  const correct = a > b ? '>' : a < b ? '<' : '=';
  return { a, b, correct };
}

export default function Confronta() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState(generate());
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const handleAnswer = (symbol) => {
    if (feedback !== null) return;
    const correct = symbol === q.correct;
    setFeedback(correct ? 'correct' : 'wrong');
    setTotal(total + 1);
    if (correct) {
      setScore(score + 1);
      Animated.sequence([
        Animated.spring(bounceAnim, { toValue: 1.3, useNativeDriver: true }),
        Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
    setTimeout(() => { setQ(generate()); setFeedback(null); }, correct ? 800 : 1500);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <Animated.Text style={[styles.scoreText, { transform: [{ scale: bounceAnim }] }]}>⭐ {score}/{total}</Animated.Text>
      </View>
      <Text style={styles.title}>⚖️ Confronta</Text>
      <Text style={styles.subtitle}>Quale simbolo va in mezzo?</Text>

      <View style={styles.questionBox}>
        <Text style={styles.number}>{q.a}</Text>
        <Text style={styles.vs}>?</Text>
        <Text style={styles.number}>{q.b}</Text>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Giusto! {q.a} {q.correct} {q.b}</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>❌ Era {q.correct}</Text>}

      <View style={styles.buttons}>
        {['<', '=', '>'].map((sym) => (
          <TouchableOpacity key={sym} style={styles.symbolBtn} onPress={() => handleAnswer(sym)} activeOpacity={0.7}>
            <Text style={styles.symbolText}>{sym}</Text>
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
  title: { fontSize: 28, fontWeight: '800', color: COLORS.math, marginBottom: 4 },
  subtitle: { fontSize: 16, color: COLORS.textLight, marginBottom: 30 },
  questionBox: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 24, padding: 32, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
  },
  number: { fontSize: 42, fontWeight: '800', color: COLORS.text },
  vs: { fontSize: 36, fontWeight: '300', color: COLORS.textLight, marginHorizontal: 24 },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 16, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 16, color: COLORS.wrong },
  buttons: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  symbolBtn: {
    width: 90, height: 90, borderRadius: 20, backgroundColor: COLORS.mathLight,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  symbolText: { fontSize: 44, fontWeight: '800', color: COLORS.math },
});
