import AsyncStorage from '@react-native-async-storage/async-storage';

const ANALYTICS_KEY = 'elementari_analytics';
const SESSIONS_KEY = 'elementari_sessions';

// ─── Event Tracking ───

/**
 * Track an event with optional metadata.
 * Events are stored locally in AsyncStorage.
 */
export async function trackEvent(name, data = {}) {
  try {
    const events = await getEvents();
    events.push({
      name,
      data,
      timestamp: Date.now(),
      date: new Date().toISOString(),
    });
    // Keep last 500 events to avoid storage bloat
    const trimmed = events.slice(-500);
    await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmed));
  } catch (e) {
    // Silently fail — analytics should never break the app
  }
}

export async function getEvents() {
  try {
    const raw = await AsyncStorage.getItem(ANALYTICS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ─── Session Tracking ───

let sessionStart = null;
let currentScreen = null;
let screenEnteredAt = null;

/**
 * Start a new app session. Call on app mount.
 */
export function startSession() {
  sessionStart = Date.now();
  trackEvent('session_start');
}

/**
 * End the current session. Call on app unmount/background.
 */
export async function endSession() {
  if (!sessionStart) return;
  const duration = Math.round((Date.now() - sessionStart) / 1000);
  await trackEvent('session_end', { durationSec: duration });

  // Save session summary
  try {
    const sessions = await getSessions();
    sessions.push({
      start: sessionStart,
      end: Date.now(),
      durationSec: duration,
      date: new Date().toISOString(),
    });
    const trimmed = sessions.slice(-100);
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(trimmed));
  } catch {}
  sessionStart = null;
}

export async function getSessions() {
  try {
    const raw = await AsyncStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ─── Screen Tracking ───

/**
 * Track a screen view. Call when navigating to a screen.
 */
export async function trackScreen(screenName) {
  // Track time on previous screen
  if (currentScreen && screenEnteredAt) {
    const timeOnScreen = Math.round((Date.now() - screenEnteredAt) / 1000);
    await trackEvent('screen_exit', { screen: currentScreen, timeOnScreenSec: timeOnScreen });
  }
  currentScreen = screenName;
  screenEnteredAt = Date.now();
  await trackEvent('screen_view', { screen: screenName });
}

// ─── Activity Tracking ───

/**
 * Track when a quiz/activity is started.
 */
export async function trackActivityStart(activity, subject) {
  await trackEvent('activity_start', { activity, subject });
}

/**
 * Track when a quiz/activity is completed.
 */
export async function trackActivityComplete(activity, subject, score, total, durationSec) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  await trackEvent('activity_complete', {
    activity,
    subject,
    score,
    total,
    percentage: pct,
    durationSec,
  });
}

/**
 * Track an individual answer.
 */
export async function trackAnswer(activity, correct, questionIndex) {
  await trackEvent('answer', { activity, correct, questionIndex });
}

// ─── Stats & Reports ───

/**
 * Get a summary of usage stats.
 */
export async function getStats() {
  const events = await getEvents();
  const sessions = await getSessions();

  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  const last7Days = now - 7 * 24 * 60 * 60 * 1000;

  const screenViews = events.filter(e => e.name === 'screen_view');
  const completions = events.filter(e => e.name === 'activity_complete');
  const answers = events.filter(e => e.name === 'answer');
  const todayEvents = events.filter(e => e.date?.startsWith(today));
  const weekEvents = events.filter(e => e.timestamp >= last7Days);

  // Most visited screens
  const screenCounts = {};
  screenViews.forEach(e => {
    const s = e.data?.screen || 'unknown';
    screenCounts[s] = (screenCounts[s] || 0) + 1;
  });
  const topScreens = Object.entries(screenCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Subject breakdown
  const subjectStats = {};
  completions.forEach(e => {
    const subj = e.data?.subject || 'unknown';
    if (!subjectStats[subj]) subjectStats[subj] = { completed: 0, totalScore: 0, totalQuestions: 0 };
    subjectStats[subj].completed += 1;
    subjectStats[subj].totalScore += e.data?.score || 0;
    subjectStats[subj].totalQuestions += e.data?.total || 0;
  });

  // Accuracy
  const correctAnswers = answers.filter(e => e.data?.correct).length;
  const totalAnswers = answers.length;

  // Total study time (from sessions)
  const totalStudyTimeSec = sessions.reduce((sum, s) => sum + (s.durationSec || 0), 0);

  // Streak (consecutive days with activity)
  const activeDays = new Set(events.map(e => e.date?.slice(0, 10)).filter(Boolean));
  let streak = 0;
  const d = new Date();
  while (activeDays.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  return {
    totalEvents: events.length,
    totalSessions: sessions.length,
    totalStudyTimeSec,
    totalStudyTimeMin: Math.round(totalStudyTimeSec / 60),
    todayEvents: todayEvents.length,
    weekEvents: weekEvents.length,
    activitiesCompleted: completions.length,
    totalAnswers,
    correctAnswers,
    accuracy: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
    topScreens,
    subjectStats,
    streak,
    activeDays: activeDays.size,
  };
}

/**
 * Clear all analytics data.
 */
export async function clearAnalytics() {
  await AsyncStorage.multiRemove([ANALYTICS_KEY, SESSIONS_KEY]);
}
