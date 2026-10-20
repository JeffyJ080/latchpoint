import { useEffect, useState } from 'react';
import { StyleSheet, useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050B14',
  },

  video: {
    width: '100%',
    height: '100%',
  },

  buttonContinue: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 50,
    paddingHorizontal: 30,
    marginBottom: 280,
  },

  touchLayer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },

  messageContainer: {
    backgroundColor: 'rgba(43, 57, 70, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },

  message: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
