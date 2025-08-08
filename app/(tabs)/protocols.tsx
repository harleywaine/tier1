import { Background } from '@/components/ui/Background';
import { CollectionCard } from '@/components/ui/CollectionCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { CollectionCardSkeleton } from '@/components/ui/SkeletonCards';
import { getThemeConfig } from '@/constants/ThemeColors';
import { useData } from '@/src/contexts/DataContext';
import { useCourseCompletion } from '@/src/hooks/useCourseCompletion';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const baseFontSize = 16;
const rem = (size: number) => size * baseFontSize;

export default function ExploreScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { courses, coursesLoading } = useData();
  
  // Cache last fetch time to prevent excessive refetching
  const lastFetchTime = useRef<number>(0);
  const CACHE_DURATION = 30000; // 30 seconds
  
  // Get course IDs for completion tracking
  const courseIds = useMemo(() => {
    return courses.map(course => course.id);
  }, [courses]);
  
  const { getCourseCompletion, loading: completionLoading, refresh } = useCourseCompletion(courseIds);

  // Refresh completion data when screen comes into focus
  useEffect(() => {
    if (isFocused) {
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTime.current;
      
      // Only refetch if cache is stale or we have no data
      if (timeSinceLastFetch > CACHE_DURATION || courseIds.length === 0) {
        lastFetchTime.current = now;
        refresh();
      }
    }
  }, [isFocused, courseIds.length]); // Removed refresh from dependencies

  // Group courses by theme
  const groupedCourses = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    
    courses.forEach(course => {
      const themeName = course.theme?.name || 'Other';
      if (!grouped[themeName]) {
        grouped[themeName] = [];
      }
      grouped[themeName].push(course);
    });
    
    return grouped;
  }, [courses]);

  // Check if data is loading
  const isLoading = coursesLoading || completionLoading;

  // Skeleton arrays for loading states
  const themeSkeletons = Array(4).fill(null);
  const courseSkeletons = Array(6).fill(null);

  const handleCoursePress = (course: any) => {
    if (course.disabled) return;
    
    router.push({
      pathname: '/collection',
      params: { courseId: course.id, title: course.title },
    });
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={[styles.header, { paddingTop: rem(2.5) }]}>
            <View>
              <Text style={styles.title}>Protocols</Text>
              <Text style={styles.subtitle}>Your performance OS. Select. Engage. Evolve.</Text>
            </View>
          </View>

          {isLoading ? (
            // Show skeleton loading states
            <>
              {/* Theme skeletons */}
              {themeSkeletons.map((_, themeIndex) => (
                <View key={themeIndex} style={styles.themeSection}>
                  <Skeleton width="40%" height={24} borderRadius={4} style={styles.themeTitle} />
                  <View style={styles.coursesContainer}>
                    {courseSkeletons.map((_, courseIndex) => (
                      <View key={courseIndex} style={styles.courseCard}>
                        <CollectionCardSkeleton />
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </>
          ) : (
            // Show actual content
            Object.entries(groupedCourses).map(([themeName, themeCourses]) => (
              <View key={themeName} style={styles.themeSection}>
                <Text style={styles.themeTitle}>{themeName}</Text>
                <View style={styles.coursesContainer}>
                  {themeCourses.map((course) => (
                    <CollectionCard
                      key={course.id}
                      title={course.title}
                      color={course.theme?.name ? getThemeConfig(course.theme.name)?.colors : undefined}
                      disabled={course.disabled}
                      fullWidth
                      showCompletion={true}
                      completedSessions={getCourseCompletion(course.id).completedSessions}
                      totalSessions={getCourseCompletion(course.id).totalSessions}
                      onPress={() => handleCoursePress(course)}
                    />
                  ))}
                </View>
              </View>
            ))
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
  themeSection: {
    marginBottom: 32,
  },
  themeTitle: {
    fontSize: 22,
    fontFamily: 'SFProDisplay-Bold',
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  coursesContainer: {
    gap: 16,
  },
  courseCard: {
    width: '100%',
  },
});
