import { Background } from '@/components/ui/Background';
import { GradientButton } from '@/components/ui/GradientButton';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const baseFontSize = 16;
const rem = (size: number) => size * baseFontSize;

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Attempting sign in with:', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log('Sign in response:', { data, error });

      if (error) {
        console.error('Sign in error:', error);
        Alert.alert('Sign in error', error.message);
      } else {
        console.log('Sign in successful:', data);
        router.replace('/(tabs)');
      }
    } catch (err) {
      console.error('Unexpected error during sign in:', err);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>TIER 1</Text>
            <Text style={styles.subtitle}>Sign In</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <GradientButton
              title={loading ? 'Signing in...' : 'Sign In'}
              onPress={loading ? undefined : handleSignIn}
            />
            <TouchableOpacity onPress={() => router.push('../SignUp')}>
              <Text style={styles.link}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: rem(1.5),
    paddingTop: rem(1.5),
  },
  header: {
    marginTop: rem(6),
    marginBottom: rem(1),
    paddingHorizontal: rem(1.5),
    alignItems: 'center',
  },
  title: {
    fontSize: rem(2),
    fontFamily: 'SFProDisplay-Bold',
    color: '#fff',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: rem(1.25),
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: rem(0.5),
    textAlign: 'center',
    fontFamily: 'SFProDisplay-Light',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: rem(0.5),
    padding: rem(1),
    marginBottom: rem(1),
    color: '#fff',
    fontSize: rem(1),
  },
  link: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: rem(0.875),
    marginTop: rem(1),
    fontFamily: 'SFProDisplay-Light',
  },
});
