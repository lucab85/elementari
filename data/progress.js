import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = 'compiti_progress';

const defaultProgress = {
  tabelline: { played: 0, correct: 0, bestStreak: 0, lastPlayed: null },
  operazioni: { played: 0, correct: 0, bestStreak: 0, lastPlayed: null },
  moltiplicazioni: { played: 0, correct: 0, bestStreak: 0, lastPlayed: null },
  ortografia: { played: 0, correct: 0, bestStreak: 0, lastPlayed: null },
  quiz: { played: 0, correct: 0, bestStreak: 0, lastPlayed: null },
  totalStars: 0,
};

export async function getProgress() {
  try {
    const data = await AsyncStorage.getItem(PROGRESS_KEY);
    return data ? { ...defaultProgress, ...JSON.parse(data) } : { ...defaultProgress };
  } catch {
    return { ...defaultProgress };
  }
}

export async function updateProgress(activity, correct, total) {
  const progress = await getProgress();
  if (!progress[activity]) {
    progress[activity] = { played: 0, correct: 0, bestStreak: 0, lastPlayed: null };
  }
  progress[activity].played += total;
  progress[activity].correct += correct;
  progress[activity].lastPlayed = new Date().toISOString();

  // Award stars: 1 star per 5 correct answers
  const newStars = Math.floor(correct / 5);
  progress.totalStars = (progress.totalStars || 0) + newStars;

  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  return progress;
}

export async function getTotalStars() {
  const progress = await getProgress();
  return progress.totalStars || 0;
}
