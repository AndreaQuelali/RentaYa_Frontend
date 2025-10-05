import React from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '@/assets/logo';

function PropertyCard({ title, subtitle, price }: { title: string; subtitle: string; price: string }) {
  return (
    <View className="w-[48%] bg-white border border-gray-200 rounded-xl p-3 mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xs px-2 py-1 bg-gray-100 rounded-full">Alquiler</Text>
        <Ionicons name="heart-outline" size={18} color="#6B7280" />
      </View>
      <View className="h-24 bg-gray-200 rounded-lg items-center justify-center mb-2">
        <Text className="text-gray-500 text-xs">Imagen de propiedad</Text>
      </View>
      <Text className="text-xs text-gray-700 mb-1" numberOfLines={1}>{title}</Text>
      <Text className="text-xs text-gray-500 mb-2" numberOfLines={1}>{subtitle}</Text>
      <Text className="text-base font-semibold">{price}</Text>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
        <Logo size={20}/>
        <Text className="text-white font-semibold text-lg">RentaYa</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-4 py-4">
          <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-2">
            <Ionicons name="search-outline" size={18} color="#6B7280" />
            <TextInput placeholder="Buscar" className="flex-1 px-2 py-1" />
            <Pressable className="ml-2 p-2">
              <Ionicons name="options-outline" size={18} color="#11181C" />
            </Pressable>
          </View>

          <View className="mt-4 flex-row flex-wrap justify-between">
            <PropertyCard title="Casa en Zona Norte" subtitle="Imagen de propiedad 1" price="Bs 800/mes" />
            <PropertyCard title="Departamento en Centro" subtitle="Imagen de propiedad 2" price="Bs 600/mes" />
            <PropertyCard title="Casa en Zona Norte" subtitle="Imagen de propiedad 1" price="Bs 800/mes" />
            <PropertyCard title="Departamento en Centro" subtitle="Imagen de propiedad 2" price="Bs 600/mes" />
            <PropertyCard title="Casa en Zona Norte" subtitle="Imagen de propiedad 1" price="Bs 800/mes" />
            <PropertyCard title="Departamento en Centro" subtitle="Imagen de propiedad 2" price="Bs 600/mes" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
