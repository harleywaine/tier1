import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { SplashScreen } from '@/components/ui/SplashScreen';
import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '@/lib/supabase';
import { DataProvider, useData } from '@/src/contexts/DataContext';

function AppContent() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'SFProDisplay-Bold': require('../assets/fonts/SF-Pro-Display-Bold.otf'),
    'SFProDisplay-Light': require('../assets/fonts/SF-Pro-Display-Light.otf'),
  });

  // Use the correct type for session state
  const [session, setSession] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [minSplashTime, setMinSplashTime] = useState(true);

  // Get data loading states
  const { coursesLoading, arcsLoading, historyLoading } = useData();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecked(true);
    });

    // Listen for session changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Force splash screen to show for at least 4 seconds
    const timer = setTimeout(() => {
      setMinSplashTime(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Hide splash screen when minimum time has passed AND all data is loaded
    const allDataLoaded = !coursesLoading && !arcsLoading && !historyLoading;
    const canHideSplash = !minSplashTime && allDataLoaded;
    
    if (canHideSplash) {
      setShowSplash(false);
    }
  }, [minSplashTime, coursesLoading, arcsLoading, historyLoading]);

  useEffect(() => {
    if (!authChecked || showSplash) return;

    const inAuthGroup = (segments as string[]).includes('(auth)');
    const isResetPassword = (segments as string[]).includes('ResetPassword');

    if (!session && !inAuthGroup) {
      router.replace('../SignIn');
    } else if (session && inAuthGroup && !isResetPassword) {
      router.replace('/(tabs)');
    }
  }, [session, segments, authChecked, showSplash]);

  if (!loaded || !authChecked || showSplash) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="play" options={{ headerShown: false }} />
          <Stack.Screen name="collection" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
