import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface GradientButtonProps {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export const GradientButton = ({ title, onPress, style, disabled }: GradientButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[styles.buttonContainer, style]}
    disabled={disabled}
  >
    <LinearGradient
      colors={disabled ? ['#666', '#444'] : ['#457b9d', '#2c4a63']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.gradientButton, disabled && styles.disabledButton]}
    >
      <Text style={[styles.gradientButtonText, disabled && styles.disabledText]}>{title}</Text>
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
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    color: '#999',
  },
}); 