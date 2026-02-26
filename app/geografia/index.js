import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

export default function Geografia() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🌍 Geografia</Text>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/geografia/regioni')} activeOpacity={0.7}>
        <Text style={styles.emoji}>🇮🇹</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Regioni d'Italia</Text>
          <Text style={styles.cardDesc}>Scopri tutte le 20 regioni</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/geografia/quiz')} activeOpacity={0.7}>
        <Text style={styles.emoji}>❓</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Quiz Regioni</Text>
          <Text style={styles.cardDesc}>Capoluoghi e regioni</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/geografia/capitali')} activeOpacity={0.7}>
        <Text style={styles.emoji}>🏛️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Capitali d'Europa</Text>
          <Text style={styles.cardDesc}>20 paesi europei</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const GEO_COLOR = '#1ABC9C';
const GEO_LIGHT = '#D1F2EB';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 40 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: GEO_COLOR, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '800', color: GEO_COLOR, marginBottom: 24 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: GEO_LIGHT,
    padding: 20, borderRadius: 16, marginBottom: 14, ...SHADOWS.card,
  },
  emoji: { fontSize: 36, marginRight: 14 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: GEO_COLOR },
  cardDesc: { fontSize: 14, color: COLORS.textLight, marginTop: 2 },
  arrow: { fontSize: 28, color: COLORS.textLight, fontWeight: '300' },
});
