
import { useEventListener } from 'expo';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [videoFinished, setVideoFinished] = useState(false);

  const player = useVideoPlayer(
    require('./Latchpoint resources/Latchpoint-intro.mp4'),
    (player) => {
      player.loop = false;
      player.muted = true;
      player.play();
    }
  );
  
useEventListener(player, 'playToEnd', () => {
    router.replace('/home');
  });
  
  return (
    <View style={styles.container}>

      <VideoView
        player={player}
        style={styles.video}
        nativeControls={false}
        contentFit="cover"
      />


    </View>
  );
}

const styles = StyleSheet.create({

container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
})

