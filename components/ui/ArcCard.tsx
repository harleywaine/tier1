import { getArcColorScheme } from '@/constants/ArcColors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ArcCardProps {
  name: string;
  title: string;
  description: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: any;
}

export const ArcCard = ({ name, title, description, onPress, children, style }: ArcCardProps) => {
  const colorScheme = getArcColorScheme(name);
  
  return (
    <TouchableOpacity
      style={[
        styles.arcCard, 
        { 
          backgroundColor: colorScheme.background,
          borderColor: colorScheme.border,
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.tagContainer}>
        <Text style={[
          styles.tag,
          {
            backgroundColor: colorScheme.tag,
            color: colorScheme.tagText,
          }
        ]}>
          {name.toUpperCase()}
        </Text>
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  arcCard: {
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  tagContainer: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  tag: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Bold',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontFamily: 'SFProDisplay-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Light',
    color: '#ccc',
    lineHeight: 22,
  },
}); 