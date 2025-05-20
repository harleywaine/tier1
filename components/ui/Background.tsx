import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

interface BackgroundProps {
  children: React.ReactNode;
}

export function Background({ children }: BackgroundProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#111113', '#232526']}
        style={StyleSheet.absoluteFill}
      />
      {/* SVG Grid Overlay */}
      <Svg
        height="100%"
        width="100%"
        style={[StyleSheet.absoluteFill, { opacity: 0.10 }]}
        pointerEvents="none"
      >
        {/* Vertical lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Line
            key={`v-${i}`}
            x1={(i * 20).toString()}
            y1="0"
            x2={(i * 20).toString()}
            y2="100%"
            stroke="#fff"
            strokeWidth="1"
          />
        ))}
        {/* Horizontal lines */}
        {Array.from({ length: 40 }).map((_, i) => (
          <Line
            key={`h-${i}`}
            x1="0"
            y1={(i * 20).toString()}
            x2="100%"
            y2={(i * 20).toString()}
            stroke="#fff"
            strokeWidth="1"
          />
        ))}
      </Svg>
      <BlurView
        intensity={2}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 