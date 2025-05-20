import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CollectionCardProps {
  icon: React.ComponentType<any>;
  title: string;
  sessions: number;
  color: string[];
}

export const CollectionCard = ({ icon: Icon, title, sessions, color }: CollectionCardProps) => (
  <View style={styles.collectionCard}>
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
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginRight: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
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