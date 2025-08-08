import { Background } from '@/components/ui/Background';
import { GradientButton } from '@/components/ui/GradientButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { useFeedback } from '@/src/hooks/useFeedback';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const baseFontSize = 16; // Base font size for REM calculations
const rem = (size: number) => size * baseFontSize;

export default function AccountScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { submitFeedback, loading: feedbackLoading, error: feedbackError } = useFeedback();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setEmail(user?.email ?? null);
      setUserId(user?.id ?? null);
      
      // Get first and last name from user metadata (same as index.tsx)
      if (user?.user_metadata) {
        setFirstName(user.user_metadata.first_name || '');
        setLastName(user.user_metadata.last_name || '');
      }
    };
    fetchUser();
  }, []);

  const handleSaveProfile = async () => {
    if (!userId) return;
    
    setProfileLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName
        }
      });

      if (error) {
        Alert.alert('Error', 'Failed to update profile: ' + error.message);
      } else {
        Alert.alert('Success', 'Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

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

  const handleSubmitFeedback = async () => {
    const success = await submitFeedback(feedbackMessage);
    if (success) {
      setShowSuccessMessage(true);
      setFeedbackMessage('');
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'No email address found. Please contact support.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'tier1://update-password',
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert(
          'Password Reset Email Sent',
          `We've sent a password reset link to ${email}. Please check your email and follow the instructions to reset your password.`
        );
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            style={styles.container} 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
          >
          <View style={[styles.header, { paddingTop: rem(2.5) }]}>
            <View>
              <Text style={styles.title}>Account</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Profile Information</Text>
              {!isEditing ? (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.editActions}>
                  <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButton} disabled={profileLoading}>
                    <Text style={styles.saveButtonText}>{profileLoading ? 'Saving...' : 'Save'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{email ?? 'Loading...'}</Text>
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.label}>First Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter first name"
                  placeholderTextColor="#666"
                />
              ) : (
                <Text style={styles.value}>{firstName || 'Not set'}</Text>
              )}
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Last Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter last name"
                  placeholderTextColor="#666"
                />
              ) : (
                <Text style={styles.value}>{lastName || 'Not set'}</Text>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.resetPasswordButton} 
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text style={styles.resetPasswordText}>
                {loading ? 'Sending...' : 'Reset Password'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.signOutButton} 
            onPress={handleLogout}
            disabled={loading}
          >
            <Text style={styles.signOutButtonText}>
              {loading ? 'Signing out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>





          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Feedback</Text>
            <Text style={styles.feedbackDescription}>
              Help us improve by sharing your thoughts, suggestions, or reporting issues.
            </Text>
            
            {showSuccessMessage && (
              <View style={styles.successMessage}>
                <Text style={styles.successText}>Thank you for your feedback! We'll review it shortly.</Text>
                <TouchableOpacity onPress={handleCloseSuccessMessage} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {feedbackError && (
              <Text style={styles.errorText}>{feedbackError}</Text>
            )}
            
            <TextInput
              style={styles.feedbackInput}
              value={feedbackMessage}
              onChangeText={setFeedbackMessage}
              placeholder="Share your feedback, suggestions, or report issues..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
            />
            
            <View style={styles.feedbackFooter}>
              <Text style={styles.characterCount}>
                {feedbackMessage.length}/500
              </Text>
              <GradientButton
                title={feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
                onPress={handleSubmitFeedback}
                disabled={feedbackLoading || feedbackMessage.trim().length < 5}
              />
            </View>
                      </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 8.5,
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
  section: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'SFProDisplay-Regular',
    color: '#fff',
  },
  editButton: {
    color: '#007bff',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
  },
  input: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'SFProDisplay-Light',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 5,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
  },
  settingValue: {
    color: '#aaa',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Light',
  },
  signOutButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
    width: '100%',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
    fontWeight: '600',
  },
  feedbackDescription: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 20,
    fontFamily: 'SFProDisplay-Light',
    lineHeight: 20,
  },
  feedbackInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 100,
    marginBottom: 15,
  },
  feedbackFooter: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 15,
  },
  characterCount: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Light',
  },
  successMessage: {
    backgroundColor: '#1a3a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  successText: {
    color: '#22c55e',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    flex: 1,
  },
  closeButton: {
    marginLeft: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Bold',
    lineHeight: 18,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    marginBottom: 15,
  },
  resetPasswordButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  resetPasswordText: {
    color: '#007bff',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
  },
});
