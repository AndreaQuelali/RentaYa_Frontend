import { View, Text, KeyboardAvoidingView, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import Logo from '@/assets/logo';
import { useEffect, useState } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { configureGoogleSignIn } from '../../config/google';
import { useAuth } from '@/hooks/auth/use-auth';
import { Ionicons } from '@expo/vector-icons';

type Role = 'rentante' | 'arrendador' | null;

export default function SignInWithGoogleScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const { googleLogin } = useAuth();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const signIn = async () => {
    if (!selectedRole) {
      Alert.alert('Selecciona un rol', 'Por favor selecciona si eres rentante o arrendador');
      return;
    }

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

      await googleLogin.mutateAsync({ token: idToken, role: selectedRole });
      
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
            {showRoleSelection ? (
              <>
                <Text className="text-2xl font-bold text-center mb-2">¿Cómo quieres usar RentaYa?</Text>
                <Text className="text-gray-600 text-center mb-8">Selecciona el tipo de cuenta que mejor se adapte a ti</Text>

                <View className="gap-4 mb-6">
                  <Pressable
                    onPress={() => {
                      setSelectedRole('rentante');
                    }}
                    className={`border-2 rounded-2xl p-6 ${selectedRole === 'rentante' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}
                  >
                    <View className="flex-row items-center gap-4">
                      <View className={`w-14 h-14 rounded-full items-center justify-center ${selectedRole === 'rentante' ? 'bg-primary' : 'bg-gray-100'}`}>
                        <Ionicons name="search-outline" size={28} color={selectedRole === 'rentante' ? '#fff' : '#6B7280'} />
                      </View>
                      <View className="flex-1">
                        <Text className={`text-xl font-bold mb-1 ${selectedRole === 'rentante' ? 'text-primary' : 'text-gray-900'}`}>
                          Rentante
                        </Text>
                        <Text className="text-gray-600 text-sm">
                          Busco propiedades para alquilar o comprar
                        </Text>
                      </View>
                      {selectedRole === 'rentante' && (
                        <Ionicons name="checkmark-circle" size={24} color="#D65E48" />
                      )}
                    </View>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setSelectedRole('arrendador');
                    }}
                    className={`border-2 rounded-2xl p-6 ${selectedRole === 'arrendador' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}
                  >
                    <View className="flex-row items-center gap-4">
                      <View className={`w-14 h-14 rounded-full items-center justify-center ${selectedRole === 'arrendador' ? 'bg-primary' : 'bg-gray-100'}`}>
                        <Ionicons name="home-outline" size={28} color={selectedRole === 'arrendador' ? '#fff' : '#6B7280'} />
                      </View>
                      <View className="flex-1">
                        <Text className={`text-xl font-bold mb-1 ${selectedRole === 'arrendador' ? 'text-primary' : 'text-gray-900'}`}>
                          Arrendador
                        </Text>
                        <Text className="text-gray-600 text-sm">
                          Tengo propiedades para publicar y administrar
                        </Text>
                      </View>
                      {selectedRole === 'arrendador' && (
                        <Ionicons name="checkmark-circle" size={24} color="#D65E48" />
                      )}
                    </View>
                  </Pressable>
                </View>

                <Pressable 
                  className={`bg-black rounded-xl py-4 items-center mb-3 ${!selectedRole || isLoading ? 'opacity-50' : ''}`}
                  onPress={() => setShowRoleSelection(false)}
                  disabled={!selectedRole || isLoading}
                >
                  <Text className="text-white font-semibold">Continuar</Text>
                </Pressable>

                <Pressable 
                  className="border border-black rounded-xl py-3 items-center"
                  onPress={() => router.back()}
                  disabled={isLoading}
                >
                  <Text className="text-black font-semibold">Cancelar</Text>
                </Pressable>
              </>
            ) : (
              <>
                <View className="flex-row items-center justify-between mb-6">
                  <Pressable onPress={() => setShowRoleSelection(true)} disabled={isLoading}>
                    <Ionicons name="arrow-back" size={24} color="#11181C" />
                  </Pressable>
                  <Text className="text-xl font-semibold">Iniciar sesión con Google</Text>
                  <View style={{ width: 24 }} />
                </View>

                <View className="mb-6">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Ionicons 
                      name={selectedRole === 'rentante' ? 'search' : 'home'} 
                      size={18} 
                      color="#D65E48" 
                    />
                    <Text className="text-primary font-semibold">
                      {selectedRole === 'rentante' ? 'Rentante' : 'Arrendador'}
                    </Text>
                  </View>
                  <Text className="text-center text-gray-500 mb-4">
                    {isLoading ? 'Iniciando sesión...' : 'Conecta tu cuenta de Google para continuar'}
                  </Text>
                </View>

                <Pressable 
                  className={`bg-black rounded-xl py-4 items-center flex-row justify-center gap-2 ${isLoading ? 'opacity-50' : ''}`}
                  onPress={signIn}
                  disabled={isLoading}
                >
                  <Ionicons name="logo-google" size={20} color="#fff" />
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
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
