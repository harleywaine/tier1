import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface TabSelectorProps<T extends string> {
  tabs: { label: string; value: T }[];
  value: T;
  onChange: (val: T) => void;
  style?: ViewStyle;
}

export const TabSelector = <T extends string>({ tabs, value, onChange, style }: TabSelectorProps<T>) => (
  <View style={[styles.tabSelectorContainer, style]}>
    {tabs.map(tab => (
      <TouchableOpacity
        key={tab.value}
        style={[styles.tabButton, value === tab.value && styles.tabButtonActive]}
        onPress={() => onChange(tab.value)}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabButtonText, value === tab.value && styles.tabButtonTextActive]}>{tab.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  tabSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    marginBottom: 14,
    marginTop: 8,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tabButtonText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#fff',
  },
}); 