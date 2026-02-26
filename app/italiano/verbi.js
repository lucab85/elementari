import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

const verbiQs = [
  { infinito: 'Andare', tempo: 'Presente - Io', options: ['Vado', 'Ando', 'Vai', 'Andiamo'], correct: 0 },
  { infinito: 'Andare', tempo: 'Passato prossimo - Io', options: ['Ho andato', 'Sono andato', 'Andai', 'Andrò'], correct: 1 },
  { infinito: 'Fare', tempo: 'Presente - Io', options: ['Fò', 'Faccio', 'Fo', 'Fai'], correct: 1 },
  { infinito: 'Fare', tempo: 'Passato prossimo - Noi', options: ['Abbiamo fatto', 'Abbiamo fato', 'Siamo fatti', 'Facemmo'], correct: 0 },
  { infinito: 'Dire', tempo: 'Presente - Tu', options: ['Diri', 'Dici', 'Dice', 'Di'], correct: 1 },
  { infinito: 'Dire', tempo: 'Passato prossimo - Lui', options: ['Ha ditto', 'Ha diceto', 'Ha detto', 'È detto'], correct: 2 },
  { infinito: 'Stare', tempo: 'Presente - Noi', options: ['Stamo', 'Stiamo', 'Stanno', 'State'], correct: 1 },
  { infinito: 'Dare', tempo: 'Presente - Io', options: ['Dò', 'Do', 'Dai', 'Daro'], correct: 1 },
  { infinito: 'Venire', tempo: 'Presente - Io', options: ['Veno', 'Venio', 'Vengo', 'Vieni'], correct: 2 },
  { infinito: 'Venire', tempo: 'Passato prossimo - Io', options: ['Ho venuto', 'Sono venuto', 'Venni', 'Verrò'], correct: 1 },
  { infinito: 'Bere', tempo: 'Presente - Io', options: ['Bero', 'Bevo', 'Beio', 'Beo'], correct: 1 },
  { infinito: 'Bere', tempo: 'Passato prossimo - Tu', options: ['Hai berto', 'Hai bevuto', 'Hai buto', 'Sei bevuto'], correct: 1 },
  { infinito: 'Sapere', tempo: 'Presente - Io', options: ['Sapo', 'Sappo', 'So', 'Sepo'], correct: 2 },
  { infinito: 'Potere', tempo: 'Presente - Io', options: ['Poto', 'Posso', 'Puoto', 'Puoi'], correct: 1 },
  { infinito: 'Volere', tempo: 'Presente - Io', options: ['Volo', 'Volio', 'Vuolo', 'Voglio'], correct: 3 },
  { infinito: 'Uscire', tempo: 'Presente - Io', options: ['Usco', 'Uscio', 'Esco', 'Usci'], correct: 2 },
];

const IT_COLOR = COLORS.italiano;

export default function Verbi() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [questions] = useState(() => [...verbiQs].sort(() => Math.random() - 0.5));
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
      <Text style={styles.title}>🔤 Verbi Irregolari</Text>
      <Text style={styles.progress}>{idx + 1}/{questions.length}</Text>

      <View style={styles.questionBox}>
        <View style={styles.verbBadge}><Text style={styles.verbText}>{q.infinito}</Text></View>
        <Text style={styles.tempoText}>{q.tempo}</Text>
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
  backText: { fontSize: 16, color: IT_COLOR, fontWeight: '600' },
  scoreText: { fontSize: 20, fontWeight: '700', color: IT_COLOR },
  title: { fontSize: 28, fontWeight: '800', color: IT_COLOR, marginBottom: 4 },
  progress: { fontSize: 14, color: COLORS.textLight, marginBottom: 20 },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 24, padding: 28, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  verbBadge: { backgroundColor: COLORS.italianoLight, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 16, marginBottom: 12 },
  verbText: { fontSize: 28, fontWeight: '800', color: IT_COLOR },
  tempoText: { fontSize: 18, color: COLORS.textLight, fontWeight: '600' },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { gap: 10 },
  optionBtn: { backgroundColor: COLORS.white, borderRadius: 16, padding: 18, alignItems: 'center', borderWidth: 2, borderColor: COLORS.italianoLight },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 22, fontWeight: '700', color: IT_COLOR },
  doneText: { fontSize: 28, fontWeight: '800', color: IT_COLOR, marginTop: 16 },
  retryBtn: { backgroundColor: IT_COLOR, borderRadius: 16, paddingHorizontal: 40, paddingVertical: 16, marginTop: 24 },
  retryBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
});
