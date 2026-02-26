import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { descrizionePrompts } from '../../data/italiano';

export default function Descrizione() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});

  if (selected === null) {
    return (
      <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📝 Descrizione guidata</Text>
        <Text style={styles.subtitle}>Scegli cosa descrivere:</Text>
        {descrizionePrompts.map((p, i) => (
          <TouchableOpacity key={i} style={styles.card} onPress={() => { setSelected(i); setAnswers({}); }} activeOpacity={0.7}>
            <Text style={styles.cardTitle}>{p.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  const prompt = descrizionePrompts[selected];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => setSelected(null)} style={styles.back}>
          <Text style={styles.backText}>← Scegli argomento</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{prompt.title}</Text>
        <Text style={styles.subtitle}>Rispondi alle domande guida:</Text>

        {prompt.questions.map((q, i) => (
          <View key={i} style={styles.qBlock}>
            <Text style={styles.qLabel}>{q}</Text>
            <TextInput
              style={styles.qInput}
              value={answers[i] || ''}
              onChangeText={(t) => setAnswers({ ...answers, [i]: t })}
              placeholder="Scrivi qui..."
              placeholderTextColor="#AAA"
              multiline
            />
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 60 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: COLORS.italiano, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.italiano, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.textLight, marginBottom: 20 },
  card: {
    backgroundColor: COLORS.italianoLight, borderRadius: 16, padding: 24, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: COLORS.italiano },
  qBlock: { marginBottom: 20 },
  qLabel: { fontSize: 17, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  qInput: {
    backgroundColor: COLORS.white, borderRadius: 12, padding: 16, fontSize: 16,
    minHeight: 60, borderWidth: 2, borderColor: COLORS.italianoLight, textAlignVertical: 'top',
  },
});
