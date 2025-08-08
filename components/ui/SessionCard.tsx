import { CheckCircle, Heart, Play } from 'phosphor-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { GradientButton } from './GradientButton';

interface SessionCardProps {
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  onPress?: () => void;
  progress?: number;
  large?: boolean;
  duration?: string;
  description?: string;
  compact?: boolean;
  plays?: string;
  showBookmark?: boolean;
  style?: ViewStyle;
  completionStatus?: 'not_started' | 'started' | 'completed';
  hideCompletionIcon?: boolean;
  showHeartIcon?: boolean;
  isFavorited?: boolean;
  onHeartPress?: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  title,
  subtitle,
  buttonLabel,
  onPress,
  progress,
  large,
  duration,
  description,
  compact,
  plays,
  showBookmark,
  style,
  completionStatus = 'not_started',
  hideCompletionIcon = false,
  showHeartIcon = false,
  isFavorited = false,
  onHeartPress,
}) => {
  const renderCompletionIcon = () => {
    if (hideCompletionIcon) return null;
    
    switch (completionStatus) {
      case 'started':
        return <CheckCircle size={20} color="rgba(255, 255, 255, 0.7)" weight="fill" />;
      case 'completed':
        return <CheckCircle size={20} color="#4ade80" weight="fill" />;
      default:
        return <Play size={20} color="#fff" weight="fill" />;
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.sessionCard,
        large && styles.sessionCardLarge,
        compact && styles.sessionCardCompact,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.sessionCardContent,
          compact && styles.sessionCardContentCompact,
          large && styles.sessionCardContentNoPadding,
          large && {
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingBottom: 0,
          },
        ]}
      >
        {!large && (
          <View
            style={[
              styles.sessionCardIcon,
              compact && styles.sessionCardIconCompact,
              large && { marginRight: 0, marginBottom: 12 },
            ]}
          >
            <Text
              style={{
                fontSize: large ? 28 : compact ? 20 : 22,
                color: '#fff',
                opacity: 0.8,
              }}
            >
              ▶
            </Text>
          </View>
        )}
        <View style={large ? { width: '100%' } : { flex: 1 }}>
          <Text
            style={[
              styles.sessionCardTitle,
              large && styles.sessionCardTitleLarge,
              compact && styles.sessionCardTitleCompact,
            ]}
          >
            {title}
          </Text>
          {subtitle && <Text style={styles.sessionCardSubtitle}>{subtitle}</Text>}
          {description && (
            <Text style={styles.sessionCardDescription}>{description}</Text>
          )}
          {large && duration && (
            <Text
              style={[styles.sessionCardDuration, { marginLeft: 0, marginTop: 6 }]}
            >
              {duration}
            </Text>
          )}
        </View>
        {duration && !compact && !large && (
          <Text style={styles.sessionCardDuration}>{duration}</Text>
        )}
        {!hideCompletionIcon && completionStatus === 'started' && !large && (
          <View style={styles.completionIcon}>
            <CheckCircle size={20} color="rgba(255, 255, 255, 0.6)" weight="light" />
          </View>
        )}
        {!hideCompletionIcon && completionStatus === 'completed' && !large && (
          <View style={styles.completionIcon}>
            <CheckCircle size={20} color="#22c55e" weight="fill" />
          </View>
        )}
        {showHeartIcon && !large && (
          <TouchableOpacity 
            style={styles.heartIcon} 
            onPress={onHeartPress}
            activeOpacity={0.7}
          >
            <Heart 
              size={20} 
              color="#ffffff" 
              weight={isFavorited ? "fill" : "light"} 
            />
          </TouchableOpacity>
        )}
      </View>

      {progress !== undefined && !compact && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      )}

      {large && (
        <View style={{ marginTop: 16, width: '100%' }}>
          <GradientButton title={buttonLabel || ''} onPress={onPress} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  sessionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 0,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    height: 90,
  },
  sessionCardLarge: {
    padding: 18,
  },
  sessionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    height: '100%',
    justifyContent: 'center',
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
  progressBar: {
    height: 3,
    backgroundColor: '#222',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#01b4d4',
  },
  completionIcon: {
    position: 'absolute',
    top: 0,
    right: 10,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    position: 'absolute',
    top: 0,
    right: 10,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
