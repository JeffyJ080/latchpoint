
import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 800;

  const player = useVideoPlayer(
    require('./Latchpoint resources/latchpoint_web_loop.mp4'),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.play();
    }
  );

  useEffect(() => {
    const subscription = player.addListener('statusChange', ({ status }) => {
      if (status === 'readyToPlay') {
        player.play();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  return (
    <View style={styles.container}>

      <VideoView
        player={player}
        style={styles.backgroundVideo}
        contentFit="cover"
        nativeControls={false}
        allowsPictureInPicture={false}
      />

      <BlurView
        intensity={40}
        tint="dark"
        style={styles.squareContainer}
      />

      <View
        style={[
          styles.content,
          {
            flexDirection: isDesktop ? 'row' : 'column',
          },
        ]}
      >
        <View style={styles.textSection}>
          <Text style={styles.welcomeMessage}>
            Welcome to LatchPoint
          </Text>

          <Text style={styles.subtitle}>
            Secure your digital world.
          </Text>

          <View style={styles.buttonContainer}>
            <Link href="/login" asChild>
              <Pressable
                style={styles.button}
              >
                <Text style={styles.buttonText}>LOGIN</Text>
              </Pressable>
            </Link>

            <Link href="/signup" asChild>
              <Pressable
                style={styles.button}
              >
                <Text style={styles.buttonText}>SIGN UP</Text>
              </Pressable>
            </Link>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#050B14',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
  },

  backgroundVideo: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },

  squareContainer: {
    position: 'absolute',
    width: '35%',
    height: '75%',
    left: 30,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1,
  },

  squareDesktop: {
    width: 650,
    height: '75%',
    left: 40,
    top: '12.5%',
  },

  squareMobile: {
    width: '92%',
    height: '85%',
    alignSelf: 'center',
  },

  content: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 24,
    gap: 40,
    zIndex: 2,
    right: 600,
  },

  textSection: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 16,
  },

  welcomeMessage: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#d5dbea',
    fontSize: 16,
    marginBottom: 16,
    position: 'relative',
  },

  buttonContainer: {
    gap: 30,
    left: 1,
  },

  button: {
    backgroundColor: '#f3f1ff',
    paddingVertical: 10,
    paddingHorizontal: 200,
    borderRadius: 50,
    width: '100%',
  },

  buttonText: {
    color: '#232125',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
