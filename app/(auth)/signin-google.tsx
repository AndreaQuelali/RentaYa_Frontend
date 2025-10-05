import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import Logo from '@/assets/logo';

export default function SignInWithGoogleScreen() {
  return (
    <KeyboardAvoidingView className="flex-1 bg-primary" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-primary justify-end">
          <View className=" items-center justify-center my-auto">
            <Logo />
            <Text className="text-3xl font-medium tracking-tight text-white mt-3">RentaYa</Text>
          </View>

          <View className="bg-white rounded-t-2xl border border-gray-200 px-5 pt-12 pb-20 w-screen">
            <Text className="text-xl font-semibold text-center mb-2">Iniciar sesión con Google</Text>
            <Text className="text-center text-gray-500 mb-4">Pantalla de ejemplo para flujo de Google. Aquí iría la integración con Google Auth.</Text>

            <Pressable className="bg-black rounded-xl py-4 items-center" onPress={() => {/* TODO: Integrar Google Sign-In */}}>
              <Text className="text-white font-semibold">Continuar con Google</Text>
            </Pressable>

            <Pressable className="border border-black rounded-xl py-3 items-center mt-3" onPress={() => router.back()}>
              <Text className="text-black font-semibold">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
