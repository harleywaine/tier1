import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';

export default function BlurTabBarBackground() {
  return (
    <View style={[StyleSheet.absoluteFill, { height: 95, paddingTop: 25, backgroundColor: '#000000' }]} />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
