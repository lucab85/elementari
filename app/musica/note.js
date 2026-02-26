import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { noteMusical } from '../../data/musica';

const MUSICA_COLOR = '#E91E63';
const { width } = Dimensions.get('window');

export default function Note() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const nota = noteMusical[current];

  const animateAndGo = (dir) => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setCurrent(c => Math.max(0, Math.min(noteMusical.length - 1, c + dir)));
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🎵 Le Note Musicali</Text>

      <Animated.View style={[styles.noteCard, { backgroundColor: nota.color + '20', borderColor: nota.color, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.noteEmoji}>{nota.emoji}</Text>
        <Text style={[styles.noteName, { color: nota.color }]}>{nota.name}</Text>
        <Text style={styles.noteDesc}>{nota.desc}</Text>
        <View style={styles.positionBadge}>
          <Text style={styles.positionText}>{nota.position}ª nota</Text>
        </View>
      </Animated.View>

      {/* Scale visualization */}
      <View style={styles.scaleRow}>
        {noteMusical.map((n, i) => (
          <TouchableOpacity key={n.name} onPress={() => setCurrent(i)}
            style={[styles.scaleNote, { backgroundColor: i === current ? n.color : n.color + '30' }]}>
            <Text style={[styles.scaleText, { color: i === current ? '#FFF' : n.color }]}>{n.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity style={[styles.navBtn, current === 0 && styles.navDisabled]}
          onPress={() => current > 0 && animateAndGo(-1)}>
          <Text style={styles.navText}>← Precedente</Text>
        </TouchableOpacity>
        <Text style={styles.counter}>{current + 1} / {noteMusical.length}</Text>
        <TouchableOpacity style={[styles.navBtn, current === noteMusical.length - 1 && styles.navDisabled]}
          onPress={() => current < noteMusical.length - 1 && animateAndGo(1)}>
          <Text style={styles.navText}>Successiva →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 40 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: MUSICA_COLOR, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: MUSICA_COLOR, marginBottom: 24 },
  noteCard: {
    alignItems: 'center', padding: 40, borderRadius: 24, borderWidth: 3, marginBottom: 24,
  },
  noteEmoji: { fontSize: 64 },
  noteName: { fontSize: 56, fontWeight: '900', marginTop: 8 },
  noteDesc: { fontSize: 18, color: COLORS.textLight, marginTop: 8 },
  positionBadge: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 12 },
  positionText: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  scaleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  scaleNote: { width: (width - 80) / 7, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  scaleText: { fontSize: 13, fontWeight: '700' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  navBtn: { backgroundColor: MUSICA_COLOR, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14 },
  navDisabled: { opacity: 0.3 },
  navText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  counter: { fontSize: 16, fontWeight: '600', color: COLORS.textLight },
});
