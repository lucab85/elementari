import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { hapticCorrect, hapticWrong, hapticTap, getCorrectMessage, getWrongMessage } from '../../components/KidsFeedback';

// Equivalenze: km↔m, m↔cm, kg↔g, l↔ml, h↔min
const conversions = [
  { from: 'km', to: 'm', factor: 1000, emoji: '📏' },
  { from: 'm', to: 'cm', factor: 100, emoji: '📐' },
  { from: 'cm', to: 'mm', factor: 10, emoji: '📐' },
  { from: 'kg', to: 'g', factor: 1000, emoji: '⚖️' },
  { from: 'g', to: 'mg', factor: 1000, emoji: '⚖️' },
  { from: 'l', to: 'ml', factor: 1000, emoji: '🧪' },
  { from: 'h', to: 'min', factor: 60, emoji: '⏰' },
  { from: 'min', to: 's', factor: 60, emoji: '⏱️' },
];

function generate() {
  const conv = conversions[Math.floor(Math.random() * conversions.length)];
  const toSmaller = Math.random() > 0.5;
  if (toSmaller) {
    const value = Math.floor(Math.random() * 10) + 1;
    const answer = value * conv.factor;
    const wrong1 = answer + Math.floor(Math.random() * conv.factor);
    const wrong2 = Math.max(1, answer - Math.floor(Math.random() * conv.factor));
    const options = [String(answer), String(wrong1), String(wrong2)].sort(() => Math.random() - 0.5);
    return {
      question: `${value} ${conv.from} = ? ${conv.to}`,
      answer: String(answer),
      options,
      correct: options.indexOf(String(answer)),
      emoji: conv.emoji,
    };
  } else {
    const multiplier = Math.floor(Math.random() * 10) + 1;
    const value = multiplier * conv.factor;
    const answer = multiplier;
    const wrong1 = answer + Math.floor(Math.random() * 5) + 1;
    const wrong2 = Math.max(1, answer - Math.floor(Math.random() * 5) - 1);
    const options = [String(answer), String(wrong1), String(wrong2)].sort(() => Math.random() - 0.5);
    return {
      question: `${value} ${conv.to} = ? ${conv.from}`,
      answer: String(answer),
      options,
      correct: options.indexOf(String(answer)),
      emoji: conv.emoji,
    };
  }
}

export default function Equivalenze() {
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
      Animated.sequence([
        Animated.spring(bounceAnim, { toValue: 1.2, useNativeDriver: true }),
        Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
    setTimeout(() => { setQ(generate()); setFeedback(null); }, correct ? 800 : 2000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <Animated.Text style={[styles.scoreText, { transform: [{ scale: bounceAnim }] }]}>⭐ {score}/{total}</Animated.Text>
      </View>
      <Text style={styles.title}>📏 Equivalenze</Text>

      <View style={styles.refBox}>
        <Text style={styles.refText}>1 km = 1000 m • 1 m = 100 cm • 1 kg = 1000 g</Text>
        <Text style={styles.refText}>1 l = 1000 ml • 1 h = 60 min • 1 min = 60 s</Text>
      </View>

      <View style={styles.questionBox}>
        <Text style={{ fontSize: 40 }}>{q.emoji}</Text>
        <Text style={styles.questionText}>{q.question}</Text>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Grande! 💪</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>💡 Era: {q.answer}</Text>}

      <View style={styles.options}>
        {q.options.map((opt, i) => (
          <TouchableOpacity key={i}
            style={[styles.optionBtn, feedback && i === q.correct && styles.optionCorrect, feedback === 'wrong' && i !== q.correct && styles.optionFaded]}
            onPress={() => handleAnswer(i)} activeOpacity={0.7}>
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  backText: { fontSize: 16, color: COLORS.math, fontWeight: '600' },
  scoreText: { fontSize: 20, fontWeight: '700', color: COLORS.math },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.math, marginBottom: 12 },
  refBox: { backgroundColor: COLORS.mathLight, borderRadius: 16, padding: 12, marginBottom: 20 },
  refText: { fontSize: 13, color: COLORS.math, fontWeight: '600', textAlign: 'center', lineHeight: 20 },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 24, padding: 28, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  questionText: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginTop: 12 },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { gap: 12 },
  optionBtn: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: COLORS.mathLight },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 26, fontWeight: '700', color: COLORS.math },
});
