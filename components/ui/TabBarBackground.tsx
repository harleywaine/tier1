import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// This is a shim for web and Android where the tab bar is generally opaque.
export default function TabBarBackground() {
  const insets = useSafeAreaInsets();
  
  return <View style={[styles.background, { paddingBottom: insets.bottom }]} />;
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    height: 95,
    paddingTop: 25,
  },
});

export function useBottomTabOverflow() {
  return 0;
}
