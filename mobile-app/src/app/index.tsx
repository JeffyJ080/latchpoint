
import { styles } from '@/hooks/use-color-scheme.web';
import { useEventListener } from 'expo';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

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

      {/* Full-screen intro video */}
      <VideoView
        player={player}
        style={styles.video}
        nativeControls={false}
        contentFit="cover"
      />

      {/* Transparent layer that detects clicks */}
      <Pressable style={styles.touchLayer}
      >
        {videoFinished && (
          <View style={styles.buttonContinue}>
            <Text>
             TAP TO CONTINUE
            </Text>
          </View>
        )}
      </Pressable>


    </View>
  );
}

