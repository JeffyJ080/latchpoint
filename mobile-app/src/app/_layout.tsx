import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../context/AuthContext';

function AppRoutes() {
  const { session, ready } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const route = segments[0] as string | undefined;

  const isPublic =
    !route ||
    route === 'index' ||
    route === 'home' ||
    route === 'login' ||
    route === 'signup';

  const needsLogin = ready && !session && !isPublic;
  const needsDashboard = ready && !!session && isPublic;

  useEffect(() => {
    if (needsLogin) router.replace('/login');
    else if (needsDashboard) router.replace('/dashboard');
  }, [needsLogin, needsDashboard, router]);

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />

      {(!ready || needsLogin || needsDashboard) && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#100e24',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator color="#a78bfa" size="large" />
        </View>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: '#100e24' }}
        edges={Platform.OS === 'web' ? [] : ['top']}
      >
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}