import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

export default function Storia() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🦕 Storia e Scienze</Text>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/storia/animali')} activeOpacity={0.7}>
        <Text style={styles.emoji}>🦖</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Animali del mondo antico</Text>
          <Text style={styles.cardDesc}>Scopri gli animali preistorici!</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/storia/quiz')} activeOpacity={0.7}>
        <Text style={styles.emoji}>❓</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Quiz</Text>
          <Text style={styles.cardDesc}>Metti alla prova le tue conoscenze</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 40 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: '#D4A017', fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '800', color: '#D4A017', marginBottom: 24 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.storiaLight,
    padding: 20, borderRadius: 16, marginBottom: 14, ...SHADOWS.card,
  },
  emoji: { fontSize: 36, marginRight: 14 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#D4A017' },
  cardDesc: { fontSize: 14, color: COLORS.textLight, marginTop: 2 },
  arrow: { fontSize: 24, color: COLORS.textLight },
});
