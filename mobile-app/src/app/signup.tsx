import { Link } from 'expo-router';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function SignUpScreen() {
  return (
    <>

    <View style={styles.container}>

    <Image source={require('./Riverside (2).png')} style={styles.Image} />

      <Text style={styles.title}>
        Create Account
      </Text>

      <Text style={styles.subtitle}>
        Sign up to get started
      </Text>

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

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>
          SIGN UP
        </Text>
      </Pressable>

      <View style={styles.loginContainer}>

        <Text style={styles.normalText}>
          Already have an account?
        </Text>

        <Link href="/login" style={styles.loginText}>
          Login
        </Link>

      </View>

    </View>

    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#100e24',
    justifyContent: 'center',
    padding: 24,
  },

  Image: {
    borderRadius: 10,
    width: 200,
    height: 200,
    marginBottom: 50,
    alignSelf: 'center',
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
    backgroundColor: '#767483',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#100e24',
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#3f3950',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#ffffff',
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