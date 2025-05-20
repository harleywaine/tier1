import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface GradientButtonProps {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const GradientButton = ({ title, onPress, style }: GradientButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[styles.buttonContainer, style]}
  >
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
  buttonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
  },
  gradientButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 14,
    width: '100%',
  },
  gradientButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
}); 