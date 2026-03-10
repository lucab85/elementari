import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../constants/theme';
import { getStats, clearAnalytics } from '../data/analytics';

const subjectColors = {
  matematica: '#FF6B6B', italiano: '#4ECDC4', storia: '#FFD93D',
  scienze: '#8E44AD', geografia: '#1ABC9C', inglese: '#E67E22',
  civica: '#27AE60', musica: '#E91E63', arte: '#FF6F00',
};

export default function Statistiche() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getStats().then(setStats);
    }, [])
  );

  const handleClear = () => {
    Alert.alert(
      'Cancella Statistiche',
      'Vuoi cancellare tutte le statistiche? Questa azione non può essere annullata.',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Cancella', style: 'destructive',
          onPress: async () => { await clearAnalytics(); setStats(await getStats()); }
        },
      ]
    );
  };

  if (!stats) return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.loading}>Caricamento...</Text>
    </View>
  );

  const formatTime = (sec) => {
    if (sec < 60) return `${sec}s`;
    if (sec < 3600) return `${Math.round(sec / 60)}min`;
    const h = Math.floor(sec / 3600);
    const m = Math.round((sec % 3600) / 60);
    return `${h}h ${m}min`;
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>📊 Le Mie Statistiche</Text>

      {/* Overview cards */}
      <View style={styles.overviewRow}>
        <View style={[styles.overviewCard, { backgroundColor: '#E8F8F5' }]}>
          <Text style={styles.overviewEmoji}>🔥</Text>
          <Text style={styles.overviewNum}>{stats.streak}</Text>
          <Text style={styles.overviewLabel}>Giorni{'\n'}di fila</Text>
        </View>
        <View style={[styles.overviewCard, { backgroundColor: '#FEF9E7' }]}>
          <Text style={styles.overviewEmoji}>⏱️</Text>
          <Text style={styles.overviewNum}>{formatTime(stats.totalStudyTimeSec)}</Text>
          <Text style={styles.overviewLabel}>Tempo{'\n'}di studio</Text>
        </View>
        <View style={[styles.overviewCard, { backgroundColor: '#F4ECF7' }]}>
          <Text style={styles.overviewEmoji}>🎯</Text>
          <Text style={styles.overviewNum}>{stats.accuracy}%</Text>
          <Text style={styles.overviewLabel}>Risposte{'\n'}corrette</Text>
        </View>
      </View>

      {/* Activity stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Attività</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Esercizi completati</Text>
          <Text style={styles.statValue}>{stats.activitiesCompleted}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Risposte totali</Text>
          <Text style={styles.statValue}>{stats.totalAnswers}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Risposte corrette</Text>
          <Text style={[styles.statValue, { color: COLORS.correct }]}>{stats.correctAnswers}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Sessioni di studio</Text>
          <Text style={styles.statValue}>{stats.totalSessions}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Giorni attivi</Text>
          <Text style={styles.statValue}>{stats.activeDays}</Text>
        </View>
      </View>

      {/* Subject breakdown */}
      {Object.keys(stats.subjectStats).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Per Materia</Text>
          {Object.entries(stats.subjectStats).map(([subj, data]) => {
            const acc = data.totalQuestions > 0 ? Math.round((data.totalScore / data.totalQuestions) * 100) : 0;
            const color = subjectColors[subj] || COLORS.text;
            return (
              <View key={subj} style={styles.subjectRow}>
                <View style={[styles.subjectDot, { backgroundColor: color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.subjectName, { color }]}>
                    {subj.charAt(0).toUpperCase() + subj.slice(1)}
                  </Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${acc}%`, backgroundColor: color }]} />
                  </View>
                </View>
                <View style={styles.subjectStats}>
                  <Text style={styles.subjectAcc}>{acc}%</Text>
                  <Text style={styles.subjectCount}>{data.completed}x</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Top screens */}
      {stats.topScreens.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Schermate più visitate</Text>
          {stats.topScreens.slice(0, 5).map(([screen, count], i) => (
            <View key={screen} style={styles.statRow}>
              <Text style={styles.statLabel}>{i + 1}. {screen}</Text>
              <Text style={styles.statValue}>{count}x</Text>
            </View>
          ))}
        </View>
      )}

      {/* Today */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Oggi</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Eventi oggi</Text>
          <Text style={styles.statValue}>{stats.todayEvents}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Eventi ultimi 7 giorni</Text>
          <Text style={styles.statValue}>{stats.weekEvents}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
        <Text style={styles.clearText}>🗑️ Cancella statistiche</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24 },
  loading: { fontSize: 18, color: COLORS.textLight, textAlign: 'center', marginTop: 100 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: '#6C5CE7', fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginBottom: 20 },
  overviewRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  overviewCard: {
    flex: 1, alignItems: 'center', padding: 16, borderRadius: 20, marginHorizontal: 4, ...SHADOWS.card,
  },
  overviewEmoji: { fontSize: 28 },
  overviewNum: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginTop: 4 },
  overviewLabel: { fontSize: 12, color: COLORS.textLight, textAlign: 'center', marginTop: 2 },
  section: {
    backgroundColor: COLORS.card, padding: 20, borderRadius: 20, marginBottom: 16, ...SHADOWS.card,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  statLabel: { fontSize: 16, color: COLORS.textLight },
  statValue: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  subjectRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  subjectDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  subjectName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  subjectStats: { alignItems: 'flex-end', marginLeft: 12 },
  subjectAcc: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  subjectCount: { fontSize: 12, color: COLORS.textLight },
  barBg: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4 },
  barFill: { height: 8, borderRadius: 4 },
  clearBtn: { alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 20, marginTop: 8 },
  clearText: { fontSize: 15, color: COLORS.wrong, fontWeight: '600' },
});
