import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { regioni } from '../../data/geografia';

const GEO_COLOR = '#1ABC9C';
const GEO_LIGHT = '#D1F2EB';
const { width } = Dimensions.get('window');

export default function Regioni() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [idx, setIdx] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const r = regioni[idx];

  const goTo = (newIdx) => {
    const dir = newIdx > idx ? -1 : 1;
    Animated.timing(slideAnim, { toValue: dir * width, duration: 150, useNativeDriver: true }).start(() => {
      setIdx(newIdx);
      slideAnim.setValue(-dir * width);
      Animated.timing(slideAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🇮🇹 Regioni d'Italia</Text>
      <View style={styles.progressBar}>
        {regioni.map((_, i) => (
          <View key={i} style={[styles.dot, i === idx && styles.dotActive]} />
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.card, { transform: [{ translateX: slideAnim }] }]}>
          <Text style={styles.regionEmoji}>{r.emoji}</Text>
          <Text style={styles.regionName}>{r.name}</Text>
          <View style={styles.capoluogoBox}>
            <Text style={styles.capoluogoLabel}>Capoluogo:</Text>
            <Text style={styles.capoluogoValue}>{r.capoluogo}</Text>
          </View>
          <View style={styles.divider} />
          {r.facts.map((f, i) => (
            <View key={i} style={styles.factRow}>
              <Text style={styles.bullet}>📌</Text>
              <Text style={styles.factText}>{f}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      <View style={styles.nav}>
        <TouchableOpacity style={[styles.navBtn, idx === 0 && styles.navBtnDisabled]}
          onPress={() => idx > 0 && goTo(idx - 1)} activeOpacity={0.7}>
          <Text style={styles.navBtnText}>← Precedente</Text>
        </TouchableOpacity>
        <Text style={styles.counter}>{idx + 1}/{regioni.length}</Text>
        <TouchableOpacity style={[styles.navBtn, idx === regioni.length - 1 && styles.navBtnDisabled]}
          onPress={() => idx < regioni.length - 1 && goTo(idx + 1)} activeOpacity={0.7}>
          <Text style={styles.navBtnText}>Successivo →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },
  back: { marginBottom: 8 },
  backText: { fontSize: 16, color: GEO_COLOR, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '800', color: GEO_COLOR, marginBottom: 12 },
  progressBar: { flexDirection: 'row', justifyContent: 'center', gap: 4, marginBottom: 16, flexWrap: 'wrap' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0E0E0' },
  dotActive: { backgroundColor: GEO_COLOR, width: 20 },
  card: {
    backgroundColor: COLORS.white, borderRadius: 24, padding: 28, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
  },
  regionEmoji: { fontSize: 64, textAlign: 'center', marginBottom: 8 },
  regionName: { fontSize: 28, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: 8 },
  capoluogoBox: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  capoluogoLabel: { fontSize: 16, color: COLORS.textLight, marginRight: 6 },
  capoluogoValue: { fontSize: 18, fontWeight: '700', color: GEO_COLOR },
  divider: { height: 2, backgroundColor: GEO_LIGHT, borderRadius: 1, marginBottom: 16 },
  factRow: { flexDirection: 'row', marginBottom: 10, paddingRight: 8 },
  bullet: { fontSize: 14, marginRight: 8, marginTop: 2 },
  factText: { fontSize: 17, color: COLORS.text, lineHeight: 24, flex: 1 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 8 },
  navBtn: { backgroundColor: GEO_LIGHT, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, flex: 1, alignItems: 'center' },
  navBtnDisabled: { opacity: 0.3 },
  navBtnText: { fontSize: 15, fontWeight: '700', color: GEO_COLOR },
  counter: { fontSize: 14, color: COLORS.textLight, fontWeight: '600' },
});
