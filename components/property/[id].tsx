import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const galleryHeight = 220;

const MOCK_ITEMS = [
  {
    id: '1',
    titulo: 'Casa en Zona Norte',
    ciudad: 'Zona Norte',
    descripcion:
      'Espaciosa casa con vista panorámica, ubicada en la exclusiva Zona Norte de Cochabamba. Cuenta con acabados de primera, cocina equipada y garaje.',
    tipoOperacion: 'alquiler',
    precio: '800',
    fotosInmueble: [
      { url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200' },
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200' },
      { url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200' },
    ],
  },
  {
    id: '2',
    titulo: 'Departamento en Centro',
    ciudad: 'Centro',
    descripcion:
      'Cómodo departamento cerca de todo. Ideal para profesionales. Edificio con seguridad 24/7.',
    tipoOperacion: 'anticretico',
    precio: '600',
    fotosInmueble: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200' },
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200' },
    ],
  },
];

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const item = useMemo(() => {
    return MOCK_ITEMS.find((x) => x.id === String(id)) || MOCK_ITEMS[0];
  }, [id]);

  const photos: string[] = useMemo(() => {
    return (item?.fotosInmueble || []).map((f: any) => f.url).filter(Boolean);
  }, [item]);

  const priceText = item?.precio ? `Bs ${item.precio}` : '—';
  const tipoText = item?.tipoOperacion ? item.tipoOperacion.charAt(0).toUpperCase() + item.tipoOperacion.slice(1) : '—';

  return (
    <View className="flex-1 bg-white">
      {/* Header with back */}
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-3">
        <Pressable onPress={() => router.back()} className="p-1 rounded-full bg-white/10">
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 pt-4">
          {/* Badge + favorite */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs px-2 py-1 bg-red-500 text-white rounded-md">{tipoText}</Text>
            <Ionicons name="heart-outline" size={20} color="#6B7280" />
          </View>

          {/* Gallery */}
          <View className="rounded-xl overflow-hidden bg-gray-100" style={{ height: galleryHeight }}>
            {photos.length > 0 ? (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={{ width }}
              >
                {photos.map((uri, idx) => (
                  <Image key={`${uri}-${idx}`} source={{ uri }} style={{ width, height: galleryHeight }} resizeMode="cover" />
                ))}
              </ScrollView>
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500">Galería de imágenes de la propiedad</Text>
              </View>
            )}
          </View>

          {/* Title + Price */}
          <View className="flex-row items-start justify-between mt-4">
            <View className="flex-1 pr-2">
              <Text className="text-base font-semibold" numberOfLines={2}>{item?.titulo || '—'}</Text>
              <Text className="text-xs text-gray-500 mt-1" numberOfLines={1}>Ubicación: {item?.ciudad || '—'}</Text>
            </View>
            <Text className="text-red-500 font-semibold">{priceText}/mes</Text>
          </View>

          {/* Description */}
          <View className="mt-4">
            <Text className="text-sm font-semibold mb-1">Descripción</Text>
            <Text className="text-sm text-gray-700 leading-5">
              {item?.descripcion || 'Sin descripción'}
            </Text>
          </View>

          {/* Map placeholder */}
          <View className="mt-4">
            <Text className="text-sm font-semibold mb-1">Ubicación</Text>
            <View className="h-28 bg-gray-200 rounded-xl items-center justify-center">
              <Text className="text-gray-600">Mapa interactivo de la propiedad</Text>
            </View>
          </View>

          {/* Owner info (estático) */}
          <View className="mt-6">
            <Text className="text-sm font-semibold mb-2">Información del propietario</Text>
            <View className="flex-row items-center gap-2 mb-1">
              <Ionicons name="person-outline" size={16} color="#11181C" />
              <Text>Maria Fuentes</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Ionicons name="call-outline" size={16} color="#11181C" />
              <Text>+591 60708090</Text>
            </View>

            <Pressable className="bg-black rounded-xl py-3 items-center mt-4">
              <Text className="text-white font-semibold">Enviar mensaje</Text>
            </Pressable>
            <Pressable className="border border-gray-300 rounded-xl py-3 items-center mt-2">
              <Text className="text-black font-semibold">Calificar propiedad</Text>
            </Pressable>
          </View>

          {/* Reviews (estático) */}
          <View className="mt-6">
            <Text className="text-sm font-semibold mb-2">Reseñas</Text>
            <View className="flex-row items-start gap-3 mb-3">
              <View className="w-8 h-8 rounded-full bg-purple-200 items-center justify-center">
                <Text className="text-purple-700 font-semibold">A</Text>
              </View>
              <View className="flex-1 border-b border-gray-200 pb-3">
                <Text className="text-xs font-semibold">Usuario demo 1</Text>
                <Text className="text-xs text-gray-600">Muy buen lugar, zona tranquila con acceso a supermercados...</Text>
              </View>
            </View>
            <View className="flex-row items-start gap-3">
              <View className="w-8 h-8 rounded-full bg-purple-200 items-center justify-center">
                <Text className="text-purple-700 font-semibold">A</Text>
              </View>
              <View className="flex-1 border-b border-gray-200 pb-3">
                <Text className="text-xs font-semibold">Usuario demo 2</Text>
                <Text className="text-xs text-gray-600">Muy buen lugar, zona tranquila con acceso a supermercados...</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
