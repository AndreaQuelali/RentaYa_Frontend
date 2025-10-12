import React from 'react';
import { View, Text, Switch, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMode } from '@/context/ModeContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { mode, toggle } = useMode();
  const isOwner = mode === 'owner';

  const onToggle = () => {
    toggle();
    (router as any).replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-white">
  
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
        <Ionicons name="home-outline" size={20} color="#fff" />
        <Text className="text-white font-semibold text-lg">RentaYa</Text>
      </View>

      <View className="px-4 py-5">
       
        <View className="flex-row items-center gap-3 mb-6">
          <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
            <Text className="text-gray-600 font-semibold">U</Text>
          </View>
          <View>
            <Text className="text-base font-semibold">Usuario Demo</Text>
            <Text className="text-gray-500 text-xs">userdemo@gmail.com</Text>
          </View>
        </View>

        <View className="mb-2">
          <Text className="text-gray-600 text-sm mb-2">Modo de usuario</Text>
          <View className="flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="person-circle-outline" size={18} color="#11181C" />
              <Text className="font-medium">{isOwner ? 'Propietario' : 'Usuario'}</Text>
            </View>
            <Switch value={isOwner} onValueChange={onToggle} />
          </View>
          <Text className="text-gray-500 text-xs mt-2">
            {isOwner
              ? 'Puedes publicar y administrar tus propiedades.'
              : 'Puedes buscar y contactar propietarios.'}
          </Text>
        </View>

        <View className="mt-6 gap-3">
          <Pressable className="flex-row items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="create-outline" size={18} />
              <Text>Editar perfil</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </Pressable>

          <Pressable className="flex-row items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="notifications-outline" size={18} />
              <Text>Notificaciones</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </Pressable>
        </View>

        <Pressable className="mt-8 border border-gray-300 rounded-xl py-3 items-center">
          <Text className="font-semibold">Cerrar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}
