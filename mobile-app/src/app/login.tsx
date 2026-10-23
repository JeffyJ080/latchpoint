import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLogin } from '../hooks/useLogin';

export default function LoginScreen() {
  const login = useLogin();
  return (

    <View style={styles.container}>

      <BlurView
        intensity={50}
        tint="dark"
        style={styles.squareContainer}
      />

      <Text style={styles.texts}>Welcome back</Text>
      <Text style={styles.texts}>Login to continue</Text>

      <View style={styles.buttonContainer}>
        <TextInput
          style={styles.textarea}
          placeholder="Enter your username"
          placeholderTextColor="#232230"
          value={login.username}
          onChangeText={login.setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!login.busy && !login.challengeId}
        />

        <TextInput
          style={styles.textarea}
          placeholder="Enter your password"
          placeholderTextColor="#232230"
          secureTextEntry={true}
          value={login.password}
          onChangeText={login.setPassword}
          editable={!login.busy && !login.challengeId}
        />
      </View>

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

      {/* Future work: public account registration is not implemented. */}
      <Text style={styles.label}>
        Account registration — coming later.
        {'\n'}Contact your administrator for access.
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050B14',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  squareContainer: {
    position: 'absolute',
    width: '100%',
    height: '90%',
    left: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 0,
    overflow: 'hidden',
  },

  Image: {
    position: 'absolute',
    borderRadius: 10,
    height: '150%',
    marginBottom: 150,
  },

  texts: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 24,
  },

  buttonContainer: {
    width: '80%',
    marginTop: 40,
  },

  label: {
    color: '#7d7a86',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#c6baf1',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    width: '80%',
  },

  buttonText: {
    color: '#292838',
    fontSize: 16,
    fontWeight: 'bold',
  },

  textarea: {
    backgroundColor: '#e5deff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#100e24',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    paddingBottom: 12,
    marginBottom: 12,
  },

  Plainbutton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
  },

});