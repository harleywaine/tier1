import { supabase } from '@/lib/supabase';
import { useCallback, useEffect, useState } from 'react';

export interface SessionCompletion {
  session_id: string;
  status: 'not_started' | 'started' | 'completed';
  progress_percentage: number;
}

export function useSessionCompletion(sessionIds: string[]) {
  const [completionData, setCompletionData] = useState<Record<string, SessionCompletion>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompletionData = useCallback(async () => {
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

      console.log('📊 Raw history data from database:', historyData);
      console.log('📊 History error:', historyError);
      console.log('📊 User ID being queried:', user.id);
      console.log('📊 Session IDs being queried:', sessionIds);

      // Test query to see if we can read any records at all
      const { data: allRecords, error: allRecordsError } = await supabase
        .from('user_play_history')
        .select('*')
        .eq('user_id', user.id);

      console.log('📊 All records for user:', allRecords);
      console.log('📊 All records error:', allRecordsError);

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

      console.log('📊 Completion data fetched:', completionMap);
      setCompletionData(completionMap);

    } catch (err) {
      console.error('Error in fetchCompletionData:', err);
      setError('Failed to fetch session completion data');
    } finally {
      setLoading(false);
    }
  }, [sessionIds]);

  useEffect(() => {
    fetchCompletionData();
  }, [fetchCompletionData]);



  const getSessionCompletion = (sessionId: string): SessionCompletion => {
    const result = completionData[sessionId] || {
      session_id: sessionId,
      status: 'not_started',
      progress_percentage: 0,
    };
    console.log(`📊 getSessionCompletion for ${sessionId}:`, result);
    return result;
  };

  return {
    completionData,
    loading,
    error,
    getSessionCompletion,
    refresh: fetchCompletionData,
  };
} 