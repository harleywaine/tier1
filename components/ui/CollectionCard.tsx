import { Lock } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';

interface CollectionCardProps {
  icon?: React.ComponentType<any>;
  title: string;
  sessions?: number;
  color?: string[];
  fullWidth?: boolean;
  hideIcon?: boolean;
  disabled?: boolean;
  completedSessions?: number;
  totalSessions?: number;
  showCompletion?: boolean;
  onPress?: () => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  icon: Icon,
  title,
  sessions,
  color,
  disabled = false,
  onPress,
  fullWidth = false,
  hideIcon = false,
  showCompletion = false,
  completedSessions = 0,
  totalSessions = 0,
}) => {
  const progress = totalSessions > 0 ? completedSessions / totalSessions : 0;
  
  return (
    <TouchableOpacity
      style={[
        styles.collectionCard,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {showCompletion && completedSessions !== undefined && totalSessions !== undefined && totalSessions > 0 && (
        <View style={styles.circularProgressContainer}>
          <Progress.Circle
            size={24}
            progress={progress}
            color="#22c55e"
            borderWidth={0}
            unfilledColor="#666"
            strokeCap="round"
            showsText={false}
            thickness={2}
          />
        </View>
      )}
      {Icon && !hideIcon ? (
        <View style={styles.iconCircle}>
          <Icon size={28} color={disabled ? "#666" : "#ffffff"} weight="light" />
        </View>
      ) : null}
      <View style={styles.textContainer}>
        <Text style={[
          styles.collectionTitle,
          disabled && styles.collectionTitleDisabled
        ]}>{title}</Text>
        {sessions !== undefined && (
          <Text style={[
            styles.collectionSubtitle,
            disabled && styles.collectionSubtitleDisabled
          ]}>
            {sessions} sessions
          </Text>
        )}
      </View>
      
      {disabled && (
        <View style={styles.lockOverlay}>
          <Lock size={20} color="#ffffff" weight="light" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  collectionCard: {
    width: 240,
    height: 100,
    backgroundColor: '#2C2D30',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3C3D40',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    marginRight: 0,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.4,
    backgroundColor: '#0a0a0a',
    borderColor: '#333',
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
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 2,
  },
  collectionSubtitle: {
    color: '#aaa',
    fontSize: 15,
  },
  collectionTitleDisabled: {
    color: '#666',
  },
  collectionSubtitleDisabled: {
    color: '#444',
  },
  lockOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionContainer: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    width: '100%',
    marginBottom: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#444',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 2,
    minWidth: 2,
  },
  completionText: {
    color: '#22c55e',
    fontSize: 12,
    fontFamily: 'SFProDisplay-Medium',
    fontWeight: '500',
  },
  circularProgressContainer: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularProgressText: {
    position: 'absolute',
    color: '#22c55e',
    fontSize: 10,
    fontFamily: 'SFProDisplay-Bold',
    fontWeight: '700',
  },
}); 