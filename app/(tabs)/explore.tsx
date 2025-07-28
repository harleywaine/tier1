import { Background } from '@/components/ui/Background';
import { CollectionCard } from '@/components/ui/CollectionCard';
import { getThemeConfig } from '@/constants/ThemeColors';
import { useCourses } from '@/src/hooks/useCourses';
import { useRouter } from 'expo-router';
import { Lock } from 'phosphor-react-native';
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

export default function ExploreScreen() {
  const router = useRouter();
  const { courses, loading, error } = useCourses();

  // Group courses by theme
  const groupedCourses = courses.reduce((acc, course) => {
    const themeName = course.theme?.name || 'default';
    console.log('🎨 Course:', course.title, 'Theme ID:', course.theme_id, 'Theme Name:', course.theme?.name, 'Display:', course.theme?.display_name);
    if (!acc[themeName]) {
      acc[themeName] = {
        theme: course.theme,
        courses: []
      };
    }
    acc[themeName].courses.push(course);
    return acc;
  }, {} as Record<string, { theme: any; courses: any[] }>);

  console.log('📊 Grouped courses by theme name:', Object.keys(groupedCourses));

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
            </View>
          </View>

          <View style={{ gap: 20 }}>
            {loading && <Text style={{ color: '#aaa' }}>Loading...</Text>}
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            {Object.entries(groupedCourses).map(([themeName, themeData]) => {
              const themeConfig = getThemeConfig(themeName);
              console.log('🎨 Theme config for', themeName, ':', themeConfig);
              console.log('🎨 Theme colors:', themeConfig.colors);
              return (
                <View key={themeName} style={styles.themeSection}>
                  <View style={styles.themeHeader}>
                    <themeConfig.icon size={24} color="#fff" weight="light" />
                    <Text style={styles.themeTitle}>
                      {themeData.theme?.display_name || themeName}
                    </Text>
                  </View>
                  <View style={styles.coursesContainer}>
                    {themeData.courses.map(course => {
                      const isDisabled = !!course.disabled;
                      console.log('🎨 Course card colors for', course.title, ':', themeConfig.colors);
                      return (
                        <View key={course.id} style={{ position: 'relative' }}>
                          <TouchableOpacity
                            activeOpacity={isDisabled ? 1 : 0.7}
                            onPress={() => {
                              if (!isDisabled) {
                                router.push({
                                  pathname: '/collection',
                                  params: {
                                    courseId: course.id,
                                    title: course.title,
                                  },
                                });
                              }
                            }}
                            disabled={isDisabled}
                          >
                            <CollectionCard
                              title={course.title}
                              sessions={course.sessionCount ?? 0}
                              color={themeConfig.colors}
                              hideIcon
                              fullWidth
                              disabled={isDisabled}
                            />
                            {isDisabled && (
                              <View style={styles.disabledOverlay}>
                                <Lock size={32} color="#fff" weight="bold" />
                              </View>
                            )}
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </View>
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
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    zIndex: 2,
  },
  themeSection: {
    marginBottom: 32,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  themeTitle: {
    fontSize: 22,
    fontFamily: 'SFProDisplay-Bold',
    fontWeight: '600',
    color: '#fff',
  },
  coursesContainer: {
    gap: 16,
  },
});
