import { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../constants/theme';
import { getTotalStars } from '../data/progress';
import { hapticTap } from '../components/KidsFeedback';

const subjects = [
  { title: 'Matematica', emoji: '🔢', color: COLORS.math, lightColor: COLORS.mathLight, route: '/matematica', desc: '19 attività: tabelline, problemi, geometria...' },
  { title: 'Italiano', emoji: '📖', color: COLORS.italiano, lightColor: COLORS.italianoLight, route: '/italiano', desc: 'Ortografia, grammatica, punteggiatura, poesie' },
  { title: 'Storia', emoji: '🦕', color: COLORS.storia, lightColor: COLORS.storiaLight, route: '/storia', desc: 'Preistoria, storia d\'Italia, quiz' },
  { title: 'Scienze', emoji: '🔬', color: '#8E44AD', lightColor: '#F4ECF7', route: '/scienze', desc: 'Sistema Solare, corpo umano, catena alimentare' },
  { title: 'Geografia', emoji: '🌍', color: '#1ABC9C', lightColor: '#D1F2EB', route: '/geografia', desc: '20 regioni d\'Italia e quiz' },
  { title: 'Inglese', emoji: '🇬🇧', color: '#E67E22', lightColor: '#FDEBD0', route: '/inglese', desc: '95+ parole e quiz' },
  { title: 'Ed. Civica', emoji: '🏛️', color: '#27AE60', lightColor: '#D5F5E3', route: '/civica', desc: 'Diritti, regole, Costituzione' },
  { title: 'Musica', emoji: '🎵', color: '#E91E63', lightColor: '#FCE4EC', route: '/musica', desc: 'Note, strumenti e quiz' },
  { title: 'Arte', emoji: '🎨', color: '#FF6F00', lightColor: '#FFF3E0', route: '/arte', desc: 'Colori e pittori' },
  { title: 'I Miei Compiti', emoji: '📝', color: COLORS.compiti, lightColor: COLORS.compitiLight, route: '/compiti', desc: 'La tua lista compiti' },
];

function AnimatedCard({ subject, onPress, index }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    hapticTap();
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start(() => onPress());
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: subject.lightColor, borderLeftColor: subject.color }]}
        activeOpacity={0.85}
        onPress={handlePress}
      >
        <Text style={styles.emoji}>{subject.emoji}</Text>
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: subject.color }]}>{subject.title}</Text>
          <Text style={styles.cardDesc}>{subject.desc}</Text>
        </View>
        <Text style={[styles.arrow, { color: subject.color }]}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stars, setStars] = useState(0);
  const starAnim = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    useCallback(() => {
      getTotalStars().then((s) => {
        setStars(s);
        if (s > 0) {
          Animated.sequence([
            Animated.timing(starAnim, { toValue: 1.2, duration: 300, useNativeDriver: true }),
            Animated.spring(starAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
          ]).start();
        }
      });
    }, [])
  );

  const hour = new Date().getHours();
  let greeting, greetEmoji;
  if (hour >= 5 && hour < 12) { greeting = 'Buongiorno!'; greetEmoji = '☀️'; }
  else if (hour >= 12 && hour < 18) { greeting = 'Buon pomeriggio!'; greetEmoji = '🌤️'; }
  else if (hour >= 18 && hour < 22) { greeting = 'Buonasera!'; greetEmoji = '🌅'; }
  else { greeting = 'Buonanotte!'; greetEmoji = '🌙'; }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>{greeting} {greetEmoji}</Text>
          <Text style={styles.subtitle}>Cosa studiamo oggi?</Text>
        </View>
        {stars > 0 && (
          <Animated.View style={[styles.starBadge, { transform: [{ scale: starAnim }] }]}>
            <Text style={styles.starText}>⭐ {stars}</Text>
          </Animated.View>
        )}
      </View>

      <TouchableOpacity
        style={styles.statsBtn}
        activeOpacity={0.7}
        onPress={() => { hapticTap(); router.push('/statistiche'); }}
      >
        <Text style={styles.statsBtnText}>📊 Le Mie Statistiche</Text>
      </TouchableOpacity>

      {subjects.map((subject, i) => (
        <AnimatedCard
          key={subject.title}
          subject={subject}
          index={i}
          onPress={() => router.push(subject.route)}
        />
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ per i piccoli studenti</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 20, paddingBottom: 40 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 16, marginBottom: 24 },
  greeting: { fontSize: 34, fontWeight: '900', color: COLORS.text },
  subtitle: { fontSize: 18, color: COLORS.textLight, marginTop: 4 },
  starBadge: {
    backgroundColor: '#FFF8DC', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 24,
    ...SHADOWS.card, borderWidth: 2, borderColor: '#FFD700',
  },
  starText: { fontSize: 22, fontWeight: '800', color: '#D4A017' },
  statsBtn: {
    backgroundColor: '#6C5CE7', paddingVertical: 16, borderRadius: 20, alignItems: 'center', marginBottom: 20,
    ...SHADOWS.card, shadowColor: '#6C5CE7', shadowOpacity: 0.3,
  },
  statsBtnText: { color: '#FFF', fontSize: 19, fontWeight: '800' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    marginBottom: 14,
    borderLeftWidth: 6,
    ...SHADOWS.card,
    minHeight: 88,
  },
  emoji: { fontSize: 42, marginRight: 16 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 23, fontWeight: '800' },
  cardDesc: { fontSize: 14, color: COLORS.textLight, marginTop: 4 },
  arrow: { fontSize: 36, fontWeight: '600' },
  footer: { alignItems: 'center', marginTop: 24 },
  footerText: { fontSize: 14, color: COLORS.textLight },
});
