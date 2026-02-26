import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { regoleCiviche } from '../../data/civica';

const CIV_COLOR = '#27AE60';
const CIV_LIGHT = '#D5F5E3';

export default function Regole() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
      <Text style={styles.title}>🤝 Regole del Vivere Civile</Text>
      {regoleCiviche.map((r, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.emoji}>{r.emoji}</Text>
          <Text style={styles.rule}>{r.rule}</Text>
          <Text style={styles.desc}>{r.desc}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 40 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: CIV_COLOR, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '800', color: CIV_COLOR, marginBottom: 20 },
  card: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, marginBottom: 14, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  emoji: { fontSize: 44, marginBottom: 8 },
  rule: { fontSize: 20, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: 6 },
  desc: { fontSize: 16, color: COLORS.textLight, textAlign: 'center', lineHeight: 22 },
});
