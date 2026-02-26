import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

const ENG_COLOR = '#E67E22';
const ENG_LIGHT = '#FDEBD0';

export default function Inglese() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🇬🇧 Inglese</Text>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/inglese/vocabolario')} activeOpacity={0.7}>
        <Text style={styles.emoji}>📚</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Vocabolario</Text>
          <Text style={styles.cardDesc}>Impara le parole in inglese</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/inglese/quiz')} activeOpacity={0.7}>
        <Text style={styles.emoji}>❓</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Quiz</Text>
          <Text style={styles.cardDesc}>Metti alla prova il tuo inglese</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 40 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: ENG_COLOR, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '800', color: ENG_COLOR, marginBottom: 24 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: ENG_LIGHT,
    padding: 20, borderRadius: 16, marginBottom: 14, ...SHADOWS.card,
  },
  emoji: { fontSize: 36, marginRight: 14 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: ENG_COLOR },
  cardDesc: { fontSize: 14, color: COLORS.textLight, marginTop: 2 },
  arrow: { fontSize: 28, color: COLORS.textLight, fontWeight: '300' },
});
