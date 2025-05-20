import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AvatarProps {
  initial: string;
}

export const Avatar = ({ initial }: AvatarProps) => (
  <View style={styles.avatarContainer}>
    <Text style={styles.avatarText}>{initial}</Text>
  </View>
);

const styles = StyleSheet.create({
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 22,
  },
}); 