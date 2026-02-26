import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { poesie } from '../../data/poesie';
import { hapticCorrect, hapticWrong, hapticTap, getCorrectMessage, getWrongMessage } from '../../components/KidsFeedback';

export default function Poesie() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  if (selectedPoem === null) {
    return (
      <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }} style={styles.back}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📜 Poesie e Letture</Text>
        <Text style={styles.subtitle}>Leggi e rispondi alle domande</Text>
        {poesie.map((p, i) => (
          <TouchableOpacity key={i} style={styles.card} onPress={() => { setSelectedPoem(i); setShowQuiz(false); setQIdx(0); setScore(0); }} activeOpacity={0.7}>
            <Text style={styles.cardEmoji}>{p.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{p.title}</Text>
              <Text style={styles.cardAuthor}>{p.author}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  const poem = poesie[selectedPoem];

  if (!showQuiz) {
    return (
      <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => setSelectedPoem(null)} style={styles.back}>
          <Text style={styles.backText}>← Poesie</Text>
        </TouchableOpacity>
        <Text style={styles.poemEmoji}>{poem.emoji}</Text>
        <Text style={styles.poemTitle}>{poem.title}</Text>
        <Text style={styles.poemAuthor}>{poem.author}</Text>
        <View style={styles.poemBox}>
          <Text style={styles.poemText}>{poem.text}</Text>
        </View>
        <TouchableOpacity style={styles.quizBtn} onPress={() => setShowQuiz(true)} activeOpacity={0.7}>
          <Text style={styles.quizBtnText}>Domande sulla poesia ❓</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Quiz mode
  const q = poem.questions[qIdx];
  const isDone = qIdx >= poem.questions.length;

  if (isDone) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={{ fontSize: 72 }}>🎉</Text>
        <Text style={styles.doneText}>Bravo!</Text>
        <Text style={styles.doneScore}>{score}/{poem.questions.length} corrette</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => { setShowQuiz(false); setQIdx(0); setScore(0); setFeedback(null); }}>
          <Text style={styles.retryBtnText}>Rileggi la poesia</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedPoem(null)} style={{ marginTop: 16 }}>
          <Text style={styles.backText}>← Altre poesie</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAnswer = (i) => {
    if (feedback !== null) return;
    const correct = i === q.correct;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) hapticCorrect(); else hapticWrong();
    if (correct) setScore(score + 1);
    setTimeout(() => {
      setQIdx(qIdx + 1);
      setFeedback(null);
    }, correct ? 800 : 2000);
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => setShowQuiz(false)} style={styles.back}>
        <Text style={styles.backText}>← Torna alla poesia</Text>
      </TouchableOpacity>
      <Text style={styles.title}>❓ {poem.title}</Text>
      <Text style={styles.progress}>{qIdx + 1}/{poem.questions.length}</Text>

      <View style={styles.questionBox}>
        <Text style={styles.questionText}>{q.q}</Text>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Bravissimo! 🌟</Text>}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  content: { padding: 24, paddingBottom: 60 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: COLORS.italiano, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.italiano, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.textLight, marginBottom: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.italianoLight, padding: 20, borderRadius: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  cardEmoji: { fontSize: 36, marginRight: 14 },
  cardTitle: { fontSize: 19, fontWeight: '700', color: COLORS.italiano },
  cardAuthor: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  arrow: { fontSize: 28, color: COLORS.textLight },
  poemEmoji: { fontSize: 64, textAlign: 'center', marginTop: 16 },
  poemTitle: { fontSize: 28, fontWeight: '800', color: COLORS.italiano, textAlign: 'center', marginTop: 8 },
  poemAuthor: { fontSize: 16, color: COLORS.textLight, textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },
  poemBox: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  poemText: { fontSize: 20, color: COLORS.text, lineHeight: 32, fontStyle: 'italic' },
  quizBtn: { backgroundColor: COLORS.italiano, borderRadius: 16, padding: 18, alignItems: 'center' },
  quizBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  progress: { fontSize: 14, color: COLORS.textLight, marginBottom: 16 },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  questionText: { fontSize: 24, fontWeight: '600', color: COLORS.text, lineHeight: 28 },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { gap: 10 },
  optionBtn: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: COLORS.italianoLight },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 19, fontWeight: '700', color: COLORS.italiano },
  doneText: { fontSize: 36, fontWeight: '800', color: COLORS.italiano, marginTop: 16 },
  doneScore: { fontSize: 20, color: COLORS.textLight, marginTop: 8 },
  retryBtn: { backgroundColor: COLORS.italiano, borderRadius: 16, paddingHorizontal: 40, paddingVertical: 16, marginTop: 24 },
  retryBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
});
