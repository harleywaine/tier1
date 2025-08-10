import type { AVPlaybackStatus } from 'expo-av';
import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useAudioPlayer(uri: string) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  // Proper cleanup function
  const cleanupSound = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch (err) {
        console.warn('Error unloading sound:', err);
      } finally {
        soundRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    const loadSound = async () => {
      try {
        // Clean up any existing sound before loading new one
        await cleanupSound();

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { sound, status } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: false },
          playbackStatus => {
            if (isMountedRef.current) setStatus(playbackStatus);
          }
        );

        if (isMountedRef.current) {
          soundRef.current = sound;
          setStatus(status);
          setIsLoading(false);
          setError(null);
        } else {
          // Component unmounted during loading, cleanup immediately
          await sound.unloadAsync();
        }
      } catch (err: any) {
        if (isMountedRef.current) {
          setError(err);
          setIsLoading(false);
        }
      }
    };

    loadSound();

    return () => {
      isMountedRef.current = false;
      // Cleanup will be handled by the next loadSound call or component unmount
    };
  }, [uri, cleanupSound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanupSound();
    };
  }, [cleanupSound]);

  const play = async () => {
    if (!soundRef.current) {
      console.warn('No sound loaded');
      return;
    }
    
    try {
      await soundRef.current.playAsync();
    } catch (e) {
      console.warn('Play error:', e);
      setError(e instanceof Error ? e : new Error('Play failed'));
    }
  };

  const pause = async () => {
    if (!soundRef.current) {
      console.warn('No sound loaded');
      return;
    }
    
    try {
      await soundRef.current.pauseAsync();
    } catch (e) {
      console.warn('Pause error:', e);
      setError(e instanceof Error ? e : new Error('Pause failed'));
    }
  };

  const seekTo = async (positionMillis: number) => {
    if (!soundRef.current) {
      console.warn('No sound loaded');
      return;
    }
    
    try {
      await soundRef.current.setPositionAsync(positionMillis);
    } catch (e) {
      console.warn('Seek error:', e);
      setError(e instanceof Error ? e : new Error('Seek failed'));
    }
  };

  return { 
    status, 
    isLoading, 
    error, 
    play, 
    pause, 
    seekTo,
    cleanup: cleanupSound 
  };
}
