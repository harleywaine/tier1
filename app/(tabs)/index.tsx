import { Background } from '@/components/ui/Background';
import { CollectionCard } from '@/components/ui/CollectionCard';
import { SessionCard } from '@/components/ui/SessionCard';
import { TabSelector } from '@/components/ui/TabSelector';
import { Lightning, Moon, Trophy, WaveSawtooth } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const baseFontSize = 16; // Base font size for REM calculations
const rem = (size: number) => size * baseFontSize;

const collections = [
  { title: 'Focus', sessions: 8, icon: Lightning, color: ['#3ad0ff', '#2563eb'] },
  { title: 'Recovery', sessions: 6, icon: WaveSawtooth, color: ['#38bdf8', '#6366f1'] },
  { title: 'Performance', sessions: 12, icon: Trophy, color: ['#fbbf24', '#f59e42'] },
  { title: 'Sleep', sessions: 5, icon: Moon, color: ['#6ee7b7', '#2563eb'] },
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
  const [selectedTab, setSelectedTab] = useState<keyof typeof popularSessions>('all');

  // ListHeaderComponent for FlatList
  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={[styles.header, { paddingTop: rem(2.5) }]}>
        <View>
          <Text style={styles.title}>TIER 1</Text>
          <Text style={styles.subtitle}>Mindset</Text>
        </View>
      </View>

      {/* Continue */}
      <Text style={styles.sectionTitle}>Continue</Text>
      <SessionCard
        title="Pre-Competition Focus"
        subtitle="12 min · 3 days ago"
        progress={0.75}
      />

      {/* Today's Pick */}
      <Text style={styles.sectionTitle}>Today's Pick</Text>
      <SessionCard
        title="Mental Edge Visualization"
        description="Visualize your perfect performance and build confidence"
        buttonLabel="Start Session"
        duration="15 min"
        large
      />

      {/* Collections */}
      <View style={styles.collectionsHeader}>
        <Text style={styles.sectionTitle}>Collections</Text>
        <TouchableOpacity><Text style={styles.viewAll}>View all</Text></TouchableOpacity>
      </View>
      <FlatList
        data={collections}
        keyExtractor={item => item.title}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
        renderItem={({ item }) => <CollectionCard {...item} />}
        style={{ marginBottom: 16 }}
      />

      {/* Popular */}
      <Text style={styles.sectionTitle}>Popular</Text>
      <TabSelector tabs={popularTabs} value={selectedTab} onChange={setSelectedTab} />
    </>
  );

  return (
    <Background>
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
            contentContainerStyle={{ gap: 14, paddingBottom: rem(4) }}
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
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 2,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8,
  },
  collectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 8,
  },
  viewAll: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '500',
  },
});
