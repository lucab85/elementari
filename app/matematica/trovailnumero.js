import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { hapticCorrect, hapticWrong, hapticTap, getCorrectMessage, getWrongMessage } from '../../components/KidsFeedback';

// "Trova il numero mancante" - like the textbook exercises
// e.g. 50 + ? = 175, or ? - 38 = 62
function generate() {
  const type = Math.floor(Math.random() * 4);
  let a, b, answer, display;

  switch (type) {
    case 0: // a + ? = c
      a = Math.floor(Math.random() * 500) + 10;
      answer = Math.floor(Math.random() * 500) + 10;
      display = `${a} + ? = ${a + answer}`;
      break;
    case 1: // ? + b = c
      answer = Math.floor(Math.random() * 500) + 10;
      b = Math.floor(Math.random() * 500) + 10;
      display = `? + ${b} = ${answer + b}`;
      break;
    case 2: // a - ? = c
      a = Math.floor(Math.random() * 900) + 100;
      answer = Math.floor(Math.random() * a) + 1;
      display = `${a} − ? = ${a - answer}`;
      break;
    case 3: // ? - b = c
      answer = Math.floor(Math.random() * 900) + 100;
      b = Math.floor(Math.random() * answer) + 1;
      display = `? − ${b} = ${answer - b}`;
      break;
  }

  return { display, answer };
}

export default function TrovaIlNumero() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState(generate());
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const check = () => {
    if (!input.trim()) return;
    const correct = parseInt(input) === q.answer;
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
    setTimeout(() => { setQ(generate()); setInput(''); setFeedback(null); }, correct ? 1000 : 2500);
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { paddingTop: insets.top + 16 }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <Animated.Text style={[styles.scoreText, { transform: [{ scale: bounceAnim }] }]}>⭐ {score}/{total}</Animated.Text>
      </View>
      <Text style={styles.title}>🔍 Trova il numero</Text>
      <Text style={styles.subtitle}>Quale numero manca?</Text>

      <View style={styles.questionBox}>
        <Text style={styles.questionText}>{q.display}</Text>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Perfetto! 🎯</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>💡 Era: {q.answer}</Text>}

      <TextInput style={styles.input} value={input} onChangeText={setInput} keyboardType="number-pad"
        placeholder="Il numero è..." placeholderTextColor="#AAA" editable={feedback === null} onSubmitEditing={check} autoFocus />
      <TouchableOpacity style={styles.checkBtn} onPress={check} activeOpacity={0.7} disabled={feedback !== null}>
        <Text style={styles.checkBtnText}>Controlla ✓</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  backText: { fontSize: 16, color: COLORS.math, fontWeight: '600' },
  scoreText: { fontSize: 20, fontWeight: '700', color: COLORS.math },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.math, marginBottom: 4 },
  subtitle: { fontSize: 16, color: COLORS.textLight, marginBottom: 24 },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 24, padding: 32, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  questionText: { fontSize: 36, fontWeight: '800', color: COLORS.text },
  correctText: { fontSize: 22, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 22, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  input: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, fontSize: 28, textAlign: 'center',
    fontWeight: '700', marginBottom: 16, borderWidth: 2, borderColor: COLORS.mathLight },
  checkBtn: { backgroundColor: COLORS.math, borderRadius: 16, padding: 18, alignItems: 'center' },
  checkBtnText: { color: '#FFF', fontSize: 22, fontWeight: '700' },
});
