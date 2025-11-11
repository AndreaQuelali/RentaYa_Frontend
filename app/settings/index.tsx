import React from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEditProfile } from '@/hooks/profile/use-edit-profile';

export default function EditProfileScreen() {
  const { fullName, setFullName, phone, setPhone, loading, handleSave } = useEditProfile();

  const onSave = async () => {
    const success = await handleSave();
    if (success) {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text className="text-white font-semibold text-lg">Editar perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 px-4 py-5">
        <View className="gap-4">
          <View>
            <Text className="text-gray-700 font-medium mb-2">Nombre completo</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Ingresa tu nombre completo"
              autoCapitalize="words"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Teléfono</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3"
              value={phone}
              onChangeText={setPhone}
              placeholder="Ingresa tu teléfono"
              keyboardType="phone-pad"
            />
          </View>

          <Pressable
            className="bg-primary rounded-xl py-3 items-center mt-4"
            onPress={onSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold">Guardar cambios</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}