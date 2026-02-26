import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { vocabulary } from '../../data/inglese';

const ENG_COLOR = '#E67E22';
const ENG_LIGHT = '#FDEBD0';

export default function Vocabolario() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { topic: topicParam } = useLocalSearchParams();
  const topicIdx = topicParam !== undefined ? parseInt(topicParam) : null;

  if (topicIdx === null) {
    return (
      <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📚 Vocabolario</Text>
        {vocabulary.map((v, i) => (
          <TouchableOpacity key={i} style={styles.card} onPress={() => router.push(`/inglese/vocabolario?topic=${i}`)} activeOpacity={0.7}>
            <Text style={styles.cardTitle}>{v.title}</Text>
            <Text style={styles.cardDesc}>{v.words.length} parole</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  const topic = vocabulary[topicIdx];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Vocabolario</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{topic.title}</Text>

      {topic.words.map((w, i) => (
        <View key={i} style={styles.wordCard}>
          <Text style={styles.wordEmoji}>{w.emoji}</Text>
          <View style={styles.wordContent}>
            <Text style={styles.wordEn}>{w.en}</Text>
            <Text style={styles.wordIt}>{w.it}</Text>
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
  backText: { fontSize: 16, color: ENG_COLOR, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: ENG_COLOR, marginBottom: 20 },
  card: { backgroundColor: ENG_LIGHT, padding: 20, borderRadius: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: ENG_COLOR },
  cardDesc: { fontSize: 13, color: COLORS.textLight, marginTop: 4 },
  wordCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 16, borderRadius: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  wordEmoji: { fontSize: 36, marginRight: 16 },
  wordContent: { flex: 1 },
  wordEn: { fontSize: 20, fontWeight: '700', color: ENG_COLOR },
  wordIt: { fontSize: 16, color: COLORS.textLight, marginTop: 2 },
});
