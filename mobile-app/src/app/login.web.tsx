import { Link } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { BlurView } from 'expo-blur';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect } from 'react';
import { useLogin } from '../hooks/useLogin';



export default function SignUpScreen() {

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

  const login = useLogin();

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
        intensity={50}
        tint="dark"
        style={styles.squareContainer}
      />

      <View style={styles.buttonContainer}>

        <Text style={styles.title}>Welcome back</Text>

        <Text style={styles.subtitle}>Login to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#100e24"
          value={login.username}
          onChangeText={login.setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!login.busy && !login.challengeId}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#100e24"
          secureTextEntry={true}
          value={login.password}
          onChangeText={login.setPassword}
          editable={!login.busy && !login.challengeId}
        />

        {login.challengeId && (
          <>
            <Text style={{ color: 'white', marginTop: 12, marginBottom: 8 }}>
              Enter your authenticator code
            </Text>

            <TextInput
              value={login.code}
              onChangeText={(value) =>
                login.setCode(value.replace(/[^0-9]/g, '').slice(0, 6))
              }
              placeholder="123456"
              placeholderTextColor="#777"
              keyboardType="number-pad"
              maxLength={6}
              editable={!login.busy}
              style={{
                backgroundColor: '#e5deff',
                color: '#100e24',
                padding: 14,
                borderRadius: 8,
                marginBottom: 12,
              }}
            />

            <Pressable
              onPress={login.startAgain}
              disabled={login.busy}
              style={{ paddingVertical: 10 }}
            >
              <Text style={{ color: '#c6baf1', textAlign: 'center' }}>
                Start again
              </Text>
            </Pressable>
          </>
        )}

        {!!login.error && (
          <Text
            accessibilityRole="alert"
            style={{ color: '#ff9098', marginVertical: 12, textAlign: 'center' }}
          >
            {login.error}
          </Text>
        )}

        <Pressable
          onPress={() => void login.submit()}
          disabled={login.busy}
          style={{
            backgroundColor: '#c6baf1',
            borderRadius: 8,
            padding: 14,
            alignItems: 'center',
            opacity: login.busy ? 0.6 : 1,
            marginTop: 12,
          }}
        >
          <Text style={{ color: '#292838', fontWeight: 'bold' }}>
            {login.busy
              ? 'PLEASE WAIT…'
              : login.challengeId
                ? 'VERIFY CODE'
                : 'LOGIN'}
          </Text>
        </Pressable>

        <Text style={styles.label}>Forgot Password?</Text>

        <Link href="/signup" asChild>
          <Pressable style={styles.Plainbutton}>
            <Text style={styles.label}> Don't have an account?{' '}
              <Text style={{ color: 'white' }}>Sign up</Text>
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  buttonContainer: {
    width: 500,
    left: 90,
  },

  backgroundVideo: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },

  label: {
    color: '#7d7a86',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'center',
  },

  squareContainer: {
    position: 'absolute',
    width: '35%',
    height: '90%',
    left: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 0,
    overflow: 'hidden',
  },

  title: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 35,
  },

  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#e5deff',
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#100e24',
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#e5deff',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },

  LoginButton: {
    backgroundColor: '#c6baf1',
    borderRadius: 15,
    paddingVertical: 7,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  buttonText: {
    color: '#292838',
    fontSize: 16,
    fontWeight: 'bold',
  },

  Plainbutton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
  },

});