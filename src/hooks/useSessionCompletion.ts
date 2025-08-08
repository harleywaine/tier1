import { supabase } from '@/lib/supabase';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface SessionCompletion {
  session_id: string;
  status: 'not_started' | 'started' | 'completed';
  progress_percentage: number;
}

export function useSessionCompletion(sessionIds: string[]) {
  const [completionData, setCompletionData] = useState<Record<string, SessionCompletion>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cache for preventing unnecessary refetches
  const lastSessionIdsRef = useRef<string[]>([]);
  const lastFetchTimeRef = useRef<number>(0);
  const completionDataRef = useRef<Record<string, SessionCompletion>>({});
  const CACHE_DURATION = 30000; // 30 seconds

  // Memoize session IDs to prevent unnecessary re-renders
  const memoizedSessionIds = useMemo(() => {
    const sortedIds = [...sessionIds].sort();
    return sortedIds;
  }, [sessionIds]);

  const fetchCompletionData = useCallback(async () => {
    if (memoizedSessionIds.length === 0) {
      setCompletionData({});
      setLoading(false);
      return;
    }

    // Check if session IDs have changed or cache is stale
    const now = Date.now();
    const sessionIdsChanged = JSON.stringify(memoizedSessionIds) !== JSON.stringify(lastSessionIdsRef.current);
    const cacheStale = now - lastFetchTimeRef.current > CACHE_DURATION;
    
    if (!sessionIdsChanged && !cacheStale && Object.keys(completionDataRef.current).length > 0) {
      // No need to refetch
      return;
    }

    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // If no user, all sessions are not started
        const notStartedData: Record<string, SessionCompletion> = {};
        memoizedSessionIds.forEach(id => {
          notStartedData[id] = {
            session_id: id,
            status: 'not_started',
            progress_percentage: 0,
          };
        });
        setCompletionData(notStartedData);
        completionDataRef.current = notStartedData;
        lastSessionIdsRef.current = memoizedSessionIds;
        lastFetchTimeRef.current = now;
        return;
      }

      // Get completion data for all session IDs
      const { data: historyData, error: historyError } = await supabase
        .from('user_play_history')
        .select('session_id, status, progress_percentage')
        .eq('user_id', user.id)
        .in('session_id', memoizedSessionIds);

      if (historyError) {
        console.error('Error fetching session completion:', historyError);
        setError(historyError.message);
        return;
      }

      // Create a map of session completion data
      const completionMap: Record<string, SessionCompletion> = {};
      
      // Initialize all sessions as not started
      memoizedSessionIds.forEach(id => {
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
      completionDataRef.current = completionMap;
      lastSessionIdsRef.current = memoizedSessionIds;
      lastFetchTimeRef.current = now;

    } catch (err) {
      console.error('Error in fetchCompletionData:', err);
      setError('Failed to fetch session completion data');
    } finally {
      setLoading(false);
    }
  }, [memoizedSessionIds]); // Removed completionData from dependencies

  useEffect(() => {
    fetchCompletionData();
  }, [fetchCompletionData]);

  const getSessionCompletion = useCallback((sessionId: string): SessionCompletion => {
    const result = completionData[sessionId] || {
      session_id: sessionId,
      status: 'not_started',
      progress_percentage: 0,
    };
    return result;
  }, [completionData]);

  const refresh = useCallback(() => {
    lastFetchTimeRef.current = 0; // Force refresh by resetting cache time
    fetchCompletionData();
  }, [fetchCompletionData]);

  return {
    completionData,
    loading,
    error,
    getSessionCompletion,
    refresh,
  };
} 