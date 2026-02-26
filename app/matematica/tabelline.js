import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import {
  getCorrectMessage, getWrongMessage, hapticCorrect, hapticWrong, hapticTap,
  CelebrationOverlay, FeedbackCard, StreakBadge,
} from '../../components/KidsFeedback';

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
  const [options, setOptions] = useState([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const startTable = (t) => {
    hapticTap();
    setSelectedTable(t);
    const q = generateQuestion(t);
    setQuestion(q);
    setOptions(generateOptions(q.answer));
    setStreak(0);
    setScore(0);
    setTotal(0);
    setFeedback(null);
  };

  const nextQuestion = () => {
    const q = generateQuestion(selectedTable);
    setQuestion(q);
    setOptions(generateOptions(q.answer));
    setFeedback(null);
  };

  const handleAnswer = (ans) => {
    if (feedback !== null) return;
    const isCorrect = ans === question.answer;
    setTotal(t => t + 1);

    if (isCorrect) {
      const newStreak = streak + 1;
      setScore(s => s + 1);
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setFeedback('correct');
      setFeedbackMsg(getCorrectMessage());
      hapticCorrect();

      if (newStreak % 5 === 0) setShowCelebration(true);

      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.3, friction: 3, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]).start();
    } else {
      setStreak(0);
      setFeedback('wrong');
      setFeedbackMsg(getWrongMessage());
      hapticWrong();
    }

    setTimeout(nextQuestion, isCorrect ? 1200 : 2500);
  };

  // Table selection screen
  if (!selectedTable) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }} style={styles.back}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <Text style={styles.title}>✖️ Tabelline</Text>
        <Text style={styles.subtitle}>Scegli una tabellina! 🎯</Text>
        <View style={styles.tableGrid}>
          {[2, 3, 4, 5, 6, 7, 8, 9].map((t) => (
            <TouchableOpacity key={t} style={styles.tableBtn} onPress={() => startTable(t)} activeOpacity={0.7}>
              <Text style={styles.tableBtnText}>×{t}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.tableBtn, styles.tableBtnAll]} onPress={() => startTable(0)} activeOpacity={0.7}>
            <Text style={[styles.tableBtnText, { color: '#FFF' }]}>Tutte! 🌟</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <CelebrationOverlay visible={showCelebration} onDone={() => setShowCelebration(false)} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => { hapticTap(); setSelectedTable(null); }}>
          <Text style={styles.backText}>← Tabelline</Text>
        </TouchableOpacity>
        <View style={styles.scoreBox}>
          <Animated.Text style={[styles.scoreText, { transform: [{ scale: scaleAnim }] }]}>
            ⭐ {score}
          </Animated.Text>
        </View>
      </View>

      <StreakBadge streak={streak} />

      <Animated.View style={[styles.questionBox, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.questionText}>
          {question.a} × {question.b} = ?
        </Text>
      </Animated.View>

      {feedback && (
        <FeedbackCard type={feedback} message={feedbackMsg} answer={feedback === 'wrong' ? question.answer : undefined} />
      )}

      <View style={styles.optionsGrid}>
        {options.map((opt) => {
          let btnStyle = styles.optionBtn;
          if (feedback && opt === question.answer) btnStyle = [styles.optionBtn, styles.optionCorrect];
          else if (feedback === 'wrong' && opt !== question.answer) btnStyle = [styles.optionBtn, styles.optionFaded];

          return (
            <TouchableOpacity
              key={opt}
              style={btnStyle}
              onPress={() => handleAnswer(opt)}
              activeOpacity={0.7}
              disabled={feedback !== null}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {bestStreak > 2 && <Text style={styles.bestStreak}>🏆 Record: {bestStreak} di fila!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },
  back: { marginBottom: 8 },
  backText: { fontSize: 18, color: COLORS.math, fontWeight: '700' },
  title: { fontSize: 34, fontWeight: '900', color: COLORS.math, marginBottom: 8 },
  subtitle: { fontSize: 19, color: COLORS.textLight, marginBottom: 24 },
  tableGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center' },
  tableBtn: {
    width: 88, height: 88, borderRadius: 24, backgroundColor: COLORS.mathLight,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  tableBtnAll: { width: 184, backgroundColor: COLORS.math },
  tableBtnText: { fontSize: 30, fontWeight: '900', color: COLORS.math },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  scoreBox: { backgroundColor: COLORS.mathLight, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24 },
  scoreText: { fontSize: 26, fontWeight: '800' },
  questionBox: {
    backgroundColor: COLORS.white, borderRadius: 28, padding: 40, alignItems: 'center',
    marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 8,
  },
  questionText: { fontSize: 52, fontWeight: '900', color: COLORS.text },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginTop: 8 },
  optionBtn: {
    width: '46%', paddingVertical: 24, borderRadius: 20, backgroundColor: COLORS.white,
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
    minHeight: 72,
  },
  optionCorrect: { backgroundColor: '#D5F5E3', borderWidth: 3, borderColor: '#2ECC71' },
  optionFaded: { opacity: 0.3 },
  optionText: { fontSize: 36, fontWeight: '800', color: COLORS.text },
  bestStreak: { textAlign: 'center', marginTop: 20, fontSize: 17, color: '#D4A017', fontWeight: '700' },
});
