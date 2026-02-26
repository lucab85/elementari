import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { hapticCorrect, hapticWrong, hapticTap, getCorrectMessage, getWrongMessage } from '../../components/KidsFeedback';

function generateRound() {
  const count = 5;
  const nums = new Set();
  while (nums.size < count) nums.add(Math.floor(Math.random() * 500) + 1);
  const arr = [...nums];
  const ascending = Math.random() > 0.5;
  const sorted = [...arr].sort((a, b) => ascending ? a - b : b - a);
  return { numbers: arr, sorted, ascending };
}

export default function Ordina() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [round, setRound] = useState(generateRound());
  const [selected, setSelected] = useState([]);
  const [remaining, setRemaining] = useState(round.numbers);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const handleTap = (num) => {
    if (feedback) return;
    const nextIdx = selected.length;
    const expectedNum = round.sorted[nextIdx];

    if (num === expectedNum) {
      const newSelected = [...selected, num];
      const newRemaining = remaining.filter(n => n !== num);
      setSelected(newSelected);
      setRemaining(newRemaining);

      if (newSelected.length === round.sorted.length) {
        setFeedback('correct');
        setScore(score + 1);
        setTotal(total + 1);
        Animated.sequence([Animated.spring(bounceAnim, { toValue: 1.3, useNativeDriver: true }), Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true })]).start();
        setTimeout(() => {
          const newRound = generateRound();
          setRound(newRound);
          setSelected([]);
          setRemaining(newRound.numbers);
          setFeedback(null);
        }, 1200);
      }
    } else {
      setFeedback('wrong');
      setTotal(total + 1);
      setTimeout(() => {
        setSelected([]);
        setRemaining(round.numbers);
        setFeedback(null);
      }, 1500);
    }
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
        <Animated.Text style={[styles.scoreText, { transform: [{ scale: bounceAnim }] }]}>⭐ {score}/{total}</Animated.Text>
      </View>
      <Text style={styles.title}>📊 Ordina i Numeri</Text>
      <View style={styles.dirBadge}>
        <Text style={styles.dirText}>{round.ascending ? '⬆️ Dal più piccolo al più grande' : '⬇️ Dal più grande al più piccolo'}</Text>
      </View>

      {selected.length > 0 && (
        <View style={styles.selectedRow}>
          {selected.map((n, i) => (
            <View key={i} style={styles.selectedChip}><Text style={styles.selectedText}>{n}</Text></View>
          ))}
          {remaining.map((_, i) => (
            <View key={'p' + i} style={styles.placeholder}><Text style={styles.placeholderText}>?</Text></View>
          ))}
        </View>
      )}

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Fantastico! ⭐</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>❌ Ordine sbagliato, riprova!</Text>}

      <Text style={styles.tapHint}>Tocca i numeri nell'ordine giusto:</Text>
      <View style={styles.numbersGrid}>
        {remaining.map((n, i) => (
          <TouchableOpacity key={i} style={styles.numBtn} onPress={() => handleTap(n)} activeOpacity={0.7}>
            <Text style={styles.numText}>{n}</Text>
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
  dirBadge: { backgroundColor: COLORS.mathLight, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, marginBottom: 20 },
  dirText: { fontSize: 16, fontWeight: '600', color: COLORS.math },
  selectedRow: { flexDirection: 'row', gap: 8, marginBottom: 16, justifyContent: 'center', flexWrap: 'wrap' },
  selectedChip: { backgroundColor: '#D5F5E3', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 2, borderColor: COLORS.correct },
  selectedText: { fontSize: 22, fontWeight: '700', color: COLORS.correct },
  placeholder: { backgroundColor: '#F0F0F0', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 2, borderColor: '#DDD', borderStyle: 'dashed' },
  placeholderText: { fontSize: 22, fontWeight: '700', color: '#CCC' },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct, fontWeight: '600' },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong, fontWeight: '600' },
  tapHint: { fontSize: 16, color: COLORS.textLight, marginBottom: 12 },
  numbersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  numBtn: { backgroundColor: COLORS.white, borderRadius: 20, paddingVertical: 20, paddingHorizontal: 28, borderWidth: 2, borderColor: COLORS.mathLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  numText: { fontSize: 28, fontWeight: '800', color: COLORS.math },
});
