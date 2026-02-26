import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { civicaQuiz } from '../../data/civica';
import { hapticCorrect, hapticWrong, hapticTap, getCorrectMessage, getWrongMessage } from '../../components/KidsFeedback';

const CIV_COLOR = '#27AE60';
const CIV_LIGHT = '#D5F5E3';

export default function CivicaQuiz() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [questions] = useState(() => [...civicaQuiz].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[idx];

  const handleAnswer = (i) => {
    if (feedback !== null) return;
    const correct = i === q.correct;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) hapticCorrect(); else hapticWrong();
    if (correct) setScore(score + 1);
    setTimeout(() => { if (idx + 1 >= questions.length) setDone(true); else { setIdx(idx + 1); setFeedback(null); } }, correct ? 800 : 2000);
  };

  if (done) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={{ fontSize: 72 }}>🏛️</Text>
        <Text style={styles.doneText}>{score}/{questions.length} corrette!</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => { setIdx(0); setScore(0); setDone(false); setFeedback(null); }}><Text style={styles.retryBtnText}>Riprova</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }} style={{ marginTop: 16 }}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => { hapticTap(); router.back(); }} style={styles.back}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
      <Text style={styles.title}>❓ Quiz Educazione Civica</Text>
      <Text style={styles.progress}>{idx + 1}/{questions.length}</Text>
      <View style={styles.questionBox}><Text style={styles.questionText}>{q.question}</Text></View>
      {feedback === 'correct' && <Text style={styles.correctText}>✅ Perfetto! 🎯</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>💡 Era: {q.options[q.correct]}</Text>}
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
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: CIV_COLOR, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: CIV_COLOR, marginBottom: 8 },
  progress: { fontSize: 14, color: COLORS.textLight, marginBottom: 16 },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  questionText: { fontSize: 24, fontWeight: '600', color: COLORS.text, lineHeight: 30 },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { gap: 10 },
  optionBtn: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: CIV_LIGHT },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 19, fontWeight: '700', color: CIV_COLOR },
  doneText: { fontSize: 28, fontWeight: '800', color: CIV_COLOR, marginTop: 16 },
  retryBtn: { backgroundColor: CIV_COLOR, borderRadius: 16, paddingHorizontal: 40, paddingVertical: 16, marginTop: 24 },
  retryBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
});
