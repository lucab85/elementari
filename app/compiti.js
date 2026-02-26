import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SHADOWS } from '../constants/theme';

const STORAGE_KEY = 'compiti_tasks';

export default function Compiti() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setTasks(JSON.parse(data));
    });
  }, []);

  const save = (t) => {
    setTasks(t);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(t));
  };

  const addTask = () => {
    if (!input.trim()) return;
    save([...tasks, { id: Date.now(), text: input.trim(), done: false }]);
    setInput('');
  };

  const toggle = (id) => {
    save(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const remove = (id) => {
    save(tasks.filter((t) => t.id !== id));
  };

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Indietro</Text>
      </TouchableOpacity>
      <Text style={styles.title}>📝 I Miei Compiti</Text>

      {tasks.length > 0 && (
        <Text style={styles.counter}>{doneCount}/{tasks.length} completati ✨</Text>
      )}

      {tasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          style={[styles.taskCard, task.done && styles.taskDone]}
          onPress={() => toggle(task.id)}
          onLongPress={() => remove(task.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.checkbox}>{task.done ? '✅' : '⬜'}</Text>
          <Text style={[styles.taskText, task.done && styles.taskTextDone]}>{task.text}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Aggiungi un compito..."
          placeholderTextColor="#AAA"
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask} activeOpacity={0.7}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {tasks.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 60 }}>📚</Text>
          <Text style={styles.emptyText}>Nessun compito ancora!</Text>
          <Text style={styles.emptyHint}>Aggiungi i tuoi compiti qui sopra</Text>
        </View>
      )}

      {tasks.length > 0 && (
        <Text style={styles.hint}>Tocca per completare • Tieni premuto per eliminare</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 60 },
  back: { marginBottom: 8, marginTop: 16 },
  backText: { fontSize: 16, color: COLORS.compiti, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.compiti, marginBottom: 8 },
  counter: { fontSize: 16, color: COLORS.textLight, marginBottom: 20 },
  taskCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    padding: 18, borderRadius: 14, marginBottom: 10, ...SHADOWS.card,
  },
  taskDone: { backgroundColor: '#F0F0F0', opacity: 0.7 },
  checkbox: { fontSize: 24, marginRight: 14 },
  taskText: { fontSize: 18, color: COLORS.text, flex: 1 },
  taskTextDone: { textDecorationLine: 'line-through', color: COLORS.textLight },
  inputRow: { flexDirection: 'row', marginTop: 12, marginBottom: 20, gap: 10 },
  input: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 16, fontSize: 17,
    borderWidth: 2, borderColor: COLORS.compitiLight,
  },
  addBtn: {
    width: 56, height: 56, borderRadius: 14, backgroundColor: COLORS.compiti,
    justifyContent: 'center', alignItems: 'center',
  },
  addBtnText: { color: '#FFF', fontSize: 32, fontWeight: '700' },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 20, fontWeight: '600', color: COLORS.textLight, marginTop: 12 },
  emptyHint: { fontSize: 15, color: COLORS.textLight, marginTop: 4 },
  hint: { textAlign: 'center', fontSize: 13, color: COLORS.textLight, marginTop: 8 },
});
