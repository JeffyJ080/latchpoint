import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <Image  source={require('./Riverside (2).png')}  style={styles.Image}/>

      <View style={styles.buttonContainer}>

        <Link href= "/login" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>
        </Link>

        <Link href="/signup" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </Pressable>
        </Link>
        
      </View>

    </View>
  );
}


//all css code 
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#100e24',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  Image:{
    borderRadius: 10,
    width: 200,
    height: 200,
    marginBottom: 50,
  },

  tagline: {
    fontSize: 16,
    marginTop: 10,
  },

  buttonContainer: {
    width: '100%',
    marginTop: 40,
  },

  button: {
    backgroundColor: '#3f3950',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});