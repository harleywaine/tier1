import { Background } from '@/components/ui/Background';
import { SessionCard } from '@/components/ui/SessionCard';
import { useSessionCompletion } from '@/src/hooks/useSessionCompletion';
import { useSessionsByCourseTitle } from '@/src/hooks/useSessionsByCourseTitle';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';
import React, { useMemo } from 'react';
import {
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function CollectionScreen() {
  const { title } = useLocalSearchParams<{ title: string }>();
  const router = useRouter();

  const { course, maintenance, basic, loading, error } = useSessionsByCourseTitle(title);

  // Get all session IDs for completion tracking
  const allSessionIds = useMemo(() => {
    return [
      ...maintenance.map(s => s.id),
      ...basic.map(s => s.id)
    ];
  }, [maintenance, basic]);
  
  const { getSessionCompletion } = useSessionCompletion(allSessionIds);

  const handlePress = (session: any) => {
    console.log('🟡 Tapped session:', session);

    if (!session.audio_url) {
      console.warn('❌ No audio URL for session:', session.title);
      return;
    }

    const encodedUrl = encodeURI(session.audio_url);
    const params = {
      audioUrl: encodedUrl,
      title: session.title,
      author: session.author || 'Unknown',
      imageUrl: session.image_url || '',
      sessionId: session.id,
    };

    console.log('🟢 Navigating to /play with params:', params);

    router.push({
      pathname: '/play',
      params,
    });
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="#e0f6ff" size={26} weight="light" />
          </TouchableOpacity>

          <View style={styles.heroContainer}>
            <ImageBackground
              source={require('@/assets/images/Index-bg.jpg')}
              style={styles.heroBackground}
              imageStyle={styles.heroImage}
            >
              <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>{title}</Text>
                <Text style={styles.heroDescription}>
                  {course?.description ?? 'Explore the sessions in this course.'}
                </Text>
              </View>
            </ImageBackground>
          </View>

          {error && <Text style={{ color: 'red' }}>Error: {error}</Text>}

          {maintenance.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Maintenance</Text>
              <View style={styles.sessionsContainer}>
                {maintenance.map(session => {
                  const completion = getSessionCompletion(session.id);
                  console.log(`🔍 Session ${session.title}: ${completion.status}`);
                  return (
                    <SessionCard
                      key={session.id}
                      title={session.title}
                      subtitle="Maintenance session"
                      compact
                      showBookmark
                      onPress={() => handlePress(session)}
                      completionStatus={completion.status}
                    />
                  );
                })}
              </View>
            </>
          )}

          <Text style={styles.sectionTitle}>Basic Training</Text>
          <View style={styles.sessionsContainer}>
            {basic.map(session => {
              const completion = getSessionCompletion(session.id);
              console.log(`🔍 Session ${session.title}: ${completion.status}`);
              return (
                <SessionCard
                  key={session.id}
                  title={session.title}
                  subtitle="Basic training session"
                  compact
                  showBookmark
                  onPress={() => handlePress(session)}
                  completionStatus={completion.status}
                />
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  scrollContainer: { paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '400', color: '#fff', marginBottom: 20 },
  description: { fontSize: 16, color: '#aaa', marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '400', color: '#fff', marginTop: 20, marginBottom: 10, paddingHorizontal: 17 },
  sessionsContainer: { gap: 14, paddingHorizontal: 17 },
  backButton: {
    position: 'absolute',
    top: 32,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(20, 24, 32, 0.7)',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  heroContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 0,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  heroBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 0,
  },
  heroImage: {
    borderRadius: 0,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 0,
    padding: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    marginBottom: 10,
  },
  heroDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'left',
  },
});

export const options = { headerShown: false };
