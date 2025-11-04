import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePropertyDetail } from "@/hooks/properties/usePropertyDetail";
import { formatPrice } from "@/utils/propertyHelpers";
import { handleWhatsApp } from "@/utils/contactHelpers";

const { width } = Dimensions.get("window");
const galleryHeight = 220;

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { property, loading, error } = usePropertyDetail(id);

  const photos: string[] = useMemo(() => {
    return (property?.propertyPhotos || [])
      .map((f: any) => f.url)
      .filter(Boolean);
  }, [property]);

  const priceText = property?.price ? formatPrice(property.price) : "—";
  const tipoText = property?.operationType;

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#D65E48" />
        <Text className="text-gray-500 mt-2">Cargando detalles...</Text>
      </View>
    );
  }

  if (error || !property) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-4">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-red-500 mt-4 text-center">{error}</Text>
        <Pressable
          className="mt-4 bg-primary px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header with back */}
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="p-1 rounded-full bg-white/10"
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
        <Pressable className="p-1">
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-4 pt-4">
          {/* Gallery */}
          <View
            className="rounded-xl overflow-hidden bg-gray-100"
            style={{ height: galleryHeight }}
          >
            {photos.length > 0 ? (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={{ width }}
              >
                {photos.map((uri, idx) => (
                  <Image
                    key={`${uri}-${idx}`}
                    source={{ uri }}
                    style={{ width, height: galleryHeight }}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500">
                  Galería de imágenes de la propiedad
                </Text>
              </View>
            )}
            {/* Badge tipo operación */}
            {tipoText && (
              <View className="absolute top-3 left-3">
                <Text className="text-xs px-2 py-1 bg-red-500 text-white rounded-md font-semibold">
                  {tipoText}
                </Text>
              </View>
            )}
          </View>

          {/* Title + Price */}
          <View className="flex-row items-start justify-between mt-4">
            <View className="flex-1 pr-2">
              <Text className="text-xl font-bold" numberOfLines={2}>
                {property.title || "—"}
              </Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="location" size={18} color="#D65E48" />
                <Text
                  className="text-base text-gray-600 ml-1"
                  numberOfLines={1}
                >
                  {property.city || "—"}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-red-500">
                {priceText}
              </Text>
              <Text className="text-sm text-gray-500">/mes</Text>
            </View>
          </View>

          {/* Description */}
          <View className="mt-4">
            <Text className="text-base font-bold mb-2">Descripción</Text>
            <Text className="text-base text-gray-700 leading-6">
              {property.description || "Sin descripción"}
            </Text>
          </View>

          {/* Map placeholder */}
          <View className="mt-4">
            <Text className="text-base font-bold mb-2">Ubicación</Text>
            <View className="h-28 bg-gray-200 rounded-xl items-center justify-center">
              <Text className="text-base text-gray-600">
                Mapa interactivo de la propiedad
              </Text>
            </View>
          </View>

          {/* Owner info */}
          <View className="mt-6">
            <Text className="text-base font-bold mb-3">
              Información del propietario
            </Text>
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center gap-3 mb-3">
                <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                  <Ionicons name="person" size={20} color="#fff" />
                </View>
                <Text className="text-base font-medium flex-1">
                  {property.owner.fullName}
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                  <Ionicons name="call" size={20} color="#059669" />
                </View>
                <Text className="text-base text-gray-700">
                  {property.owner.phone}
                </Text>
              </View>
            </View>

            <Pressable
              className="bg-black rounded-xl py-4 items-center mt-4"
              onPress={() => handleWhatsApp(property.owner.phone)}
            >
              <Text className="text-white font-semibold text-base">
                Enviar mensaje
              </Text>
            </Pressable>
            <Pressable className="border border-gray-300 rounded-xl py-4 items-center mt-2">
              <Text className="text-black font-semibold text-base">
                Calificar propiedad
              </Text>
            </Pressable>
          </View>

          {/* Reviews (estático) */}
          {/* <View className="mt-6">
            <Text className="text-sm font-semibold mb-2">Reseñas</Text>
            <View className="flex-row items-start gap-3 mb-3">
              <View className="w-8 h-8 rounded-full bg-purple-200 items-center justify-center">
                <Text className="text-purple-700 font-semibold">A</Text>
              </View>
              <View className="flex-1 border-b border-gray-200 pb-3">
                <Text className="text-xs font-semibold">Usuario demo 1</Text>
                <Text className="text-xs text-gray-600">
                  Muy buen lugar, zona tranquila con acceso a supermercados...
                </Text>
              </View>
            </View>
            <View className="flex-row items-start gap-3">
              <View className="w-8 h-8 rounded-full bg-purple-200 items-center justify-center">
                <Text className="text-purple-700 font-semibold">A</Text>
              </View>
              <View className="flex-1 border-b border-gray-200 pb-3">
                <Text className="text-xs font-semibold">Usuario demo 2</Text>
                <Text className="text-xs text-gray-600">
                  Muy buen lugar, zona tranquila con acceso a supermercados...
                </Text>
              </View>
            </View>
          </View> */}
        </View>
      </ScrollView>
    </View>
  );
}
