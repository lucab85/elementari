import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

function generateQuestion() {
  const types = [
    // 10% of X
    () => { const pct = [10, 20, 25, 50][Math.floor(Math.random() * 4)]; const n = (Math.floor(Math.random() * 10) + 1) * (100 / pct); return { q: `Quanto è il ${pct}% di ${n}?`, answer: (pct * n) / 100 }; },
    // X% of 100
    () => { const pct = Math.floor(Math.random() * 10 + 1) * 10; return { q: `Quanto è il ${pct}% di 100?`, answer: pct }; },
    // 50% of even number
    () => { const n = (Math.floor(Math.random() * 20) + 1) * 2; return { q: `Quanto è il 50% di ${n}?`, answer: n / 2 }; },
  ];
  const gen = types[Math.floor(Math.random() * types.length)]();
  const correct = gen.answer;
  const opts = new Set([correct]);
  while (opts.size < 4) {
    const off = correct + (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
    if (off > 0) opts.add(off);
  }
  const options = [...opts].sort(() => Math.random() - 0.5);
  return { q: gen.q, options, correct: options.indexOf(correct) };
}

export default function Percentuali() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [question, setQuestion] = useState(() => generateQuestion());
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const answer = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setTotal(t => t + 1);
    if (i === question.correct) setScore(s => s + 1);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.15, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setTimeout(() => { setQuestion(generateQuestion()); setSelected(null); }, 1200);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <Text style={styles.title}>💯 Percentuali</Text>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreText}>✅ {score}</Text>
          <Text style={styles.scoreText}>📊 {total > 0 ? Math.round((score / total) * 100) : 0}%</Text>
        </View>

        <Animated.View style={[styles.qCard, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.qText}>{question.q}</Text>
        </Animated.View>

        {question.options.map((opt, i) => {
          let bg = COLORS.mathLight;
          if (selected !== null) {
            if (i === question.correct) bg = '#D5F5E3';
            else if (i === selected) bg = '#FADBD8';
          }
          return (
            <TouchableOpacity key={i} style={[styles.optBtn, { backgroundColor: bg }]}
              activeOpacity={0.7} onPress={() => answer(i)}>
              <Text style={styles.optText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, flex: 1 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: COLORS.math, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.math, marginBottom: 16 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  scoreText: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  qCard: { backgroundColor: COLORS.mathLight, padding: 32, borderRadius: 20, marginBottom: 24, ...SHADOWS.card },
  qText: { fontSize: 26, fontWeight: '700', color: COLORS.math, textAlign: 'center' },
  optBtn: { padding: 20, borderRadius: 16, marginBottom: 12, alignItems: 'center', ...SHADOWS.card },
  optText: { fontSize: 22, fontWeight: '700', color: COLORS.text },
});
