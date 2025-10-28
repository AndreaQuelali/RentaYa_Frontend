import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface PropertyCardProps {
  title: string;
  imageUrl?: string;
  price: string;
  tipo?: string;
}

export default function PropertyCard({ title, imageUrl, price, tipo }: PropertyCardProps) {
  return (
    <View className="w-[48%] bg-white border border-gray-200 rounded-xl p-3 mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xs px-2 py-1 bg-gray-100 rounded-full">{tipo ? tipo.charAt(0).toUpperCase() + tipo.slice(1) : '—'}</Text>
        <Ionicons name="heart-outline" size={18} color="#6B7280" />
      </View>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{ height: 96, borderRadius: 8 }} resizeMode="cover" className="w-full mb-2" />
      ) : (
        <View className="h-24 bg-gray-200 rounded-lg items-center justify-center mb-2">
          <Text className="text-gray-500 text-xs">Sin imagen</Text>
        </View>
      )}
      <Text className="text-xs text-gray-700 mb-1" numberOfLines={1}>{title}</Text>
      <Text className="text-base font-semibold">{price}</Text>
    </View>
  );
}
