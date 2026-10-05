import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('./Riverside (2).png')} style={styles.Image} />

      <Text style={styles.texts}>Welcome back</Text>
      <Text style={styles.texts}>Login to continue</Text>

      <View style={styles.buttonContainer}>
        <TextInput
          style={styles.textarea}
          placeholder="Enter your email"
          placeholderTextColor="#100e24"
        />

        <TextInput
          style={styles.textarea}
          placeholder="Enter your password"
          placeholderTextColor="#100e24"
          secureTextEntry={true}
        />
      </View>

    <Link href= "/dashboard" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>LOGIN</Text>
            </Pressable>
            </Link>

      <Text style={styles.label}>Forgot Password?</Text>

      <Text style={styles.label}>
        Don't have an account?{' '}
        <Text style={{ color: 'white' }}>Sign up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100e24',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  Image: {
    borderRadius: 10,
    width: 200,
    height: 200,
    marginBottom: 50,
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
    width: '100%',
    maxWidth: 360,
    marginTop: 24,
  },

  label: {
    color: '#a199b8',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#a199b8',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  buttonText: {
    color: '#100e24',
    fontSize: 16,
    fontWeight: 'bold',
  },

  textarea: {
    backgroundColor: '#767483',
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
});