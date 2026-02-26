import { useEffect, useRef } from 'react';
import { trackScreen, trackActivityStart, trackActivityComplete, trackAnswer } from '../data/analytics';

/**
 * Hook to track screen views. Call at the top of each screen component.
 */
export function useTrackScreen(screenName) {
  useEffect(() => {
    trackScreen(screenName);
  }, [screenName]);
}

/**
 * Hook to track quiz/activity lifecycle.
 * Returns { onStart, onAnswer, onComplete } functions.
 */
export function useTrackActivity(activityName, subjectName) {
  const startTime = useRef(null);

  const onStart = () => {
    startTime.current = Date.now();
    trackActivityStart(activityName, subjectName);
  };

  const onAnswer = (correct, questionIndex) => {
    trackAnswer(activityName, correct, questionIndex);
  };

  const onComplete = (score, total) => {
    const durationSec = startTime.current
      ? Math.round((Date.now() - startTime.current) / 1000)
      : 0;
    trackActivityComplete(activityName, subjectName, score, total, durationSec);
  };

  return { onStart, onAnswer, onComplete };
}
