import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  return (

    <View style={styles.container}>

      <Image
        source={require('./Latchpoint resources/motherbaord wallpaper.png')}
        style={styles.Image}
      />

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
            placeholder="Enter your email"
            placeholderTextColor="#232230"
          />

          <TextInput
            style={styles.textarea}
            placeholder="Enter your password"
            placeholderTextColor="#232230"
            secureTextEntry={true}
          />
        </View>

        <Link href="/dashboard" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </Pressable>
        </Link>

        <Text style={styles.label}>Forgot Password?</Text>

        <Link href="/signup" asChild>
          <Pressable style={styles.Plainbutton}>
            <Text style= {styles.label}> Don't have an account?{' '}
            <Text style={{ color: 'white' }}>Sign up</Text>
            </Text>
          </Pressable>
        </Link>

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
    width :'80%',
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