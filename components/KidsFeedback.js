import { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// ─── Encouraging Messages ───

const CORRECT_MESSAGES = [
  'Bravissimo! 🌟', 'Fantastico! 🎉', 'Perfetto! ⭐', 'Grande! 💪',
  'Esatto! 🏆', 'Ottimo lavoro! 🎯', 'Sei un genio! 🧠', 'Wow! 🚀',
  'Stupendo! ✨', 'Incredibile! 🔥', 'Super! 💫', 'Campione! 🥇',
  'Bravo! 👏', 'Magnifico! 🎊', 'Eccellente! 💎',
];

const WRONG_MESSAGES = [
  'Quasi! Riprova 💪', 'Non preoccuparti! 😊', 'Ci sei quasi! 🌈',
  'La prossima volta! ✨', 'Continua così! 🚀', 'Proviamo ancora! 💫',
  'Non arrenderti! 🌟', 'Sbagliando si impara! 📚',
];

const STREAK_MESSAGES = [
  '', '', '',  // 0-2: nothing
  '3 di fila! 🔥', '4 di fila! 🔥🔥', '5 di fila! 🔥🔥🔥',
  'Inarrestabile! 🚀', 'Incredibile! 💥', 'SUPER COMBO! ⚡',
  'SEI UN MITO! 👑', 'LEGGENDARIO! 🏆',
];

export function getCorrectMessage() {
  return CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
}

export function getWrongMessage() {
  return WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];
}

export function getStreakMessage(streak) {
  if (streak < 3) return null;
  const idx = Math.min(streak, STREAK_MESSAGES.length - 1);
  return STREAK_MESSAGES[idx];
}

// ─── Haptic Feedback ───

export function hapticCorrect() {
  try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
}

export function hapticWrong() {
  try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); } catch {}
}

export function hapticTap() {
  try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
}

export function hapticHeavy() {
  try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); } catch {}
}

// ─── Celebration Overlay ───

const CELEBRATION_EMOJIS = ['🌟', '⭐', '✨', '🎉', '🎊', '💫', '🏆', '🥇', '💪', '🚀'];

