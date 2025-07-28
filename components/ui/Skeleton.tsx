import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  style 
}) => {
  const [opacity, setOpacity] = useState(0.3);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(prev => prev === 0.3 ? 0.7 : 0.3);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#2a2a2a',
  },
}); 