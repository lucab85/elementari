import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

const SCI_COLOR = '#8E44AD';
const SCI_LIGHT = '#F4ECF7';

export default function Scienze() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🔬 Scienze</Text>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/scienze/pianeti')} activeOpacity={0.7}>
        <Text style={styles.emoji}>🪐</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Il Sistema Solare</Text>
          <Text style={styles.cardDesc}>Scopri i pianeti</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/scienze/corpo')} activeOpacity={0.7}>
        <Text style={styles.emoji}>🧠</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Il Corpo Umano</Text>
          <Text style={styles.cardDesc}>Organi e curiosità</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/scienze/quiz')} activeOpacity={0.7}>
        <Text style={styles.emoji}>❓</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Quiz Scienze</Text>
          <Text style={styles.cardDesc}>Metti alla prova le tue conoscenze</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/scienze/materia')} activeOpacity={0.7}>
        <Text style={styles.emoji}>🧊</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Gli Stati della Materia</Text>
          <Text style={styles.cardDesc}>Solido, liquido, gassoso</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/scienze/catena')} activeOpacity={0.7}>
        <Text style={styles.emoji}>🔗</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Catena Alimentare</Text>
          <Text style={styles.cardDesc}>Produttori, consumatori, decompositori</Text>
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
  backText: { fontSize: 16, color: SCI_COLOR, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '800', color: SCI_COLOR, marginBottom: 24 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: SCI_LIGHT, padding: 20, borderRadius: 16, marginBottom: 14, ...SHADOWS.card },
  emoji: { fontSize: 36, marginRight: 14 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: SCI_COLOR },
  cardDesc: { fontSize: 14, color: COLORS.textLight, marginTop: 2 },
  arrow: { fontSize: 28, color: COLORS.textLight, fontWeight: '300' },
});