export function CelebrationOverlay({ visible, onDone }) {
  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      emoji: CELEBRATION_EMOJIS[i % CELEBRATION_EMOJIS.length],
      x: Math.random() * (width - 40),
      anim: new Animated.Value(0),
      delay: Math.random() * 300,
      size: 24 + Math.random() * 20,
    }))
  ).current;

  useEffect(() => {
    if (!visible) return;
    particles.forEach((p) => {
      p.anim.setValue(0);
      Animated.timing(p.anim, {
        toValue: 1,
        duration: 1200 + Math.random() * 500,
        delay: p.delay,
        useNativeDriver: true,
      }).start();
    });
    const timer = setTimeout(() => onDone?.(), 1800);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      {particles.map((p, i) => (
        <Animated.Text
          key={i}
          style={[
            styles.particle,
            {
              left: p.x,
              fontSize: p.size,
              opacity: p.anim.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 1, 1, 0] }),
              transform: [
                { translateY: p.anim.interpolate({ inputRange: [0, 1], outputRange: [-20, height * 0.6] }) },
                { rotate: p.anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${Math.random() > 0.5 ? '' : '-'}${180 + Math.random() * 180}deg`] }) },
              ],
            },
          ]}
        >
          {p.emoji}
        </Animated.Text>
      ))}
    </View>
  );
}

// ─── Streak Badge ───

export function StreakBadge({ streak }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const msg = getStreakMessage(streak);

  useEffect(() => {
    if (!msg) return;
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 200, useNativeDriver: true }).start();
  }, [streak]);

  if (!msg) return null;

  return (
    <Animated.View style={[styles.streakBadge, { transform: [{ scale: scaleAnim }] }]}>
      <Text style={styles.streakText}>{msg}</Text>
    </Animated.View>
  );
}

// ─── Animated Score Display ───

export function AnimatedScore({ score, total, color = '#FF6B6B' }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  }, [score]);

  return (
    <Animated.View style={[styles.scoreBadge, { borderColor: color, transform: [{ scale: scaleAnim }] }]}>
      <Text style={[styles.scoreNum, { color }]}>⭐ {score}</Text>
      {total > 0 && <Text style={styles.scoreTotal}>/ {total}</Text>}
    </Animated.View>
  );
}

// ─── Feedback Card (replaces plain text feedback) ───

export function FeedbackCard({ type, message, answer }) {
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    slideAnim.setValue(-50);
    opacityAnim.setValue(0);
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, friction: 5, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [message]);

  const isCorrect = type === 'correct';

  return (
    <Animated.View
      style={[
        styles.feedbackCard,
        {
          backgroundColor: isCorrect ? '#D5F5E3' : '#FFF5F5',
          borderColor: isCorrect ? '#2ECC71' : '#FF6B6B',
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Text style={styles.feedbackEmoji}>{isCorrect ? '✅' : '💡'}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.feedbackMsg, { color: isCorrect ? '#27AE60' : '#E74C3C' }]}>{message}</Text>
        {!isCorrect && answer !== undefined && (
          <Text style={styles.feedbackAnswer}>La risposta era: {answer}</Text>
        )}
      </View>
    </Animated.View>
  );
}

// ─── Done Screen (shared completion screen) ───

export function DoneScreen({ score, total, subject, color, onBack, onRetry }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 100, useNativeDriver: true }).start();
  }, []);

  let emoji, title;
  if (pct >= 90) { emoji = '🏆👑🌟'; title = 'INCREDIBILE!'; }
  else if (pct >= 70) { emoji = '🌟🎉✨'; title = 'Fantastico!'; }
  else if (pct >= 50) { emoji = '👏💪🌈'; title = 'Bravo!'; }
  else { emoji = '💪📚🌟'; title = 'Continua così!'; }

  return (
    <Animated.View style={[styles.doneContainer, { transform: [{ scale: scaleAnim }] }]}>
      <Text style={styles.doneEmoji}>{emoji}</Text>
      <Text style={[styles.doneTitle, { color: color || '#6C5CE7' }]}>{title}</Text>
      <Text style={styles.doneScore}>{score} / {total}</Text>

      <View style={styles.doneBarBg}>
        <View style={[styles.doneBarFill, { width: `${pct}%`, backgroundColor: color || '#6C5CE7' }]} />
      </View>
      <Text style={styles.donePct}>{pct}%</Text>

      {pct >= 90 && <Text style={styles.doneMsg}>Sei un campione! 🥇</Text>}
      {pct >= 50 && pct < 90 && <Text style={styles.doneMsg}>Ottimo lavoro, continua a esercitarti!</Text>}
      {pct < 50 && <Text style={styles.doneMsg}>Non preoccuparti, la prossima volta andrà meglio! 💪</Text>}

      {onRetry && (
        <Animated.View>
          <TouchableOpacity style={[styles.doneBtn, { backgroundColor: color || '#6C5CE7' }]} onPress={onRetry}>
            <Text style={styles.doneBtnText}>🔄 Riprova</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      <TouchableOpacity style={[styles.doneBtn, { backgroundColor: '#95A5A6', marginTop: 10 }]} onPress={onBack}>
        <Text style={styles.doneBtnText}>← Torna indietro</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Need TouchableOpacity for DoneScreen
import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  // Celebration
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 1000 },
  particle: { position: 'absolute', top: 0 },

  // Streak
  streakBadge: { backgroundColor: '#FFF3CD', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, alignSelf: 'center', marginVertical: 8 },
  streakText: { fontSize: 18, fontWeight: '800', color: '#D4A017', textAlign: 'center' },

  // Score
  scoreBadge: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  scoreNum: { fontSize: 20, fontWeight: '800' },
  scoreTotal: { fontSize: 16, color: '#95A5A6', marginLeft: 2, fontWeight: '600' },

  // Feedback
  feedbackCard: {
    flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16,
    borderWidth: 2, marginVertical: 8,
  },
  feedbackEmoji: { fontSize: 28, marginRight: 12 },
  feedbackMsg: { fontSize: 18, fontWeight: '700' },
  feedbackAnswer: { fontSize: 16, color: '#636E72', marginTop: 4, fontWeight: '600' },

  // Done
  doneContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  doneEmoji: { fontSize: 60 },
  doneTitle: { fontSize: 36, fontWeight: '900', marginTop: 12 },
  doneScore: { fontSize: 28, fontWeight: '700', color: '#2D3436', marginTop: 8 },
  doneBarBg: { width: '80%', height: 14, backgroundColor: '#E0E0E0', borderRadius: 7, marginTop: 16 },
  doneBarFill: { height: 14, borderRadius: 7 },
  donePct: { fontSize: 22, fontWeight: '700', color: '#636E72', marginTop: 6 },
  doneMsg: { fontSize: 16, color: '#636E72', textAlign: 'center', marginTop: 12, lineHeight: 24 },
  doneBtn: { paddingHorizontal: 32, paddingVertical: 16, borderRadius: 20, marginTop: 20 },
  doneBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});
