import { ArcCard } from '@/components/ui/ArcCard';
import { CollectionCard } from '@/components/ui/CollectionCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { SwitchCard } from '@/components/ui/SwitchCard';
import { useArcs } from '@/src/hooks/useArcs';
import { useCourses } from '@/src/hooks/useCourses';
import { useRouter } from 'expo-router';
import { Lightning, Moon, Trophy, UserCircle } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const baseFontSize = 16; // Base font size for REM calculations
const rem = (size: number) => size * baseFontSize;

export default function HomeScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>('');
  const { arcs, loading: arcsLoading } = useArcs();
  const { courses, loading: coursesLoading } = useCourses();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const name = user?.user_metadata?.first_name || '';
      setFirstName(name);
    };
    fetchUser();
  }, []);

  // Define the order of arcs
  const arcOrder = ['commit', 'condition', 'control', 'reset', 'prime', 'explore', 'optimise', 'repeat'];
  
  // Sort arcs according to the specified order
  const sortedArcs = arcOrder.map(name => arcs.find(arc => arc.name === name)).filter(Boolean);

  console.log('🔍 Debug arcs:', {
    arcsLoading,
    arcsCount: arcs.length,
    sortedArcsCount: sortedArcs.length,
    arcs: arcs.map(a => a ? { name: a.name, title: a.title } : null),
    sortedArcs: sortedArcs.map(a => a ? { name: a.name, title: a.title } : null)
  });

  const renderArcContent = (arc: any) => {
    switch (arc.name) {
      case 'commit':
        return (
          <ArcCard
            name={arc.name}
            title={arc.title}
            description={arc.description}
          >
            <GradientButton
              title="Button"
              onPress={() => router.push('/explore')}
              style={{ marginTop: 16 }}
            />
          </ArcCard>
        );
      
      case 'explore':
        const exploreCourses = courses.slice(0, 8); // Get first 8 courses
        return (
          <ArcCard
            name={arc.name}
            title={arc.title}
            description={arc.description}
          >
            <FlatList
              data={exploreCourses}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.horizontalCard}>
                  <TouchableOpacity
                    onPress={() => {
                      router.push({
                        pathname: '/collection',
                        params: { courseId: item.id, title: item.title },
                      });
                    }}
                  >
                    <CollectionCard
                      title={item.title}
                      sessions={item.sessionCount ?? 0}
                      fullWidth
                    />
                  </TouchableOpacity>
                </View>
              )}
              ListFooterComponent={() => (
                <View style={styles.horizontalCard}>
                  <TouchableOpacity 
                    style={styles.seeMoreCard}
                    onPress={() => router.push('/explore')}
                  >
                    <Text style={styles.seeMoreCardText}>See more</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </ArcCard>
        );
      
      default:
        return (
          <ArcCard
            name={arc.name}
            title={arc.title}
            description={arc.description}
            onPress={() => {
              // For now, just navigate to explore. We can customize this later
              router.push('/explore');
            }}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <TouchableOpacity
          style={styles.avatarAbsolute}
          onPress={() => router.push('/account')}
        >
          <UserCircle size={36} color="#fff" weight="light" />
        </TouchableOpacity>
        
        <View style={[styles.header, { paddingTop: rem(2.5) }]}>
          <View>
            <Text style={styles.title}>{`You're back${firstName ? ', ' + firstName : ''}`}</Text>
            <Text style={styles.subtitle}>Let's train, win your day</Text>
          </View>
        </View>

        {/* Quick Switches Section */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
          <SwitchCard icon={Lightning} title="Switch On" color={['#2a9d8f']} style={switchCardShadow} />
          <SwitchCard icon={Moon} title="Switch Off" color={['#6c757d']} style={switchCardShadow} />
          <SwitchCard icon={Trophy} title="Take Control" color={['#e9c46a']} style={switchCardShadow} />
        </View>

        {/* Arcs Section */}
        {arcsLoading ? (
          <Text style={{ color: '#fff', marginTop: 20 }}>Loading arcs...</Text>
        ) : sortedArcs.length > 0 ? (
          sortedArcs.map((arc) => (
            arc && (
              <View key={arc.id}>
                {renderArcContent(arc)}
              </View>
            )
          ))
        ) : (
          <Text style={{ color: '#fff', marginTop: 20 }}>No arcs found</Text>
        )}
      </ScrollView>
    </SafeAreaView>
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
    fontFamily: 'SFProDisplay-Bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 2,
    fontFamily: 'SFProDisplay-Light',
  },
  avatarAbsolute: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 8,
    paddingRight: 8,
  },
  horizontalList: {
    paddingLeft: 8,
    paddingRight: 12,
    paddingVertical: 12,
    gap: 12,
  },
  horizontalCard: {
    width: 200,
  },
  seeMoreCard: {
    width: 200,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
  },
  seeMoreCardText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Bold',
  },
});

const switchCardShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
};
