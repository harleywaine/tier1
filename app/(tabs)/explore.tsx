import { Background } from '@/components/ui/Background';
import { Lightning, Moon, Trophy, WaveSawtooth } from 'phosphor-react-native';
import React from 'react';
import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

interface CollectionCardProps {
  icon: React.ComponentType<any>;
  title: string;
  sessions: number;
  color: string[];
}

const collections = [
  { title: 'Focus', sessions: 24, icon: Lightning, color: ['#3ad0ff', '#2563eb'] },
  { title: 'Sleep', sessions: 18, icon: Moon, color: ['#6ee7b7', '#2563eb'] },
  { title: 'Performance', sessions: 12, icon: Trophy, color: ['#fbbf24', '#f59e42'] },
  { title: 'Recovery', sessions: 6, icon: WaveSawtooth, color: ['#38bdf8', '#6366f1'] },
  // Add more as needed, e.g. Recovery, Performance
];

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const baseFontSize = 16; // Base font size for REM calculations
const rem = (size: number) => size * baseFontSize;
const vh = windowHeight / 100;

const CollectionCard: React.FC<CollectionCardProps> = ({ icon: Icon, title, sessions, color }) => (
  <View style={styles.collectionCard}>
    <View style={[styles.iconCircle, { backgroundColor: color[0] }]}>
      <Icon size={32} color="#fff" weight="bold" />
    </View>
    <View style={styles.collectionInfo}>
      <Text style={styles.collectionTitle}>{title}</Text>
      <Text style={styles.collectionSubtitle}>{`${sessions} sessions`}</Text>
    </View>
  </View>
);

export default function ExploreScreen() {
  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={[styles.header, { paddingTop: rem(2.5) }]}>
            <View>
              <Text style={styles.title}>EXPLORE</Text>
              <Text style={styles.subtitle}>Categories</Text>
            </View>
          </View>
          <FlatList
            data={collections}
            keyExtractor={item => item.title}
            renderItem={({ item }) => <CollectionCard {...item} />}
            contentContainerStyle={{ gap: 16, paddingBottom: rem(4) }}
            showsVerticalScrollIndicator={false}
          />
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
    padding: 24,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28, // Large
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16, // Small
    color: '#aaa',
    marginTop: 2,
  },
  collectionCard: {
    width: '100%',
    height: 110,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  collectionInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  collectionTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18, // Medium
    marginBottom: 2,
  },
  collectionSubtitle: {
    color: '#aaa',
    fontSize: 16, // Small
  },
});
