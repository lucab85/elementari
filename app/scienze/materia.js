import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

const SCI_COLOR = '#8E44AD';
const SCI_LIGHT = '#F4ECF7';
const { width } = Dimensions.get('window');

const stati = [
  { name: 'Solido', emoji: '🧊', examples: ['Ghiaccio', 'Pietra', 'Legno', 'Metallo'],
    facts: ['Ha una forma propria', 'Ha un volume proprio', 'Le molecole sono vicine e ordinate', 'Non si comprime facilmente'] },
  { name: 'Liquido', emoji: '💧', examples: ['Acqua', 'Latte', 'Succo', 'Olio'],
    facts: ['Non ha forma propria (prende quella del contenitore)', 'Ha un volume proprio', 'Le molecole si muovono liberamente', 'Scorre e si versa'] },
  { name: 'Gassoso (Gas)', emoji: '💨', examples: ['Aria', 'Vapore acqueo', 'Ossigeno', 'Elio'],
    facts: ['Non ha forma propria', 'Non ha volume proprio (occupa tutto lo spazio)', 'Le molecole si muovono velocemente in tutte le direzioni', 'Si comprime facilmente'] },
];

const passaggi = [
  { from: 'Solido', to: 'Liquido', name: 'Fusione', emoji: '🧊→💧', example: 'Il ghiaccio si scioglie' },
  { from: 'Liquido', to: 'Gas', name: 'Evaporazione', emoji: '💧→💨', example: 'L\'acqua bolle e diventa vapore' },
  { from: 'Gas', to: 'Liquido', name: 'Condensazione', emoji: '💨→💧', example: 'Il vapore diventa gocce sulla finestra' },
  { from: 'Liquido', to: 'Solido', name: 'Solidificazione', emoji: '💧→🧊', example: 'L\'acqua diventa ghiaccio nel freezer' },
  { from: 'Solido', to: 'Gas', name: 'Sublimazione', emoji: '🧊→💨', example: 'La naftalina scompare nell\'armadio' },
];

export default function Materia() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>← Indietro</Text></TouchableOpacity>
      <Text style={styles.title}>🔬 Gli Stati della Materia</Text>

      {stati.map((s, i) => (
        <View key={i} style={styles.card}>
          <Text style={{ fontSize: 56, textAlign: 'center' }}>{s.emoji}</Text>
          <Text style={styles.stateName}>{s.name}</Text>
          <View style={styles.examplesRow}>
            {s.examples.map((ex, j) => (
              <View key={j} style={styles.exampleBadge}><Text style={styles.exampleText}>{ex}</Text></View>
            ))}
          </View>
          <View style={styles.divider} />
          {s.facts.map((f, j) => (
            <View key={j} style={styles.factRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.factText}>{f}</Text>
            </View>
          ))}
        </View>
      ))}

      <Text style={styles.sectionTitle}>🔄 I Passaggi di Stato</Text>
      {passaggi.map((p, i) => (
        <View key={i} style={styles.passCard}>
          <Text style={{ fontSize: 28 }}>{p.emoji}</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.passName}>{p.name}</Text>
            <Text style={styles.passDir}>{p.from} → {p.to}</Text>
            <Text style={styles.passExample}>Es: {p.example}</Text>
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
  backText: { fontSize: 16, color: SCI_COLOR, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '800', color: SCI_COLOR, marginBottom: 20 },
  card: { backgroundColor: COLORS.white, borderRadius: 24, padding: 24, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  stateName: { fontSize: 26, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginVertical: 8 },
  examplesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 12 },
  exampleBadge: { backgroundColor: SCI_LIGHT, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  exampleText: { fontSize: 14, fontWeight: '600', color: SCI_COLOR },
  divider: { height: 2, backgroundColor: SCI_LIGHT, borderRadius: 1, marginBottom: 12 },
  factRow: { flexDirection: 'row', marginBottom: 6 },
  bullet: { fontSize: 14, color: SCI_COLOR, marginRight: 8, marginTop: 2 },
  factText: { fontSize: 16, color: COLORS.text, lineHeight: 22, flex: 1 },
  sectionTitle: { fontSize: 24, fontWeight: '800', color: SCI_COLOR, marginTop: 12, marginBottom: 16 },
  passCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  passName: { fontSize: 18, fontWeight: '700', color: SCI_COLOR },
  passDir: { fontSize: 14, color: COLORS.textLight, marginTop: 2 },
  passExample: { fontSize: 14, color: COLORS.text, fontStyle: 'italic', marginTop: 4 },
});
