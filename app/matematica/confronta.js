import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import {
  getCorrectMessage, getWrongMessage, hapticCorrect, hapticWrong, hapticTap,
  CelebrationOverlay, FeedbackCard, AnimatedScore, StreakBadge,
} from '../../components/KidsFeedback';

function generate() {
  const level = Math.random();
  let a, b;
  if (level < 0.3) { a = Math.floor(Math.random() * 100); b = Math.floor(Math.random() * 100); }
  else if (level < 0.6) { a = Math.floor(Math.random() * 1000); b = Math.floor(Math.random() * 1000); }
  else { a = Math.floor(Math.random() * 10000); b = Math.floor(Math.random() * 10000); }
  if (a === b) b += 1;
  return { a, b, correct: a > b ? '>' : a < b ? '<' : '=' };
}

export default function Confronta() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState(generate());
  const [feedback, setFeedback] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const handleAnswer = (symbol) => {
    if (feedback !== null) return;
    const correct = symbol === q.correct;
    setTotal(t => t + 1);

    if (correct) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      setFeedback('correct');
      setFeedbackMsg(getCorrectMessage());
      hapticCorrect();
      if ((streak + 1) % 5 === 0) setShowCelebration(true);
      Animated.sequence([
        Animated.spring(bounceAnim, { toValue: 1.3, friction: 3, useNativeDriver: true }),
        Animated.spring(bounceAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]).start();
    } else {
      setStreak(0);
      setFeedback('wrong');
      setFeedbackMsg(getWrongMessage());
      hapticWrong();
    }

    setTimeout(() => { setQ(generate()); setFeedback(null); }, correct ? 1000 : 2000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <CelebrationOverlay visible={showCelebration} onDone={() => setShowCelebration(false)} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <AnimatedScore score={score} total={total} color={COLORS.math} />
      </View>

      <Text style={styles.title}>⚖️ Confronta</Text>
      <Text style={styles.subtitle}>Quale simbolo va in mezzo?</Text>

      <StreakBadge streak={streak} />

      <Animated.View style={[styles.questionBox, { transform: [{ scale: bounceAnim }] }]}>
        <Text style={styles.number}>{q.a}</Text>
        <View style={styles.questionMark}>
          <Text style={styles.vs}>?</Text>
        </View>
        <Text style={styles.number}>{q.b}</Text>
      </Animated.View>

      {feedback && (
        <FeedbackCard
          type={feedback}
          message={feedbackMsg}
          answer={feedback === 'wrong' ? `${q.a} ${q.correct} ${q.b}` : undefined}
        />
      )}

      <View style={styles.buttons}>
        {['<', '=', '>'].map((sym) => (
          <TouchableOpacity
            key={sym}
            style={styles.symbolBtn}
            onPress={() => handleAnswer(sym)}
            activeOpacity={0.7}
            disabled={feedback !== null}
          >
            <Text style={styles.symbolText}>{sym}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  backText: { fontSize: 18, color: COLORS.math, fontWeight: '700' },
  title: { fontSize: 30, fontWeight: '900', color: COLORS.math, marginBottom: 4 },
  subtitle: { fontSize: 17, color: COLORS.textLight, marginBottom: 20 },
  questionBox: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 28, padding: 36, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 8,
  },
  number: { fontSize: 46, fontWeight: '900', color: COLORS.text },
  questionMark: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.mathLight,
    justifyContent: 'center', alignItems: 'center', marginHorizontal: 20,
  },
  vs: { fontSize: 32, fontWeight: '800', color: COLORS.math },
  buttons: { flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 12 },
  symbolBtn: {
    width: 100, height: 100, borderRadius: 24, backgroundColor: COLORS.mathLight,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: COLORS.math, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
  },
  symbolText: { fontSize: 48, fontWeight: '900', color: COLORS.math },
});
