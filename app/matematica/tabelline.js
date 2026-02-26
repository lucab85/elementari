import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

function generateQuestion(table) {
  const a = table || (Math.floor(Math.random() * 8) + 2);
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, answer: a * b };
}

function generateOptions(correct) {
  const opts = new Set([correct]);
  while (opts.size < 4) {
    const offset = Math.floor(Math.random() * 20) - 10;
    const v = correct + offset;
    if (v > 0 && v !== correct) opts.add(v);
  }
  return Array.from(opts).sort(() => Math.random() - 0.5);
}

export default function Tabelline() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedTable, setSelectedTable] = useState(null);
  const [question, setQuestion] = useState(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const startTable = (t) => {
    setSelectedTable(t);
    setQuestion(generateQuestion(t));
    setStreak(0);
    setFeedback(null);
  };

  const nextQuestion = () => {
    setQuestion(generateQuestion(selectedTable));
    setFeedback(null);
  };

  const handleAnswer = (ans) => {
    if (feedback !== null) return;
    const isCorrect = ans === question.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.3, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      ]).start();
    } else {
      setStreak(0);
    }

    setTimeout(nextQuestion, isCorrect ? 1000 : 2000);
  };

  // Table selection screen
  if (!selectedTable) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <Text style={styles.title}>✖️ Tabelline</Text>
        <Text style={styles.subtitle}>Scegli una tabellina</Text>
        <View style={styles.tableGrid}>
          {[2, 3, 4, 5, 6, 7, 8, 9].map((t) => (
            <TouchableOpacity key={t} style={styles.tableBtn} onPress={() => startTable(t)} activeOpacity={0.7}>
              <Text style={styles.tableBtnText}>×{t}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.tableBtn, styles.tableBtnAll]} onPress={() => startTable(0)} activeOpacity={0.7}>
            <Text style={[styles.tableBtnText, { color: '#FFF' }]}>Tutte!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const options = generateOptions(question.answer);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedTable(null)}>
          <Text style={styles.backText}>← Tabelline</Text>
        </TouchableOpacity>
        <View style={styles.streakBox}>
          <Animated.Text style={[styles.streakText, { transform: [{ scale: scaleAnim }] }]}>
            🔥 {streak}
          </Animated.Text>
        </View>
      </View>

      <View style={styles.questionBox}>
        <Text style={styles.questionText}>
          {question.a} × {question.b} = ?
        </Text>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Bravo! ⭐</Text>}
      {feedback === 'wrong' && (
        <Text style={styles.wrongText}>❌ Era {question.answer}</Text>
      )}

      <View style={styles.optionsGrid}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.optionBtn,
              feedback && opt === question.answer && styles.optionCorrect,
              feedback === 'wrong' && opt !== question.answer && styles.optionFaded,
            ]}
            onPress={() => handleAnswer(opt)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {bestStreak > 0 && <Text style={styles.bestStreak}>Miglior serie: ⭐ {bestStreak}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },
  back: { marginBottom: 8 },
  backText: { fontSize: 16, color: COLORS.math, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.math, marginBottom: 8 },
  subtitle: { fontSize: 18, color: COLORS.textLight, marginBottom: 24 },
  tableGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  tableBtn: {
    width: 80, height: 80, borderRadius: 20, backgroundColor: COLORS.mathLight,
    justifyContent: 'center', alignItems: 'center',
  },
  tableBtnAll: { width: 170, backgroundColor: COLORS.math },
  tableBtnText: { fontSize: 28, fontWeight: '800', color: COLORS.math },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  streakBox: { backgroundColor: COLORS.mathLight, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  streakText: { fontSize: 24, fontWeight: '700' },
  questionBox: {
    backgroundColor: COLORS.white, borderRadius: 24, padding: 40, alignItems: 'center',
    marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
  },
  questionText: { fontSize: 48, fontWeight: '800', color: COLORS.text },
  correctText: { fontSize: 24, textAlign: 'center', marginBottom: 16, color: COLORS.correct },
  wrongText: { fontSize: 24, textAlign: 'center', marginBottom: 16, color: COLORS.wrong },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  optionBtn: {
    width: '46%', paddingVertical: 20, borderRadius: 16, backgroundColor: COLORS.white,
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  optionCorrect: { backgroundColor: '#D5F5E3' },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 32, fontWeight: '700', color: COLORS.text },
  bestStreak: { textAlign: 'center', marginTop: 24, fontSize: 16, color: COLORS.textLight },
});
