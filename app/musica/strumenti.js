import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';
import { strumenti } from '../../data/musica';

const MUSICA_COLOR = '#E91E63';

export default function Strumenti() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const s = strumenti[current];

  const go = (dir) => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setCurrent(c => Math.max(0, Math.min(strumenti.length - 1, c + dir)));
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🎸 Gli Strumenti</Text>

      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.cardEmoji}>{s.emoji}</Text>
        <Text style={styles.cardName}>{s.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Famiglia: {s.famiglia}</Text>
        </View>
        <Text style={styles.cardDesc}>{s.desc}</Text>
      </Animated.View>

      <View style={styles.navRow}>
        <TouchableOpacity style={[styles.navBtn, current === 0 && styles.navDisabled]}
          onPress={() => current > 0 && go(-1)}>
          <Text style={styles.navText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.counter}>{current + 1} / {strumenti.length}</Text>
        <TouchableOpacity style={[styles.navBtn, current === strumenti.length - 1 && styles.navDisabled]}
          onPress={() => current < strumenti.length - 1 && go(1)}>
          <Text style={styles.navText}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dotsRow}>
        {strumenti.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => setCurrent(i)}>
            <View style={[styles.dot, i === current && styles.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 40, alignItems: 'center' },
  back: { marginBottom: 8, marginTop: 16, alignSelf: 'flex-start' },
  backText: { fontSize: 16, color: MUSICA_COLOR, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: MUSICA_COLOR, marginBottom: 24, alignSelf: 'flex-start' },
  card: {
    backgroundColor: '#FCE4EC', padding: 40, borderRadius: 24, alignItems: 'center',
    width: '100%', ...SHADOWS.card,
  },
  cardEmoji: { fontSize: 72 },
  cardName: { fontSize: 32, fontWeight: '800', color: MUSICA_COLOR, marginTop: 12 },
  badge: { backgroundColor: MUSICA_COLOR, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 10 },
  badgeText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  cardDesc: { fontSize: 18, color: COLORS.textLight, marginTop: 12, textAlign: 'center' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 24 },
  navBtn: { backgroundColor: MUSICA_COLOR, width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  navDisabled: { opacity: 0.3 },
  navText: { color: '#FFF', fontWeight: '800', fontSize: 22 },
  counter: { fontSize: 16, fontWeight: '600', color: COLORS.textLight },
  dotsRow: { flexDirection: 'row', marginTop: 16 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E0E0E0', marginHorizontal: 4 },
  dotActive: { backgroundColor: MUSICA_COLOR, width: 24 },
});
