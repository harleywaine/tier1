import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  sessionCount?: number;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });

      if (courseError) {
        setError(courseError.message);
        setLoading(false);
        return;
      }

      const { data: sessionData, error: sessionError } = await supabase
        .from('basic_training_sessions')
        .select('course_id');

      if (sessionError) {
        setError(sessionError.message);
        setLoading(false);
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
      setLoading(false);
    }

    fetchCourses();
  }, []);

  return { courses, loading, error };
}
