import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { hapticCorrect, hapticWrong, hapticTap, getCorrectMessage, getWrongMessage } from '../../components/KidsFeedback';

const ENG_COLOR = '#E67E22';
const ENG_LIGHT = '#FDEBD0';

const phrases = [
  { en: 'What is your name?', it: 'Come ti chiami?', emoji: '👋' },
  { en: 'My name is...', it: 'Mi chiamo...', emoji: '😊' },
  { en: 'How old are you?', it: 'Quanti anni hai?', emoji: '🎂' },
  { en: 'I am nine years old', it: 'Ho nove anni', emoji: '9️⃣' },
  { en: 'Where do you live?', it: 'Dove abiti?', emoji: '🏠' },
  { en: 'I live in Italy', it: 'Abito in Italia', emoji: '🇮🇹' },
  { en: 'Good morning!', it: 'Buongiorno!', emoji: '☀️' },
  { en: 'Good night!', it: 'Buonanotte!', emoji: '🌙' },
  { en: 'Thank you very much', it: 'Grazie mille', emoji: '🙏' },
  { en: 'You are welcome', it: 'Prego / Di niente', emoji: '😄' },
  { en: 'I like pizza', it: 'Mi piace la pizza', emoji: '🍕' },
  { en: 'I don\'t like spiders', it: 'Non mi piacciono i ragni', emoji: '🕷️' },
  { en: 'Can I go to the bathroom?', it: 'Posso andare in bagno?', emoji: '🚻' },
  { en: 'I don\'t understand', it: 'Non capisco', emoji: '🤔' },
  { en: 'Can you repeat please?', it: 'Puoi ripetere per favore?', emoji: '🔁' },
  { en: 'What time is it?', it: 'Che ore sono?', emoji: '⏰' },
  { en: 'See you tomorrow!', it: 'A domani!', emoji: '👋' },
  { en: 'Have a nice day!', it: 'Buona giornata!', emoji: '🌈' },
];

function generateQuiz() {
  const shuffled = [...phrases].sort(() => Math.random() - 0.5).slice(0, 10);
  return shuffled.map(p => {
    const isEnToIt = Math.random() > 0.5;
    const wrongPhrases = phrases.filter(x => x.en !== p.en).sort(() => Math.random() - 0.5).slice(0, 2);
    if (isEnToIt) {
      const opts = [p.it, ...wrongPhrases.map(w => w.it)].sort(() => Math.random() - 0.5);
      return { question: p.en, emoji: p.emoji, options: opts, correct: opts.indexOf(p.it), dir: 'EN → IT' };
    } else {
      const opts = [p.en, ...wrongPhrases.map(w => w.en)].sort(() => Math.random() - 0.5);
      return { question: p.it, emoji: p.emoji, options: opts, correct: opts.indexOf(p.en), dir: 'IT → EN' };
    }
  });
}

export default function Frasi() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [questions] = useState(generateQuiz);
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const q = questions[idx];

  const handleAnswer = (i) => {
    if (feedback !== null) return;
    const correct = i === q.correct;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) hapticCorrect(); else hapticWrong();
    if (correct) {
      setScore(score + 1);
      Animated.sequence([Animated.spring(bounceAnim, { toValue: 1.2, useNativeDriver: true }), Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true })]).start();
    }
    setTimeout(() => { if (idx + 1 >= questions.length) setDone(true); else { setIdx(idx + 1); setFeedback(null); } }, correct ? 800 : 2000);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={{ fontSize: 72 }}>{pct >= 80 ? '🏆' : '💪'}</Text>
        <Text style={styles.doneText}>{score}/{questions.length} ({pct}%)</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => { setIdx(0); setScore(0); setDone(false); setFeedback(null); }}><Text style={styles.retryBtnText}>Riprova</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }} style={{ marginTop: 16 }}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
        <Animated.Text style={[styles.scoreText, { transform: [{ scale: bounceAnim }] }]}>⭐ {score}</Animated.Text>
      </View>
      <Text style={styles.title}>💬 Frasi in Inglese</Text>
      <Text style={styles.progress}>{idx + 1}/{questions.length}</Text>

      <View style={styles.questionBox}>
        <Text style={{ fontSize: 36 }}>{q.emoji}</Text>
        <View style={styles.dirBadge}><Text style={styles.dirText}>{q.dir}</Text></View>
        <Text style={styles.questionText}>{q.question}</Text>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Correct!</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>💡 Era: {q.options[q.correct]}</Text>}

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
  center: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  content: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 12 },
  backText: { fontSize: 16, color: ENG_COLOR, fontWeight: '600' },
  scoreText: { fontSize: 20, fontWeight: '700', color: ENG_COLOR },
  title: { fontSize: 28, fontWeight: '800', color: ENG_COLOR, marginBottom: 4 },
  progress: { fontSize: 14, color: COLORS.textLight, marginBottom: 20 },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 24, padding: 28, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  dirBadge: { backgroundColor: ENG_LIGHT, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 10, marginVertical: 8 },
  dirText: { fontSize: 13, fontWeight: '700', color: ENG_COLOR },
  questionText: { fontSize: 24, fontWeight: '700', color: COLORS.text, textAlign: 'center', lineHeight: 30 },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { gap: 10 },
  optionBtn: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: ENG_LIGHT },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 17, fontWeight: '700', color: ENG_COLOR },
  doneText: { fontSize: 28, fontWeight: '800', color: ENG_COLOR, marginTop: 16 },
  retryBtn: { backgroundColor: ENG_COLOR, borderRadius: 16, paddingHorizontal: 40, paddingVertical: 16, marginTop: 24 },
  retryBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
});
