import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.quote}>Accelerate your Excellence</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  quote: {
    fontSize: 32,
    fontFamily: 'SFProDisplay-Bold',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 40,
  },
}); 