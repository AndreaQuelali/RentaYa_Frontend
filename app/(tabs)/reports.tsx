import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReportsScreen() {
  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
        <Ionicons name="home-outline" size={20} color="#fff" />
        <Text className="text-white font-semibold text-lg">RentaYa</Text>
      </View>

      <View className="p-4">
        <Text className="text-xl font-semibold mb-2">Reportes</Text>
        <Text className="text-gray-500">Aquí verás métricas y reportes de tus propiedades.</Text>
      </View>
    </View>
  );
}
