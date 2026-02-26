import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { timeline } from '../../data/storiaItalia';

const STORIA_COLOR = '#D4A017';
const { width } = Dimensions.get('window');

export default function Timeline() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🏛️ Storia d'Italia</Text>

      {timeline.map((event, i) => (
        <View key={i} style={styles.eventCard}>
          <View style={styles.yearBadge}>
            <Text style={styles.yearText}>{event.year}</Text>
          </View>
          <Text style={styles.eventEmoji}>{event.emoji}</Text>
          <Text style={styles.eventTitle}>{event.title}</Text>
          {event.facts.map((f, j) => (
            <View key={j} style={styles.factRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.factText}>{f}</Text>
            </View>
          ))}
          {i < timeline.length - 1 && <View style={styles.connector} />}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 60 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: STORIA_COLOR, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: STORIA_COLOR, marginBottom: 24 },
  eventCard: {
    backgroundColor: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  yearBadge: { backgroundColor: COLORS.storiaLight, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, marginBottom: 8 },
  yearText: { fontSize: 14, fontWeight: '800', color: STORIA_COLOR },
  eventEmoji: { fontSize: 40, marginBottom: 4 },
  eventTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  factRow: { flexDirection: 'row', marginBottom: 6 },
  bullet: { fontSize: 16, color: STORIA_COLOR, marginRight: 8, marginTop: 1 },
  factText: { fontSize: 16, color: COLORS.text, lineHeight: 22, flex: 1 },
  connector: { width: 3, height: 20, backgroundColor: COLORS.storiaLight, alignSelf: 'center', marginVertical: 0 },
});
