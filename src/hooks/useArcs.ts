import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export interface Arc {
  id: string;
  name: string;
  title: string;
  description: string;
}

export function useArcs() {
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArcs = async () => {
      try {
        console.log('🔍 Fetching arcs from database...');
        const { data, error } = await supabase
          .from('arcs')
          .select('*');

        console.log('🔍 Arcs query result:', { data, error });

        if (error) {
          console.error('🔍 Arcs query error:', error);
          setError(error.message);
        } else {
          console.log('🔍 Arcs fetched successfully:', data);
          setArcs(data || []);
        }
      } catch (err) {
        console.error('🔍 Arcs fetch error:', err);
        setError('Failed to fetch arcs');
      } finally {
        setLoading(false);
      }
    };

    fetchArcs();
  }, []);

  return { arcs, loading, error };
} 