import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return( <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: '#100e24' }}
        edges={Platform.OS === 'web' ? [] : ['top']}
      >
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
