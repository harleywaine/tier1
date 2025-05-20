import { Background } from '@/components/ui/Background';
import { CollectionCard } from '@/components/ui/CollectionCard';
import { SwitchCard } from '@/components/ui/SwitchCard';
import { Lightning, Moon, Trophy, WaveSawtooth } from 'phosphor-react-native';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

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

const switchCardShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
};

export default function ExploreScreen() {
  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: rem(4) }} showsVerticalScrollIndicator={false}>
          <View style={[styles.header, { paddingTop: rem(2.5) }]}>
            <View>
              <Text style={styles.title}>EXPLORE</Text>
              <Text style={styles.subtitle}>Categories</Text>
            </View>
          </View>
          <Text style={styles.sectionTitle}>Quick Switches</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
            <SwitchCard icon={Lightning} title="Switch On" color={["#3ad0ff"]} style={switchCardShadow} />
            <SwitchCard icon={Moon} title="Switch Off" color={["#6ee7b7"]} style={switchCardShadow} />
            <SwitchCard icon={Trophy} title="Take Control" color={["#fbbf24"]} style={switchCardShadow} />
          </View>
          <Text style={styles.sectionTitle}>Training</Text>
          <View style={{ gap: 16 }}>
            {collections.map(item => (
              <CollectionCard key={item.title} {...item} fullWidth />
            ))}
          </View>
        </ScrollView>
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
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 8,
  },
});
