import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from './Skeleton';

// Skeleton for ArcCard
export const ArcCardSkeleton: React.FC = () => (
  <View style={styles.arcCard}>
    <Skeleton width={60} height={24} borderRadius={6} style={styles.tag} />
    <Skeleton width="80%" height={24} borderRadius={4} style={styles.title} />
    <Skeleton width="60%" height={16} borderRadius={4} style={styles.description} />
  </View>
);

// Skeleton for CollectionCard
export const CollectionCardSkeleton: React.FC = () => (
  <View style={styles.collectionCard}>
    <Skeleton width="70%" height={20} borderRadius={4} style={styles.title} />
    <Skeleton width="40%" height={14} borderRadius={4} style={styles.subtitle} />
  </View>
);

// Skeleton for SessionCard
export const SessionCardSkeleton: React.FC = () => (
  <View style={styles.sessionCard}>
    <View style={styles.sessionContent}>
      <Skeleton width={24} height={24} borderRadius={12} style={styles.icon} />
      <View style={styles.textContainer}>
        <Skeleton width="80%" height={16} borderRadius={4} style={styles.title} />
        <Skeleton width="60%" height={12} borderRadius={4} style={styles.subtitle} />
      </View>
    </View>
  </View>
);

// Skeleton for SwitchCard
export const SwitchCardSkeleton: React.FC = () => (
  <View style={styles.switchCard}>
    <Skeleton width={32} height={32} borderRadius={16} style={styles.icon} />
  </View>
);

const styles = StyleSheet.create({
  // ArcCard skeleton styles
  arcCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    padding: 20,
    gap: 12,
  },
  tag: {
    alignSelf: 'flex-start',
  },
  title: {
    marginBottom: 4,
  },
  description: {
    opacity: 0.7,
  },

  // CollectionCard skeleton styles
  collectionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    padding: 20,
    gap: 8,
  },
  subtitle: {
    opacity: 0.6,
  },

  // SessionCard skeleton styles
  sessionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    height: 90,
    padding: 20,
  },
  sessionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    gap: 8,
  },

  // SwitchCard skeleton styles
  switchCard: {
    backgroundColor: 'rgba(40, 40, 40, 0.65)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3C3D40',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 