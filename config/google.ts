import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

export const configureGoogleSignIn = () => {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  const androidClientId = process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID;

  const config: any = {
    webClientId: webClientId,
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  };

  // En Android release, usar Android Client ID si está disponible
  if (Platform.OS === 'android' && androidClientId) {
    config.androidClientId = androidClientId;
    console.log('[Google Sign-In] Using Android Client ID for Android platform');
  } else {
    console.log('[Google Sign-In] Using Web Client ID only');
  }

  console.log('[Google Sign-In] Configuration:', {
    platform: Platform.OS,
    hasWebClientId: !!webClientId,
    hasAndroidClientId: !!androidClientId,
  });

  GoogleSignin.configure(config);
};
