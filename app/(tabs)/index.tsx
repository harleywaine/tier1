import { CollectionCard } from '@/components/ui/CollectionCard';
import { SessionCard } from '@/components/ui/SessionCard';
import { TabSelector } from '@/components/ui/TabSelector';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Lightning, Moon, Trophy, UserCircle, WaveSawtooth } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Dimensions, FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const baseFontSize = 16; // Base font size for REM calculations
const rem = (size: number) => size * baseFontSize;

const collections = [
  { title: 'Focus', sessions: 8, icon: Lightning, color: ['#2a9d8f', '#1a6b61'] },
  { title: 'Recovery', sessions: 6, icon: WaveSawtooth, color: ['#457b9d', '#2c4a63'] },
  { title: 'Performance', sessions: 12, icon: Trophy, color: ['#e9c46a', '#a17e3d'] },
  { title: 'Sleep', sessions: 5, icon: Moon, color: ['#6c757d', '#495057'] },
];

const popularTabs = [
  { label: 'All', value: 'all' as const },
  { label: 'New', value: 'new' as const },
];

const popularSessions = {
  all: [
    { title: 'Game Day Preparation', subtitle: '18 min · 2.4k plays' },
    { title: 'Stress Relief & Calm', subtitle: '12 min · 1.8k plays' },
    { title: 'Deep Recovery', subtitle: '20 min · 3.1k plays' },
  ],
  short: [
    { title: 'Quick Focus', subtitle: '5 min · 4.2k plays' },
    { title: 'Power Minute', subtitle: '1 min · 8.7k plays' },
    { title: 'Breath Work', subtitle: '8 min · 3.5k plays' },
  ],
  new: [
    { title: 'Elite Performance', subtitle: '15 min · 1.2k plays' },
    { title: 'Mental Toughness', subtitle: '22 min · 950 plays' },
    { title: 'Visualization Mastery', subtitle: '18 min · 1.5k plays' },
  ],
};

export default function HomeScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<keyof typeof popularSessions>('all');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const handleSessionPress = (title: string, duration: string, description?: string) => {
    router.push({
      pathname: '/play',
      params: {
        title,
        duration,
        description,
        audioUrl: 'https://example.com/audio.mp3' // Replace with actual audio URL
      }
    });
  };

  const handleCollectionPress = (title: string) => {
    router.push({
      pathname: '/collection' as any,
      params: { title }
    });
  };

  // ListHeaderComponent for FlatList
  const renderHeader = () => (
    <>
      {/* Top-right Avatar */}
      <TouchableOpacity
        style={styles.avatarAbsolute}
        onPress={() => router.push('/account')}
      >
        <UserCircle size={36} color="#fff" weight="light" />
      </TouchableOpacity>
      {/* Header */}
      <View style={[styles.header, { paddingTop: rem(2.5) }]}>
        <View>
          <Text style={styles.title}>TIER 1</Text>
          <Text style={styles.subtitle}>Mindset</Text>
        </View>
      </View>

      {/* Today's Pick */}
      <Text style={styles.sectionTitle}>Today's Pick</Text>
      <SessionCard
        title="Mental Edge Visualization"
        description="Visualize your perfect performance and build confidence"
        buttonLabel="Start Session"
        duration="15 min"
        large
        onButtonPress={() => handleSessionPress(
          'Mental Edge Visualization',
          '15 min',
          'Visualize your perfect performance and build confidence'
        )}
        style={{ marginBottom: 8 }}
      />

      {/* Collections */}
      <View style={styles.collectionsHeader}>
        <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Collections</Text>
        <TouchableOpacity onPress={() => router.push('/explore')}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={collections}
        keyExtractor={item => item.title}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCollectionPress(item.title)}>
            <CollectionCard {...item} hideIcon />
          </TouchableOpacity>
        )}
        style={{ marginBottom: 10, overflow: 'visible' }}
      />

      {/* Popular */}
      <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Popular</Text>
      <TabSelector tabs={popularTabs} value={selectedTab} onChange={setSelectedTab} style={{ marginBottom: 0 }} />
    </>
  );

  return (
    <ImageBackground
      source={require('@/assets/images/Index-bg.jpg')}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
        style={styles.gradient}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <FlatList
            data={popularSessions[selectedTab]}
            keyExtractor={item => item.title}
            renderItem={({ item }) => (
              <SessionCard
                title={item.title}
                subtitle={item.subtitle}
                compact
                showBookmark
              />
            )}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={{ gap: 10, paddingBottom: rem(4) }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
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
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'SFProDisplay-Bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 2,
    fontFamily: 'SFProDisplay-Light',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'SFProDisplay-Bold',
    marginBottom: 10,
    marginTop: 8,
  },
  collectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
    marginTop: 8,
  },
  viewAll: {
    color: '#aaa',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Light',
    lineHeight: 20,
  },
  avatarContainer: {
    marginLeft: 12,
  },
  avatarAbsolute: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 8,
    paddingRight: 8,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '30%',
  },
  backgroundImageStyle: {
    opacity: 0.7,
    transform: [{ scaleX: -1 }],
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
});
