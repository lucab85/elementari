import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../constants/theme';
import { getTotalStars } from '../data/progress';

const subjects = [
  { title: 'Matematica', emoji: '🔢', color: COLORS.math, lightColor: COLORS.mathLight, route: '/matematica', desc: '12 attività: tabelline, problemi, geometria...' },
  { title: 'Italiano', emoji: '📖', color: COLORS.italiano, lightColor: COLORS.italianoLight, route: '/italiano', desc: 'Ortografia, grammatica, poesie, descrizioni' },
  { title: 'Storia', emoji: '🦕', color: COLORS.storia, lightColor: COLORS.storiaLight, route: '/storia', desc: 'Preistoria, storia d\'Italia, quiz' },
  { title: 'Scienze', emoji: '🔬', color: '#8E44AD', lightColor: '#F4ECF7', route: '/scienze', desc: 'Sistema Solare, corpo umano, quiz' },
  { title: 'Geografia', emoji: '🌍', color: '#1ABC9C', lightColor: '#D1F2EB', route: '/geografia', desc: '20 regioni d\'Italia e quiz' },
  { title: 'Inglese', emoji: '🇬🇧', color: '#E67E22', lightColor: '#FDEBD0', route: '/inglese', desc: '65+ parole e quiz' },
  { title: 'Ed. Civica', emoji: '🏛️', color: '#27AE60', lightColor: '#D5F5E3', route: '/civica', desc: 'Diritti, regole, Costituzione' },
  { title: 'I Miei Compiti', emoji: '📝', color: COLORS.compiti, lightColor: COLORS.compitiLight, route: '/compiti', desc: 'La tua lista compiti' },
];

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stars, setStars] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getTotalStars().then(setStars);
    }, [])
  );

  // Pick a greeting based on time
  const hour = new Date().getHours();
  let greeting = 'Buongiorno! ☀️';
  if (hour >= 13 && hour < 18) greeting = 'Buon pomeriggio! 🌤️';
  else if (hour >= 18) greeting = 'Buonasera! 🌙';

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtitle}>Cosa studiamo oggi?</Text>
        </View>
        {stars > 0 && (
          <View style={styles.starBadge}>
            <Text style={styles.starText}>⭐ {stars}</Text>
          </View>
        )}
      </View>

      {subjects.map((subject) => (
        <TouchableOpacity
          key={subject.title}
          style={[styles.card, { backgroundColor: subject.lightColor, borderLeftColor: subject.color }]}
          activeOpacity={0.7}
          onPress={() => router.push(subject.route)}
        >
          <Text style={styles.emoji}>{subject.emoji}</Text>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: subject.color }]}>{subject.title}</Text>
            <Text style={styles.cardDesc}>{subject.desc}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ per i piccoli studenti</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 40 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 20, marginBottom: 30 },
  greeting: { fontSize: 32, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 18, color: COLORS.textLight, marginTop: 4 },
  starBadge: { backgroundColor: '#FFF8DC', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, ...SHADOWS.card },
  starText: { fontSize: 20, fontWeight: '700', color: '#D4A017' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
    borderRadius: 20,
    marginBottom: 14,
    borderLeftWidth: 6,
    ...SHADOWS.card,
  },
  emoji: { fontSize: 38, marginRight: 16 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 22, fontWeight: '700' },
  cardDesc: { fontSize: 13, color: COLORS.textLight, marginTop: 3 },
  arrow: { fontSize: 32, color: COLORS.textLight, fontWeight: '300' },
  footer: { alignItems: 'center', marginTop: 20 },
  footerText: { fontSize: 14, color: COLORS.textLight },
});
