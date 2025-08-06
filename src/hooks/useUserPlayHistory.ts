import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export interface PlayHistoryEntry {
  id: string;
  user_id: string;
  session_id: string;
  status: 'started' | 'completed';
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface LastPlayedSession {
  session_id: string;
  title: string;
  audio_url: string;
  type: string;
  status: 'started' | 'completed';
  progress_percentage: number;
  course_title?: string;
}

export function useUserPlayHistory() {
  const [lastPlayedSession, setLastPlayedSession] = useState<LastPlayedSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLastPlayedSession = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLastPlayedSession(null);
        return;
      }

      console.log('🔍 Fetching play history for user:', user.id);
      
      // Get the most recent play history entry
      const { data: historyData, error: historyError } = await supabase
        .from('user_play_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      console.log('🔍 Play history query result:', { historyData, historyError });

      if (historyError && historyError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching play history:', historyError);
        setError(historyError.message);
        return;
      }

      if (!historyData) {
        console.log('🔍 No play history found for user');
        setLastPlayedSession(null);
        return;
      }

      console.log('🔍 Looking up session:', historyData.session_id);
      
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

      console.log('🔍 Session lookup result:', { 
        sessionData, 
        sessionError,
        courseTitle: sessionData?.courses?.title,
        sessionId: sessionData?.id 
      });

      if (sessionError || !sessionData) {
        // Session no longer exists, clean up the history entry
        console.log('Session no longer exists, cleaning up history entry');
        await supabase
          .from('user_play_history')
          .delete()
          .eq('id', historyData.id);
        
        setLastPlayedSession(null);
        return;
      }

      // Return the last played session with session details
      const lastSession = {
        session_id: sessionData.id,
        title: sessionData.title,
        audio_url: sessionData.audio_url,
        type: sessionData.position <= 10 ? 'basic' : 'maintenance',
        status: historyData.status,
        progress_percentage: historyData.progress_percentage,
        course_title: courseTitle,
      };
      
      console.log('🔍 Setting last played session:', lastSession);
      setLastPlayedSession(lastSession);

    } catch (err) {
      console.error('Error in fetchLastPlayedSession:', err);
      setError('Failed to fetch last played session');
    } finally {
      setLoading(false);
    }
  };

  const recordSessionStart = async (sessionId: string) => {
    try {
      console.log('🎵 recordSessionStart called for sessionId:', sessionId);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('🎵 No user found, cannot record session start');
        return;
      }
      console.log('🎵 User found:', user.id);

      // Check if we already have a record for this session
      const { data: existingRecord } = await supabase
        .from('user_play_history')
        .select('id')
        .eq('user_id', user.id)
        .eq('session_id', sessionId)
        .single();

      console.log('🎵 Existing record check result:', existingRecord);

      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('user_play_history')
          .update({ 
            status: 'started',
            progress_percentage: 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRecord.id);
        
        console.log('🎵 Update existing record result:', updateError ? 'Error: ' + updateError.message : 'Success');
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('user_play_history')
          .insert({
            user_id: user.id,
            session_id: sessionId,
            status: 'started',
            progress_percentage: 0,
          });
        
        console.log('🎵 Insert new record result:', insertError ? 'Error: ' + insertError.message : 'Success');
      }

      // Refresh the last played session
      await fetchLastPlayedSession();
    } catch (err) {
      console.error('Error recording session start:', err);
    }
  };

  const updateSessionProgress = async (sessionId: string, progressPercentage: number) => {
    try {
      console.log('🎵 updateSessionProgress called for sessionId:', sessionId, 'progress:', progressPercentage);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('🎵 No user found, cannot update session progress');
        return;
      }

      const status = progressPercentage >= 100 ? 'completed' : 'started';

      const { error: updateError } = await supabase
        .from('user_play_history')
        .update({ 
          status,
          progress_percentage: Math.min(progressPercentage, 100),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('session_id', sessionId);

      console.log('🎵 Update progress result:', updateError ? 'Error: ' + updateError.message : 'Success');

      // Refresh the last played session
      await fetchLastPlayedSession();
    } catch (err) {
      console.error('Error updating session progress:', err);
    }
  };

  useEffect(() => {
    fetchLastPlayedSession();
  }, []);

  return {
    lastPlayedSession,
    loading,
    error,
    recordSessionStart,
    updateSessionProgress,
    refetch: fetchLastPlayedSession,
  };
} 