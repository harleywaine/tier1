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

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      console.log('Attempting sign up with:', { email });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'tier1://',
        },
      });

      console.log('Sign up response:', { data, error });

      if (error) {
        console.error('Sign up error:', error);
        Alert.alert('Sign up error', error.message);
      } else {
        console.log('Sign up successful:', data);
        Alert.alert('Success', 'Account created successfully!');
        router.replace('../SignIn');
      }
    } catch (err) {
      console.error('Unexpected error during sign up:', err);
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
            <Text style={styles.subtitle}>Create Account</Text>
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
              title={loading ? 'Creating account...' : 'Sign Up'}
              onPress={loading ? undefined : handleSignUp}
            />
            <TouchableOpacity onPress={() => router.push('../SignIn')}>
              <Text style={styles.link}>Already have an account? Sign In</Text>
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
