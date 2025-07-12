import { Background } from '@/components/ui/Background';
import { CollectionCard } from '@/components/ui/CollectionCard';
import { SwitchCard } from '@/components/ui/SwitchCard';
import { useCourses } from '@/src/hooks/useCourses';
import { useRouter } from 'expo-router';
import { Lightning, Moon, Trophy, WaveSawtooth } from 'phosphor-react-native';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const baseFontSize = 16;
const rem = (size: number) => size * baseFontSize;

const switchCardShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
};

const courseMeta: Record<string, { icon: React.ComponentType<any>; color: string[] }> = {
  'Emotional Control': { icon: Lightning, color: ['#2a9d8f', '#1a6b61'] },
  'Focus': { icon: Lightning, color: ['#2a9d8f', '#1a6b61'] },
  'Sleep': { icon: Moon, color: ['#6c757d', '#495057'] },
  'Performance': { icon: Trophy, color: ['#e9c46a', '#a17e3d'] },
  'Recovery': { icon: WaveSawtooth, color: ['#457b9d', '#2c4a63'] },
};

export default function ExploreScreen() {
  const router = useRouter();
  const { courses, loading, error } = useCourses();

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: rem(4) }}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, { paddingTop: rem(2.5) }]}>
            <View>
              <Text style={styles.title}>Explore</Text>
              <Text style={styles.subtitle}>Categories</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Quick Switches</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
            <SwitchCard icon={Lightning} title="Switch On" color={['#2a9d8f']} style={switchCardShadow} />
            <SwitchCard icon={Moon} title="Switch Off" color={['#6c757d']} style={switchCardShadow} />
            <SwitchCard icon={Trophy} title="Take Control" color={['#e9c46a']} style={switchCardShadow} />
          </View>

          <Text style={styles.sectionTitle}>Training</Text>
          <View style={{ gap: 16 }}>
            {loading && <Text style={{ color: '#aaa' }}>Loading...</Text>}
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            {courses.map(course => {
              const meta = courseMeta[course.title] ?? { icon: Lightning, color: ['#999', '#666'] };
              return (
                <TouchableOpacity
                  key={course.id}
                  onPress={() =>
                    router.push({
                      pathname: '/collection',
                      params: {
                        courseId: course.id,
                        title: course.title,
                      },
                    })
                  }
                >
                  <CollectionCard
                    title={course.title}
                    sessions={course.sessionCount ?? 0}
                    icon={meta.icon}
                    color={meta.color}
                    fullWidth
                    hideIcon
                  />
                </TouchableOpacity>
              );
            })}
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
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'SFProDisplay-Bold',
    marginBottom: 10,
    marginTop: 8,
  },
});
