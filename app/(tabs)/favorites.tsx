import { Background } from '@/components/ui/Background';
import { SessionCard } from '@/components/ui/SessionCard';
import { SessionCardSkeleton } from '@/components/ui/SkeletonCards';
import { useFavorites } from '@/src/hooks/useFavorites';
import { useSessionCompletion } from '@/src/hooks/useSessionCompletion';
import { useRouter } from 'expo-router';
import { Heart } from 'phosphor-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const baseFontSize = 16;
const rem = (size: number) => size * baseFontSize;

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, loading: favoritesLoading } = useFavorites();

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

  console.log('🔍 Favorites screen state:', { isLoading, favoritesCount: favorites.length, favorites });

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
                  <TouchableOpacity
                    key={favorite.id}
                    onPress={() => handleSessionPress(favorite)}
                  >
                    <SessionCard
                      title={favorite.title}
                      subtitle={favorite.course_title}
                      completionStatus={completion.status}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            // Show empty state
            <View style={styles.emptyState}>
              <Heart size={64} color="#666" weight="light" />
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
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    padding: 17,
    backgroundColor: '#000',
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