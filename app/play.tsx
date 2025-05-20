import { Background } from '@/components/ui/Background';
import { Audio } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Pause, Play, SkipBack, SkipForward } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const baseFontSize = 16;
const rem = (size: number) => size * baseFontSize;

export default function PlayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [sound, setSound] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [position, setPosition] = useState<number>(0);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  async function playSound() {
    try {
      const audioUrl = params.audioUrl as string;
      if (!audioUrl) {
        console.error('No audio URL provided');
        return;
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }
      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis || 0);
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
      setIsPlaying(false);
    }
  }

  async function pauseSound() {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }

  async function seekTo(position: number) {
    if (sound) {
      await sound.setPositionAsync(position);
    }
  }

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Placeholder image or param
  const imageUrl = params.imageUrl as string || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';
  const author = params.author as string || 'Glenn Harrold';

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Custom Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="#e0f6ff" size={26} weight="bold" />
          </TouchableOpacity>
          {/* Session Image Card */}
          <View style={styles.imageCard}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
          </View>
          {/* Title & Author */}
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{params.title || 'Session'}</Text>
            <Text style={styles.author}>{author}</Text>
          </View>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(position / (duration || 1)) * 100}%` }
                ]} 
              />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration || 0)}</Text>
            </View>
          </View>
          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity onPress={() => seekTo(Math.max(0, position - 10000))} style={styles.skipButton}>
              <SkipBack color="#e0f6ff" size={32} weight="bold" />
            </TouchableOpacity>
            <LinearGradient
              colors={['#0b4f6c', '#01b4d4', '#03d2b3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.playPauseButton}
            >
              <TouchableOpacity onPress={isPlaying ? pauseSound : playSound} style={styles.playPauseTouchable}>
                {isPlaying ? <Pause color="#fff" size={40} weight="fill" /> : <Play color="#fff" size={40} weight="fill" />}
              </TouchableOpacity>
            </LinearGradient>
            <TouchableOpacity onPress={() => seekTo(Math.min(duration || 0, position + 10000))} style={styles.skipButton}>
              <SkipForward color="#e0f6ff" size={32} weight="bold" />
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
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    padding: 17,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  imageCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#222',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: '#aaa',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 12,
  },
  progressBar: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 3,
    marginBottom: 6,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#01b4d4',
    borderRadius: 3,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  timeText: {
    color: '#e0f6ff',
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.7,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 36,
    marginTop: 24,
    marginBottom: 0,
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderRadius: 32,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseButton: {
    borderRadius: 40,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseTouchable: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export const unstable_settings = {
  initialRouteName: 'play',
};

export const options = {
  headerShown: false,
}; 