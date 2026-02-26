import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { problemi } from '../../data/problemi';
import { hapticCorrect, hapticWrong, hapticTap, getCorrectMessage, getWrongMessage } from '../../components/KidsFeedback';

export default function Problemi() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [questions] = useState(() => [...problemi].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const q = questions[idx];

  const handleAnswer = (i) => {
    if (feedback !== null) return;
    const correct = i === q.correct;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) hapticCorrect(); else hapticWrong();
    if (correct) {
      setScore(score + 1);
      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.3, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
    setTimeout(() => {
      if (idx + 1 >= questions.length) setDone(true);
      else { setIdx(idx + 1); setFeedback(null); setShowHint(false); }
    }, correct ? 1000 : 2500);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={{ fontSize: 80 }}>{pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '💪'}</Text>
        <Text style={styles.doneText}>Problemi finiti!</Text>
        <Text style={styles.doneScore}>{score}/{questions.length} ({pct}%)</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => { setIdx(0); setScore(0); setDone(false); setFeedback(null); setShowHint(false); }}>
          <Text style={styles.retryBtnText}>Riprova</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }} style={{ marginTop: 16 }}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <Animated.Text style={[styles.scoreLabel, { transform: [{ scale: scaleAnim }] }]}>⭐ {score}</Animated.Text>
      </View>
      <Text style={styles.title}>📝 Problemi</Text>
      <Text style={styles.progress}>{idx + 1}/{questions.length}</Text>

      <View style={styles.problemBox}>
        <Text style={styles.problemText}>{q.text}</Text>
      </View>

      {!showHint && feedback === null && (
        <TouchableOpacity onPress={() => setShowHint(true)} style={styles.hintBtn}>
          <Text style={styles.hintBtnText}>💡 Aiutino</Text>
        </TouchableOpacity>
      )}
      {showHint && <Text style={styles.hintText}>Operazione: {q.operation}</Text>}

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Grande! 💪 ({q.operation} = {q.options[q.correct]})</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>💡 Era: {q.options[q.correct]} ({q.operation})</Text>}

      <View style={styles.options}>
        {q.options.map((opt, i) => (
          <TouchableOpacity key={i}
            style={[styles.optionBtn, feedback && i === q.correct && styles.optionCorrect, feedback === 'wrong' && i !== q.correct && styles.optionFaded]}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 8 },
  backText: { fontSize: 16, color: COLORS.math, fontWeight: '600' },
  scoreLabel: { fontSize: 22, fontWeight: '700', color: COLORS.math },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.math, marginBottom: 4 },
  progress: { fontSize: 14, color: COLORS.textLight, marginBottom: 16 },
  problemBox: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  problemText: { fontSize: 20, color: COLORS.text, lineHeight: 30 },
  hintBtn: { alignSelf: 'center', marginBottom: 16 },
  hintBtnText: { fontSize: 16, color: COLORS.math, fontWeight: '600' },
  hintText: { fontSize: 18, color: COLORS.math, textAlign: 'center', marginBottom: 16, fontWeight: '600' },
  correctText: { fontSize: 18, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 18, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  optionBtn: { width: '45%', backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: COLORS.mathLight },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 28, fontWeight: '700', color: COLORS.math },
  doneText: { fontSize: 36, fontWeight: '800', color: COLORS.math, marginTop: 16 },
  doneScore: { fontSize: 20, color: COLORS.textLight, marginTop: 8 },
  retryBtn: { backgroundColor: COLORS.math, borderRadius: 16, paddingHorizontal: 40, paddingVertical: 16, marginTop: 24 },
  retryBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
});
