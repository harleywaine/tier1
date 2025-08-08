import { Background } from '@/components/ui/Background';
import { SessionCard } from '@/components/ui/SessionCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { SessionCardSkeleton } from '@/components/ui/SkeletonCards';
import { useData } from '@/src/contexts/DataContext';
import { useSessionCompletion } from '@/src/hooks/useSessionCompletion';
import { useSessionsByCourseTitle } from '@/src/hooks/useSessionsByCourseTitle';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';
import React, { useEffect, useMemo, useRef } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CollectionScreen() {
  const router = useRouter();
  const { courseId, title } = useLocalSearchParams<{ courseId: string; title: string }>();
  const isFocused = useIsFocused();
  
  // Cache last fetch time to prevent excessive refetching
  const lastFetchTime = useRef<number>(0);
  const CACHE_DURATION = 30000; // 30 seconds
  
  const { courses, coursesLoading } = useData();
  const { course: courseData, maintenance, basic, loading: sessionsLoading } = useSessionsByCourseTitle(title || '');
  
  // Get course data
  const course = useMemo(() => {
    return courses.find(c => c.id === courseId || c.title === title);
  }, [courses, courseId, title]);

  // Combine all sessions
  const allSessions = useMemo(() => {
    return [...maintenance, ...basic];
  }, [maintenance, basic]);

  // Get session IDs for completion tracking
  const allSessionIds = useMemo(() => {
    const ids = allSessions.map((session: any) => session.id);
    return ids;
  }, [allSessions]);

  const { getSessionCompletion, refresh } = useSessionCompletion(allSessionIds);

  // Optimized focus effect - only refetch if cache is stale
  useEffect(() => {
    if (isFocused) {
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTime.current;
      
      // Only refetch if cache is stale or we have no data
      if (timeSinceLastFetch > CACHE_DURATION || allSessionIds.length === 0) {
        lastFetchTime.current = now;
        refresh();
      }
    }
  }, [isFocused, allSessionIds.length]); // Removed refresh from dependencies

  // Check if data is loading
  const isLoading = coursesLoading || sessionsLoading;

  // Skeleton arrays for loading states
  const sessionSkeletons = Array(8).fill(null);

  const handlePress = (session: any) => {
    const encodedUrl = encodeURIComponent(session.audio_url);
    const params = {
      audioUrl: encodedUrl,
      title: session.title,
      author: course?.title || title || 'Unknown',
      imageUrl: '',
      sessionId: session.id,
    };
    router.push({
      pathname: '/play',
      params,
    });
  };

  // Separate basic training and maintenance sessions
  const basicTrainingSessions = allSessions.filter((s: any) => s.position && s.position <= 10).sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
  const maintenanceSessions = allSessions.filter((s: any) => s.position && s.position > 10).sort((a: any, b: any) => (a.position || 0) - (b.position || 0));

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <ImageBackground
            source={courseData?.hero_image_url ? { uri: courseData.hero_image_url } : require('@/assets/images/Index-bg.jpg')}
            style={styles.heroSection}
            imageStyle={{ opacity: 1.0 }}
          >
            {/* Removed the dark overlay to show image at full opacity */}
          </ImageBackground>

          {/* Title and Description below image */}
          <View style={styles.titleSection}>
            <Text style={styles.heroTitle}>{title}</Text>
            {courseData?.description && (
              <Text style={styles.heroDescription}>{courseData.description}</Text>
            )}
          </View>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" weight="bold" />
          </TouchableOpacity>

          {isLoading ? (
            // Show skeleton loading states
            <>
              {/* Section title skeleton */}
              <View style={styles.sectionTitle}>
                <Skeleton width="60%" height={24} borderRadius={4} />
              </View>
              
              {/* Sessions skeleton */}
              <View style={styles.sessionsContainer}>
                {sessionSkeletons.map((_, index) => (
                  <View key={index}>
                    <SessionCardSkeleton />
                  </View>
                ))}
              </View>
            </>
          ) : (
            // Show actual content
            <>
              {/* Basic Training Section */}
              {basicTrainingSessions.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Basic Training</Text>
                  <View style={styles.sessionsContainer}>
                    {basicTrainingSessions.map((session: any) => {
                      const completion = getSessionCompletion(session.id);
                      
                      return (
                        <SessionCard
                          key={session.id}
                          title={session.title}
                          completionStatus={completion.status}
                          onPress={() => handlePress(session)}
                        />
                      );
                    })}
                  </View>
                </>
              )}

              {/* Maintenance Section */}
              {maintenanceSessions.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Maintenance</Text>
                  <View style={styles.sessionsContainer}>
                    {maintenanceSessions.map((session: any) => {
                      const completion = getSessionCompletion(session.id);
                      
                      return (
                        <SessionCard
                          key={session.id}
                          title={session.title}
                          completionStatus={completion.status}
                          onPress={() => handlePress(session)}
                        />
                      );
                    })}
                  </View>
                </>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#070708' 
  },
  scrollContainer: { paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '400', color: '#fff', marginBottom: 20 },
  description: { fontSize: 16, color: '#aaa', marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '400', color: '#fff', marginTop: 20, marginBottom: 10, paddingHorizontal: 17 },
  sessionsContainer: { gap: 16, paddingHorizontal: 17 },
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
  heroSection: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 0,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    marginBottom: 10,
  },
  heroDescription: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'left',
    lineHeight: 22,
  },
  titleSection: {
    paddingHorizontal: 17,
    marginBottom: 20,
  },
});

export const options = { headerShown: false };
