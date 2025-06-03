import { Background } from '@/components/ui/Background';
import { SessionCard } from '@/components/ui/SessionCard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Placeholder data for sessions in a collection
const placeholderSessions = [
  { title: 'Session 1', subtitle: '10 min · 1.2k plays' },
  { title: 'Session 2', subtitle: '15 min · 2.3k plays' },
  { title: 'Session 3', subtitle: '20 min · 3.4k plays' },
];

export default function CollectionScreen() {
  const { title } = useLocalSearchParams<{ title: string }>();
  const router = useRouter();

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="#e0f6ff" size={26} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>This is a placeholder description for the collection. It will be updated later.</Text>
          <Text style={styles.sectionTitle}>Maintenance</Text>
          <View style={styles.sessionsContainer}>
            {placeholderSessions.map((session, index) => (
              <SessionCard
                key={index}
                title={session.title}
                subtitle={session.subtitle}
                compact
                showBookmark
              />
            ))}
          </View>
          <Text style={styles.sectionTitle}>Course</Text>
          <View style={styles.sessionsContainer}>
            {placeholderSessions.map((session, index) => (
              <SessionCard
                key={index}
                title={session.title}
                subtitle={session.subtitle}
                compact
                showBookmark
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    padding: 17,
    paddingTop: 40,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 60,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  sessionsContainer: {
    gap: 14,
  },
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

export const options = {
  headerShown: false,
}; 