import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

const fractionQs = [
  { visual: '🟦🟦🟦⬜⬜', question: 'Che frazione è colorata?', options: ['3/5', '2/5', '3/4', '2/3'], correct: 0 },
  { visual: '🟩🟩⬜⬜', question: 'Che frazione è colorata?', options: ['1/2', '2/4', '3/4', '1/4'], correct: 1 },
  { visual: '🟧🟧🟧🟧⬜⬜⬜⬜', question: 'Che frazione è colorata?', options: ['4/8', '3/8', '5/8', '4/6'], correct: 0 },
  { visual: '🔴⚪⚪⚪', question: 'Che frazione è colorata?', options: ['1/2', '1/3', '1/4', '3/4'], correct: 2 },
  { visual: '🟪🟪🟪⬜', question: 'Che frazione è colorata?', options: ['3/5', '1/4', '3/4', '2/4'], correct: 2 },
  { visual: '🟡🟡🟡🟡🟡⬜', question: 'Che frazione è colorata?', options: ['5/6', '4/6', '5/5', '3/6'], correct: 0 },
  { question: 'Quale è più grande?', options: ['1/2', '1/4'], correct: 0, type: 'compare' },
  { question: 'Quale è più grande?', options: ['3/4', '1/3'], correct: 0, type: 'compare' },
  { question: 'Quale è più grande?', options: ['1/8', '1/2'], correct: 1, type: 'compare' },
  { question: 'Quale è più grande?', options: ['2/3', '1/6'], correct: 0, type: 'compare' },
  { question: '1/2 + 1/2 = ?', options: ['1', '2/4', '1/4', '2'], correct: 0, type: 'calc' },
  { question: '1/4 + 1/4 = ?', options: ['2/4', '1/2', '2/8', '1/4'], correct: 0, type: 'calc' },
  { question: '3/4 - 1/4 = ?', options: ['2/4', '3/4', '1/4', '4/4'], correct: 0, type: 'calc' },
  { question: 'Come si legge 3/4?', options: ['Tre quarti', 'Tre su quattro', 'Tre quinti', 'Quattro terzi'], correct: 0, type: 'read' },
  { question: 'Come si legge 1/2?', options: ['Un secondo', 'Un mezzo', 'Uno e due', 'Due metà'], correct: 1, type: 'read' },
];

export default function Frazioni() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [questions] = useState(() => [...fractionQs].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const q = questions[idx];

  const handleAnswer = (i) => {
    if (feedback !== null) return;
    const correct = i === q.correct;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) {
      setScore(score + 1);
      Animated.sequence([Animated.spring(bounceAnim, { toValue: 1.2, useNativeDriver: true }), Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true })]).start();
    }
    setTimeout(() => { if (idx + 1 >= questions.length) setDone(true); else { setIdx(idx + 1); setFeedback(null); } }, correct ? 800 : 2000);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={{ fontSize: 72 }}>{pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '💪'}</Text>
        <Text style={styles.doneText}>Frazioni finite!</Text>
        <Text style={styles.doneScore}>{score}/{questions.length} ({pct}%)</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => { setIdx(0); setScore(0); setDone(false); setFeedback(null); }}><Text style={styles.retryBtnText}>Riprova</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
        <Animated.Text style={[styles.scoreText, { transform: [{ scale: bounceAnim }] }]}>⭐ {score}</Animated.Text>
      </View>
      <Text style={styles.title}>🍕 Frazioni</Text>
      <Text style={styles.progress}>{idx + 1}/{questions.length}</Text>

      <View style={styles.questionBox}>
        {q.visual && <Text style={styles.visual}>{q.visual}</Text>}
        <Text style={styles.questionText}>{q.question}</Text>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Bravo!</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>❌ Era: {q.options[q.correct]}</Text>}

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
  center: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  content: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 12 },
  backText: { fontSize: 16, color: COLORS.math, fontWeight: '600' },
  scoreText: { fontSize: 20, fontWeight: '700', color: COLORS.math },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.math, marginBottom: 4 },
  progress: { fontSize: 14, color: COLORS.textLight, marginBottom: 20 },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 24, padding: 28, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  visual: { fontSize: 32, marginBottom: 16, letterSpacing: 4 },
  questionText: { fontSize: 24, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  optionBtn: { width: '44%', backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: COLORS.mathLight },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 26, fontWeight: '700', color: COLORS.math },
  doneText: { fontSize: 32, fontWeight: '800', color: COLORS.math, marginTop: 16 },
  doneScore: { fontSize: 20, color: COLORS.textLight, marginTop: 8 },
  retryBtn: { backgroundColor: COLORS.math, borderRadius: 16, paddingHorizontal: 40, paddingVertical: 16, marginTop: 24 },
  retryBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
});
