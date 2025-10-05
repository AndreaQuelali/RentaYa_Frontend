import { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Logo from '@/assets/logo';

export default function VerifyIdentityScreen() {
  const [phone, setPhone] = useState('');

  return (
    <KeyboardAvoidingView className="flex-1 bg-primary" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-primary justify-end">
          <View className=" items-center justify-center my-auto">
            <Logo />
            <Text className="text-3xl font-medium tracking-tight text-white mt-3">RentaYa</Text>
          </View>

          <View className="bg-white rounded-t-2xl border border-gray-200 px-5 pt-12 pb-20 w-screen">
            <Text className="text-xl font-semibold text-center">Verifica tu identidad</Text>
            <Text className="text-center text-gray-500 mt-1 mb-4">Introduce tu número de teléfono para enviarte un código de verificación</Text>

            <View className="gap-2">
              <Text className="text-sm font-medium">Número telefónico</Text>
              <TextInput
                placeholder="Escribe aquí"
                keyboardType="phone-pad"
                className="border border-gray-200 rounded-xl px-4 py-3"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <Pressable className="bg-black rounded-xl py-4 items-center mt-6" onPress={() => router.push('code' as any)}>
              <Text className="text-white font-semibold">Enviar código</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
