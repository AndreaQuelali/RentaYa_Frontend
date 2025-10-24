import { View, Text, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import Logo from '@/assets/logo';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function WelcomeScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(tabs)');
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <Logo/>
        <Text className="text-white mt-4">Cargando...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <View className="flex-1 items-center justify-center">
        <Logo/>
        <Text className="text-3xl font-medium tracking-tight text-white mt-3">RentaYa</Text>
      </View>
      <View className="px-6 pb-8 gap-3">
        <Link href="/(auth)/signin-options" asChild>
          <Pressable className="bg-black rounded-xl py-4 items-center">
            <Text className="text-white font-semibold">Iniciar sesión</Text>
          </Pressable>
        </Link>

        <View className="items-center">
          <Text className="text-white/80 text-sm">¿No tienes una cuenta?</Text>
        </View>

        <Link href="/(auth)/register" asChild>
          <Pressable className="pt-1 pb-10 items-center">
            <Text className="font-semibold text-white">Regístrate</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
