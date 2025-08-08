import { Background } from '@/components/ui/Background';
import { SessionCard } from '@/components/ui/SessionCard';
import { SessionCardSkeleton } from '@/components/ui/SkeletonCards';
import { useFavorites } from '@/src/hooks/useFavorites';
import { useSessionCompletion } from '@/src/hooks/useSessionCompletion';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const baseFontSize = 16;
const rem = (size: number) => size * baseFontSize;

export default function FavoritesScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { favorites, loading: favoritesLoading, removeFavorite, refetch } = useFavorites();
  
  // Cache last fetch time to prevent excessive refetching
  const lastFetchTime = useRef<number>(0);
  const CACHE_DURATION = 30000; // 30 seconds

  // Get session IDs for completion tracking
  const sessionIds = useMemo(() => {
    const ids = favorites.map(fav => fav.session_id);
    return ids;
  }, [favorites]);

  const { getSessionCompletion } = useSessionCompletion(sessionIds);

  // Check if data is loading
  const isLoading = favoritesLoading;

  // Skeleton arrays for loading states
  const sessionSkeletons = Array(6).fill(null);

  const handleSessionPress = (session: any) => {
    const encodedUrl = encodeURIComponent(session.audio_url);
    router.push({
      pathname: '/play',
      params: {
        audioUrl: encodedUrl,
        title: session.title,
        author: session.course_title || 'Unknown',
        imageUrl: '',
        sessionId: session.id,
      },
    });
  };

  const handleRemoveFavorite = (favorite: any) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this session from your favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFavorite(favorite.session_id),
        },
      ]
    );
  };

  // Optimized focus effect - only refetch if cache is stale
  useEffect(() => {
    if (isFocused) {
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTime.current;
      
      // Only refetch if cache is stale or we have no data
      if (timeSinceLastFetch > CACHE_DURATION || favorites.length === 0) {
        lastFetchTime.current = now;
        refetch();
      }
    }
  }, [isFocused, favorites.length]); // Removed refetch from dependencies

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={[styles.header, { paddingTop: rem(2.5) }]}>
            <View>
              <Text style={styles.title}>Favorites</Text>
              <Text style={styles.subtitle}>Your saved sessions</Text>
            </View>
          </View>

          {isLoading && favorites.length === 0 ? (
            // Show skeleton loading states only if we don't have any favorites yet
            <>
              {/* Sessions skeleton */}
              <View style={styles.sessionsContainer}>
                {sessionSkeletons.map((_, index) => (
                  <View key={index} style={{ marginBottom: 12 }}>
                    <SessionCardSkeleton />
                  </View>
                ))}
              </View>
            </>
          ) : favorites.length > 0 ? (
            // Show actual content
            <View style={styles.sessionsContainer}>
              {favorites.map((favorite) => {
                const completion = getSessionCompletion(favorite.session_id);
                
                return (
                  <SessionCard
                    key={favorite.id}
                    title={favorite.title || 'Unknown Session'}
                    subtitle={favorite.course_title || 'Unknown Course'}
                    completionStatus={completion.status}
                    hideCompletionIcon={true}
                    showHeartIcon={true}
                    isFavorited={true}
                    onHeartPress={() => handleRemoveFavorite(favorite)}
                    onPress={() => handleSessionPress(favorite)}
                  />
                );
              })}
            </View>
          ) : (
            // Show empty state
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No favorites yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap the heart icon when playing a session to add it to your favourites
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070708',
  },
  container: {
    flex: 1,
    padding: 8.5,
    backgroundColor: '#070708',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'SFProDisplay-Regular',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 2,
    fontFamily: 'SFProDisplay-Light',
  },
  sessionsContainer: {
    gap: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'SFProDisplay-Bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
}); 