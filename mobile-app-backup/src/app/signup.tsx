import { Link } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { BlurView } from 'expo-blur';

export default function SignUpScreen() {
  return (
    <View style={styles.container}>

      <BlurView
        intensity={50}
        tint="dark"
        style={styles.squareContainer}
      />

      <View style={styles.container}>

        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.subtitle}>Sign up to get started</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#100e24"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#100e24"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Create a password"
          placeholderTextColor="#100e24"
          secureTextEntry={true}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          placeholderTextColor="#100e24"
          secureTextEntry={true}
        />

        <Link href="/login" style={styles.SignUpButton} asChild>
          <Pressable>
            <Text style={styles.buttonText}>SIGN UP</Text>
          </Pressable>
        </Link>

        <View style={styles.loginContainer}>
          <Text style={styles.normalText}>Already have an account?</Text>

          <Link href="/login" style={styles.loginText}>
            Login
          </Link>
        </View>
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
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#100e24',
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#e5deff',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  SignUpButton: {
    backgroundColor: '#c6baf1',
    borderRadius: 8,
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

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    gap: 5,
  },

  normalText: {
    color: '#ffffff',
  },

  loginText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

});