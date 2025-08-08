import { supabase } from '@/lib/supabase';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface CourseCompletion {
  courseId: string;
  completedSessions: number;
  totalSessions: number;
  completionPercentage: number;
}

export function useCourseCompletion(courseIds: string[]) {
  const [completionData, setCompletionData] = useState<Record<string, CourseCompletion>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cache for preventing unnecessary refetches
  const lastCourseIdsRef = useRef<string[]>([]);
  const lastFetchTimeRef = useRef<number>(0);
  const completionDataRef = useRef<Record<string, CourseCompletion>>({});
  const CACHE_DURATION = 30000; // 30 seconds

  // Memoize course IDs to prevent unnecessary re-renders
  const memoizedCourseIds = useMemo(() => {
    const sortedIds = [...courseIds].sort();
    return sortedIds;
  }, [courseIds]);

  const fetchCompletionData = useCallback(async () => {
    if (memoizedCourseIds.length === 0) {
      setCompletionData({});
      setLoading(false);
      return;
    }

    // Check if course IDs have changed or cache is stale
    const now = Date.now();
    const courseIdsChanged = JSON.stringify(memoizedCourseIds) !== JSON.stringify(lastCourseIdsRef.current);
    const cacheStale = now - lastFetchTimeRef.current > CACHE_DURATION;
    
    if (!courseIdsChanged && !cacheStale && Object.keys(completionDataRef.current).length > 0) {
      // No need to refetch
      return;
    }

    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // If no user, all courses have 0 completion
        const noCompletionData: Record<string, CourseCompletion> = {};
        memoizedCourseIds.forEach(id => {
          noCompletionData[id] = {
            courseId: id,
            completedSessions: 0,
            totalSessions: 0,
            completionPercentage: 0,
          };
        });
        setCompletionData(noCompletionData);
        completionDataRef.current = noCompletionData;
        lastCourseIdsRef.current = memoizedCourseIds;
        lastFetchTimeRef.current = now;
        return;
      }

      // Get all sessions for the courses
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('courses')
        .select(`
          id,
          basic_training_sessions(id)
        `)
        .in('id', memoizedCourseIds);

      if (sessionsError) {
        console.error('Error fetching course sessions:', sessionsError);
        setError(sessionsError.message);
        return;
      }

      // Get completion data for all sessions
      const allSessionIds: string[] = [];
      const courseSessionMap: Record<string, string[]> = {};

      sessionsData?.forEach(course => {
        const courseSessions: string[] = [];
        
        // Add only basic training sessions
        if (course.basic_training_sessions && Array.isArray(course.basic_training_sessions)) {
          course.basic_training_sessions.forEach((session: any) => {
            courseSessions.push(session.id);
            allSessionIds.push(session.id);
          });
        }
        
        courseSessionMap[course.id] = courseSessions;
      });

      // Get completion data for all sessions
      const { data: historyData, error: historyError } = await supabase
        .from('user_play_history')
        .select('session_id, status')
        .eq('user_id', user.id)
        .in('session_id', allSessionIds);

      if (historyError) {
        console.error('Error fetching session completion:', historyError);
        setError(historyError.message);
        return;
      }

      // Create completion map
      const completedSessionIds = new Set(
        historyData
          ?.filter(record => record.status === 'completed')
          .map(record => record.session_id) || []
      );

      // Calculate completion for each course
      const completionMap: Record<string, CourseCompletion> = {};
      
      memoizedCourseIds.forEach(courseId => {
        const courseSessions = courseSessionMap[courseId] || [];
        const totalSessions = courseSessions.length;
        const completedSessions = courseSessions.filter(sessionId => 
          completedSessionIds.has(sessionId)
        ).length;
        
        completionMap[courseId] = {
          courseId,
          completedSessions,
          totalSessions,
          completionPercentage: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
        };
      });

      setCompletionData(completionMap);
      completionDataRef.current = completionMap;
      lastCourseIdsRef.current = memoizedCourseIds;
      lastFetchTimeRef.current = now;

    } catch (err) {
      console.error('Error in fetchCourseCompletionData:', err);
      setError('Failed to fetch course completion data');
    } finally {
      setLoading(false);
    }
  }, [memoizedCourseIds]); // Removed completionData from dependencies

  useEffect(() => {
    fetchCompletionData();
  }, [fetchCompletionData]);

  const getCourseCompletion = useCallback((courseId: string): CourseCompletion => {
    return completionData[courseId] || {
      courseId,
      completedSessions: 0,
      totalSessions: 0,
      completionPercentage: 0,
    };
  }, [completionData]);

  const refresh = useCallback(() => {
    lastFetchTimeRef.current = 0; // Force refresh by resetting cache time
    fetchCompletionData();
  }, [fetchCompletionData]);

  return {
    completionData,
    loading,
    error,
    getCourseCompletion,
    refresh,
  };
} 