import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

export default function Tabellone() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>📋 Tabellone</Text>
      <Text style={styles.subtitle}>Tutte le tabelline da studiare</Text>

      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <View key={n} style={styles.tableCard}>
          <Text style={styles.tableTitle}>Tabellina del {n}</Text>
          <View style={styles.tableGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((m) => (
              <View key={m} style={styles.row}>
                <Text style={styles.calc}>{n} × {m}</Text>
                <Text style={styles.equals}>=</Text>
                <Text style={styles.result}>{n * m}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 60 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: COLORS.math, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.math, marginBottom: 4 },
  subtitle: { fontSize: 16, color: COLORS.textLight, marginBottom: 20 },
  tableCard: {
    backgroundColor: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  tableTitle: { fontSize: 20, fontWeight: '700', color: COLORS.math, marginBottom: 12, textAlign: 'center' },
  tableGrid: {},
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 4 },
  calc: { fontSize: 18, fontWeight: '600', color: COLORS.text, width: 80, textAlign: 'right' },
  equals: { fontSize: 18, color: COLORS.textLight, marginHorizontal: 8 },
  result: { fontSize: 18, fontWeight: '800', color: COLORS.math, width: 40 },
});
