import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';
import { capitaliEuropa } from '../../data/capitali';

const GEO_COLOR = '#1ABC9C';
const GEO_LIGHT = '#D1F2EB';

function generateQuiz() {
  const shuffled = [...capitaliEuropa].sort(() => Math.random() - 0.5);
  return shuffled.map(c => {
    const wrong = capitaliEuropa.filter(x => x.paese !== c.paese).sort(() => Math.random() - 0.5).slice(0, 2).map(x => x.capitale);
    const options = [c.capitale, ...wrong].sort(() => Math.random() - 0.5);
    return { question: `Qual è la capitale di ${c.paese}?`, emoji: c.emoji, options, correct: options.indexOf(c.capitale) };
  });
}

export default function Capitali() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [questions] = useState(() => generateQuiz().slice(0, 15));
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
        <Text style={{ fontSize: 72 }}>{pct >= 80 ? '🏆' : '🌍'}</Text>
        <Text style={styles.doneText}>{score}/{questions.length} ({pct}%)</Text>
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
      <Text style={styles.title}>🏛️ Capitali d'Europa</Text>
      <Text style={styles.progress}>{idx + 1}/{questions.length}</Text>

      <View style={styles.questionBox}>
        <Text style={{ fontSize: 48 }}>{q.emoji}</Text>
        <Text style={styles.questionText}>{q.question}</Text>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Esatto!</Text>}
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
  backText: { fontSize: 16, color: GEO_COLOR, fontWeight: '600' },
  scoreText: { fontSize: 20, fontWeight: '700', color: GEO_COLOR },
  title: { fontSize: 26, fontWeight: '800', color: GEO_COLOR, marginBottom: 4 },
  progress: { fontSize: 14, color: COLORS.textLight, marginBottom: 20 },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 24, padding: 28, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  questionText: { fontSize: 22, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginTop: 12 },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { gap: 10 },
  optionBtn: { backgroundColor: COLORS.white, borderRadius: 16, padding: 18, alignItems: 'center', borderWidth: 2, borderColor: GEO_LIGHT },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 20, fontWeight: '700', color: GEO_COLOR },
  doneText: { fontSize: 28, fontWeight: '800', color: GEO_COLOR, marginTop: 16 },
  retryBtn: { backgroundColor: GEO_COLOR, borderRadius: 16, paddingHorizontal: 40, paddingVertical: 16, marginTop: 24 },
  retryBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
});
