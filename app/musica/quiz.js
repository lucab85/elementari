import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';
import { musicaQuiz } from '../../data/musica';
import { useTrackScreen, useTrackActivity } from '../../hooks/useAnalytics';
import { hapticCorrect, hapticWrong, hapticTap, getCorrectMessage, getWrongMessage } from '../../components/KidsFeedback';

const MUSICA_COLOR = '#E91E63';

export default function QuizMusica() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [questions] = useState(() => [...musicaQuiz].sort(() => Math.random() - 0.5));
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useTrackScreen('Musica > Quiz');
  const { onStart, onAnswer, onComplete } = useTrackActivity('quiz_musica', 'musica');

  useState(() => { onStart(); }, []);

  const q = questions[qi];

  const answer = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === q.correct;
    if (correct) setScore(s => s + 1);
    onAnswer(correct, qi);

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      if (qi + 1 < questions.length) {
        setQi(qi + 1);
        setSelected(null);
      } else {
        setDone(true);
        onComplete(score + (i === q.correct ? 1 : 0), questions.length);
      }
    }, 1200);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const stars = pct >= 80 ? '🌟🌟🌟' : pct >= 60 ? '🌟🌟' : pct >= 40 ? '🌟' : '💪';
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.doneCard}>
          <Text style={styles.doneStars}>{stars}</Text>
          <Text style={styles.doneTitle}>Quiz Completato!</Text>
          <Text style={styles.doneScore}>{score} / {questions.length} ({pct}%)</Text>
          <TouchableOpacity style={styles.doneBtn} onPress={() => { hapticTap(); router.back(); }}>
            <Text style={styles.doneBtnText}>← Torna alla Musica</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }} style={styles.back}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>

        <View style={styles.progressRow}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${((qi + 1) / questions.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{qi + 1}/{questions.length}</Text>
        </View>

        <Animated.View style={[styles.qCard, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.qText}>{q.q}</Text>
        </Animated.View>

        {q.options.map((opt, i) => {
          let bg = '#FCE4EC';
          if (selected !== null) {
            if (i === q.correct) bg = '#D5F5E3';
            else if (i === selected) bg = '#FADBD8';
          }
          return (
            <TouchableOpacity key={i} style={[styles.optBtn, { backgroundColor: bg }]}
              activeOpacity={0.7} onPress={() => answer(i)}>
              <Text style={styles.optText}>{opt}</Text>
              {selected !== null && i === q.correct && <Text style={styles.check}>✓</Text>}
              {selected !== null && i === selected && i !== q.correct && <Text style={styles.cross}>✗</Text>}
            </TouchableOpacity>
          );
        })}

        <Text style={styles.scoreText}>⭐ {score} punti</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, flex: 1 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: MUSICA_COLOR, fontWeight: '600' },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  progressBg: { flex: 1, height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, marginRight: 10 },
  progressFill: { height: 8, backgroundColor: MUSICA_COLOR, borderRadius: 4 },
  progressText: { fontSize: 14, fontWeight: '600', color: COLORS.textLight },
  qCard: { backgroundColor: '#FCE4EC', padding: 28, borderRadius: 20, marginBottom: 20, ...SHADOWS.card },
  qText: { fontSize: 22, fontWeight: '700', color: MUSICA_COLOR, textAlign: 'center' },
  optBtn: {
    padding: 18, borderRadius: 16, marginBottom: 12, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center', ...SHADOWS.card,
  },
  optText: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  check: { fontSize: 22, color: COLORS.correct, fontWeight: '800' },
  cross: { fontSize: 22, color: COLORS.wrong, fontWeight: '800' },
  scoreText: { textAlign: 'center', fontSize: 18, fontWeight: '700', color: MUSICA_COLOR, marginTop: 12 },
  doneCard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  doneStars: { fontSize: 60 },
  doneTitle: { fontSize: 32, fontWeight: '800', color: MUSICA_COLOR, marginTop: 16 },
  doneScore: { fontSize: 24, color: COLORS.textLight, marginTop: 8 },
  doneBtn: { backgroundColor: MUSICA_COLOR, paddingHorizontal: 28, paddingVertical: 16, borderRadius: 20, marginTop: 24 },
  doneBtnText: { color: '#FFF', fontWeight: '700', fontSize: 18 },
});
