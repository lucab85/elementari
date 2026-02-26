import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
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
    Animated.timing(slideAnim, { toValue: -width, duration: 200, useNativeDriver: true }).start(() => {
      setIdx(newIdx);
      slideAnim.setValue(width);
      Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🦖 Animali del mondo antico</Text>
      <Text style={styles.progress}>{idx + 1} / {animals.length}</Text>

      <Animated.View style={[styles.card, { transform: [{ translateX: slideAnim }] }]}>
        <Text style={styles.animalEmoji}>{animal.emoji}</Text>
        <Text style={styles.animalName}>{animal.name}</Text>
        {animal.facts.map((f, i) => (
          <View key={i} style={styles.factRow}>
            <Text style={styles.bullet}>🔹</Text>
            <Text style={styles.factText}>{f}</Text>
          </View>
        ))}
      </Animated.View>

      <View style={styles.nav}>
        <TouchableOpacity
          style={[styles.navBtn, idx === 0 && styles.navBtnDisabled]}
          onPress={() => idx > 0 && goTo(idx - 1)}
          activeOpacity={0.7}
        >
          <Text style={styles.navBtnText}>← Precedente</Text>
        </TouchableOpacity>
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
  title: { fontSize: 24, fontWeight: '800', color: '#D4A017', marginBottom: 8 },
  progress: { fontSize: 14, color: COLORS.textLight, marginBottom: 16 },
  card: {
    backgroundColor: COLORS.white, borderRadius: 24, padding: 28, flex: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
  },
  animalEmoji: { fontSize: 72, textAlign: 'center', marginBottom: 8 },
  animalName: { fontSize: 28, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: 20 },
  factRow: { flexDirection: 'row', marginBottom: 12, paddingRight: 8 },
  bullet: { fontSize: 16, marginRight: 8, marginTop: 2 },
  factText: { fontSize: 18, color: COLORS.text, lineHeight: 26, flex: 1 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 12 },
  navBtn: { backgroundColor: COLORS.storiaLight, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 20, flex: 1, alignItems: 'center' },
  navBtnDisabled: { opacity: 0.3 },
  navBtnText: { fontSize: 16, fontWeight: '700', color: '#D4A017' },
});
