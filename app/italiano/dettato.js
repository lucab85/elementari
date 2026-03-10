import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { hapticCorrect, hapticWrong, hapticTap, getCorrectMessage, getWrongMessage } from '../../components/KidsFeedback';

const words = [
  { word: 'ACQUA', blank: 'A_QUA', options: ['C', 'CQ', 'QU', 'CC'], correct: 0 },
  { word: 'SCUOLA', blank: 'S_OLA', options: ['CU', 'QU', 'CQU', 'GU'], correct: 0 },
  { word: 'CUORE', blank: '_ORE', options: ['QU', 'CU', 'GU', 'CO'], correct: 1 },
  { word: 'QUADERNO', blank: '_ADERNO', options: ['CU', 'QU', 'GU', 'CO'], correct: 1 },
  { word: 'AQUILA', blank: 'A_ILA', options: ['CU', 'QU', 'GU', 'CQU'], correct: 1 },
  { word: 'CUCINA', blank: '_CINA', options: ['QU', 'CU', 'CO', 'CA'], correct: 1 },
  { word: 'SOQQUADRO', blank: 'SO_ADRO', options: ['QU', 'CQU', 'QQU', 'CU'], correct: 2 },
  { word: 'FAMIGLIA', blank: 'FAMI_IA', options: ['GL', 'LI', 'GLI', 'GN'], correct: 2 },
  { word: 'CONIGLIO', blank: 'CONI_O', options: ['LI', 'GLI', 'GL', 'GN'], correct: 1 },
  { word: 'RAGNO', blank: 'RA_O', options: ['GN', 'NN', 'NI', 'GNI'], correct: 0 },
  { word: 'MONTAGNA', blank: 'MONTA_A', options: ['NI', 'GNA', 'GN', 'NN'], correct: 2 },
  { word: 'GNOMO', blank: '_OMO', options: ['N', 'GN', 'NI', 'NN'], correct: 1 },
  { word: 'SCIARE', blank: '_ARE', options: ['SCI', 'SI', 'SH', 'SC'], correct: 0 },
  { word: 'PESCE', blank: 'PE_E', options: ['SC', 'SCI', 'SH', 'SS'], correct: 0 },
  { word: 'CIAO', blank: '_AO', options: ['CI', 'CH', 'GI', 'C'], correct: 0 },
  { word: 'CIELO', blank: '_ELO', options: ['CI', 'CH', 'CE', 'GI'], correct: 0 },
  { word: 'CHIESA', blank: '_ESA', options: ['CI', 'CH', 'CE', 'GI'], correct: 1 },
  { word: 'GHIACCIO', blank: '_ACCIO', options: ['GI', 'GHI', 'GH', 'CHI'], correct: 1 },
];

export default function Dettato() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [shuffled] = useState(() => [...words].sort(() => Math.random() - 0.5).slice(0, 10));
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const q = shuffled[idx];

  const handleAnswer = (i) => {
    if (feedback !== null) return;
    const correct = i === q.correct;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) hapticCorrect(); else hapticWrong();
    if (correct) {
      setScore(score + 1);
      Animated.sequence([Animated.spring(bounceAnim, { toValue: 1.2, useNativeDriver: true }), Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true })]).start();
    }
    setTimeout(() => { if (idx + 1 >= shuffled.length) setDone(true); else { setIdx(idx + 1); setFeedback(null); } }, correct ? 800 : 2000);
  };

  if (done) {
    const pct = Math.round((score / shuffled.length) * 100);
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={{ fontSize: 72 }}>{pct >= 80 ? '🏆' : pct >= 60 ? '📝' : '💪'}</Text>
        <Text style={styles.doneText}>Dettato finito!</Text>
        <Text style={styles.doneScore}>{score}/{shuffled.length} ({pct}%)</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => { setIdx(0); setScore(0); setDone(false); setFeedback(null); }}><Text style={styles.retryBtnText}>Riprova</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }} style={{ marginTop: 16 }}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
        <Animated.Text style={[styles.scoreLabel, { transform: [{ scale: bounceAnim }] }]}>⭐ {score}</Animated.Text>
      </View>
      <Text style={styles.title}>✍️ Dettato Ortografico</Text>
      <Text style={styles.progress}>{idx + 1}/{shuffled.length}</Text>

      <View style={styles.wordBox}>
        <Text style={styles.blankText}>{q.blank}</Text>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ {q.word}</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>💡 Era: {q.word}</Text>}

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

const IT_COLOR = COLORS.italiano;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  backText: { fontSize: 16, color: IT_COLOR, fontWeight: '600' },
  scoreLabel: { fontSize: 22, fontWeight: '700', color: IT_COLOR },
  title: { fontSize: 28, fontWeight: '800', color: IT_COLOR, marginBottom: 4 },
  progress: { fontSize: 14, color: COLORS.textLight, marginBottom: 20 },
  wordBox: { backgroundColor: COLORS.white, borderRadius: 24, padding: 32, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  blankText: { fontSize: 42, fontWeight: '800', color: COLORS.text, letterSpacing: 4 },
  correctText: { fontSize: 22, textAlign: 'center', marginBottom: 12, color: COLORS.correct, fontWeight: '700' },
  wrongText: { fontSize: 22, textAlign: 'center', marginBottom: 12, color: COLORS.wrong, fontWeight: '700' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  optionBtn: { width: '44%', backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: COLORS.italianoLight },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 24, fontWeight: '700', color: IT_COLOR },
  doneText: { fontSize: 32, fontWeight: '800', color: IT_COLOR, marginTop: 16 },
  doneScore: { fontSize: 20, color: COLORS.textLight, marginTop: 8 },
  retryBtn: { backgroundColor: IT_COLOR, borderRadius: 16, paddingHorizontal: 40, paddingVertical: 16, marginTop: 24 },
  retryBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
});
