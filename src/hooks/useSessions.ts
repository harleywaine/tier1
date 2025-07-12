import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Session {
  id: string;
  title: string;
  type: 'maintenance' | 'basic';
  course_id: string;
  audio_url: string;
  created_at: string;
}

export function useSessions(courseId: string) {
  const [maintenance, setMaintenance] = useState<Session[]>([]);
  const [basic, setBasic] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: true });

      if (error) {
        setError(error.message);
      } else if (data) {
        setMaintenance(data.filter((s: Session) => s.type === 'maintenance'));
        setBasic(data.filter((s: Session) => s.type === 'basic'));
      }

      setLoading(false);
    }

    fetchSessions();
  }, [courseId]);

  return { maintenance, basic, loading, error };
}
