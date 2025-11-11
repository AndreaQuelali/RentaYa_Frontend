import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';

export interface PropertyCardProps {
  propertyId: string;
  title: string;
  imageUrl?: string;
  price: string;
  tipo?: string;
  ubicacion?: string;
  address?: string;
  rating?: number;
  reviews?: number;
  onPress?: () => void;
  favorited?: boolean;
  onToggleFavorite?: (isFavorite: boolean) => void;
}

export default function PropertyCard({ 
  propertyId,
  title, 
  imageUrl, 
  price, 
  tipo,
  ubicacion,
  address,
  rating=4.8,
  reviews=6,
  onPress,
  favorited = false,
  onToggleFavorite,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(favorited);

  const handleToggleFavorite = async () => {
    try {
      await api.post(`/api/properties/${propertyId}/favorite`);
      setIsFavorite((prev) => {
        const next = !prev;
        onToggleFavorite?.(next);
        return next;
      });
    } catch (e) {
      console.error('Error toggling favorite:', e);
    }
  };

  return (
    <Pressable onPress={onPress} className="w-full bg-white rounded-2xl overflow-hidden mb-4 border border-gray-200">
      {/* Imagen con overlays */}
      <View className="w-full h-48 bg-gray-100">
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="w-full h-full bg-gray-100 items-center justify-center">
            <Text className="text-gray-700">Imagen de propiedad</Text>
          </View>
        )}

        {/* Badge tipo */}
        {tipo && (
          <View className="absolute top-3 left-3">
            <Text className="px-2 py-1 text-sm bg-primary text-white rounded-lg font-semibold">
              {tipo}
            </Text>
          </View>
        )}

        {/* Botón favorito */}
        <Pressable
          onPress={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleToggleFavorite();
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 items-center justify-center"
        >
          <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={20} color={isFavorite ? '#d65e48' : '#111827'}/>
        </Pressable>
      </View>

      {/* Contenido inferior */}
      <View className="px-4 py-3 bg-white">
        <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
          {title}
        </Text>
        <View className="flex-row items-center gap-2">
          <Ionicons name="star" size={18} color="#D65E48" />
          <Text className="text-base text-gray-600 mt-1">{rating} ({reviews})</Text>
        </View>
        </View>
        <Text className="text-xl font-bold text-primary mt-1">{price}</Text>
        <View className="flex-row items-center justify-between mt-1">
        <View className="flex-row items-center">
          <Ionicons name="location" size={18} color="#D65E48" />
          <Text
            className="text-base text-gray-600 ml-1"
          
          >
            {ubicacion || ""},
          </Text>
          <Text
            className="text-base text-gray-600 ml-1"
          
          >
            {address || ""}
          </Text>
        </View>
        </View>
      </View>
    </Pressable>
  );
}