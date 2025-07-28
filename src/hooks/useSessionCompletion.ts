import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export interface SessionCompletion {
  session_id: string;
  status: 'not_started' | 'started' | 'completed';
  progress_percentage: number;
}

export function useSessionCompletion(sessionIds: string[]) {
  const [completionData, setCompletionData] = useState<Record<string, SessionCompletion>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompletionData = async () => {
      if (sessionIds.length === 0) {
        setCompletionData({});
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // If no user, all sessions are not started
          const notStartedData: Record<string, SessionCompletion> = {};
          sessionIds.forEach(id => {
            notStartedData[id] = {
              session_id: id,
              status: 'not_started',
              progress_percentage: 0,
            };
          });
          setCompletionData(notStartedData);
          return;
        }

        // Get completion data for all session IDs
        const { data: historyData, error: historyError } = await supabase
          .from('user_play_history')
          .select('session_id, status, progress_percentage')
          .eq('user_id', user.id)
          .in('session_id', sessionIds);

        if (historyError) {
          console.error('Error fetching session completion:', historyError);
          setError(historyError.message);
          return;
        }

        // Create a map of session completion data
        const completionMap: Record<string, SessionCompletion> = {};
        
        // Initialize all sessions as not started
        sessionIds.forEach(id => {
          completionMap[id] = {
            session_id: id,
            status: 'not_started',
            progress_percentage: 0,
          };
        });

        // Update with actual completion data
        historyData?.forEach(record => {
          completionMap[record.session_id] = {
            session_id: record.session_id,
            status: record.status as 'started' | 'completed',
            progress_percentage: record.progress_percentage,
          };
        });

        setCompletionData(completionMap);

      } catch (err) {
        console.error('Error in fetchCompletionData:', err);
        setError('Failed to fetch session completion data');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletionData();
  }, [sessionIds]);

  const getSessionCompletion = (sessionId: string): SessionCompletion => {
    return completionData[sessionId] || {
      session_id: sessionId,
      status: 'not_started',
      progress_percentage: 0,
    };
  };

  return {
    completionData,
    loading,
    error,
    getSessionCompletion,
  };
} 