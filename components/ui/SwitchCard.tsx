import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface SwitchCardProps {
  icon: React.ComponentType<any>;
  title: string;
  color: string[];
  style?: ViewStyle;
}

export const SwitchCard = ({ icon: Icon, title, color, style }: SwitchCardProps) => (
  <View style={[styles.switchCard, style]}>
    <View style={styles.iconCircle}> 
      <Icon size={22} color="#fff" weight="light" />
    </View>
    {/* <Text style={styles.switchTitle}>{title}</Text> */}
  </View>
);

const styles = StyleSheet.create({
  switchCard: {
    flex: 1,
    height: 60,
    backgroundColor: 'rgba(40, 40, 40, 0.65)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 0,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchTitle: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 13,
    textAlign: 'center',
  },
}); 