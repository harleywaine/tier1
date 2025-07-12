import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useSessionsByCourseTitle(courseTitle: string | undefined) {
  const [course, setCourse] = useState<any>(null);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [basic, setBasic] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);

      if (!courseTitle) {
        setError('No course title provided');
        return;
      }

      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('title', courseTitle)
        .single();

      if (courseError || !courseData) {
        setError(courseError?.message ?? 'Course not found');
        return;
      }

      setCourse(courseData);

      const [{ data: maintenanceData }, { data: basicData }] = await Promise.all([
        supabase.from('maintenance_sessions').select('*').eq('course_id', courseData.id),
        supabase.from('basic_training_sessions').select('*').eq('course_id', courseData.id),
      ]);

      setMaintenance(maintenanceData ?? []);
      setBasic(basicData ?? []);
      setError(null);
      setLoading(false);
    }

    fetchSessions();
  }, [courseTitle]);

  return { course, maintenance, basic, loading, error };
}
