import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface PropertyCardProps {
  title: string;
  imageUrl?: string;
  price: string;
  tipo?: string;
  ubicacion?: string;
  area?: number;
  onPress?: () => void;
}

export default function PropertyCard({ 
  title, 
  imageUrl, 
  price, 
  tipo,
  ubicacion,
  area,
  onPress 
}: PropertyCardProps) {
  return (
    <Pressable 
      onPress={onPress}
      className="w-[48%] bg-white border border-gray-200 rounded-xl overflow-hidden mb-4"
    >
      {/* Imagen */}
      {imageUrl ? (
        <Image 
          source={{ uri: imageUrl }} 
          className="w-full h-32"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-32 bg-gray-200 items-center justify-center">
          <Ionicons name="image-outline" size={32} color="#9CA3AF" />
          <Text className="text-gray-400 text-xs mt-1">Sin imagen</Text>
        </View>
      )}

      {/* Contenido */}
      <View className="p-3">
        {/* Tipo y favorito */}
        <View className="flex-row justify-between items-center mb-2">
          {tipo && (
            <View className="bg-primary/10 px-2 py-1 rounded-full">
              <Text className="text-xs text-primary font-medium">
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </Text>
            </View>
          )}
          <Ionicons name="heart-outline" size={18} color="#6B7280" />
        </View>

        {/* Título */}
        <Text 
          className="text-sm font-semibold text-gray-900 mb-1" 
          numberOfLines={2}
        >
          {title}
        </Text>

        {/* Ubicación */}
        {ubicacion && (
          <View className="flex-row items-center mb-2">
            <Ionicons name="location-outline" size={12} color="#6B7280" />
            <Text className="text-xs text-gray-500 ml-1" numberOfLines={1}>
              {ubicacion}
            </Text>
          </View>
        )}

        {/* Área */}
        {area && (
          <Text className="text-xs text-gray-500 mb-2">
            {area} m²
          </Text>
        )}

        {/* Precio */}
        <Text className="text-base font-bold text-gray-900">
          {price}
        </Text>
      </View>
    </Pressable>
  );
}