import { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import type { AVPlaybackStatus } from 'expo-av';

export function useAudioPlayer(uri: string) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSound = async () => {
      try {
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
            if (isMounted) setStatus(playbackStatus);
          }
        );

        soundRef.current = sound;
        setStatus(status);
        setIsLoading(false);
      } catch (err: any) {
        setError(err);
        setIsLoading(false);
      }
    };

    loadSound();

    return () => {
      isMounted = false;
      soundRef.current?.unloadAsync();
    };
  }, [uri]);

  const play = async () => {
    try {
      await soundRef.current?.playAsync();
    } catch (e) {
      console.warn('Play error:', e);
    }
  };

  const pause = async () => {
    try {
      await soundRef.current?.pauseAsync();
    } catch (e) {
      console.warn('Pause error:', e);
    }
  };

  const seekTo = async (positionMillis: number) => {
    try {
      await soundRef.current?.setPositionAsync(positionMillis);
    } catch (e) {
      console.warn('Seek error:', e);
    }
  };

  return { status, isLoading, error, play, pause, seekTo };
}
