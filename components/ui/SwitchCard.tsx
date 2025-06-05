import React from 'react';
import { Dimensions, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface SwitchCardProps {
  icon: React.ComponentType<any>;
  title: string;
  color: string[];
  style?: ViewStyle;
}

const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth / 3 - 16; // 33% of page width minus some gap

export const SwitchCard = ({ icon: Icon, title, color, style }: SwitchCardProps) => (
  <View style={[styles.switchCard, style]}>
    <View style={[styles.iconCircle, { backgroundColor: color[0] }]}> 
      <Icon size={22} color="#fff" weight="bold" />
    </View>
    <Text style={styles.switchTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  switchCard: {
    width: cardWidth,
    height: 90,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    paddingVertical: 10,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    // Shadow for Android
    elevation: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  switchTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
}); 