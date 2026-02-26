import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';
import { coloriPrimari, coloriSecondari } from '../../data/arte';

const ARTE_COLOR = '#FF6F00';

export default function Colori() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showMix, setShowMix] = useState(false);

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🎨 I Colori</Text>

      <Text style={styles.sectionTitle}>Colori Primari</Text>
      <Text style={styles.sectionDesc}>Non si possono ottenere mescolando altri colori</Text>

      <View style={styles.colorRow}>
        {coloriPrimari.map((c) => (
          <View key={c.name} style={[styles.colorCard, { backgroundColor: c.hex + '20', borderColor: c.hex }]}>
            <View style={[styles.colorCircle, { backgroundColor: c.hex }]}>
              <Text style={styles.colorEmoji}>{c.emoji}</Text>
            </View>
            <Text style={[styles.colorName, { color: c.hex }]}>{c.name}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Colori Secondari</Text>
      <Text style={styles.sectionDesc}>Si ottengono mescolando due colori primari</Text>

      {coloriSecondari.map((c) => (
        <View key={c.name} style={[styles.mixCard, { borderLeftColor: c.hex }]}>
          <View style={styles.mixRow}>
            <View style={[styles.smallCircle, { backgroundColor: c.hex }]} />
            <Text style={[styles.mixName, { color: c.hex }]}>{c.name}</Text>
          </View>
          <Text style={styles.mixFormula}>{c.mix}</Text>
          <Text style={styles.mixDesc}>{c.desc}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.tipCard} onPress={() => setShowMix(!showMix)}>
        <Text style={styles.tipTitle}>💡 Lo sapevi?</Text>
        {showMix ? (
          <Text style={styles.tipText}>
            Mescolando tutti e tre i colori primari si ottiene il marrone!{'\n'}
            Bianco e nero non sono veri colori: sono detti "acromatici".
          </Text>
        ) : (
          <Text style={styles.tipText}>Tocca per scoprire una curiosità!</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 40 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: ARTE_COLOR, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: ARTE_COLOR, marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  sectionDesc: { fontSize: 14, color: COLORS.textLight, marginBottom: 16 },
  colorRow: { flexDirection: 'row', justifyContent: 'space-between' },
  colorCard: {
    flex: 1, alignItems: 'center', padding: 18, borderRadius: 20, borderWidth: 2,
    marginHorizontal: 4, ...SHADOWS.card,
  },
  colorCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  colorEmoji: { fontSize: 28 },
  colorName: { fontSize: 16, fontWeight: '700', marginTop: 8 },
  mixCard: {
    backgroundColor: COLORS.card, padding: 18, borderRadius: 16, marginBottom: 12,
    borderLeftWidth: 5, ...SHADOWS.card,
  },
  mixRow: { flexDirection: 'row', alignItems: 'center' },
  smallCircle: { width: 24, height: 24, borderRadius: 12, marginRight: 10 },
  mixName: { fontSize: 20, fontWeight: '700' },
  mixFormula: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginTop: 6 },
  mixDesc: { fontSize: 14, color: COLORS.textLight, marginTop: 4 },
  tipCard: { backgroundColor: '#FFF3E0', padding: 20, borderRadius: 16, marginTop: 16, ...SHADOWS.card },
  tipTitle: { fontSize: 18, fontWeight: '700', color: ARTE_COLOR, marginBottom: 6 },
  tipText: { fontSize: 15, color: COLORS.text, lineHeight: 22 },
});
