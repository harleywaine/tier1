import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';

export const BackgroundGradient: React.FC = () => (
  <LinearGradient
    colors={['#111111', '#000000']}
    style={StyleSheet.absoluteFill}
  />
);

export const sharedStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 0.2 * (Dimensions.get('window').height / 100),
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'transparent',
  },
}); 