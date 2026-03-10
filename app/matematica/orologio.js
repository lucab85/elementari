import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { hapticCorrect, hapticWrong, hapticTap, getCorrectMessage, getWrongMessage } from '../../components/KidsFeedback';

function generate() {
  const hours = Math.floor(Math.random() * 12) + 1;
  const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const minutes = minuteOptions[Math.floor(Math.random() * minuteOptions.length)];

  let timeStr;
  if (minutes === 0) timeStr = `${hours}:00`;
  else if (minutes === 15) timeStr = `${hours} e un quarto`;
  else if (minutes === 30) timeStr = `${hours} e mezza`;
  else if (minutes === 45) timeStr = `${(hours % 12) + 1} meno un quarto`;
  else timeStr = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

  // Generate wrong answers
  const wrongTimes = [];
  while (wrongTimes.length < 2) {
    const wh = Math.floor(Math.random() * 12) + 1;
    const wm = minuteOptions[Math.floor(Math.random() * minuteOptions.length)];
    const wStr = wm === 0 ? `${wh}:00` : `${wh}:${wm < 10 ? '0' : ''}${wm}`;
    if (wStr !== `${hours}:${minutes < 10 ? '0' : ''}${minutes}` && !wrongTimes.includes(wStr)) {
      wrongTimes.push(wStr);
    }
  }

  const digitalTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  const options = [digitalTime, ...wrongTimes].sort(() => Math.random() - 0.5);

  return { hours, minutes, timeStr, options, correct: options.indexOf(digitalTime) };
}

// Simple clock face drawn with Text
function ClockFace({ hours, minutes }) {
  return (
    <View style={clockStyles.clock}>
      <Text style={clockStyles.twelve}>12</Text>
      <Text style={clockStyles.three}>3</Text>
      <Text style={clockStyles.six}>6</Text>
      <Text style={clockStyles.nine}>9</Text>
      <Text style={clockStyles.center}>🕐</Text>
      <Text style={clockStyles.time}>
        {hours}:{minutes < 10 ? '0' : ''}{minutes}
      </Text>
    </View>
  );
}

export default function Orologio() {
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

  // Map hour+minute to clock emoji
  const clockEmojis = ['🕛','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚'];
  const clockEmoji = clockEmojis[q.hours % 12];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <Animated.Text style={[styles.scoreText, { transform: [{ scale: bounceAnim }] }]}>⭐ {score}/{total}</Animated.Text>
      </View>
      <Text style={styles.title}>🕐 L'Orologio</Text>
      <Text style={styles.subtitle}>Che ore sono?</Text>

      <View style={styles.questionBox}>
        <Text style={{ fontSize: 80 }}>{clockEmoji}</Text>
        <Text style={styles.timeHint}>{q.timeStr}</Text>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Perfetto! 🎯</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>💡 Era: {q.options[q.correct]}</Text>}

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

const clockStyles = StyleSheet.create({
  clock: { width: 120, height: 120, position: 'relative' },
  twelve: { position: 'absolute', top: 0, alignSelf: 'center' },
  three: { position: 'absolute', right: 0, top: '50%' },
  six: { position: 'absolute', bottom: 0, alignSelf: 'center' },
  nine: { position: 'absolute', left: 0, top: '50%' },
  center: { fontSize: 40, textAlign: 'center', marginTop: 20 },
  time: { textAlign: 'center', fontSize: 16, fontWeight: '700', marginTop: 4 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  backText: { fontSize: 16, color: COLORS.math, fontWeight: '600' },
  scoreText: { fontSize: 20, fontWeight: '700', color: COLORS.math },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.math, marginBottom: 4 },
  subtitle: { fontSize: 16, color: COLORS.textLight, marginBottom: 24 },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  timeHint: { fontSize: 20, fontWeight: '600', color: COLORS.textLight, marginTop: 8 },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { gap: 12 },
  optionBtn: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: COLORS.mathLight },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 28, fontWeight: '700', color: COLORS.math },
});
