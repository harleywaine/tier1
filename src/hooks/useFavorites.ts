import { supabase } from '@/lib/supabase';
import { useCallback, useEffect, useState } from 'react';

export interface Favorite {
  id: string;
  user_id: string;
  session_id: string;
  created_at: string;
  title?: string;
  course_title?: string;
  audio_url?: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get all favorites first
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (favoritesError) throw favoritesError;

      if (!favoritesData || favoritesData.length === 0) {
        setFavorites([]);
        return;
      }

      // Get session IDs from favorites
      const sessionIds = favoritesData.map(fav => fav.session_id);

      // Fetch session details from both tables
      const [basicSessionsResult, maintenanceSessionsResult] = await Promise.all([
        supabase
          .from('basic_training_sessions')
          .select(`
            id,
            title,
            audio_url,
            course_id,
            courses!inner(
              id,
              title
            )
          `)
          .in('id', sessionIds),
        supabase
          .from('maintenance_sessions')
          .select(`
            id,
            title,
            audio_url,
            course_id,
            courses!inner(
              id,
              title
            )
          `)
          .in('id', sessionIds)
      ]);

      // Combine all sessions into a map
      const sessionMap = new Map();
      
      // Add basic training sessions
      (basicSessionsResult.data || []).forEach(session => {
        sessionMap.set(session.id, {
          ...session,
          course_title: session.courses?.title
        });
      });
      
      // Add maintenance sessions
      (maintenanceSessionsResult.data || []).forEach(session => {
        sessionMap.set(session.id, {
          ...session,
          course_title: session.courses?.title
        });
      });

      // Transform favorites with session details
      const transformedFavorites = favoritesData.map(fav => {
        const sessionDetails = sessionMap.get(fav.session_id);
        return {
          id: fav.id,
          user_id: fav.user_id,
          session_id: fav.session_id,
          created_at: fav.created_at,
          title: sessionDetails?.title,
          audio_url: sessionDetails?.audio_url,
          course_title: sessionDetails?.course_title,
        };
      });
      
      setFavorites(transformedFavorites);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  }, []);

  const addFavorite = async (sessionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, session_id: sessionId });

      if (error) throw error;
      await fetchFavorites();
    } catch (err) {
      console.error('❌ Error adding favorite:', err);
      setError(err instanceof Error ? err.message : 'Failed to add favorite');
    }
  };

  const removeFavorite = async (sessionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('session_id', sessionId);

      if (error) throw error;
      await fetchFavorites();
    } catch (err) {
      console.error('❌ Error removing favorite:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove favorite');
    }
  };

  const isFavorited = (sessionId: string) => {
    const result = favorites.some(fav => fav.session_id === sessionId);
    return result;
  };

  const toggleFavorite = async (sessionId: string) => {
    try {
      if (isFavorited(sessionId)) {
        await removeFavorite(sessionId);
      } else {
        await addFavorite(sessionId);
      }
    } catch (err) {
      console.error('❌ Error in toggleFavorite:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle favorite');
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorited,
    toggleFavorite,
    refetch: fetchFavorites,
  };
} 