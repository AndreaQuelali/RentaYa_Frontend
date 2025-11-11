import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import Logo from '@/assets/logo';
import { api } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface FavoriteItem {
  id: string;
  propertyId?: string;
  property?: {
    id: string;
    title: string;
    city?: string;
    address?: string;
    price: number;
    operationType: string;
    latitude?: number | null;
    longitude?: number | null;
    propertyPhotos?: { id: string; url: string }[];
  };
}

export default function FavoritesScreen() {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchFavorites = async () => {
        try {
          setLoading(true);
          setError(null);
          const res = await api.get('/api/properties/user/favorites');
          const data = res.data?.data || [];
          setItems(data);
        } catch (e: any) {
          console.error('Error fetching favorites:', e);
          setError('No se pudieron cargar tus favoritos');
        } finally {
          setLoading(false);
        }
      };
      fetchFavorites();
    }, [])
  );

  const handleOpen = (propertyId: string) => {
    router.push(`/property/${propertyId}`);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
        <Logo size={20} />
        <Text className="text-white font-semibold text-lg">RentaYa</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-4 py-4">
          {loading && (
            <View className="mt-6 items-center justify-center">
              <ActivityIndicator size="large" color="#D65E48" />
              <Text className="text-gray-500 mt-2">Cargando favoritos...</Text>
            </View>
          )}

          {error && !loading && (
            <View className="mt-6 items-center justify-center bg-red-50 p-4 rounded-xl">
              <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
              <Text className="text-primary mt-2 text-center">{error}</Text>
            </View>
          )}

          {!loading && !error && items.length === 0 && (
            <View className="mt-6 items-center justify-center">
              <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
              <Text className="text-gray-500 mt-4 text-center">
                Aún no tienes propiedades favoritas
              </Text>
            </View>
          )}

          {!loading && !error && items.length > 0 && (
            <View className="flex-col">
              {items.map((fav) => {
                const p = fav.property;
                if (!p) return null;
                const firstPhoto = p.propertyPhotos && p.propertyPhotos.length > 0 ? p.propertyPhotos[0].url : undefined;
                const priceText = p.price ? `Bs ${p.price.toLocaleString('es-BO')}` : 'Precio no disponible';
                const tipoLabel: Record<string, string> = { RENT: 'Alquiler', SALE: 'Venta', ANTICRETICO: 'Anticrético', rent: 'Alquiler', sale: 'Venta', anticretico: 'Anticrético' };

                return (
                  <PropertyCard
                    key={p.id}
                    propertyId={p.id}
                    title={p.title}
                    imageUrl={firstPhoto}
                    price={priceText}
                    tipo={tipoLabel[p.operationType] || p.operationType}
                    ubicacion={p.city}
                    address={p.address}
                    favorited={true}
                    onToggleFavorite={(isFav) => {
                      // If user un-favorites from here, remove from list
                      if (!isFav) {
                        setItems((prev) => prev.filter((x) => x.property?.id !== p.id));
                      }
                    }}
                    onPress={() => handleOpen(p.id)}
                  />
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
