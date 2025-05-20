import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface GradientButtonProps {
  title: string;
  onPress?: () => void;
}

export const GradientButton = ({ title, onPress }: GradientButtonProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ borderRadius: 24, overflow: 'hidden' }}>
    <LinearGradient
      colors={['#0b4f6c', '#01b4d4', '#03d2b3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradientButton}
    >
      <Text style={styles.gradientButtonText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  gradientButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 24,
  },
  gradientButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
}); 