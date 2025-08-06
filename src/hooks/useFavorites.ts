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
      console.log('👤 Current user:', user?.id);
      if (!user) return;

      // First, get all favorites
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (favoritesError) throw favoritesError;

      // Then, get session details for each favorite
      const sessionIds = favoritesData?.map(fav => fav.session_id) || [];
      
      // Query both basic training and maintenance sessions
      const { data: basicSessions, error: basicError } = await supabase
        .from('basic_training_sessions')
        .select(`
          id,
          title,
          audio_url,
          course_id
        `)
        .in('id', sessionIds);

      const { data: maintenanceSessions, error: maintenanceError } = await supabase
        .from('maintenance_sessions')
        .select(`
          id,
          title,
          audio_url,
          course_id
        `)
        .in('id', sessionIds);

      if (basicError) throw basicError;
      if (maintenanceError) throw maintenanceError;

      // Combine all sessions
      const allSessions = [...(basicSessions || []), ...(maintenanceSessions || [])];
      
      // Get course titles for all course IDs
      const courseIds = [...new Set(allSessions.map(session => session.course_id))];
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id, title')
        .in('id', courseIds);

      if (coursesError) throw coursesError;

      // Create a map of course titles
      const courseTitleMap = (courses || []).reduce((acc, course) => {
        acc[course.id] = course.title;
        return acc;
      }, {} as Record<string, string>);

      // Create a map of session details
      const sessionMap = allSessions.reduce((acc, session) => {
        acc[session.id] = session;
        return acc;
      }, {} as Record<string, any>);

      const { data, error } = { data: favoritesData, error: null };

      console.log('❤️ Favorites query result:', { data, error });

      if (error) throw error;
      
      // Transform the data to flatten the nested structure
      const transformedFavorites = (data || []).map(fav => {
        const session = sessionMap[fav.session_id];
        return {
          id: fav.id,
          user_id: fav.user_id,
          session_id: fav.session_id,
          created_at: fav.created_at,
          title: session?.title,
          audio_url: session?.audio_url,
          course_title: session ? courseTitleMap[session.course_id] : undefined,
        };
      });
      
      setFavorites(transformedFavorites);
      console.log('💾 Favorites set:', transformedFavorites.length);
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
      setError(err instanceof Error ? err.message : 'Failed to remove favorite');
    }
  };

  const isFavorited = (sessionId: string) => {
    return favorites.some(fav => fav.session_id === sessionId);
  };

  const toggleFavorite = async (sessionId: string) => {
    if (isFavorited(sessionId)) {
      await removeFavorite(sessionId);
    } else {
      await addFavorite(sessionId);
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