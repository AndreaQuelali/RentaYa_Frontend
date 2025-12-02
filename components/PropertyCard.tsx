import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';
import { formatPrice } from '@/utils/propertyHelpers';

export interface PropertyCardProps {
  propertyId: string;
  title: string;
  imageUrl?: string;
  price: number;
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
  rating,
  reviews,
  onPress,
  favorited = false,
  onToggleFavorite,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(favorited);
  const [avgRating, setAvgRating] = useState<number | undefined>(rating);
  const [reviewsCount, setReviewsCount] = useState<number | undefined>(reviews);

  useEffect(() => {
    // If rating info not provided, fetch reviews for this property and compute
    if (avgRating == null || reviewsCount == null) {
      (async () => {
        try {
          const res = await api.get(`/api/reviews/property/${propertyId}`);
          const list: any[] = res.data?.data || [];
          const count = list.length;
          const avg = count > 0 ? Number((list.reduce((s, r) => s + (r.rating || 0), 0) / count).toFixed(1)) : 0;
          setAvgRating(avg);
          setReviewsCount(count);
        } catch (e) {
          // Ignore errors silently; keep defaults
        }
      })();
    }
  }, [propertyId]);

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
          <Text className="text-base text-gray-600 mt-1">{(avgRating ?? 0).toFixed(1)} ({reviewsCount ?? 0})</Text>
        </View>
        </View>
        <Text className="text-xl font-bold text-primary mt-1">{formatPrice(price)}</Text>
        <View className="flex-row items-center justify-between mt-1">
        <View className="flex-row items-center">
          <Ionicons name="location" size={18} color="#D65E48" />
          <Text
            className="text-base text-gray-600 ml-1"
          
          >
            {ubicacion || ""}
          </Text>
        </View>
        </View>
      </View>
    </Pressable>
  );
}