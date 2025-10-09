import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import Logo from "@/assets/logo";

export default function EnterCodeScreen() {
  const [code, setCode] = useState("");

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primary"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-primary justify-end">
          <View className=" items-center justify-center my-auto">
            <Logo />
            <Text className="text-3xl font-medium tracking-tight text-white mt-3">
              RentaYa
            </Text>
          </View>

          <View className="bg-white rounded-t-2xl border border-gray-200 px-5 pt-12 pb-20 w-screen">
            <Text className="text-xl font-semibold text-center mb-4">
              Introduce el código
            </Text>

            <View className="gap-2">
              <Text className="text-sm font-medium">Código</Text>
              <TextInput
                placeholder="Escribe aquí"
                keyboardType="number-pad"
                className="border border-gray-200 rounded-xl px-4 py-3"
                value={code}
                onChangeText={setCode}
              />
            </View>

            <Pressable
              className="mt-2 items-center"
              onPress={() => {
                /* TODO: Resend code */
              }}
            >
              <Text className="text-gray-500 text-xs">
                Volver a enviar código
              </Text>
            </Pressable>

            <Pressable
              className="bg-black rounded-xl py-4 items-center mt-6"
              onPress={() => router.push("preferences" as any)}
            >
              <Text className="text-white font-semibold">Comprobar</Text>
            </Pressable>

            <Pressable
              className="border border-black rounded-xl py-3 items-center mt-3"
              onPress={() => router.back()}
            >
              <Text className="text-black font-semibold">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
