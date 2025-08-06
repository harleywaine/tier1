import { Background } from '@/components/ui/Background';
import { SessionCard } from '@/components/ui/SessionCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { SessionCardSkeleton } from '@/components/ui/SkeletonCards';
import { useCourses } from '@/src/hooks/useCourses';
import { useSessionCompletion } from '@/src/hooks/useSessionCompletion';
import { useSessionsByCourseTitle } from '@/src/hooks/useSessionsByCourseTitle';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';
import React, { useEffect, useMemo } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CollectionScreen() {
  const router = useRouter();
  const { courseId, title } = useLocalSearchParams<{ courseId: string; title: string }>();
  const isFocused = useIsFocused();
  
  const { courses, loading: coursesLoading } = useCourses();
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
    console.log('🔍 Session IDs for completion tracking:', ids);
    return ids;
  }, [allSessions]);

  const { getSessionCompletion, refresh } = useSessionCompletion(allSessionIds);

  // Refresh completion data when screen comes into focus
  useEffect(() => {
    console.log('🔄 Collection screen focus effect triggered, isFocused:', isFocused);
    if (isFocused) {
      console.log('🔄 Collection screen focused, refreshing completion data');
      refresh();
    }
  }, [isFocused, refresh]);

  // Check if data is loading
  const isLoading = coursesLoading || sessionsLoading;

  // Skeleton arrays for loading states
  const sessionSkeletons = Array(8).fill(null);

  console.log('🔍 Collection page title parameter:', title);
  console.log('🔍 Course data:', course);
  console.log('🔍 Course title from data:', course?.title);

  const handlePress = (session: any) => {
    console.log('🟡 Tapped session:', session);
    const encodedUrl = encodeURIComponent(session.audio_url);
    const params = {
      audioUrl: encodedUrl,
      title: session.title,
      author: course?.title || title || 'Unknown',
      imageUrl: '',
      sessionId: session.id,
    };
    console.log('🟢 Navigating to /play with params:', params);
    console.log('🟢 Course title being passed as author:', course?.title || title);
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
            source={require('@/assets/images/Index-bg.jpg')}
            style={styles.heroSection}
            imageStyle={{ opacity: 0.5 }}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{title}</Text>
            </View>
          </ImageBackground>

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
                      console.log(`🔍 Session ${session.title}:`, completion.status);
                      console.log(`🔍 Session ${session.id} completion data:`, completion);
                      
                      return (
                        <SessionCard
                          key={session.id}
                          title={session.title}
                          subtitle={`Lesson ${session.position}`}
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
                          subtitle={`Lesson ${session.position}`}
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
  safeArea: { flex: 1, backgroundColor: '#000' },
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
  heroContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 0,
    padding: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
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
    color: '#fff',
    textAlign: 'left',
  },
});

export const options = { headerShown: false };
