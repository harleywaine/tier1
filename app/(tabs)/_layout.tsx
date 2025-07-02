import { Tabs } from 'expo-router';
import { Compass, House, User } from 'phosphor-react-native';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            height: 80,
            paddingTop: 18,
          },
          default: {
            height: 80,
            paddingTop: 18,
          },
        }),
        tabBarIconStyle: {
          marginTop: -12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <View style={{ marginTop: -6 }}>
              <House size={28} color={color} weight="light" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <View style={{ marginTop: -6 }}>
              <Compass size={28} color={color} weight="light" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => (
            <View style={{ marginTop: -6 }}>
              <User size={28} color={color} weight="light" />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
