import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { quizQuestions } from '../../data/storia';

export default function Quiz() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [questions] = useState(() => [...quizQuestions].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const q = questions[idx];

  const handleAnswer = (i) => {
    if (feedback !== null) return;
    const correct = i === q.correct;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) {
      setScore(score + 1);
      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.3, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
    setTimeout(() => {
      if (idx + 1 >= questions.length) setDone(true);
      else { setIdx(idx + 1); setFeedback(null); }
    }, correct ? 800 : 2000);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    let emoji = '😊';
    if (pct >= 90) emoji = '🏆';
    else if (pct >= 70) emoji = '⭐';
    else if (pct >= 50) emoji = '👍';
    else emoji = '💪';

    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={{ fontSize: 80 }}>{emoji}</Text>
        <Text style={styles.doneText}>Quiz finito!</Text>
        <Text style={styles.doneScore}>{score}/{questions.length} corrette ({pct}%)</Text>
        {pct >= 70 && <Text style={{ fontSize: 20, marginTop: 8 }}>Bravissimo! 🎉</Text>}
        {pct < 70 && <Text style={{ fontSize: 20, marginTop: 8 }}>Riprova, puoi fare meglio! 💪</Text>}
        <TouchableOpacity style={styles.retryBtn} onPress={() => { setIdx(0); setScore(0); setDone(false); setFeedback(null); }}>
          <Text style={styles.retryBtnText}>Riprova</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <Animated.Text style={[styles.scoreLabel, { transform: [{ scale: scaleAnim }] }]}>⭐ {score}</Animated.Text>
      </View>
      <Text style={styles.title}>❓ Quiz</Text>

      <View style={styles.progressBar}>
        {questions.map((_, i) => (
          <View key={i} style={[styles.dot, i === idx && styles.dotActive, i < idx && styles.dotDone]} />
        ))}
      </View>

      <View style={styles.questionBox}>
        <Text style={styles.questionText}>{q.question}</Text>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Esatto!</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>❌ Era: {q.options[q.correct]}</Text>}

      <View style={styles.options}>
        {q.options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.optionBtn, feedback && i === q.correct && styles.optionCorrect, feedback === 'wrong' && i !== q.correct && styles.optionFaded]}
            onPress={() => handleAnswer(i)}
            activeOpacity={0.7}
          >
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 8 },
  backText: { fontSize: 16, color: '#D4A017', fontWeight: '600' },
  scoreLabel: { fontSize: 22, fontWeight: '700', color: '#D4A017' },
  title: { fontSize: 28, fontWeight: '800', color: '#D4A017', marginBottom: 12 },
  progressBar: { flexDirection: 'row', justifyContent: 'center', gap: 4, marginBottom: 20, flexWrap: 'wrap' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0E0E0' },
  dotActive: { backgroundColor: '#D4A017', width: 20 },
  dotDone: { backgroundColor: '#2ECC71' },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  questionText: { fontSize: 22, fontWeight: '600', color: COLORS.text, lineHeight: 30 },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { gap: 10 },
  optionBtn: { backgroundColor: COLORS.white, borderRadius: 16, padding: 18, alignItems: 'center', borderWidth: 2, borderColor: COLORS.storiaLight },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 19, fontWeight: '700', color: '#D4A017' },
  doneText: { fontSize: 36, fontWeight: '800', color: '#D4A017', marginTop: 16 },
  doneScore: { fontSize: 20, color: COLORS.textLight, marginTop: 8 },
  retryBtn: { backgroundColor: '#D4A017', borderRadius: 16, paddingHorizontal: 40, paddingVertical: 16, marginTop: 24 },
  retryBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
});
