import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { verbiEssere, verbiAvere, nomiPlurali, articoli } from '../../data/grammatica';

const topics = [verbiEssere, verbiAvere, nomiPlurali, articoli];

export default function Grammatica() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { topic: topicParam } = useLocalSearchParams();
  const topicIdx = topicParam !== undefined ? parseInt(topicParam) : null;
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  // Topic selection
  if (topicIdx === null) {
    return (
      <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📗 Grammatica</Text>
        {topics.map((t, i) => (
          <TouchableOpacity key={i} style={styles.card} onPress={() => router.push(`/italiano/grammatica?topic=${i}`)} activeOpacity={0.7}>
            <Text style={styles.cardEmoji}>{t.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{t.title}</Text>
              <Text style={styles.cardDesc}>{t.questions.length} esercizi</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  const topic = topics[topicIdx];
  const q = topic.questions[idx];

  // Show conjugation table for verbs
  const showConjugation = topic.conjugation && !done;

  const handleAnswer = (i) => {
    if (feedback !== null) return;
    const correct = i === q.correct;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(score + 1);
    setTimeout(() => {
      if (idx + 1 >= topic.questions.length) setDone(true);
      else { setIdx(idx + 1); setFeedback(null); }
    }, correct ? 800 : 2000);
  };

  if (done) {
    const pct = Math.round((score / topic.questions.length) * 100);
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={{ fontSize: 72 }}>{pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '💪'}</Text>
        <Text style={styles.doneText}>Finito!</Text>
        <Text style={styles.doneScore}>{score}/{topic.questions.length} ({pct}%)</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => { setIdx(0); setScore(0); setDone(false); setFeedback(null); }}>
          <Text style={styles.retryBtnText}>Riprova</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={styles.backText}>← Grammatica</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Grammatica</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{topic.emoji} {topic.title}</Text>

      {showConjugation && (
        <View style={styles.conjugationBox}>
          {Object.entries(topic.conjugation).map(([pron, verb]) => (
            <View key={pron} style={styles.conjRow}>
              <Text style={styles.conjPron}>{pron}</Text>
              <Text style={styles.conjVerb}>{verb}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.progress}>{idx + 1}/{topic.questions.length}</Text>

      <View style={styles.questionBox}>
        <Text style={styles.sentence}>{q.sentence || q.word}</Text>
      </View>

      {feedback === 'correct' && <Text style={styles.correctText}>✅ Giusto!</Text>}
      {feedback === 'wrong' && <Text style={styles.wrongText}>❌ Era: {q.options[q.correct]}</Text>}

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
  title: { fontSize: 28, fontWeight: '800', color: COLORS.italiano, marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.italianoLight, padding: 18, borderRadius: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  cardEmoji: { fontSize: 32, marginRight: 14 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: COLORS.italiano },
  cardDesc: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  arrow: { fontSize: 28, color: COLORS.textLight },
  conjugationBox: { backgroundColor: COLORS.italianoLight, borderRadius: 16, padding: 16, marginBottom: 16 },
  conjRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  conjPron: { fontSize: 16, color: COLORS.textLight, fontWeight: '500' },
  conjVerb: { fontSize: 16, fontWeight: '700', color: COLORS.italiano },
  progress: { fontSize: 14, color: COLORS.textLight, marginBottom: 12 },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  sentence: { fontSize: 22, fontWeight: '600', color: COLORS.text, lineHeight: 32 },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { gap: 10 },
  optionBtn: { backgroundColor: COLORS.white, borderRadius: 16, padding: 18, alignItems: 'center', borderWidth: 2, borderColor: COLORS.italianoLight },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 22, fontWeight: '700', color: COLORS.italiano },
  doneText: { fontSize: 36, fontWeight: '800', color: COLORS.italiano, marginTop: 16 },
  doneScore: { fontSize: 20, color: COLORS.textLight, marginTop: 8 },
  retryBtn: { backgroundColor: COLORS.italiano, borderRadius: 16, paddingHorizontal: 40, paddingVertical: 16, marginTop: 24 },
  retryBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
});
