import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface SecondaryButtonProps {
  title: string;
  onPress?: () => void;
}

export const SecondaryButton = ({ title, onPress }: SecondaryButtonProps) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
}); 