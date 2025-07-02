import { Background } from '@/components/ui/Background';
import { CollectionCard } from '@/components/ui/CollectionCard';
import { SwitchCard } from '@/components/ui/SwitchCard';
import { useRouter } from 'expo-router';
import { Lightning, Moon, Trophy, WaveSawtooth } from 'phosphor-react-native';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CollectionCardProps {
  icon: React.ComponentType<any>;
  title: string;
  sessions: number;
  color: string[];
}

const collections = [
  { title: 'Focus', sessions: 24, icon: Lightning, color: ['#2a9d8f', '#1a6b61'] },
  { title: 'Sleep', sessions: 18, icon: Moon, color: ['#6c757d', '#495057'] },
  { title: 'Performance', sessions: 12, icon: Trophy, color: ['#e9c46a', '#a17e3d'] },
  { title: 'Recovery', sessions: 6, icon: WaveSawtooth, color: ['#457b9d', '#2c4a63'] },
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
  const router = useRouter();
  return (
    <Background>
    <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: rem(4) }} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: rem(2.5) }]}>
        <View>
              <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Categories</Text>
        </View>
      </View>
          <Text style={styles.sectionTitle}>Quick Switches</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
            <SwitchCard icon={Lightning} title="Switch On" color={["#2a9d8f"]} style={switchCardShadow} />
            <SwitchCard icon={Moon} title="Switch Off" color={["#6c757d"]} style={switchCardShadow} />
            <SwitchCard icon={Trophy} title="Take Control" color={["#e9c46a"]} style={switchCardShadow} />
          </View>
          <Text style={styles.sectionTitle}>Training</Text>
          <View style={{ gap: 16 }}>
            {collections.map(item => (
              <TouchableOpacity key={item.title} onPress={() => router.push({ pathname: '/collection' as any, params: { title: item.title } })}>
                <CollectionCard {...item} fullWidth hideIcon />
              </TouchableOpacity>
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
    fontFamily: 'SFProDisplay-Regular',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16, // Small
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
});
