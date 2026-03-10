import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';
import { forme, geometriaQuiz } from '../../data/geometria';
import { hapticCorrect, hapticWrong, hapticTap, getCorrectMessage, getWrongMessage } from '../../components/KidsFeedback';

const GEO_M_COLOR = '#2980B9';
const GEO_M_LIGHT = '#D6EAF8';
const { width } = Dimensions.get('window');

export default function Geometria() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mode } = useLocalSearchParams();

  // Forme flashcards
  if (mode === 'forme') {
    return <FormeScreen router={router} insets={insets} />;
  }
  if (mode === 'quiz') {
    return <QuizScreen router={router} insets={insets} />;
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => { hapticTap(); router.back(); }} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>📐 Geometria</Text>
      <TouchableOpacity style={styles.card} onPress={() => router.push('/matematica/geometria?mode=forme')} activeOpacity={0.7}>
        <Text style={styles.emoji}>🔷</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Le Forme</Text>
          <Text style={styles.cardDesc}>Scopri le figure geometriche</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => router.push('/matematica/geometria?mode=quiz')} activeOpacity={0.7}>
        <Text style={styles.emoji}>❓</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Quiz Geometria</Text>
          <Text style={styles.cardDesc}>Metti alla prova le conoscenze</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function FormeScreen({ router, insets }) {
  const [idx, setIdx] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const f = forme[idx];
  const goTo = (n) => {
    const dir = n > idx ? -1 : 1;
    Animated.timing(slideAnim, { toValue: dir * width, duration: 150, useNativeDriver: true }).start(() => {
      setIdx(n); slideAnim.setValue(-dir * width);
      Animated.timing(slideAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <TouchableOpacity onPress={() => { hapticTap(); router.back(); }} style={styles.back}><Text style={styles.backText}>← Geometria</Text></TouchableOpacity>
      <Text style={styles.title}>🔷 Le Forme</Text>
      <View style={styles.dots}>{forme.map((_, i) => <View key={i} style={[styles.dot, i === idx && styles.dotActive]} />)}</View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.formaCard, { transform: [{ translateX: slideAnim }] }]}>
          <Text style={{ fontSize: 72, textAlign: 'center' }}>{f.emoji}</Text>
          <Text style={styles.formaName}>{f.name}</Text>
          <Text style={styles.formaInfo}>Lati: {f.lati} • Angoli: {f.angoli}</Text>
          <View style={styles.divider} />
          {f.facts.map((fact, i) => (
            <View key={i} style={styles.factRow}><Text style={styles.bullet}>📐</Text><Text style={styles.factText}>{fact}</Text></View>
          ))}
        </Animated.View>
      </ScrollView>
      <View style={styles.nav}>
        <TouchableOpacity style={[styles.navBtn, idx === 0 && styles.navBtnDisabled]} onPress={() => idx > 0 && goTo(idx - 1)}><Text style={styles.navBtnText}>←</Text></TouchableOpacity>
        <Text style={styles.counter}>{idx + 1}/{forme.length}</Text>
        <TouchableOpacity style={[styles.navBtn, idx === forme.length - 1 && styles.navBtnDisabled]} onPress={() => idx < forme.length - 1 && goTo(idx + 1)}><Text style={styles.navBtnText}>→</Text></TouchableOpacity>
      </View>
    </View>
  );
}

function QuizScreen({ router, insets }) {
  const [questions] = useState(() => [...geometriaQuiz].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[idx];

  const handleAnswer = (i) => {
    if (feedback !== null) return;
    const correct = i === q.correct;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) hapticCorrect(); else hapticWrong();
    if (correct) setScore(score + 1);
    setTimeout(() => { if (idx + 1 >= questions.length) setDone(true); else { setIdx(idx + 1); setFeedback(null); } }, correct ? 800 : 2000);
  };

  if (done) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={{ fontSize: 72 }}>📐</Text>
        <Text style={styles.doneText}>{score}/{questions.length} corrette!</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => { setIdx(0); setScore(0); setDone(false); setFeedback(null); }}><Text style={styles.retryBtnText}>Riprova</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => { hapticTap(); router.back(); }} style={{ marginTop: 16 }}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => { hapticTap(); router.back(); }} style={styles.back}><Text style={styles.backText}>← Geometria</Text></TouchableOpacity>
      <Text style={styles.title}>❓ Quiz Geometria</Text>
      <Text style={styles.progress}>{idx + 1}/{questions.length}</Text>
      <View style={styles.questionBox}><Text style={styles.questionText}>{q.question}</Text></View>
      {feedback === 'correct' && <Text style={styles.correctText}>✅ Bravissimo! 🌟</Text>}
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
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },
  center: { justifyContent: 'center', alignItems: 'center' },
  content: { paddingBottom: 40 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: GEO_M_COLOR, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: GEO_M_COLOR, marginBottom: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: GEO_M_LIGHT, padding: 20, borderRadius: 16, marginBottom: 14, ...SHADOWS.card },
  emoji: { fontSize: 36, marginRight: 14 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: GEO_M_COLOR },
  cardDesc: { fontSize: 14, color: COLORS.textLight, marginTop: 2 },
  arrow: { fontSize: 28, color: COLORS.textLight },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0E0E0' },
  dotActive: { backgroundColor: GEO_M_COLOR, width: 20 },
  formaCard: { backgroundColor: COLORS.white, borderRadius: 24, padding: 28, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  formaName: { fontSize: 28, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginVertical: 8 },
  formaInfo: { fontSize: 15, color: GEO_M_COLOR, textAlign: 'center', fontWeight: '600', marginBottom: 12 },
  divider: { height: 2, backgroundColor: GEO_M_LIGHT, borderRadius: 1, marginBottom: 16 },
  factRow: { flexDirection: 'row', marginBottom: 10 },
  bullet: { fontSize: 14, marginRight: 8, marginTop: 2 },
  factText: { fontSize: 17, color: COLORS.text, lineHeight: 24, flex: 1 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  navBtn: { backgroundColor: GEO_M_LIGHT, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24 },
  navBtnDisabled: { opacity: 0.3 },
  navBtnText: { fontSize: 24, fontWeight: '700', color: GEO_M_COLOR },
  counter: { fontSize: 14, color: COLORS.textLight, fontWeight: '600' },
  progress: { fontSize: 14, color: COLORS.textLight, marginBottom: 16 },
  questionBox: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  questionText: { fontSize: 24, fontWeight: '600', color: COLORS.text, lineHeight: 28 },
  correctText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.correct },
  wrongText: { fontSize: 20, textAlign: 'center', marginBottom: 12, color: COLORS.wrong },
  options: { gap: 10 },
  optionBtn: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: GEO_M_LIGHT },
  optionCorrect: { backgroundColor: '#D5F5E3', borderColor: COLORS.correct },
  optionFaded: { opacity: 0.4 },
  optionText: { fontSize: 18, fontWeight: '700', color: GEO_M_COLOR },
  doneText: { fontSize: 28, fontWeight: '800', color: GEO_M_COLOR, marginTop: 16 },
  retryBtn: { backgroundColor: GEO_M_COLOR, borderRadius: 16, paddingHorizontal: 40, paddingVertical: 16, marginTop: 24 },
  retryBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
});
