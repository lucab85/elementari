/**
 * useKidsQuiz — Drop-in hook that upgrades any quiz/activity screen
 * with kid-friendly feedback, haptics, streaks, and celebrations.
 *
 * Usage:
 *   const kids = useKidsQuiz();
 *   // When answering:
 *   const correct = userAnswer === correctAnswer;
 *   const msg = kids.handleAnswer(correct);
 *   // msg.type = 'correct'|'wrong', msg.message = encouraging text
 *   // In render: <kids.Overlay />  and  <kids.Streak />
 */

import { useState, useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import {
  getCorrectMessage, getWrongMessage, hapticCorrect, hapticWrong,
  CelebrationOverlay, StreakBadge, FeedbackCard,
} from '../components/KidsFeedback';

export function useKidsQuiz() {
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const handleAnswer = useCallback((isCorrect, wrongAnswer) => {
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      hapticCorrect();
      if (newStreak % 5 === 0) setShowCelebration(true);

      Animated.sequence([
        Animated.spring(bounceAnim, { toValue: 1.3, friction: 3, useNativeDriver: true }),
        Animated.spring(bounceAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]).start();

      const msg = getCorrectMessage();
      setFeedbackData({ type: 'correct', message: msg });
      return { type: 'correct', message: msg };
    } else {
      setStreak(0);
      hapticWrong();
      const msg = getWrongMessage();
      setFeedbackData({ type: 'wrong', message: msg, answer: wrongAnswer });
      return { type: 'wrong', message: msg };
    }
  }, [streak]);

  const clearFeedback = useCallback(() => {
    setFeedbackData(null);
  }, []);

  // Components to render
  const Overlay = () => (
    <CelebrationOverlay visible={showCelebration} onDone={() => setShowCelebration(false)} />
  );

  const Streak = () => <StreakBadge streak={streak} />;

  const Feedback = () => feedbackData ? (
    <FeedbackCard type={feedbackData.type} message={feedbackData.message} answer={feedbackData.answer} />
  ) : null;

  return {
    streak,
    showCelebration,
    feedbackData,
    bounceAnim,
    handleAnswer,
    clearFeedback,
    Overlay,
    Streak,
    Feedback,
  };
}
