import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { corpoUmano } from '../../data/scienze';

const SCI_COLOR = '#8E44AD';
const SCI_LIGHT = '#F4ECF7';
const { width } = Dimensions.get('window');

export default function Corpo() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [idx, setIdx] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const item = corpoUmano[idx];

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
      <Text style={styles.title}>🧠 Il Corpo Umano</Text>
      <View style={styles.dots}>
        {corpoUmano.map((_, i) => <View key={i} style={[styles.dot, i === idx && styles.dotActive]} />)}
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.card, { transform: [{ translateX: slideAnim }] }]}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.divider} />
          {item.facts.map((f, i) => (
            <View key={i} style={styles.factRow}>
              <Text style={styles.bullet}>🔹</Text>
              <Text style={styles.factText}>{f}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
      <View style={styles.nav}>
        <TouchableOpacity style={[styles.navBtn, idx === 0 && styles.navBtnDisabled]} onPress={() => idx > 0 && goTo(idx - 1)} activeOpacity={0.7}>
          <Text style={styles.navBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.counter}>{idx + 1}/{corpoUmano.length}</Text>
        <TouchableOpacity style={[styles.navBtn, idx === corpoUmano.length - 1 && styles.navBtnDisabled]} onPress={() => idx < corpoUmano.length - 1 && goTo(idx + 1)} activeOpacity={0.7}>
          <Text style={styles.navBtnText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },
  back: { marginBottom: 8 },
  backText: { fontSize: 16, color: SCI_COLOR, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '800', color: SCI_COLOR, marginBottom: 12 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0E0E0' },
  dotActive: { backgroundColor: SCI_COLOR, width: 20 },
  card: { backgroundColor: COLORS.white, borderRadius: 24, padding: 28, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  emoji: { fontSize: 72, textAlign: 'center', marginBottom: 8 },
  name: { fontSize: 28, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: 16 },
  divider: { height: 2, backgroundColor: SCI_LIGHT, borderRadius: 1, marginBottom: 16 },
  factRow: { flexDirection: 'row', marginBottom: 10 },
  bullet: { fontSize: 14, marginRight: 8, marginTop: 2 },
  factText: { fontSize: 17, color: COLORS.text, lineHeight: 24, flex: 1 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  navBtn: { backgroundColor: SCI_LIGHT, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24 },
  navBtnDisabled: { opacity: 0.3 },
  navBtnText: { fontSize: 24, fontWeight: '700', color: SCI_COLOR },
  counter: { fontSize: 14, color: COLORS.textLight, fontWeight: '600' },
});
