import { useEffect } from 'react';
import { AppState } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { startSession, endSession } from '../data/analytics';

export default function Layout() {
  useEffect(() => {
    startSession();

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background' || state === 'inactive') {
        endSession();
      } else if (state === 'active') {
        startSession();
      }
    });

    return () => {
      endSession();
      sub.remove();
    };
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#F8F9FA' },
        }}
      />
    </>
  );
}
