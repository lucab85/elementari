import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { animals } from '../../data/storia';

const { width } = Dimensions.get('window');

export default function Animali() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [idx, setIdx] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animal = animals[idx];

  const goTo = (newIdx) => {
    const direction = newIdx > idx ? -1 : 1;
    Animated.timing(slideAnim, { toValue: direction * width, duration: 180, useNativeDriver: true }).start(() => {
      setIdx(newIdx);
      slideAnim.setValue(-direction * width);
      Animated.timing(slideAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start();
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🦖 Animali del mondo antico</Text>

      <View style={styles.progressBar}>
        {animals.map((_, i) => (
          <View key={i} style={[styles.dot, i === idx && styles.dotActive]} />
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.card, { transform: [{ translateX: slideAnim }] }]}>
          <Text style={styles.animalEmoji}>{animal.emoji}</Text>
          <Text style={styles.animalName}>{animal.name}</Text>
          {animal.period && <Text style={styles.period}>🕐 {animal.period}</Text>}
          <View style={styles.divider} />
          {animal.facts.map((f, i) => (
            <View key={i} style={styles.factRow}>
              <Text style={styles.bullet}>🔹</Text>
              <Text style={styles.factText}>{f}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      <View style={styles.nav}>
        <TouchableOpacity
          style={[styles.navBtn, idx === 0 && styles.navBtnDisabled]}
          onPress={() => idx > 0 && goTo(idx - 1)}
          activeOpacity={0.7}
        >
          <Text style={styles.navBtnText}>← Precedente</Text>
        </TouchableOpacity>
        <Text style={styles.counter}>{idx + 1}/{animals.length}</Text>
        <TouchableOpacity
          style={[styles.navBtn, idx === animals.length - 1 && styles.navBtnDisabled]}
          onPress={() => idx < animals.length - 1 && goTo(idx + 1)}
          activeOpacity={0.7}
        >
          <Text style={styles.navBtnText}>Successivo →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },
  back: { marginBottom: 8 },
  backText: { fontSize: 16, color: '#D4A017', fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '800', color: '#D4A017', marginBottom: 12 },
  progressBar: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0E0E0' },
  dotActive: { backgroundColor: '#D4A017', width: 24 },
  card: {
    backgroundColor: COLORS.white, borderRadius: 24, padding: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
    marginBottom: 16,
  },
  animalEmoji: { fontSize: 72, textAlign: 'center', marginBottom: 8 },
  animalName: { fontSize: 28, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: 6 },
  period: { fontSize: 13, color: COLORS.textLight, textAlign: 'center', marginBottom: 12, fontStyle: 'italic' },
  divider: { height: 2, backgroundColor: COLORS.storiaLight, borderRadius: 1, marginBottom: 16 },
  factRow: { flexDirection: 'row', marginBottom: 10, paddingRight: 8 },
  bullet: { fontSize: 14, marginRight: 8, marginTop: 2 },
  factText: { fontSize: 17, color: COLORS.text, lineHeight: 24, flex: 1 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 8 },
  navBtn: { backgroundColor: COLORS.storiaLight, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, flex: 1, alignItems: 'center' },
  navBtnDisabled: { opacity: 0.3 },
  navBtnText: { fontSize: 15, fontWeight: '700', color: '#D4A017' },
  counter: { fontSize: 14, color: COLORS.textLight, fontWeight: '600' },
});
