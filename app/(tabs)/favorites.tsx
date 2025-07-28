import { Background } from '@/components/ui/Background';
import { SessionCard } from '@/components/ui/SessionCard';
import { useFavorites } from '@/src/hooks/useFavorites';
import { useSessionCompletion } from '@/src/hooks/useSessionCompletion';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

const windowHeight = Dimensions.get('window').height;
const baseFontSize = 16;
const rem = (size: number) => size * baseFontSize;

interface Session {
  id: string;
  title: string;
  audio_url: string;
  author?: string;
  image_url?: string;
  course_id: string;
  course_title?: string;
}

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, loading, error } = useFavorites();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // Get session IDs for completion tracking
  const sessionIds = useMemo(() => sessions.map(s => s.id), [sessions]);
  const { getSessionCompletion } = useSessionCompletion(sessionIds);

  useEffect(() => {
    const fetchSessions = async () => {
      if (favorites.length === 0) {
        setSessions([]);
        setSessionsLoading(false);
        return;
      }

      try {
        const sessionIds = favorites.map(fav => fav.session_id);
        console.log('🔍 Fetching sessions for favorites:', sessionIds);
        
        // Fetch from both basic_training_sessions and maintenance_sessions
        const [basicResult, maintenanceResult] = await Promise.all([
          supabase.from('basic_training_sessions').select('*').in('id', sessionIds),
          supabase.from('maintenance_sessions').select('*').in('id', sessionIds)
        ]);

        console.log('📊 Basic sessions result:', basicResult);
        console.log('📊 Maintenance sessions result:', maintenanceResult);

        const allSessions = [
          ...(basicResult.data || []),
          ...(maintenanceResult.data || [])
        ];

        console.log('🎯 All sessions found:', allSessions.length);
        console.log('🎯 Session IDs found:', allSessions.map(s => s.id));

        // Fetch course titles for all sessions
        const courseIds = [...new Set(allSessions.map(session => session.course_id))];
        const { data: coursesData } = await supabase
          .from('courses')
          .select('id, title')
          .in('id', courseIds);

        const coursesMap = new Map(coursesData?.map(course => [course.id, course.title]) || []);

        // Add course titles to sessions
        const sessionsWithCourses = allSessions.map(session => ({
          ...session,
          course_title: coursesMap.get(session.course_id) || 'Unknown Course'
        }));

        setSessions(sessionsWithCourses);
      } catch (err) {
        console.error('Error fetching sessions:', err);
      } finally {
        setSessionsLoading(false);
      }
    };

    fetchSessions();
  }, [favorites]);

  const handleSessionPress = (session: Session) => {
    if (!session.audio_url) {
      console.warn('No audio URL for session:', session.title);
      return;
    }

    const encodedUrl = encodeURI(session.audio_url);
    const params = {
      audioUrl: encodedUrl,
      title: session.title,
      author: session.course_title || 'Unknown',
      imageUrl: session.image_url || '',
      sessionId: session.id,
    };

    router.push({
      pathname: '/play',
      params,
    });
  };

  if (loading || sessionsLoading) {
    return (
      <Background>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Text style={styles.loadingText}>Loading favorites...</Text>
          </View>
        </SafeAreaView>
      </Background>
    );
  }

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={[styles.header, { paddingTop: rem(2.5) }]}>
            <View>
              <Text style={styles.title}>Favorites</Text>
              <Text style={styles.subtitle}>Your saved sessions</Text>
            </View>
          </View>

          <ScrollView 
            style={styles.content}
            contentContainerStyle={{ paddingBottom: rem(4) }}
            showsVerticalScrollIndicator={false}
          >
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            {sessions.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No favorites yet</Text>
                <Text style={styles.emptySubtext}>Tap the heart icon while listening to save sessions</Text>
              </View>
            ) : (
              <View style={styles.sessionsContainer}>
                {sessions.map(session => (
                  <SessionCard
                    key={session.id}
                    title={session.title}
                    subtitle={session.course_title}
                    compact
                    showBookmark
                    onPress={() => handleSessionPress(session)}
                    completionStatus={getSessionCompletion(session.id).status}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    padding: 17,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'SFProDisplay-Regular',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 2,
    fontFamily: 'SFProDisplay-Light',
  },
  content: {
    flex: 1,
  },
  sessionsContainer: {
    gap: 14,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'SFProDisplay-Bold',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#aaa',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Light',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
}); 