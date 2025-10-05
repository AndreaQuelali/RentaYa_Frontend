import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Logo from '@/assets/logo';
import { Ionicons } from '@expo/vector-icons';

export default function SignInOptionsScreen() {
  return (
    <KeyboardAvoidingView className="flex-1 bg-primary" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-primary justify-end">
          <View className="items-center justify-center my-auto">
            <Logo />
            <Text className="text-3xl font-medium tracking-tight text-white mt-3">RentaYa</Text>
          </View>

          <View className="bg-white rounded-t-2xl border border-gray-200 px-5 pt-12 pb-20 w-screen">
            <Text className="text-xl font-semibold text-center mb-5">Iniciar sesión con</Text>

            <Pressable
              className="border border-gray-300 rounded-xl py-3 items-center flex-row justify-center gap-2"
              onPress={() => (router as any).push('signin-google')}
            >
              <Ionicons name="logo-google" size={18} />
              <Text className="font-semibold">Google</Text>
            </Pressable>

            <Pressable
              className="bg-black rounded-xl py-3 items-center mt-3 flex-row justify-center gap-2"
              onPress={() => (router as any).push('login')}
            >
            <Logo size={18}/>
              <Text className="text-white font-semibold">RentaYa</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
