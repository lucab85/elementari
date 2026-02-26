import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';
import { ortografiaTopics } from '../../data/italiano';

const ortografiaCards = ortografiaTopics.map((t, i) => ({
  title: t.title, emoji: '✏️', desc: `${t.questions.length} domande`, route: `/italiano/ortografia?topic=${i}`,
}));

const activities = [
  ...ortografiaCards,
  { title: 'Descrizione guidata', emoji: '📝', desc: 'Esercitati a scrivere', route: '/italiano/descrizione' },
  { title: 'Poesie e Letture', emoji: '📜', desc: 'Leggi e rispondi', route: '/italiano/poesie' },
  { title: 'Grammatica', emoji: '📗', desc: 'Verbi, plurali, articoli', route: '/italiano/grammatica' },
  { title: 'Dettato Ortografico', emoji: '✍️', desc: 'CU/QU/CQU, GN, GL, SC, CH', route: '/italiano/dettato' },
];

export default function Italiano() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>📖 Italiano</Text>

      {activities.map((a, i) => (
        <TouchableOpacity key={i} style={styles.card} activeOpacity={0.7} onPress={() => router.push(a.route)}>
          <Text style={styles.emoji}>{a.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{a.title}</Text>
            <Text style={styles.cardDesc}>{a.desc}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 40 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: COLORS.italiano, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.italiano, marginBottom: 24 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.italianoLight,
    padding: 18, borderRadius: 16, marginBottom: 12, ...SHADOWS.card,
  },
  emoji: { fontSize: 32, marginRight: 14 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: COLORS.italiano },
  cardDesc: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  arrow: { fontSize: 28, color: COLORS.textLight, fontWeight: '300' },
});
