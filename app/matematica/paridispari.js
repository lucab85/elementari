import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

function generate() {
  return Math.floor(Math.random() * 200) + 1;
}

export default function PariDispari() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [num, setNum] = useState(generate());
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const handleAnswer = (answer) => {
    if (feedback !== null) return;
    const isPari = num % 2 === 0;
    const correct = (answer === 'pari' && isPari) || (answer === 'dispari' && !isPari);
    setFeedback(correct ? 'correct' : 'wrong');
    setTotal(total + 1);
    if (correct) {
      setScore(score + 1);
      Animated.sequence([Animated.spring(bounceAnim, { toValue: 1.3, useNativeDriver: true }), Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true })]).start();
    }
    setTimeout(() => { setNum(generate()); setFeedback(null); }, correct ? 600 : 1500);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
        <Animated.Text style={[styles.scoreText, { transform: [{ scale: bounceAnim }] }]}>⭐ {score}/{total}</Animated.Text>
      </View>
      <Text style={styles.title}>🔢 Pari o Dispari?</Text>
      <Text style={styles.hint}>Pari = divisibile per 2 (finisce in 0, 2, 4, 6, 8)</Text>

      <View style={styles.numBox}>
        <Text style={styles.numText}>{num}</Text>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Giusto! {num} è {num % 2 === 0 ? 'pari' : 'dispari'}</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>❌ {num} è {num % 2 === 0 ? 'pari' : 'dispari'}!</Text>}

      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.btn, styles.pariBtn]} onPress={() => handleAnswer('pari')} activeOpacity={0.7}>
          <Text style={styles.btnText}>PARI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.dispariBtn]} onPress={() => handleAnswer('dispari')} activeOpacity={0.7}>
          <Text style={styles.btnText}>DISPARI</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  backText: { fontSize: 16, color: COLORS.math, fontWeight: '600' },
  scoreText: { fontSize: 20, fontWeight: '700', color: COLORS.math },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.math, marginBottom: 4 },
  hint: { fontSize: 14, color: COLORS.textLight, marginBottom: 24 },
  numBox: { backgroundColor: COLORS.white, borderRadius: 32, padding: 48, alignItems: 'center', alignSelf: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 6, minWidth: 200 },
  numText: { fontSize: 72, fontWeight: '800', color: COLORS.math },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 16, color: COLORS.correct, fontWeight: '600' },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 16, color: COLORS.wrong, fontWeight: '600' },
  buttons: { flexDirection: 'row', gap: 16, justifyContent: 'center' },
  btn: { flex: 1, borderRadius: 20, padding: 24, alignItems: 'center' },
  pariBtn: { backgroundColor: '#3498DB' },
  dispariBtn: { backgroundColor: '#E67E22' },
  btnText: { color: '#FFF', fontSize: 24, fontWeight: '800' },
});
