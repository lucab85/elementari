import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import {
  getCorrectMessage, getWrongMessage, hapticCorrect, hapticWrong, hapticTap,
  CelebrationOverlay, FeedbackCard, AnimatedScore, StreakBadge,
} from '../../components/KidsFeedback';

function generate() {
  const isAdd = Math.random() > 0.5;
  const max = Math.random() > 0.5 ? 1000 : 100;
  const a = Math.floor(Math.random() * max) + 10;
  const b = Math.floor(Math.random() * (isAdd ? max : a)) + 1;
  return { a, b, op: isAdd ? '+' : '−', answer: isAdd ? a + b : a - b };
}

export default function Operazioni() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState(generate());
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const check = () => {
    if (!input.trim()) return;
    const val = parseInt(input);
    const correct = val === q.answer;
    setTotal(t => t + 1);

    if (correct) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      setFeedback('correct');
      setFeedbackMsg(getCorrectMessage());
      hapticCorrect();

      // Celebrate on streak milestones
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

    setTimeout(() => {
      setQ(generate());
      setInput('');
      setFeedback(null);
    }, correct ? 1200 : 2500);
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { paddingTop: insets.top + 16 }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <CelebrationOverlay visible={showCelebration} onDone={() => setShowCelebration(false)} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <AnimatedScore score={score} total={total} color={COLORS.math} />
      </View>

      <Text style={styles.title}>➕ Operazioni</Text>

      <StreakBadge streak={streak} />

      <Animated.View style={[styles.questionBox, { transform: [{ scale: bounceAnim }] }]}>
        <Text style={styles.questionText}>{q.a} {q.op} {q.b} = ?</Text>
      </Animated.View>

      {feedback && (
        <FeedbackCard type={feedback} message={feedbackMsg} answer={feedback === 'wrong' ? q.answer : undefined} />
      )}

      {!feedback && (
        <>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            keyboardType="number-pad"
            placeholder="Scrivi qui! ✏️"
            placeholderTextColor="#CCC"
            onSubmitEditing={check}
            autoFocus
          />

          <TouchableOpacity
            style={[styles.checkBtn, !input.trim() && styles.checkBtnDisabled]}
            onPress={check}
            activeOpacity={0.7}
            disabled={!input.trim()}
          >
            <Text style={styles.checkBtnText}>Controlla ✓</Text>
          </TouchableOpacity>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  backText: { fontSize: 18, color: COLORS.math, fontWeight: '700' },
  title: { fontSize: 30, fontWeight: '800', color: COLORS.math, marginBottom: 16 },
  questionBox: {
    backgroundColor: COLORS.white, borderRadius: 28, padding: 36, alignItems: 'center',
    marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 8,
  },
  questionText: { fontSize: 48, fontWeight: '900', color: COLORS.text },
  input: {
    backgroundColor: COLORS.white, borderRadius: 20, padding: 22, fontSize: 32,
    textAlign: 'center', fontWeight: '700', marginBottom: 16,
    borderWidth: 3, borderColor: COLORS.mathLight,
  },
  checkBtn: {
    backgroundColor: COLORS.math, borderRadius: 20, padding: 20, alignItems: 'center',
    shadowColor: COLORS.math, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  checkBtnDisabled: { opacity: 0.5 },
  checkBtnText: { color: '#FFF', fontSize: 24, fontWeight: '800' },
});
