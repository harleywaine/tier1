import { Background } from '@/components/ui/Background';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

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
    
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="#e0f6ff" size={26} weight="light" />
          </TouchableOpacity>

          <Text style={styles.title}>Account Settings</Text>
          
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
                  <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButton} disabled={loading}>
                    <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save'}</Text>
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
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingValue}>On</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingValue}>Enabled</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Auto-play</Text>
              <Text style={styles.settingValue}>Off</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data & Privacy</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Export Data</Text>
              <Text style={styles.settingValue}>→</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Delete Account</Text>
              <Text style={styles.settingValue}>→</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  scrollContainer: { 
    padding: 17, 
    paddingTop: 80, 
    paddingBottom: 40 
  },
  backButton: {
    position: 'absolute',
    top: 32,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(20, 24, 32, 0.7)',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  title: { 
    fontSize: 28, 
    fontWeight: '400', 
    color: '#fff', 
    marginBottom: 30 
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#fff', 
  },
  editButton: {
    color: '#007bff',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  cancelButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
  },
  saveButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#007bff',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'SFProDisplay-Light',
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
  },
  input: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
});

export const options = { headerShown: false }; 