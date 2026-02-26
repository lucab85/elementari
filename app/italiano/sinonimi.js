import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

const sinonimi = [
  { word: 'Bello', type: 'sinonimo', options: ['Carino', 'Brutto', 'Grande', 'Piccolo'], correct: 0 },
  { word: 'Grande', type: 'sinonimo', options: ['Piccolo', 'Enorme', 'Basso', 'Stretto'], correct: 1 },
  { word: 'Felice', type: 'sinonimo', options: ['Triste', 'Contento', 'Arrabbiato', 'Stanco'], correct: 1 },
  { word: 'Veloce', type: 'sinonimo', options: ['Lento', 'Rapido', 'Pesante', 'Leggero'], correct: 1 },
  { word: 'Furbo', type: 'sinonimo', options: ['Stupido', 'Lento', 'Astuto', 'Pigro'], correct: 2 },
  { word: 'Gentile', type: 'sinonimo', options: ['Cattivo', 'Cortese', 'Triste', 'Duro'], correct: 1 },
  { word: 'Parlare', type: 'sinonimo', options: ['Tacere', 'Discorrere', 'Dormire', 'Mangiare'], correct: 1 },
  { word: 'Iniziare', type: 'sinonimo', options: ['Finire', 'Cominciare', 'Fermare', 'Rompere'], correct: 1 },
];

const contrari = [
  { word: 'Alto', type: 'contrario', options: ['Basso', 'Grande', 'Lungo', 'Grosso'], correct: 0 },
  { word: 'Caldo', type: 'contrario', options: ['Tiepido', 'Bollente', 'Freddo', 'Umido'], correct: 2 },
  { word: 'Lungo', type: 'contrario', options: ['Alto', 'Largo', 'Corto', 'Grosso'], correct: 2 },
  { word: 'Pieno', type: 'contrario', options: ['Vuoto', 'Grosso', 'Pesante', 'Largo'], correct: 0 },
  { word: 'Chiaro', type: 'contrario', options: ['Luminoso', 'Scuro', 'Pallido', 'Bianco'], correct: 1 },
  { word: 'Aprire', type: 'contrario', options: ['Spalancare', 'Chiudere', 'Tirare', 'Spingere'], correct: 1 },
  { word: 'Ridere', type: 'contrario', options: ['Sorridere', 'Piangere', 'Gridare', 'Cantare'], correct: 1 },
  { word: 'Salire', type: 'contrario', options: ['Correre', 'Camminare', 'Scendere', 'Saltare'], correct: 2 },
];

const IT_COLOR = COLORS.italiano;

export default function SinonimiContrari() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [questions] = useState(() => [...sinonimi, ...contrari].sort(() => Math.random() - 0.5));
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
        <Text style={{ fontSize: 72 }}>{pct >= 80 ? '🏆' : '💪'}</Text>
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
      <Text style={styles.title}>🔄 Sinonimi e Contrari</Text>
      <Text style={styles.progress}>{idx + 1}/{questions.length}</Text>

      <View style={styles.questionBox}>
        <View style={[styles.typeBadge, q.type === 'contrario' && styles.typeContrario]}>
          <Text style={styles.typeText}>{q.type === 'sinonimo' ? '= SINONIMO' : '≠ CONTRARIO'}</Text>
        </View>
        <Text style={styles.wordText}>{q.word}</Text>
        <Text style={styles.questionLabel}>Trova il {q.type} di "{q.word}"</Text>
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
  backText: { fontSize: 16, color: IT_COLOR, fontWeight: '600' },
  scoreText: { fontSize: 20, fontWeight: '700', color: IT_COLOR },
  title: { fontSize: 26, fontWeight: '800', color: IT_COLOR, marginBottom: 4 },
  progress: { fontSize: 14, color: COLORS.textLight, marginBottom: 20 },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 24, padding: 28, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  typeBadge: { backgroundColor: '#D5F5E3', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12, marginBottom: 12 },
  typeContrario: { backgroundColor: '#FADBD8' },
  typeText: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  wordText: { fontSize: 36, fontWeight: '800', color: IT_COLOR, marginBottom: 8 },
  questionLabel: { fontSize: 16, color: COLORS.textLight },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { gap: 10 },
  optionBtn: { backgroundColor: COLORS.white, borderRadius: 16, padding: 18, alignItems: 'center', borderWidth: 2, borderColor: COLORS.italianoLight },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 20, fontWeight: '700', color: IT_COLOR },
  doneText: { fontSize: 28, fontWeight: '800', color: IT_COLOR, marginTop: 16 },
  retryBtn: { backgroundColor: IT_COLOR, borderRadius: 16, paddingHorizontal: 40, paddingVertical: 16, marginTop: 24 },
  retryBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
});
