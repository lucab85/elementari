import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

const activities = [
  { title: 'Tabelline', emoji: '✖️', desc: 'Ripassa le tabelline del 2-9!', route: '/matematica/tabelline' },
  { title: 'Addizioni e Sottrazioni', emoji: '➕', desc: 'Calcola a mente', route: '/matematica/operazioni' },
  { title: 'Moltiplicazioni', emoji: '🔢', desc: 'Da facile a difficile', route: '/matematica/moltiplicazioni' },
  { title: 'Divisioni', emoji: '➗', desc: 'Dividi!', route: '/matematica/divisioni' },
  { title: 'Trova il numero', emoji: '🔍', desc: 'Completa le operazioni', route: '/matematica/trovailnumero' },
  { title: 'Confronta', emoji: '⚖️', desc: 'Maggiore, minore o uguale?', route: '/matematica/confronta' },
  { title: 'Numeri Romani', emoji: '🏛️', desc: 'I, V, X, L, C, D, M', route: '/matematica/numeriromani' },
  { title: 'L\'Orologio', emoji: '🕐', desc: 'Che ore sono?', route: '/matematica/orologio' },
  { title: 'Equivalenze', emoji: '📏', desc: 'km↔m, kg↔g, l↔ml', route: '/matematica/equivalenze' },
  { title: 'Problemi', emoji: '📝', desc: 'Problemi con le parole', route: '/matematica/problemi' },
  { title: 'Geometria', emoji: '📐', desc: 'Forme e figure', route: '/matematica/geometria' },
  { title: 'Doppio e Metà', emoji: '✖️', desc: 'Il doppio e la metà', route: '/matematica/doppiometa' },
  { title: 'Frazioni', emoji: '🍕', desc: 'Parti e frazioni', route: '/matematica/frazioni' },
  { title: 'Tabellone', emoji: '📋', desc: 'Tutte le tabelline', route: '/matematica/tabellone' },
];

export default function Matematica() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🔢 Matematica</Text>

      {activities.map((a) => (
        <TouchableOpacity
          key={a.title}
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => router.push(a.route)}
        >
          <Text style={styles.emoji}>{a.emoji}</Text>
          <View style={styles.cardContent}>
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
  backText: { fontSize: 16, color: COLORS.math, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.math, marginBottom: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.mathLight,
    padding: 20,
    borderRadius: 16,
    marginBottom: 14,
    ...SHADOWS.card,
  },
  emoji: { fontSize: 36, marginRight: 14 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: COLORS.math },
  cardDesc: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  arrow: { fontSize: 28, color: COLORS.textLight, fontWeight: '300' },
});
