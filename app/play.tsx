import { Background } from '@/components/ui/Background';
import { useAudioPlayer } from '@/src/hooks/useAudioPlayer';
import { useFavorites } from '@/src/hooks/useFavorites';
import { useSessionsByCourseTitle } from '@/src/hooks/useSessionsByCourseTitle';
import { useUserPlayHistory } from '@/src/hooks/useUserPlayHistory';
import Slider from '@react-native-community/slider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { ArrowLeft, Heart, Pause, Play, SkipBack, SkipForward } from 'phosphor-react-native';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PlayScreen() {
  const router = useRouter();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { recordSessionStart, updateSessionProgress } = useUserPlayHistory();
  const params = useLocalSearchParams<{
    audioUrl: string;
    title?: string;
    author?: string;
    sessionId?: string;
  }>();
  
  // Use state to manage current session data instead of relying on params
  const [currentSession, setCurrentSession] = useState({
    audioUrl: decodeURIComponent(params.audioUrl || ''),
    title: params.title || 'Session',
    author: params.author || 'Glenn Harrold',
    sessionId: params.sessionId || '',
  });

  // Get all sessions for the current course to enable navigation
  const { maintenance, basic } = useSessionsByCourseTitle(currentSession.author);
  
  // Combine and sort all sessions by position
  const allSessions = useMemo(() => {
    const basicSessions = basic.filter((s: any) => s.position && s.position <= 10)
      .sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
    const maintenanceSessions = maintenance.filter((s: any) => s.position && s.position > 10)
      .sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
    return [...basicSessions, ...maintenanceSessions];
  }, [basic, maintenance]);

  // Find current session index
  const currentSessionIndex = useMemo(() => {
    return allSessions.findIndex((session: any) => session.id === currentSession.sessionId);
  }, [allSessions, currentSession.sessionId]);

  // Get next and previous sessions
  const nextSession = useMemo(() => {
    if (currentSessionIndex >= 0 && currentSessionIndex < allSessions.length - 1) {
      return allSessions[currentSessionIndex + 1];
    }
    return null;
  }, [allSessions, currentSessionIndex]);

  const previousSession = useMemo(() => {
    if (currentSessionIndex > 0) {
      return allSessions[currentSessionIndex - 1];
    }
    return null;
  }, [allSessions, currentSessionIndex]);

  // Navigation functions - update state directly without navigation
  const navigateToSession = (session: any) => {
    if (!session) return;
    
    setCurrentSession({
      audioUrl: session.audio_url,
      title: session.title,
      author: currentSession.author,
      sessionId: session.id,
    });
  };

  const handleNextSession = () => {
    if (nextSession) {
      navigateToSession(nextSession);
    }
  };

  const handlePreviousSession = () => {
    if (previousSession) {
      navigateToSession(previousSession);
    }
  };

  const { status, isLoading, error, play, pause, seekTo } = useAudioPlayer(currentSession.audioUrl);

  const isPlaying = (status as any)?.isPlaying ?? false;
  const duration = (status as any)?.durationMillis ?? 0;
  const position = (status as any)?.positionMillis ?? 0;

  const [seeking, setSeeking] = useState(false);
  const [seekPos, setSeekPos] = useState(0);
  const [hasRecordedStart, setHasRecordedStart] = useState(false);

  // Record session start when audio begins playing
  React.useEffect(() => {
    if (currentSession.sessionId && isPlaying && !hasRecordedStart) {
      recordSessionStart(currentSession.sessionId);
      setHasRecordedStart(true);
    }
  }, [currentSession.sessionId, isPlaying, hasRecordedStart, recordSessionStart]);

  // Update progress when reaching 95% completion
  React.useEffect(() => {
    if (currentSession.sessionId && duration > 0 && position > 0) {
      const progressPercentage = Math.round((position / duration) * 100);
      
      // Only update when reaching 95% completion
      if (progressPercentage >= 95) {
        updateSessionProgress(currentSession.sessionId, progressPercentage);
      }
    }
  }, [currentSession.sessionId, duration, position, updateSessionProgress]);

  const onSeekStart = () => setSeeking(true);
  const onSeekComplete = (value: number) => {
    setSeeking(false);
    seekTo(value);
  };

  const displayPosition = seeking ? seekPos : position;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="#e0f6ff" size={26} weight="light" />
          </TouchableOpacity>

          {currentSession.sessionId && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(currentSession.sessionId)}
            >
              <Heart
                size={26}
                color="#e0f6ff"
                weight={isFavorited(currentSession.sessionId) ? "fill" : "light"}
              />
            </TouchableOpacity>
          )}

          <View style={styles.lottieInfoWrapper}>
            <View style={styles.imageCard}>
              <LottieView
                source={require('@/assets/images/play-animation.json')}
                autoPlay
                loop
                style={styles.image}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{currentSession.title}</Text>
              <Text style={styles.author}>{currentSession.author}</Text>
            </View>
          </View>

          <View style={styles.sliderContainer}>
            <Slider
              style={{ height: 20, marginBottom: 12 }} // increased bottom margin
              minimumValue={0}
              maximumValue={duration}
              value={displayPosition}
              minimumTrackTintColor="#01b4d4"
              maximumTrackTintColor="rgba(255,255,255,0.3)"
              thumbTintColor="#457b9d"
              onSlidingStart={onSeekStart}
              onValueChange={setSeekPos}
              onSlidingComplete={onSeekComplete}
            />
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(displayPosition)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity 
              onPress={handlePreviousSession} 
              style={[styles.skipButton, !previousSession && styles.disabledButton]}
              disabled={!previousSession}
            >
              <SkipBack color={previousSession ? "#ffffff" : "#666666"} size={32} weight="light" style={{ opacity: previousSession ? 0.6 : 0.3 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={isPlaying ? pause : play} style={[styles.playPauseButton, { backgroundColor: '#457b9d' }]}>
              {isPlaying ? <Pause color="#fff" size={40} weight="fill" /> : <Play color="#fff" size={40} weight="fill" />}
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleNextSession} 
              style={[styles.skipButton, !nextSession && styles.disabledButton]}
              disabled={!nextSession}
            >
              <SkipForward color={nextSession ? "#ffffff" : "#666666"} size={32} weight="light" style={{ opacity: nextSession ? 0.6 : 0.3 }} />
            </TouchableOpacity>
          </View>

          {isLoading && <Text style={styles.loadingText}>Loading audio...</Text>}
          {error && <Text style={styles.errorText}>{String(error)}</Text>}
        </View>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#070708' },
  container: { flex: 1, padding: 17, backgroundColor: '#070708', alignItems: 'center' },
  lottieInfoWrapper: { marginTop: 100, alignItems: 'center' },
  imageCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  image: { width: '65%', height: '65%', alignSelf: 'center' },
  infoContainer: { alignItems: 'center', marginTop: 12 },
  title: { fontSize: 24, fontFamily: 'SFProDisplay-Bold', color: '#fff', marginBottom: 4 },
  author: { fontSize: 16, color: '#aaa', fontFamily: 'SFProDisplay-Light' },
  sliderContainer: { width: '100%', marginTop: 12 },
  timeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  timeText: { color: '#e0f6ff', fontSize: 13, opacity: 0.7 },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 36, marginTop: 24 },
  skipButton: { backgroundColor: 'transparent', borderRadius: 32, padding: 8, alignItems: 'center', justifyContent: 'center' },
  playPauseButton: { borderRadius: 40, padding: 16, alignItems: 'center', justifyContent: 'center' },
  backButton: {
    position: 'absolute',
    top: 32,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(20, 24, 32, 0.7)',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  favoriteButton: {
    position: 'absolute',
    top: 32,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(20, 24, 32, 0.7)',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  loadingText: { color: '#fff', marginTop: 20 },
  errorText: { color: 'red', marginTop: 12 },
  disabledButton: {
    opacity: 0.3,
    pointerEvents: 'none',
  },
});
