import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Logo from '@/assets/logo';


export default function RegisterScreen() {
  const [show, setShow] = useState(false);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primary"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-primary justify-end">
          <View className=" items-center justify-center my-auto">
            <Logo/>
            <Text className="text-3xl font-medium tracking-tight text-white mt-3">RentaYa</Text>
          </View>
      

        <View className="bg-white rounded-t-2xl border border-gray-200 px-5 pt-12 pb-20 w-screen">
          <Text className="text-xl font-semibold text-center mb-4">Registro de usuario</Text>

          <View className="gap-3">
            <View className="gap-2">
              <Text className="text-sm font-medium">Nombres</Text>
              <TextInput
                placeholder="Escribe aquí"
                className="border border-gray-200 rounded-xl px-4 py-3"
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium">Apellidos</Text>
              <TextInput
                placeholder="Escribe aquí"
                className="border border-gray-200 rounded-xl px-4 py-3"
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium">Correo electrónico</Text>
              <TextInput
                placeholder="Escribe aquí"
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-gray-200 rounded-xl px-4 py-3"
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium">Contraseña</Text>
              <View className="flex-row items-center border border-gray-200 rounded-xl px-2">
                <TextInput
                  placeholder="Escribe aquí"
                  secureTextEntry={!show}
                  className="flex-1 px-2 py-3"
                />
                <Pressable onPress={() => setShow((s: boolean) => !s)} className="p-2">
                  <Ionicons name={show ? 'eye' : 'eye-off'} size={20} />
                </Pressable>
              </View>
            </View>
          </View>

          <Pressable className="bg-black rounded-xl py-4 items-center mt-6" onPress={() => router.push('verify' as any)}>
            <Text className="text-white font-semibold">Registrar</Text>
          </Pressable>
          <View className="items-center mt-5">
          <Text className="text-gray-500 text-sm">¿Ya tienes cuenta?</Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="font-semibold text-secondary">Inicia sesión</Text>
            </Pressable>
          </Link>
        </View>
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  );
}
