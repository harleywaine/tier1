import { Background } from '@/components/ui/Background';
import { GradientButton } from '@/components/ui/GradientButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const baseFontSize = 16; // Base font size for REM calculations
const rem = (size: number) => size * baseFontSize;

export default function AccountScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setEmail(user?.email ?? null);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      console.log('Attempting to sign out...');

      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session ? 'exists' : 'none');

      if (!session) {
        console.log('No active session, redirecting to sign in...');
        router.replace('../SignIn');
        return;
      }

      const { error } = await supabase.auth.signOut();
      console.log('Sign out response:', error ? 'error' : 'success');

      if (error) {
        console.error('Sign out error:', error);
        Alert.alert('Error', error.message);
      } else {
        console.log('Sign out successful, redirecting...');
        router.replace('../SignIn');
      }
    } catch (err) {
      console.error('Unexpected error during sign out:', err);
      Alert.alert(
        'Network Error',
        'Unable to sign out. Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={[styles.header, { paddingTop: rem(2.5) }]}>
            <View>
              <Text style={styles.title}>Account</Text>
            </View>
          </View>
          <View style={styles.content}>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{email ?? 'Loading...'}</Text>
            </View>
            <GradientButton title="Account Settings" onPress={() => {}} />
            <SecondaryButton
              title={loading ? 'Signing out...' : 'Sign Out'}
              onPress={handleLogout}
            />
          </View>
        </View>
      </SafeAreaView>
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
    backgroundColor: '#000',
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
    fontFamily: 'SFProDisplay-Regular',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 2,
    fontFamily: 'SFProDisplay-Light',
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 2,
    fontFamily: 'SFProDisplay-Light',
  },
  value: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'SFProDisplay-Light',
  },
});
