import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

const SCI_COLOR = '#8E44AD';
const SCI_LIGHT = '#F4ECF7';

const catena = [
  { name: 'Produttori', emoji: '🌿', examples: ['Erba', 'Alberi', 'Alghe', 'Fiori'],
    desc: 'Le piante producono il proprio cibo con la fotosintesi', order: 1 },
  { name: 'Consumatori Primari', emoji: '🐰', examples: ['Coniglio', 'Cervo', 'Pecora', 'Cavalletta'],
    desc: 'Gli erbivori mangiano le piante', order: 2 },
  { name: 'Consumatori Secondari', emoji: '🦊', examples: ['Volpe', 'Rana', 'Serpente', 'Ragno'],
    desc: 'I carnivori mangiano gli erbivori', order: 3 },
  { name: 'Consumatori Terziari', emoji: '🦅', examples: ['Aquila', 'Lupo', 'Orso', 'Leone'],
    desc: 'I super-predatori sono in cima alla catena', order: 4 },
  { name: 'Decompositori', emoji: '🍄', examples: ['Funghi', 'Batteri', 'Vermi', 'Insetti'],
    desc: 'Trasformano i resti in nutrienti per il terreno', order: 5 },
];

const quiz = [
  { q: 'Chi produce il proprio cibo?', options: ['Animali', 'Piante', 'Funghi', 'Batteri'], correct: 1 },
  { q: 'Un coniglio è un consumatore...', options: ['Primario', 'Secondario', 'Terziario', 'Decompositore'], correct: 0 },
  { q: 'Cosa fanno i decompositori?', options: ['Cacciano', 'Fanno la fotosintesi', 'Trasformano i resti in nutrienti', 'Mangiano l\'erba'], correct: 2 },
  { q: 'L\'aquila è un consumatore...', options: ['Primario', 'Secondario', 'Terziario', 'Produttore'], correct: 2 },
  { q: 'Gli erbivori mangiano...', options: ['Carne', 'Piante', 'Funghi', 'Tutto'], correct: 1 },
  { q: 'La fotosintesi serve per...', options: ['Respirare', 'Muoversi', 'Produrre cibo', 'Dormire'], correct: 2 },
  { q: 'Chi è in cima alla catena alimentare?', options: ['Le piante', 'Gli erbivori', 'I super-predatori', 'I decompositori'], correct: 2 },
  { q: 'I funghi sono...', options: ['Produttori', 'Consumatori', 'Decompositori', 'Predatori'], correct: 2 },
];

