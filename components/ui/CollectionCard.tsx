import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CollectionCardProps {
  icon?: React.ComponentType<any>;
  title: string;
  sessions: number;
  color?: string[];
  fullWidth?: boolean;
  hideIcon?: boolean;
  disabled?: boolean;
}

export const CollectionCard = ({ icon: Icon, title, sessions, color, fullWidth, hideIcon, disabled }: CollectionCardProps) => {
  const appliedColor = color && color.length > 0 ? color[0] : null;
  
  return (
  <View style={[
    styles.collectionCard,
    fullWidth && styles.collectionCardFullWidth,
    disabled && styles.collectionCardDisabled,
    appliedColor && { backgroundColor: appliedColor }
  ]}>
    {Icon && !hideIcon ? (
      <View style={styles.iconCircle}>
        <Icon size={28} color="#ffffff" weight="light" />
      </View>
    ) : null}
    <View style={styles.textContainer}>
      <Text style={styles.collectionTitle}>{title}</Text>
      <Text style={styles.collectionSubtitle}>{sessions} sessions</Text>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  collectionCard: {
    width: 240,
    height: 100,
    backgroundColor: 'rgba(40, 40, 40, 0.65)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    marginRight: 0,
  },
  collectionCardFullWidth: {
    width: '100%',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  collectionTitle: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 20,
    marginBottom: 2,
  },
  collectionSubtitle: {
    color: '#aaa',
    fontSize: 15,
  },
  collectionCardDisabled: {
    opacity: 0.75,
  },
}); 