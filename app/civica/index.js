import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

const CIV_COLOR = '#27AE60';
const CIV_LIGHT = '#D5F5E3';

export default function CivicaIndex() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const items = [
    { title: 'I Diritti dei Bambini', emoji: '📜', desc: 'Cosa dice la Costituzione', route: '/civica/diritti' },
    { title: 'Regole del Vivere Civile', emoji: '🤝', desc: 'Come stare bene insieme', route: '/civica/regole' },
    { title: 'Quiz Educazione Civica', emoji: '❓', desc: 'Metti alla prova le conoscenze', route: '/civica/quiz' },
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🏛️ Educazione Civica</Text>
      {items.map((item, i) => (
        <TouchableOpacity key={i} style={styles.card} onPress={() => router.push(item.route)} activeOpacity={0.7}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
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
  backText: { fontSize: 16, color: CIV_COLOR, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '800', color: CIV_COLOR, marginBottom: 24 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: CIV_LIGHT, padding: 20, borderRadius: 16, marginBottom: 14, ...SHADOWS.card },
  emoji: { fontSize: 36, marginRight: 14 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: CIV_COLOR },
  cardDesc: { fontSize: 14, color: COLORS.textLight, marginTop: 2 },
  arrow: { fontSize: 28, color: COLORS.textLight, fontWeight: '300' },
});
