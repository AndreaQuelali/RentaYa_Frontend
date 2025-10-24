import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_CLIENT_ID } from '@/constants/constants';
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_CLIENT_ID,
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
};  
