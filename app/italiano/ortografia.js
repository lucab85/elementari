import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { ortografiaTopics } from '../../data/italiano';
import { hapticCorrect, hapticWrong, hapticTap, getCorrectMessage, getWrongMessage } from '../../components/KidsFeedback';

export default function Ortografia() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { topic } = useLocalSearchParams();
  const topicData = ortografiaTopics[parseInt(topic) || 0];
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = topicData.questions[idx];

  const handleAnswer = (i) => {
    if (feedback !== null) return;
    const correct = i === q.correct;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) hapticCorrect(); else hapticWrong();
    if (correct) setScore(score + 1);
    setTimeout(() => {
      if (idx + 1 >= topicData.questions.length) {
        setDone(true);
      } else {
        setIdx(idx + 1);
        setFeedback(null);
      }
    }, correct ? 800 : 2000);
  };

  if (done) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.doneEmoji}>🎉</Text>
        <Text style={styles.doneText}>Finito!</Text>
        <Text style={styles.doneScore}>{score}/{topicData.questions.length} risposte corrette</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => { setIdx(0); setScore(0); setDone(false); setFeedback(null); }}>
          <Text style={styles.retryBtnText}>Riprova</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }} style={{ marginTop: 16 }}>
          <Text style={styles.backText}>← Torna a Italiano</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => { hapticTap(); router.back(); }} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{topicData.title}</Text>
      <View style={styles.ruleBox}>
        <Text style={styles.ruleText}>{topicData.rule}</Text>
      </View>

      <Text style={styles.progress}>{idx + 1} / {topicData.questions.length}</Text>

      <View style={styles.questionBox}>
        <Text style={styles.sentence}>{q.sentence}</Text>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Bravissimo! 🌟</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>💡 Era: {q.options[q.correct]}</Text>}

      <View style={styles.options}>
        {q.options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.optionBtn,
              feedback !== null && i === q.correct && styles.optionCorrect,
              feedback === 'wrong' && i !== q.correct && styles.optionFaded,
            ]}
            onPress={() => handleAnswer(i)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { justifyContent: 'center', alignItems: 'center' },
  content: { padding: 24, paddingBottom: 40 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: COLORS.italiano, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.italiano, marginBottom: 12 },
  ruleBox: { backgroundColor: COLORS.italianoLight, borderRadius: 16, padding: 16, marginBottom: 20 },
  ruleText: { fontSize: 15, color: COLORS.text, lineHeight: 22 },
  progress: { fontSize: 14, color: COLORS.textLight, marginBottom: 12 },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  sentence: { fontSize: 22, fontWeight: '600', color: COLORS.text, lineHeight: 32 },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { gap: 12 },
  optionBtn: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.italianoLight },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 24, fontWeight: '700', color: COLORS.italiano },
  doneEmoji: { fontSize: 80 },
  doneText: { fontSize: 36, fontWeight: '800', color: COLORS.italiano, marginTop: 16 },
  doneScore: { fontSize: 20, color: COLORS.textLight, marginTop: 8 },
  retryBtn: { backgroundColor: COLORS.italiano, borderRadius: 16, paddingHorizontal: 40, paddingVertical: 16, marginTop: 24 },
  retryBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
});
