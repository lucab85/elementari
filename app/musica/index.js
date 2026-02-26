import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

const MUSICA_COLOR = '#E91E63';
const MUSICA_LIGHT = '#FCE4EC';

const activities = [
  { title: 'Le Note Musicali', emoji: '🎵', desc: 'DO, RE, MI, FA, SOL, LA, SI', route: '/musica/note' },
  { title: 'Gli Strumenti', emoji: '🎸', desc: '8 strumenti da scoprire', route: '/musica/strumenti' },
  { title: 'Quiz Musica', emoji: '🎯', desc: 'Metti alla prova le tue conoscenze!', route: '/musica/quiz' },
];

export default function Musica() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🎵 Musica</Text>

      {activities.map((a) => (
        <TouchableOpacity key={a.title} style={styles.card} activeOpacity={0.7} onPress={() => router.push(a.route)}>
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
  backText: { fontSize: 16, color: MUSICA_COLOR, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '800', color: MUSICA_COLOR, marginBottom: 24 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: MUSICA_LIGHT,
    padding: 20, borderRadius: 16, marginBottom: 14, ...SHADOWS.card,
  },
  emoji: { fontSize: 36, marginRight: 14 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: MUSICA_COLOR },
  cardDesc: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  arrow: { fontSize: 28, color: COLORS.textLight, fontWeight: '300' },
});
