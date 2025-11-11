import { View, Text, KeyboardAvoidingView, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import Logo from '@/assets/logo';
import { useEffect, useState } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { configureGoogleSignIn } from '../../config/google';
import { useAuth } from '@/hooks/auth/use-auth';

export default function SignInWithGoogleScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { googleLogin } = useAuth();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const signIn = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      
      let idToken =
        (response as any)?.idToken ??
        (response as any)?.data?.idToken ??
        (response as any)?.user?.idToken;

      if (!idToken) {
        try {
          const tokens = await GoogleSignin.getTokens();
          idToken = tokens?.idToken;
        } catch (e) {
          console.error('Error al obtener tokens de Google:', e);
        }
      }
      if (!idToken) {
        throw new Error('No se pudo obtener el token de ID de Google');
      }

      await googleLogin.mutateAsync( idToken );
      
    } catch (error: any) {
      console.error('Error en login:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Espera', 'Ya hay un login en progreso');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert(
          'Google Play Services no disponible',
          'Por favor instala o actualiza Google Play Services en tu dispositivo'
        );
      } else {
        Alert.alert(
          'Error al iniciar sesión',
          error.message || 'Ocurrió un error. Por favor verifica tu configuración.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-primary" behavior='padding'>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-primary justify-end">
          <View className=" items-center justify-center my-auto">
            <Logo />
            <Text className="text-3xl font-medium tracking-tight text-white mt-3">RentaYa</Text>
          </View>

          <View className="bg-white rounded-t-2xl border border-gray-200 px-5 pt-12 pb-20 w-screen">
            <Text className="text-xl font-semibold text-center mb-2">Iniciar sesión con Google</Text>
            <Text className="text-center text-gray-500 mb-4">
              {isLoading ? 'Iniciando sesión...' : 'Conecta tu cuenta de Google para continuar'}
            </Text>

            <Pressable 
              className={`bg-black rounded-xl py-4 items-center ${isLoading ? 'opacity-50' : ''}`}
              onPress={signIn}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold">
                {isLoading ? 'Cargando...' : 'Continuar con Google'}
              </Text>
            </Pressable>

            <Pressable 
              className="border border-black rounded-xl py-3 items-center mt-3"
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Text className="text-black font-semibold">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
