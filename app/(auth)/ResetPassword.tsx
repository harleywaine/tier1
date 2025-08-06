import { Background } from '@/components/ui/Background';
import { GradientButton } from '@/components/ui/GradientButton';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { supabase } from '../../lib/supabase';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const baseFontSize = 16;
const rem = (size: number) => size * baseFontSize;

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'tier1://update-password',
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Background>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>TIER 1</Text>
              <Text style={styles.subtitle}>Check Your Email</Text>
            </View>
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Password Reset Email Sent</Text>
              <Text style={styles.successMessage}>
                We've sent a password reset link to {email}. Please check your email and follow the instructions to reset your password.
              </Text>
              <GradientButton
                title="Back to Sign In"
                onPress={() => router.replace('../SignIn')}
              />
            </View>
          </View>
        </SafeAreaView>
      </Background>
    );
  }

  return (
    <Background>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.container}>
                <View style={styles.header}>
                  <Text style={styles.title}>TIER 1</Text>
                  <Text style={styles.subtitle}>Reset Password</Text>
                </View>
                <View style={styles.form}>
                  <Text style={styles.description}>
                    Enter your email address and we'll send you a link to reset your password.
                  </Text>
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                  />
                  <GradientButton
                    title={loading ? 'Sending...' : 'Send Reset Link'}
                    onPress={loading ? undefined : handleResetPassword}
                  />
                  <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.link}>Back to Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    padding: 17,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    marginBottom: rem(3),
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    fontFamily: 'SFProDisplay-Light',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  description: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: rem(2),
    lineHeight: 24,
    fontFamily: 'SFProDisplay-Light',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: rem(2),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  link: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: rem(2),
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
  },
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: rem(1.5),
    textAlign: 'center',
  },
  successMessage: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: rem(3),
    lineHeight: 24,
    fontFamily: 'SFProDisplay-Light',
  },
}); 