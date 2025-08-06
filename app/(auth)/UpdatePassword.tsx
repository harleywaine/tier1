import { Background } from '@/components/ui/Background';
import { GradientButton } from '@/components/ui/GradientButton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { supabase } from '../../lib/supabase';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const baseFontSize = 16;
const rem = (size: number) => size * baseFontSize;

export default function UpdatePassword() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Handle the password reset token from the URL
    const handlePasswordReset = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        Alert.alert('Error', 'Invalid or expired reset link. Please try again.');
        router.replace('../SignIn');
        return;
      }

      if (!data.session) {
        Alert.alert('Error', 'Invalid or expired reset link. Please try again.');
        router.replace('../SignIn');
        return;
      }
    };

    handlePasswordReset();
  }, []);

  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
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
              <Text style={styles.subtitle}>Password Updated</Text>
            </View>
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Password Successfully Updated</Text>
              <Text style={styles.successMessage}>
                Your password has been updated successfully. You can now sign in with your new password.
              </Text>
              <GradientButton
                title="Sign In"
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
                  <Text style={styles.subtitle}>Set New Password</Text>
                </View>
                <View style={styles.form}>
                  <Text style={styles.description}>
                    Enter your new password below.
                  </Text>
                  <TextInput
                    placeholder="New Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Confirm New Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={styles.input}
                  />
                  <GradientButton
                    title={loading ? 'Updating...' : 'Update Password'}
                    onPress={loading ? undefined : handleUpdatePassword}
                  />
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
    marginBottom: rem(1.5),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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