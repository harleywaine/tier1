import { ArcCard } from '@/components/ui/ArcCard';
import { CollectionCard } from '@/components/ui/CollectionCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArcCardSkeleton, SwitchCardSkeleton } from '@/components/ui/SkeletonCards';
import { SwitchCard } from '@/components/ui/SwitchCard';
import { useData } from '@/src/contexts/DataContext';
import { useRouter } from 'expo-router';
import { Play } from 'phosphor-react-native';
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
  const { arcs, courses, lastPlayedSession, arcsLoading, coursesLoading, historyLoading } = useData();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const name = user?.user_metadata?.first_name || '';
      setFirstName(name);
    };
    fetchUser();
  }, []);

  // Check if any critical data is still loading
  const isLoading = arcsLoading || historyLoading || coursesLoading;

  // Skeleton arrays for loading states
  const arcSkeletons = Array(8).fill(null);
  const switchSkeletons = Array(4).fill(null);

  // Define the order of arcs
  const arcOrder = ['commit', 'condition', 'control', 'reset', 'prime', 'explore', 'optimise', 'repeat'];
  
  // Sort arcs according to the specified order
  const sortedArcs = arcOrder.map(name => arcs.find(arc => arc.name === name)).filter(Boolean);

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
              title={historyLoading ? "Loading..." : (lastPlayedSession ? "Continue Listening" : "Get Started")}
              icon={lastPlayedSession && !historyLoading ? <Play size={20} color="#fff" weight="fill" /> : undefined}
              onPress={() => {
                if (lastPlayedSession) {
                  // Navigate to the course collection page
                  router.push({
                    pathname: '/collection',
                    params: { 
                      courseId: lastPlayedSession.course_id || 'default-course-id', 
                      title: lastPlayedSession.course_title || 'Course Collection' 
                    },
                  });
                } else {
                  // Navigate to protocols page
                  router.push('/protocols');
                }
              }}
              style={{ marginTop: 16 }}
            />
          </ArcCard>
        );
      
      case 'condition':
        return (
          <ArcCard
            name={arc.name}
            title={arc.title}
            description={arc.description}
            onPress={() => {
              // Navigate to ECT protocol collection
              router.push({
                pathname: '/collection',
                params: { courseId: 'ect-protocol-course-id', title: 'ECT Protocol' },
              });
            }}
          />
        );
      
      case 'control':
        return (
          <ArcCard
            name={arc.name}
            title={arc.title}
            description={arc.description}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 8 }}>
              <SwitchCard title="ON" color={['#2a9d8f']} />
              <SwitchCard title="OFF" color={['#6c757d']} />
              <SwitchCard title="CONTROL" color={['#e9c46a']} />
            </View>
          </ArcCard>
        );
      
      case 'explore':
        const exploreCourses = courses.slice(0, 8); // Get first 8 courses
        return (
          <ArcCard
            name={arc.name}
            title={arc.title}
            description={arc.description}
            style={{ paddingRight: 0 }}
          >
            <FlatList
              data={exploreCourses}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.horizontalCard}>
                  <CollectionCard
                    title={item.title}
                    sessions={item.sessionCount ?? 0}
                    fullWidth
                    hideIcon
                    onPress={() => {
                      router.push({
                        pathname: '/collection',
                        params: { courseId: item.id, title: item.title },
                      });
                    }}
                  />
                </View>
              )}
              ListFooterComponent={() => (
                <View style={styles.horizontalCard}>
                  <TouchableOpacity 
                    style={styles.seeMoreCard}
                    onPress={() => router.push('/protocols')}
                  >
                    <Text style={styles.seeMoreCardText}>See more</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </ArcCard>
        );
      
      case 'prime':
        return (
          <ArcCard
            name={arc.name}
            title={arc.title}
            description={arc.description}
            onPress={() => {
              // Navigate to primers collection
              router.push({
                pathname: '/collection',
                params: { courseId: 'primers-course-id', title: 'Primers' },
              });
            }}
          />
        );
      
      default:
        return (
          <ArcCard
            name={arc.name}
            title={arc.title}
            description={arc.description}
            onPress={() => {
              // Navigate to favorites tab
              router.push('/(tabs)/favorites');
            }}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[styles.header, { paddingTop: rem(2.5) }]}>
          <View>
            <Text style={styles.title}>{`You're back${firstName ? ', ' + firstName : ''}`}</Text>
            <Text style={styles.subtitle}>Time to lead your mind. Lets train.</Text>
          </View>
        </View>

        {/* Arcs Section */}
        {isLoading ? (
          // Show skeleton loading states
          <>
            {/* Header skeleton */}
            <View style={styles.header}>
              <Skeleton width="60%" height={32} borderRadius={4} />
              <Skeleton width="40%" height={20} borderRadius={4} style={{ marginTop: 8 }} />
            </View>
            
            {/* Switches skeleton */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 8 }}>
              {switchSkeletons.map((_, index) => (
                <SwitchCardSkeleton key={index} />
              ))}
            </View>
            
            {/* Arcs skeletons */}
            {arcSkeletons.map((_, index) => (
              <View key={index} style={{ marginTop: 16 }}>
                <ArcCardSkeleton />
              </View>
            ))}
          </>
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
    backgroundColor: '#070708',
  },
  container: {
    flex: 1,
    padding: 8.5,
    backgroundColor: '#070708',
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

  horizontalList: {
    paddingLeft: 8,
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
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  seeMoreCardText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Bold',
  },
});

