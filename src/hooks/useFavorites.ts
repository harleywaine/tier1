import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export interface Favorite {
  id: string;
  user_id: string;
  session_id: string;
  created_at: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 Current user:', user?.id);
      if (!user) return;

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('❤️ Favorites query result:', { data, error });

      if (error) throw error;
      setFavorites(data || []);
      console.log('💾 Favorites set:', data?.length || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

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
  }, []);

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