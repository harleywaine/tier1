import { supabase } from '@/lib/supabase';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface Course {
  id: string;
  title: string;
  description?: string;
  disabled?: boolean;
  sessionCount: number;
  theme?: {
    id: string;
    name: string;
    display_name: string;
  };
}

interface Arc {
  id: string;
  name: string;
  title: string;
  description: string;
}

interface LastPlayedSession {
  session_id: string;
  title: string;
  audio_url: string;
  type: 'basic' | 'maintenance';
  status: 'started' | 'completed';
  progress_percentage: number;
  course_title?: string;
  course_id?: string;
}

interface DataContextType {
  // Data
  courses: Course[];
  arcs: Arc[];
  lastPlayedSession: LastPlayedSession | null;
  
  // Loading states
  coursesLoading: boolean;
  arcsLoading: boolean;
  historyLoading: boolean;
  
  // Errors
  coursesError: string | null;
  arcsError: string | null;
  historyError: string | null;
  
  // Actions
  refreshCourses: () => Promise<void>;
  refreshArcs: () => Promise<void>;
  refreshHistory: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [lastPlayedSession, setLastPlayedSession] = useState<LastPlayedSession | null>(null);
  
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [arcsLoading, setArcsLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [arcsError, setArcsError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Debounce refs to prevent rapid successive calls
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshTime = useRef<{ [key: string]: number }>({});
  const DEBOUNCE_DELAY = 1000; // 1 second

  const fetchCourses = useCallback(async () => {
    try {
      setCoursesLoading(true);
      setCoursesError(null);

      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          disabled,
          collection_themes!inner(
            id,
            name,
            display_name
          )
        `)
        .order('title');

      if (error) throw error;

      const coursesWithSessionCount = await Promise.all(
        data.map(async (course) => {
          // Get session count for basic training
          const { count: basicCount } = await supabase
            .from('basic_training_sessions')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);

          // Get session count for maintenance
          const { count: maintenanceCount } = await supabase
            .from('maintenance_sessions')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);

          return {
            ...course,
            sessionCount: (basicCount || 0) + (maintenanceCount || 0),
            theme: course.collection_themes,
          };
        })
      );

      setCourses(coursesWithSessionCount);
    } catch (err) {
      setCoursesError('Failed to fetch courses');
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  const fetchArcs = useCallback(async () => {
    try {
      setArcsLoading(true);
      setArcsError(null);

      const { data, error } = await supabase
        .from('arcs')
        .select('*');

      if (error) throw error;
      setArcs(data || []);
    } catch (err) {
      setArcsError('Failed to fetch arcs');
    } finally {
      setArcsLoading(false);
    }
  }, []);

  const fetchLastPlayedSession = useCallback(async () => {
    try {
      setHistoryLoading(true);
      setHistoryError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLastPlayedSession(null);
        return;
      }

      // Get the most recent play history entry
      const { data: historyData, error: historyError } = await supabase
        .from('user_play_history')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (historyError || !historyData) {
        setLastPlayedSession(null);
        return;
      }

      // Try to get session details from maintenance_sessions first
      let { data: sessionData, error: sessionError } = await supabase
        .from('maintenance_sessions')
        .select(`
          id,
          title,
          audio_url,
          position,
          course_id
        `)
        .eq('id', historyData.session_id)
        .single();

      // If not found in maintenance_sessions, try basic_training_sessions
      if (sessionError && sessionError.code === 'PGRST116') {
        const { data: basicSessionData, error: basicSessionError } = await supabase
          .from('basic_training_sessions')
          .select(`
            id,
            title,
            audio_url,
            position,
            course_id
          `)
          .eq('id', historyData.session_id)
          .single();
        
        sessionData = basicSessionData;
        sessionError = basicSessionError;
      }

      // If session found, get the course title
      let courseTitle = null;
      let courseId: string | undefined;
      if (sessionData && sessionData.course_id) {
        const { data: courseData } = await supabase
          .from('courses')
          .select('title, id')
          .eq('id', sessionData.course_id)
          .single();
        
        courseTitle = courseData?.title;
        courseId = courseData?.id;
      }

      if (sessionError || !sessionData) {
        // Session no longer exists, clean up the history entry
        await supabase
          .from('user_play_history')
          .delete()
          .eq('id', historyData.id);
        
        setLastPlayedSession(null);
        return;
      }

      const lastSession = {
        session_id: sessionData.id,
        title: sessionData.title,
        audio_url: sessionData.audio_url,
        type: sessionData.position <= 10 ? 'basic' : 'maintenance',
        status: historyData.status,
        progress_percentage: historyData.progress_percentage,
        course_title: courseTitle,
        course_id: courseId,
      };
      
      setLastPlayedSession(lastSession);

    } catch (err) {
      setHistoryError('Failed to fetch last played session');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Debounced refresh functions
  const createDebouncedRefresh = useCallback((refreshFunction: () => Promise<void>, key: string) => {
    return async () => {
      const now = Date.now();
      const lastRefresh = lastRefreshTime.current[key] || 0;
      
      // Clear existing timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      // If enough time has passed, refresh immediately
      if (now - lastRefresh > DEBOUNCE_DELAY) {
        lastRefreshTime.current[key] = now;
        await refreshFunction();
      } else {
        // Otherwise, debounce the call
        refreshTimeoutRef.current = setTimeout(async () => {
          lastRefreshTime.current[key] = Date.now();
          await refreshFunction();
        }, DEBOUNCE_DELAY);
      }
    };
  }, []);

  // Memoized refresh functions with debouncing
  const refreshCourses = useCallback(
    createDebouncedRefresh(fetchCourses, 'courses'),
    [createDebouncedRefresh, fetchCourses]
  );

  const refreshArcs = useCallback(
    createDebouncedRefresh(fetchArcs, 'arcs'),
    [createDebouncedRefresh, fetchArcs]
  );

  const refreshHistory = useCallback(
    createDebouncedRefresh(fetchLastPlayedSession, 'history'),
    [createDebouncedRefresh, fetchLastPlayedSession]
  );

  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchCourses(),
      fetchArcs(),
      fetchLastPlayedSession(),
    ]);
  }, [fetchCourses, fetchArcs, fetchLastPlayedSession]);

  // Initial data fetch
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const value: DataContextType = {
    courses,
    arcs,
    lastPlayedSession,
    coursesLoading,
    arcsLoading,
    historyLoading,
    coursesError,
    arcsError,
    historyError,
    refreshCourses,
    refreshArcs,
    refreshHistory,
    refreshAll,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
