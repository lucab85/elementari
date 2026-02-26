import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../constants/theme';

const subjects = [
  { title: 'Matematica', emoji: '🔢', color: COLORS.math, lightColor: COLORS.mathLight, route: '/matematica' },
  { title: 'Italiano', emoji: '📖', color: COLORS.italiano, lightColor: COLORS.italianoLight, route: '/italiano' },
  { title: 'Storia e Scienze', emoji: '🦕', color: COLORS.storia, lightColor: COLORS.storiaLight, route: '/storia' },
  { title: 'I Miei Compiti', emoji: '📝', color: COLORS.compiti, lightColor: COLORS.compitiLight, route: '/compiti' },
];

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>Ciao! 👋</Text>
      <Text style={styles.subtitle}>Cosa studiamo oggi?</Text>

      {subjects.map((subject) => (
        <TouchableOpacity
          key={subject.title}
          style={[styles.card, { backgroundColor: subject.lightColor, borderLeftColor: subject.color }]}
          activeOpacity={0.7}
          onPress={() => router.push(subject.route)}
        >
          <Text style={styles.emoji}>{subject.emoji}</Text>
          <Text style={[styles.cardTitle, { color: subject.color }]}>{subject.title}</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 40 },
  greeting: { fontSize: 36, fontWeight: '800', color: COLORS.text, marginTop: 20 },
  subtitle: { fontSize: 18, color: COLORS.textLight, marginBottom: 30, marginTop: 4 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
    borderLeftWidth: 6,
    ...SHADOWS.card,
  },
  emoji: { fontSize: 40, marginRight: 16 },
  cardTitle: { fontSize: 22, fontWeight: '700', flex: 1 },
  arrow: { fontSize: 28, color: COLORS.textLight },
});
