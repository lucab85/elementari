import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { diritti } from '../../data/civica';

const CIV_COLOR = '#27AE60';
const CIV_LIGHT = '#D5F5E3';
const { width } = Dimensions.get('window');

export default function Diritti() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [idx, setIdx] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const d = diritti[idx];

  const goTo = (n) => {
    const dir = n > idx ? -1 : 1;
    Animated.timing(slideAnim, { toValue: dir * width, duration: 150, useNativeDriver: true }).start(() => {
      setIdx(n); slideAnim.setValue(-dir * width);
      Animated.timing(slideAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
      <Text style={styles.title}>📜 I Diritti dei Bambini</Text>
      <View style={styles.dots}>{diritti.map((_, i) => <View key={i} style={[styles.dot, i === idx && styles.dotActive]} />)}</View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.card, { transform: [{ translateX: slideAnim }] }]}>
          <Text style={{ fontSize: 64, textAlign: 'center' }}>{d.emoji}</Text>
          <Text style={styles.cardTitle}>{d.title}</Text>
          <View style={styles.articleBadge}><Text style={styles.articleText}>{d.article}</Text></View>
          <View style={styles.divider} />
          <Text style={styles.descText}>{d.text}</Text>
        </Animated.View>
      </ScrollView>
      <View style={styles.nav}>
        <TouchableOpacity style={[styles.navBtn, idx === 0 && styles.navBtnDisabled]} onPress={() => idx > 0 && goTo(idx - 1)}><Text style={styles.navBtnText}>←</Text></TouchableOpacity>
        <Text style={styles.counter}>{idx + 1}/{diritti.length}</Text>
        <TouchableOpacity style={[styles.navBtn, idx === diritti.length - 1 && styles.navBtnDisabled]} onPress={() => idx < diritti.length - 1 && goTo(idx + 1)}><Text style={styles.navBtnText}>→</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },
  back: { marginBottom: 8 },
  backText: { fontSize: 16, color: CIV_COLOR, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '800', color: CIV_COLOR, marginBottom: 12 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0E0E0' },
  dotActive: { backgroundColor: CIV_COLOR, width: 20 },
  card: { backgroundColor: COLORS.white, borderRadius: 24, padding: 28, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  cardTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginTop: 8, marginBottom: 12 },
  articleBadge: { backgroundColor: CIV_LIGHT, alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12, marginBottom: 16 },
  articleText: { fontSize: 14, fontWeight: '700', color: CIV_COLOR },
  divider: { height: 2, backgroundColor: CIV_LIGHT, borderRadius: 1, marginBottom: 16 },
  descText: { fontSize: 18, color: COLORS.text, lineHeight: 28, textAlign: 'center' },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  navBtn: { backgroundColor: CIV_LIGHT, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24 },
  navBtnDisabled: { opacity: 0.3 },
  navBtnText: { fontSize: 24, fontWeight: '700', color: CIV_COLOR },
  counter: { fontSize: 14, color: COLORS.textLight, fontWeight: '600' },
});
