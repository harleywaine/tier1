import { supabase } from '@/lib/supabase';
import React, { createContext, useContext, useEffect, useState } from 'react';

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
  // State
  const [courses, setCourses] = useState<Course[]>([]);
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [lastPlayedSession, setLastPlayedSession] = useState<LastPlayedSession | null>(null);
  
  // Loading states
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [arcsLoading, setArcsLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  
  // Errors
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [arcsError, setArcsError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Fetch courses with session counts
  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      setCoursesError(null);

      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          theme:collection_themes(id, name, display_name)
        `)
        .order('created_at', { ascending: true });

      if (courseError) {
        setCoursesError(courseError.message);
        return;
      }

      const { data: sessionData, error: sessionError } = await supabase
        .from('basic_training_sessions')
        .select('course_id');

      if (sessionError) {
        setCoursesError(sessionError.message);
        return;
      }

      const sessionCounts = sessionData?.reduce((acc: Record<string, number>, { course_id }) => {
        acc[course_id] = (acc[course_id] || 0) + 1;
        return acc;
      }, {}) ?? {};

      const enrichedCourses = courseData.map(course => ({
        ...course,
        sessionCount: sessionCounts[course.id] || 0,
      }));

      setCourses(enrichedCourses);
    } catch (err) {
      setCoursesError('Failed to fetch courses');
    } finally {
      setCoursesLoading(false);
    }
  };

  // Fetch arcs
  const fetchArcs = async () => {
    try {
      setArcsLoading(true);
      setArcsError(null);

      const { data, error } = await supabase
        .from('arcs')
        .select('*');

      if (error) {
        setArcsError(error.message);
      } else {
        setArcs(data || []);
      }
    } catch (err) {
      setArcsError('Failed to fetch arcs');
    } finally {
      setArcsLoading(false);
    }
  };

  // Fetch last played session
  const fetchLastPlayedSession = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLastPlayedSession(null);
        return;
      }
      
      const { data: historyData, error: historyError } = await supabase
        .from('user_play_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (historyError && historyError.code !== 'PGRST116') {
        setHistoryError(historyError.message);
        return;
      }

      if (!historyData) {
        setLastPlayedSession(null);
        return;
      }
      
      // Try to find the session in maintenance_sessions first
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
      if (sessionData && sessionData.course_id) {
        const { data: courseData } = await supabase
          .from('courses')
          .select('title')
          .eq('id', sessionData.course_id)
          .single();
        
        courseTitle = courseData?.title;
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
      };
      
      setLastPlayedSession(lastSession);

    } catch (err) {
      setHistoryError('Failed to fetch last played session');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Refresh functions
  const refreshCourses = async () => {
    await fetchCourses();
  };

  const refreshArcs = async () => {
    await fetchArcs();
  };

  const refreshHistory = async () => {
    await fetchLastPlayedSession();
  };

  const refreshAll = async () => {
    await Promise.all([
      fetchCourses(),
      fetchArcs(),
      fetchLastPlayedSession(),
    ]);
  };

  // Initial data fetch
  useEffect(() => {
    refreshAll();
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
