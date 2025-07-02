import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GradientButton } from './GradientButton';

interface SessionCardProps {
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  onButtonPress?: () => void;
  progress?: number;
  large?: boolean;
  duration?: string;
  description?: string;
  compact?: boolean;
  plays?: string;
  showBookmark?: boolean;
  style?: any;
}

export const SessionCard = ({ 
  title, 
  subtitle, 
  buttonLabel, 
  onButtonPress, 
  progress, 
  large, 
  duration, 
  description, 
  compact, 
  plays, 
  showBookmark, 
  style
}: SessionCardProps) => (
  <TouchableOpacity 
    style={[styles.sessionCard, large && styles.sessionCardLarge, compact && styles.sessionCardCompact, style]}
    onPress={onButtonPress}
    activeOpacity={0.7}
  >
    <View style={[
      styles.sessionCardContent,
      compact && styles.sessionCardContentCompact,
      large && styles.sessionCardContentNoPadding,
      large && { flexDirection: 'column', alignItems: 'flex-start', paddingBottom: 0 }
    ]}>
      {!large && (
        <View style={[styles.sessionCardIcon, compact && styles.sessionCardIconCompact, large && { marginRight: 0, marginBottom: 12 }]}>
        <Text style={{fontSize: large ? 28 : compact ? 20 : 22, color: '#fff', opacity: 0.8}}>▶</Text>
      </View>
      )}
      <View style={[large ? { width: '100%' } : { flex: 1 }]}>
        <Text style={[styles.sessionCardTitle, large && styles.sessionCardTitleLarge, compact && styles.sessionCardTitleCompact]}>{title}</Text>
        {subtitle && <Text style={styles.sessionCardSubtitle}>{subtitle}</Text>}
        {description && <Text style={styles.sessionCardDescription}>{description}</Text>}
        {large && duration && (
          <Text style={[styles.sessionCardDuration, { marginLeft: 0, marginTop: 6 }]}>{duration}</Text>
        )}
      </View>
      {duration && !compact && !large && <Text style={styles.sessionCardDuration}>{duration}</Text>}
    </View>
    {progress !== undefined && !compact && (
      <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${progress * 100}%` }]} /></View>
    )}
    {large && (
      <View style={{ marginTop: 16, width: '100%' }}>
        <GradientButton title={buttonLabel || ''} onPress={onButtonPress} />
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  sessionCard: {
    backgroundColor: 'rgba(40, 40, 40, 0.65)',
    borderRadius: 18,
    marginBottom: 20,
    padding: 0,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    // Shadow for Android
    elevation: 12,
  },
  sessionCardLarge: {
    padding: 18,
  },
  sessionCardLargeNoContentPadding: {
    padding: 18,
  },
  sessionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    paddingBottom: 10,
  },
  sessionCardContentNoPadding: {
    padding: 0,
  },
  sessionCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sessionCardTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'SF Pro Display Regular',
  },
  sessionCardTitleLarge: {
    fontSize: 22,
    fontFamily: 'SF Pro Display Regular',
    marginBottom: 4,
  },
  sessionCardSubtitle: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 2,
  },
  sessionCardDescription: {
    color: '#888',
    fontSize: 16,
    marginTop: 6,
  },
  sessionCardDuration: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  sessionCardButton: {
    backgroundColor: '#111',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 7,
    marginLeft: 12,
  },
  sessionCardButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#222',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#01b4d4',
  },
  sessionCardCompact: {
    padding: 0,
    marginBottom: 0,
    marginTop: 0,
    borderRadius: 14,
  },
  sessionCardContentCompact: {
    padding: 14,
    paddingBottom: 10,
  },
  sessionCardIconCompact: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  sessionCardTitleCompact: {
    fontSize: 18,
    fontFamily: 'SF Pro Display Regular',
  },
}); 