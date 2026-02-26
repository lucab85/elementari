import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { hapticCorrect, hapticWrong, hapticTap, getCorrectMessage, getWrongMessage } from '../../components/KidsFeedback';

function generate() {
  const bases = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const exps = [2, 3];
  const base = bases[Math.floor(Math.random() * bases.length)];
  const exp = exps[Math.floor(Math.random() * exps.length)];
  const answer = Math.pow(base, exp);
  const w1 = base * exp;
  const w2 = answer + Math.floor(Math.random() * 20) + 1;
  const w3 = Math.max(1, answer - Math.floor(Math.random() * 20) - 1);
  const options = [...new Set([answer, w1, w2, w3])].slice(0, 4).sort(() => Math.random() - 0.5);
  return { base, exp, answer, options, correct: options.indexOf(answer) };
}

export default function Potenze() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState(generate());
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const handleAnswer = (i) => {
    if (feedback !== null) return;
    const correct = i === q.correct;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) hapticCorrect(); else hapticWrong();
    setTotal(total + 1);
    if (correct) {
      setScore(score + 1);
      Animated.sequence([Animated.spring(bounceAnim, { toValue: 1.2, useNativeDriver: true }), Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true })]).start();
    }
    setTimeout(() => { setQ(generate()); setFeedback(null); }, correct ? 800 : 2000);
  };

  const supText = q.exp === 2 ? '²' : '³';

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
        <Animated.Text style={[styles.scoreText, { transform: [{ scale: bounceAnim }] }]}>⭐ {score}/{total}</Animated.Text>
      </View>
      <Text style={styles.title}>💪 Potenze</Text>

      <View style={styles.refBox}>
        <Text style={styles.refText}>3² = 3 × 3 = 9  •  2³ = 2 × 2 × 2 = 8</Text>
      </View>

      <View style={styles.questionBox}>
        <Text style={styles.questionText}>{q.base}{supText} = ?</Text>
        <Text style={styles.expanded}>{q.base} {'× '.repeat(q.exp - 1).split(' ').filter(Boolean).map(() => q.base).join(' × ')}</Text>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Bravissimo! 🌟</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>💡 Era: {q.answer}</Text>}

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
  content: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 12 },
  backText: { fontSize: 16, color: COLORS.math, fontWeight: '600' },
  scoreText: { fontSize: 20, fontWeight: '700', color: COLORS.math },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.math, marginBottom: 12 },
  refBox: { backgroundColor: COLORS.mathLight, borderRadius: 16, padding: 12, marginBottom: 20 },
  refText: { fontSize: 15, color: COLORS.math, fontWeight: '600', textAlign: 'center' },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 24, padding: 32, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  questionText: { fontSize: 48, fontWeight: '800', color: COLORS.math },
  expanded: { fontSize: 18, color: COLORS.textLight, marginTop: 8 },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  optionBtn: { width: '44%', backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: COLORS.mathLight },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 28, fontWeight: '700', color: COLORS.math },
});
