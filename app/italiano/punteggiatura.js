import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

const exercises = [
  { text: 'Ciao come stai', options: ['Ciao come stai?', 'Ciao come stai.', 'Ciao come stai!'], correct: 0, hint: 'È una domanda!' },
  { text: 'Che bello', options: ['Che bello.', 'Che bello!', 'Che bello?'], correct: 1, hint: 'Esprimi entusiasmo!' },
  { text: 'Il gatto dorme', options: ['Il gatto dorme!', 'Il gatto dorme?', 'Il gatto dorme.'], correct: 2, hint: 'È una frase che descrive' },
  { text: 'Ho comprato mele pere e banane', options: ['Ho comprato mele pere e banane.', 'Ho comprato mele, pere e banane.', 'Ho comprato, mele pere e banane.'], correct: 1, hint: 'Usa la virgola per separare gli elementi' },
  { text: 'Mamma posso uscire', options: ['Mamma posso uscire.', 'Mamma, posso uscire?', 'Mamma posso uscire!'], correct: 1, hint: 'Si chiama qualcuno e si fa una domanda' },
  { text: 'Il maestro disse aprite i libri', options: ['Il maestro disse: "Aprite i libri".', 'Il maestro disse aprite i libri.', 'Il maestro disse, aprite i libri!'], correct: 0, hint: 'Usa i due punti e le virgolette' },
  { text: 'Evviva abbiamo vinto', options: ['Evviva abbiamo vinto.', 'Evviva, abbiamo vinto?', 'Evviva, abbiamo vinto!'], correct: 2, hint: 'È un\'esclamazione di gioia' },
  { text: 'Dove vai', options: ['Dove vai.', 'Dove vai!', 'Dove vai?'], correct: 2, hint: 'Stai chiedendo qualcosa' },
  { text: 'Marco è un bravo ragazzo studia molto', options: ['Marco è un bravo ragazzo, studia molto.', 'Marco è un bravo ragazzo studia molto.', 'Marco, è un bravo ragazzo studia molto.'], correct: 0, hint: 'Serve una pausa tra le due informazioni' },
  { text: 'Ieri sono andato a scuola al parco e in piscina', options: ['Ieri sono andato a scuola al parco e in piscina.', 'Ieri sono andato a scuola, al parco e in piscina.', 'Ieri sono andato, a scuola al parco e in piscina.'], correct: 1, hint: 'Elenca i posti con la virgola' },
  { text: 'Aiuto', options: ['Aiuto.', 'Aiuto?', 'Aiuto!'], correct: 2, hint: 'È un grido!' },
  { text: 'Mi piacciono tre animali il cane il gatto e il coniglio', options: ['Mi piacciono tre animali: il cane, il gatto e il coniglio.', 'Mi piacciono tre animali il cane il gatto e il coniglio.', 'Mi piacciono tre animali, il cane il gatto e il coniglio.'], correct: 0, hint: 'I due punti introducono l\'elenco' },
];

export default function Punteggiatura() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [questions] = useState(() => [...exercises].sort(() => Math.random() - 0.5));
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [done, setDone] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const q = questions[qi];

  const answer = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore(s => s + 1);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    setTimeout(() => {
      if (qi + 1 < questions.length) { setQi(qi + 1); setSelected(null); setShowHint(false); }
      else setDone(true);
    }, 1500);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const stars = pct >= 80 ? '🌟🌟🌟' : pct >= 60 ? '🌟🌟' : pct >= 40 ? '🌟' : '💪';
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.doneCard}>
          <Text style={styles.doneStars}>{stars}</Text>
          <Text style={styles.doneTitle}>Completato!</Text>
          <Text style={styles.doneScore}>{score} / {questions.length} ({pct}%)</Text>
          <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
            <Text style={styles.doneBtnText}>← Torna all'Italiano</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>

      <View style={styles.progressRow}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${((qi + 1) / questions.length) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{qi + 1}/{questions.length}</Text>
      </View>

      <Text style={styles.title}>✏️ Punteggiatura</Text>
      <Text style={styles.instructions}>Quale frase è scritta correttamente?</Text>

      <Animated.View style={[styles.qCard, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.qText}>"{q.text}"</Text>
      </Animated.View>

      {q.options.map((opt, i) => {
        let bg = COLORS.italianoLight;
        if (selected !== null) {
          if (i === q.correct) bg = '#D5F5E3';
          else if (i === selected) bg = '#FADBD8';
        }
        return (
          <TouchableOpacity key={i} style={[styles.optBtn, { backgroundColor: bg }]}
            activeOpacity={0.7} onPress={() => answer(i)}>
            <Text style={styles.optText}>{opt}</Text>
          </TouchableOpacity>
        );
      })}

      {!showHint && selected === null && (
        <TouchableOpacity onPress={() => setShowHint(true)} style={styles.hintBtn}>
          <Text style={styles.hintBtnText}>💡 Suggerimento</Text>
        </TouchableOpacity>
      )}
      {showHint && <Text style={styles.hintText}>💡 {q.hint}</Text>}

      <Text style={styles.scoreText}>⭐ {score} punti</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 40 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: COLORS.italiano, fontWeight: '600' },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  progressBg: { flex: 1, height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, marginRight: 10 },
  progressFill: { height: 8, backgroundColor: COLORS.italiano, borderRadius: 4 },
  progressText: { fontSize: 14, fontWeight: '600', color: COLORS.textLight },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.italiano, marginBottom: 4 },
  instructions: { fontSize: 15, color: COLORS.textLight, marginBottom: 16 },
  qCard: { backgroundColor: COLORS.italianoLight, padding: 24, borderRadius: 20, marginBottom: 20, ...SHADOWS.card },
  qText: { fontSize: 20, fontWeight: '600', color: COLORS.text, textAlign: 'center', fontStyle: 'italic' },
  optBtn: { padding: 16, borderRadius: 14, marginBottom: 10, ...SHADOWS.card },
  optText: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  hintBtn: { alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 16 },
  hintBtnText: { fontSize: 16, color: COLORS.italiano, fontWeight: '600' },
  hintText: { fontSize: 15, color: COLORS.italiano, textAlign: 'center', marginTop: 4, fontStyle: 'italic' },
  scoreText: { textAlign: 'center', fontSize: 18, fontWeight: '700', color: COLORS.italiano, marginTop: 16 },
  doneCard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  doneStars: { fontSize: 60 },
  doneTitle: { fontSize: 32, fontWeight: '800', color: COLORS.italiano, marginTop: 16 },
  doneScore: { fontSize: 24, color: COLORS.textLight, marginTop: 8 },
  doneBtn: { backgroundColor: COLORS.italiano, paddingHorizontal: 28, paddingVertical: 16, borderRadius: 20, marginTop: 24 },
  doneBtnText: { color: '#FFF', fontWeight: '700', fontSize: 18 },
});
