import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CollectionCardProps {
  icon: React.ComponentType<any>;
  title: string;
  sessions: number;
  color: string[];
  fullWidth?: boolean;
}

export const CollectionCard = ({ icon: Icon, title, sessions, color, fullWidth }: CollectionCardProps) => (
  <View style={[styles.collectionCard, fullWidth && styles.collectionCardFullWidth]}>
    <View style={[styles.iconCircle, { backgroundColor: color[0] }]}>
      <Icon size={28} color="#fff" weight="bold" />
    </View>
    <View style={styles.collectionInfo}>
      <Text style={styles.collectionTitle}>{title}</Text>
      <Text style={styles.collectionSubtitle}>{sessions} sessions</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  collectionCard: {
    width: 240,
    height: 110,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginRight: 0,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    // Shadow for Android
    elevation: 12,
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
  collectionInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  collectionTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 2,
  },
  collectionSubtitle: {
    color: '#aaa',
    fontSize: 15,
  },
}); 