export default function CatenaAlimentare() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState('learn'); // learn | quiz
  const [current, setCurrent] = useState(0);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [questions] = useState(() => [...quiz].sort(() => Math.random() - 0.5));

  if (mode === 'learn') {
    const c = catena[current];
    return (
      <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🔗 Catena Alimentare</Text>

        {/* Chain visualization */}
        <View style={styles.chainRow}>
          {catena.map((item, i) => (
            <TouchableOpacity key={item.name} onPress={() => setCurrent(i)}
              style={[styles.chainItem, i === current && styles.chainActive]}>
              <Text style={styles.chainEmoji}>{item.emoji}</Text>
              {i < catena.length - 1 && <Text style={styles.chainArrow}>→</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.learnCard, { borderColor: SCI_COLOR }]}>
          <Text style={styles.learnEmoji}>{c.emoji}</Text>
          <Text style={styles.learnName}>{c.name}</Text>
          <Text style={styles.learnDesc}>{c.desc}</Text>
          <Text style={styles.examplesTitle}>Esempi:</Text>
          <View style={styles.examplesRow}>
            {c.examples.map(e => (
              <View key={e} style={styles.exampleBadge}>
                <Text style={styles.exampleText}>{e}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.navRow}>
          <TouchableOpacity style={[styles.navBtn, current === 0 && { opacity: 0.3 }]}
            onPress={() => current > 0 && setCurrent(current - 1)}>
            <Text style={styles.navText}>← Prec.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quizStartBtn} onPress={() => setMode('quiz')}>
            <Text style={styles.quizStartText}>🎯 Fai il Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navBtn, current === catena.length - 1 && { opacity: 0.3 }]}
            onPress={() => current < catena.length - 1 && setCurrent(current + 1)}>
            <Text style={styles.navText}>Succ. →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Quiz mode
  const q = questions[qi];

  const answer = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore(s => s + 1);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    setTimeout(() => {
      if (qi + 1 < questions.length) { setQi(qi + 1); setSelected(null); }
      else setDone(true);
    }, 1200);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.doneCard}>
          <Text style={{ fontSize: 60 }}>{pct >= 80 ? '🌟🌟🌟' : pct >= 60 ? '🌟🌟' : '🌟'}</Text>
          <Text style={styles.doneTitle}>Quiz Completato!</Text>
          <Text style={styles.doneScore}>{score}/{questions.length} ({pct}%)</Text>
          <TouchableOpacity style={styles.doneBtn} onPress={() => { setMode('learn'); setQi(0); setScore(0); setSelected(null); setDone(false); }}>
            <Text style={styles.doneBtnText}>🔄 Riprova</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.doneBtn, { backgroundColor: '#666', marginTop: 10 }]} onPress={() => router.back()}>
            <Text style={styles.doneBtnText}>← Torna alle Scienze</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => setMode('learn')} style={styles.back}>
          <Text style={styles.backText}>← Studia</Text>
        </TouchableOpacity>
        <View style={styles.progressRow}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${((qi + 1) / questions.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{qi + 1}/{questions.length}</Text>
        </View>
        <Animated.View style={[styles.qCard, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.qText}>{q.q}</Text>
        </Animated.View>
        {q.options.map((opt, i) => {
          let bg = SCI_LIGHT;
          if (selected !== null) {
            if (i === q.correct) bg = '#D5F5E3';
            else if (i === selected) bg = '#FADBD8';
          }
          return (
            <TouchableOpacity key={i} style={[styles.optBtn, { backgroundColor: bg }]}
              activeOpacity={0.7} onPress={() => answer(i)}>
              <Text style={styles.optText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '700', color: SCI_COLOR, marginTop: 12 }}>⭐ {score} punti</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, flex: 1 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: SCI_COLOR, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: SCI_COLOR, marginBottom: 16 },
  chainRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' },
  chainItem: { alignItems: 'center', flexDirection: 'row', padding: 6 },
  chainActive: { backgroundColor: SCI_LIGHT, borderRadius: 12 },
  chainEmoji: { fontSize: 32 },
  chainArrow: { fontSize: 20, color: SCI_COLOR, marginLeft: 4 },
  learnCard: {
    backgroundColor: SCI_LIGHT, padding: 28, borderRadius: 24, borderWidth: 3,
    alignItems: 'center', ...SHADOWS.card,
  },
  learnEmoji: { fontSize: 64 },
  learnName: { fontSize: 24, fontWeight: '800', color: SCI_COLOR, marginTop: 8 },
  learnDesc: { fontSize: 16, color: COLORS.text, textAlign: 'center', marginTop: 8, lineHeight: 24 },
  examplesTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textLight, marginTop: 16, marginBottom: 8 },
  examplesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  exampleBadge: { backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, margin: 4 },
  exampleText: { fontSize: 14, fontWeight: '600', color: SCI_COLOR },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  navBtn: { backgroundColor: SCI_COLOR, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14 },
  navText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  quizStartBtn: { backgroundColor: '#2ECC71', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 },
  quizStartText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  progressBg: { flex: 1, height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, marginRight: 10 },
  progressFill: { height: 8, backgroundColor: SCI_COLOR, borderRadius: 4 },
  progressText: { fontSize: 14, fontWeight: '600', color: COLORS.textLight },
  qCard: { backgroundColor: SCI_LIGHT, padding: 28, borderRadius: 20, marginBottom: 20, ...SHADOWS.card },
  qText: { fontSize: 22, fontWeight: '700', color: SCI_COLOR, textAlign: 'center' },
  optBtn: { padding: 18, borderRadius: 16, marginBottom: 12, ...SHADOWS.card },
  optText: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  doneCard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  doneTitle: { fontSize: 32, fontWeight: '800', color: SCI_COLOR, marginTop: 16 },
  doneScore: { fontSize: 24, color: COLORS.textLight, marginTop: 8 },
  doneBtn: { backgroundColor: SCI_COLOR, paddingHorizontal: 28, paddingVertical: 16, borderRadius: 20, marginTop: 24 },
  doneBtnText: { color: '#FFF', fontWeight: '700', fontSize: 18 },
});
