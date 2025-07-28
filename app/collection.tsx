import { Background } from '@/components/ui/Background';
import { SessionCard } from '@/components/ui/SessionCard';
import { useSessionsByCourseTitle } from '@/src/hooks/useSessionsByCourseTitle';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CollectionScreen() {
  const { title } = useLocalSearchParams<{ title: string }>();
  const router = useRouter();

  const { course, maintenance, basic, loading, error } = useSessionsByCourseTitle(title);

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

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>
            {course?.description ?? 'Explore the sessions in this course.'}
          </Text>
          {error && <Text style={{ color: 'red' }}>Error: {error}</Text>}

          <Text style={styles.sectionTitle}>Maintenance</Text>
          <View style={styles.sessionsContainer}>
            {maintenance.map(session => (
              <SessionCard
                key={session.id}
                title={session.title}
                subtitle="Maintenance session"
                compact
                showBookmark
                onPress={() => handlePress(session)}
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Course</Text>
          <View style={styles.sessionsContainer}>
            {basic.map(session => (
              <SessionCard
                key={session.id}
                title={session.title}
                subtitle="Basic training session"
                compact
                showBookmark
                onPress={() => handlePress(session)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  scrollContainer: { padding: 17, paddingTop: 80, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '400', color: '#fff', marginBottom: 20 },
  description: { fontSize: 16, color: '#aaa', marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '400', color: '#fff', marginTop: 20, marginBottom: 10 },
  sessionsContainer: { gap: 14 },
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
});

export const options = { headerShown: false };
