import { Background } from '@/components/ui/Background';
import { GradientButton } from '@/components/ui/GradientButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const baseFontSize = 16; // Base font size for REM calculations
const rem = (size: number) => size * baseFontSize;

export default function AccountScreen() {
  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={[styles.header, { paddingTop: rem(2.5) }]}>
            <View>
              <Text style={styles.title}>ACCOUNT</Text>
              <Text style={styles.subtitle}>Settings</Text>
            </View>
          </View>
          <View style={styles.content}>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>Alex Johnson</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>alex@email.com</Text>
            </View>
            <GradientButton title="Account Settings" onPress={() => {}} />
            <SecondaryButton title="Log Out" onPress={() => {}} />
          </View>
        </View>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    padding: 17,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    paddingBottom: rem(4),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 2,
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 2,
  },
  value: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 