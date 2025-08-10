import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface SwitchCardProps {
  icon?: React.ComponentType<any>;
  title: string;
  color: string[];
  style?: ViewStyle;
}

export const SwitchCard = ({ icon: Icon, title, color, style }: SwitchCardProps) => (
  <View style={[styles.switchCard, style]}>
    <View style={styles.iconCircle}> 
      {Icon ? (
        <Icon size={22} color="#fff" weight="light" />
      ) : (
        <Text style={styles.switchText}>{title}</Text>
      )}
    </View>
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
    borderWidth: 2,
    borderColor: Colors.border.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconCircle: {
    width: 60,
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
  switchText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'SFProDisplay-Regular',
    paddingHorizontal: 1,
    flexShrink: 1,
  },
}); 