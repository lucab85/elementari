import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

const ARTE_COLOR = '#FF6F00';
const ARTE_LIGHT = '#FFF3E0';

const activities = [
  { title: 'I Colori', emoji: '🎨', desc: 'Primari e secondari', route: '/arte/colori' },
  { title: 'Quiz Arte', emoji: '🎯', desc: 'Colori, pittori e tecniche', route: '/arte/quiz' },
];

export default function Arte() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🎨 Arte</Text>

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
  backText: { fontSize: 16, color: ARTE_COLOR, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '800', color: ARTE_COLOR, marginBottom: 24 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: ARTE_LIGHT,
    padding: 20, borderRadius: 16, marginBottom: 14, ...SHADOWS.card,
  },
  emoji: { fontSize: 36, marginRight: 14 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: ARTE_COLOR },
  cardDesc: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  arrow: { fontSize: 28, color: COLORS.textLight, fontWeight: '300' },
});
