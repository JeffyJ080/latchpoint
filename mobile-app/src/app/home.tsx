import BlurView from 'expo-blur/build/BlurView';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    
    <View style={styles.container}>

      <BlurView
        intensity={50}
        tint="dark"
        style={styles.squareContainer}
      />

      <View style={styles.buttonContainer}>

        <Text style={styles.welcomeMessage}>
          Welcome to Latchpoint
        </Text>

        <Link href= "/login" asChild>
        <Pressable onHoverIn ={() => setIsHovered(true)} onHoverOut={() => setIsHovered(false)} style={styles.button}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>
        </Link>

        <Link href="/signup" asChild>
        <Pressable onHoverIn ={() => setIsHovered(true)} onHoverOut={() => setIsHovered(false)} style={styles.button}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </Pressable>
        </Link>
      
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#050B14',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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

  Image:{
    position: 'absolute',
    borderRadius: 10,   
    height:'150%',
    marginBottom: 150,
  },

  welcomeMessage: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 50,
  },

  tagline: {
    fontSize: 16,
    marginTop: 10,
  },

  buttonContainer: {
    width: '80%',
    marginTop: 40,
  },

  button: {
    backgroundColor: '#e5deff',
    padding: 16,
    borderRadius: 50,
    marginBottom: 15,
    alignItems: 'center',
  },

  buttonText: {
    color: '#251c33',
    fontSize: 16,
    fontWeight: 'bold',
  },

});