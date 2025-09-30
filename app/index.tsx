import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Logo from '@/assets/logo';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-primary">
      <View className="flex-1 items-center justify-center">
        <Logo/>
        <h2 className="text-3xl font-medium tracking-tight text-white mt-3">RentaYa</h2>
      </View>
      <View className="px-6 pb-8 gap-3">
        <Link href="/(auth)/login" asChild>
          <Pressable className="bg-black rounded-xl py-4 items-center">
            <Text className="text-white font-semibold">Iniciar sesión</Text>
          </Pressable>
        </Link>

        <View className="items-center">
          <Text className="text-white/80 text-sm">¿No tienes una cuenta?</Text>
        </View>

        <Link href="/(auth)/register" asChild>
          <Pressable className="py-1 items-center">
            <Text className="font-semibold text-white">Regístrate</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
