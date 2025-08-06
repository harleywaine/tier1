import { supabase } from '@/lib/supabase';
import { useCallback, useEffect, useState } from 'react';

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

  const fetchCompletionData = useCallback(async () => {
    if (courseIds.length === 0) {
      setCompletionData({});
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // If no user, all courses have 0 completion
        const noCompletionData: Record<string, CourseCompletion> = {};
        courseIds.forEach(id => {
          noCompletionData[id] = {
            courseId: id,
            completedSessions: 0,
            totalSessions: 0,
            completionPercentage: 0,
          };
        });
        setCompletionData(noCompletionData);
        return;
      }

      // Get all sessions for the courses
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('courses')
        .select(`
          id,
          basic_training_sessions(id)
        `)
        .in('id', courseIds);

      if (sessionsError) {
        console.error('Error fetching course sessions:', sessionsError);
        setError(sessionsError.message);
        return;
      }

      console.log('📊 Raw sessions data:', sessionsData);

      // Get completion data for all sessions
      const allSessionIds: string[] = [];
      const courseSessionMap: Record<string, string[]> = {};

      sessionsData?.forEach(course => {
        const courseSessions: string[] = [];
        
        console.log(`📊 Course ${course.id} basic training sessions:`, course.basic_training_sessions);
        
        // Add only basic training sessions
        if (course.basic_training_sessions && Array.isArray(course.basic_training_sessions)) {
          course.basic_training_sessions.forEach((session: any) => {
            courseSessions.push(session.id);
            allSessionIds.push(session.id);
          });
        }
        
        courseSessionMap[course.id] = courseSessions;
        console.log(`📊 Course ${course.id} basic training sessions count:`, courseSessions.length);
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

      console.log('📊 Completed session IDs:', Array.from(completedSessionIds));
      console.log('📊 All history data:', historyData);

      // Calculate completion for each course
      const completionMap: Record<string, CourseCompletion> = {};
      
      courseIds.forEach(courseId => {
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
        
        console.log(`📊 Course ${courseId} completion:`, {
          completedSessions,
          totalSessions,
          percentage: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
          courseSessions: courseSessionMap[courseId]
        });
      });

      console.log('📊 Course completion data:', completionMap);
      setCompletionData(completionMap);

    } catch (err) {
      console.error('Error in fetchCourseCompletionData:', err);
      setError('Failed to fetch course completion data');
    } finally {
      setLoading(false);
    }
  }, [courseIds]);

  useEffect(() => {
    fetchCompletionData();
  }, [fetchCompletionData]);

  const getCourseCompletion = (courseId: string): CourseCompletion => {
    return completionData[courseId] || {
      courseId,
      completedSessions: 0,
      totalSessions: 0,
      completionPercentage: 0,
    };
  };

  const refresh = useCallback(() => {
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