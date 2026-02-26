import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';
import { timeline, storiaQuiz } from '../../data/storiaItalia';

const { width } = Dimensions.get('window');
const STORIA_COLOR = '#D4A017';

export default function StoriaIndex() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🦕 Storia</Text>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/storia/animali')} activeOpacity={0.7}>
        <Text style={styles.emoji}>🦖</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Animali del mondo antico</Text>
          <Text style={styles.cardDesc}>10 animali preistorici</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/storia/timeline')} activeOpacity={0.7}>
        <Text style={styles.emoji}>🏛️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Storia d'Italia</Text>
          <Text style={styles.cardDesc}>Dalla fondazione di Roma a oggi</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/storia/quiz')} activeOpacity={0.7}>
        <Text style={styles.emoji}>❓</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Quiz Animali</Text>
          <Text style={styles.cardDesc}>15 domande</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/storia/quizstoria')} activeOpacity={0.7}>
        <Text style={styles.emoji}>🇮🇹</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Quiz Storia d'Italia</Text>
          <Text style={styles.cardDesc}>8 domande</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 40 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: STORIA_COLOR, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '800', color: STORIA_COLOR, marginBottom: 24 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.storiaLight, padding: 20, borderRadius: 16, marginBottom: 14, ...SHADOWS.card },
  emoji: { fontSize: 36, marginRight: 14 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: STORIA_COLOR },
  cardDesc: { fontSize: 14, color: COLORS.textLight, marginTop: 2 },
  arrow: { fontSize: 28, color: COLORS.textLight, fontWeight: '300' },
});
