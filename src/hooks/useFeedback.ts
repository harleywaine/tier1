import { supabase } from '@/lib/supabase';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { useState } from 'react';

export interface FeedbackData {
  message: string;
  deviceInfo?: string;
  appVersion?: string;
}

export function useFeedback() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDeviceInfo = () => {
    const deviceInfo = {
      brand: Device.brand,
      modelName: Device.modelName,
      osName: Device.osName,
      osVersion: Device.osVersion,
      appVersion: Application.nativeApplicationVersion || 'Unknown',
      buildVersion: Application.nativeBuildVersion || 'Unknown',
    };
    
    return JSON.stringify(deviceInfo);
  };

  const submitFeedback = async (message: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (!message.trim()) {
        throw new Error('Feedback message cannot be empty');
      }

      if (message.trim().length < 5) {
        throw new Error('Feedback message must be at least 5 characters');
      }

      if (message.length > 500) {
        throw new Error('Feedback message cannot exceed 500 characters');
      }

      const deviceInfo = getDeviceInfo();
      const appVersion = Application.nativeApplicationVersion || 'Unknown';

      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          message: message.trim(),
          device_info: deviceInfo,
          app_version: appVersion,
        });

      if (error) throw error;

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitFeedback,
    loading,
    error,
  };
} 