import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { hapticCorrect, hapticWrong, hapticTap, getCorrectMessage, getWrongMessage } from '../../components/KidsFeedback';

const analisiQs = [
  { word: 'Il', sentence: '___ gatto dorme.', question: 'Che cos\'è "il"?', options: ['Articolo', 'Nome', 'Verbo', 'Aggettivo'], correct: 0 },
  { word: 'gatto', sentence: 'Il ___ dorme.', question: 'Che cos\'è "gatto"?', options: ['Verbo', 'Aggettivo', 'Nome', 'Articolo'], correct: 2 },
  { word: 'dorme', sentence: 'Il gatto ___.', question: 'Che cos\'è "dorme"?', options: ['Nome', 'Verbo', 'Aggettivo', 'Avverbio'], correct: 1 },
  { word: 'bella', sentence: 'La ___ casa.', question: 'Che cos\'è "bella"?', options: ['Nome', 'Verbo', 'Aggettivo', 'Articolo'], correct: 2 },
  { word: 'velocemente', sentence: 'Corre ___.', question: 'Che cos\'è "velocemente"?', options: ['Aggettivo', 'Nome', 'Verbo', 'Avverbio'], correct: 3 },
  { word: 'una', sentence: '___ bambina gioca.', question: 'Che cos\'è "una"?', options: ['Nome', 'Articolo', 'Aggettivo', 'Verbo'], correct: 1 },
  { word: 'mangia', sentence: 'Marco ___ la mela.', question: 'Che cos\'è "mangia"?', options: ['Nome', 'Aggettivo', 'Articolo', 'Verbo'], correct: 3 },
  { word: 'grande', sentence: 'Un albero ___.', question: 'Che cos\'è "grande"?', options: ['Verbo', 'Aggettivo', 'Nome', 'Avverbio'], correct: 1 },
  { word: 'sempre', sentence: 'Studio ___.', question: 'Che cos\'è "sempre"?', options: ['Aggettivo', 'Avverbio', 'Nome', 'Verbo'], correct: 1 },
  { word: 'mela', sentence: 'Mangio la ___.', question: 'Che cos\'è "mela"?', options: ['Verbo', 'Articolo', 'Nome', 'Avverbio'], correct: 2 },
  { word: 'e', sentence: 'Pane ___ burro.', question: 'Che cos\'è "e"?', options: ['Articolo', 'Congiunzione', 'Nome', 'Verbo'], correct: 1 },
  { word: 'nel', sentence: 'Gioco ___ parco.', question: 'Che cos\'è "nel"?', options: ['Preposizione', 'Articolo', 'Nome', 'Verbo'], correct: 0 },
  { word: 'Lei', sentence: '___ è gentile.', question: 'Che cos\'è "lei"?', options: ['Nome', 'Articolo', 'Pronome', 'Verbo'], correct: 2 },
  { word: 'questo', sentence: '___ libro è bello.', question: 'Che cos\'è "questo"?', options: ['Articolo', 'Aggettivo dimostrativo', 'Nome', 'Verbo'], correct: 1 },
  { word: 'cantano', sentence: 'I bambini ___.', question: 'Che cos\'è "cantano"?', options: ['Nome', 'Aggettivo', 'Avverbio', 'Verbo'], correct: 3 },
];

const IT_COLOR = COLORS.italiano;

export default function Analisi() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [questions] = useState(() => [...analisiQs].sort(() => Math.random() - 0.5));
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
    if (correct) hapticCorrect(); else hapticWrong();
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
        <Text style={{ fontSize: 72 }}>{pct >= 80 ? '🏆' : pct >= 60 ? '📗' : '💪'}</Text>
        <Text style={styles.doneText}>Analisi finita!</Text>
        <Text style={styles.doneScore}>{score}/{questions.length} ({pct}%)</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => { setIdx(0); setScore(0); setDone(false); setFeedback(null); }}><Text style={styles.retryBtnText}>Riprova</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }} style={{ marginTop: 16 }}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
        <Animated.Text style={[styles.scoreText, { transform: [{ scale: bounceAnim }] }]}>⭐ {score}</Animated.Text>
      </View>
      <Text style={styles.title}>🔍 Analisi Grammaticale</Text>
      <Text style={styles.progress}>{idx + 1}/{questions.length}</Text>

      <View style={styles.questionBox}>
        <Text style={styles.sentence}>{q.sentence}</Text>
        <View style={styles.wordBadge}><Text style={styles.wordText}>{q.word}</Text></View>
        <Text style={styles.questionText}>{q.question}</Text>
      </View>

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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 12 },
  backText: { fontSize: 16, color: IT_COLOR, fontWeight: '600' },
  scoreText: { fontSize: 20, fontWeight: '700', color: IT_COLOR },
  title: { fontSize: 26, fontWeight: '800', color: IT_COLOR, marginBottom: 4 },
  progress: { fontSize: 14, color: COLORS.textLight, marginBottom: 20 },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 24, padding: 28, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  sentence: { fontSize: 20, color: COLORS.textLight, marginBottom: 12, fontStyle: 'italic' },
  wordBadge: { backgroundColor: COLORS.italianoLight, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 16, marginBottom: 12 },
  wordText: { fontSize: 28, fontWeight: '800', color: IT_COLOR },
  questionText: { fontSize: 24, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { gap: 10 },
  optionBtn: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: COLORS.italianoLight },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 19, fontWeight: '700', color: IT_COLOR },
  doneText: { fontSize: 32, fontWeight: '800', color: IT_COLOR, marginTop: 16 },
  doneScore: { fontSize: 20, color: COLORS.textLight, marginTop: 8 },
  retryBtn: { backgroundColor: IT_COLOR, borderRadius: 16, paddingHorizontal: 40, paddingVertical: 16, marginTop: 24 },
  retryBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
});
