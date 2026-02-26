import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

function generateSequence() {
  const types = [
    () => { const start = Math.floor(Math.random() * 20) + 1; const step = Math.floor(Math.random() * 5) + 2; const seq = Array.from({length: 6}, (_, i) => start + step * i); const hideIdx = Math.floor(Math.random() * 4) + 1; return { seq, hideIdx, hint: `+${step}` }; },
    () => { const start = Math.floor(Math.random() * 50) + 30; const step = -(Math.floor(Math.random() * 5) + 2); const seq = Array.from({length: 6}, (_, i) => start + step * i); const hideIdx = Math.floor(Math.random() * 4) + 1; return { seq, hideIdx, hint: `${step}` }; },
    () => { const base = Math.floor(Math.random() * 8) + 2; const seq = Array.from({length: 6}, (_, i) => base * (i + 1)); const hideIdx = Math.floor(Math.random() * 4) + 1; return { seq, hideIdx, hint: `×${base}` }; },
    () => { const start = Math.floor(Math.random() * 5) + 1; const seq = [start]; for (let i = 1; i < 6; i++) seq.push(seq[i-1] * 2); const hideIdx = Math.floor(Math.random() * 3) + 2; return { seq, hideIdx, hint: '×2' }; },
  ];
  const gen = types[Math.floor(Math.random() * types.length)]();
  const answer = gen.seq[gen.hideIdx];
  const w1 = answer + Math.floor(Math.random() * 5) + 1;
  const w2 = Math.max(0, answer - Math.floor(Math.random() * 5) - 1);
  const w3 = answer + Math.floor(Math.random() * 10) + 3;
  const options = [...new Set([answer, w1, w2, w3])].slice(0, 4).sort(() => Math.random() - 0.5);
  return { ...gen, answer, options, correct: options.indexOf(answer) };
}

export default function Sequenze() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState(generateSequence());
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const handleAnswer = (i) => {
    if (feedback !== null) return;
    const correct = i === q.correct;
    setFeedback(correct ? 'correct' : 'wrong');
    setTotal(total + 1);
    if (correct) {
      setScore(score + 1);
      Animated.sequence([Animated.spring(bounceAnim, { toValue: 1.2, useNativeDriver: true }), Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true })]).start();
    }
    setTimeout(() => { setQ(generateSequence()); setFeedback(null); }, correct ? 800 : 2000);
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
        <Animated.Text style={[styles.scoreText, { transform: [{ scale: bounceAnim }] }]}>⭐ {score}/{total}</Animated.Text>
      </View>
      <Text style={styles.title}>🔢 Sequenze Numeriche</Text>
      <Text style={styles.hint}>Trova il numero mancante!</Text>

      <View style={styles.seqBox}>
        <View style={styles.seqRow}>
          {q.seq.map((n, i) => (
            <View key={i} style={[styles.numCell, i === q.hideIdx && styles.numCellHidden]}>
              <Text style={[styles.numCellText, i === q.hideIdx && styles.numCellTextHidden]}>
                {i === q.hideIdx ? '?' : n}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Giusto! Era {q.answer}</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>❌ Era {q.answer} (regola: {q.hint})</Text>}

      <View style={styles.options}>
        {q.options.map((opt, i) => (
          <TouchableOpacity key={i} style={[styles.optionBtn, feedback && i === q.correct && styles.optionCorrect, feedback === 'wrong' && i !== q.correct && styles.optionFaded]}
            onPress={() => handleAnswer(i)} activeOpacity={0.7}>
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 12 },
  backText: { fontSize: 16, color: COLORS.math, fontWeight: '600' },
  scoreText: { fontSize: 20, fontWeight: '700', color: COLORS.math },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.math, marginBottom: 4 },
  hint: { fontSize: 15, color: COLORS.textLight, marginBottom: 20 },
  seqBox: { backgroundColor: COLORS.white, borderRadius: 24, padding: 20, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  seqRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, flexWrap: 'wrap' },
  numCell: { backgroundColor: COLORS.mathLight, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 12, minWidth: 48, alignItems: 'center' },
  numCellHidden: { backgroundColor: COLORS.math, borderStyle: 'dashed' },
  numCellText: { fontSize: 22, fontWeight: '700', color: COLORS.math },
  numCellTextHidden: { color: '#FFF' },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct, fontWeight: '600' },
  wrongText: { fontSize: 18, textAlign: 'center', marginBottom: 12, color: COLORS.wrong, fontWeight: '600' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  optionBtn: { width: '44%', backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: COLORS.mathLight },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 26, fontWeight: '700', color: COLORS.math },
});
