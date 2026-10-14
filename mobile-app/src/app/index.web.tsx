import { styles } from '@/hooks/use-color-scheme.web';
import { useEventListener } from 'expo';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import { View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [videoFinished, setVideoFinished] = useState(false);

  const player = useVideoPlayer(
    require('./Latchpoint resources/latchpoint_web_intro.mp4'),
    (player) => {
      player.loop = false;
      player.muted = true;
      player.play();
    }
  );

  // Detect when the video finishes playing
  useEventListener(player, 'statusChange', ({status}) => {
    if (status === 'readyToPlay'){
        player.play();
    }
  });


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

    </View>
  );
}

