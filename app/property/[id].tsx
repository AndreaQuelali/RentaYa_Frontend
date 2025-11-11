import React, { useMemo, useState } from "react";
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
import PropertyMap from "@/components/PropertyMap";
import {
  handleCall,
  handleEmail,
  handleWhatsApp,
} from "@/utils/contactHelpers";
import { api } from "@/lib/api";

const { width } = Dimensions.get("window");
const galleryHeight = 220;

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { property, loading, error } = usePropertyDetail(id);
  const [isFavorite, setIsFavorite] = useState(false);

  const photos: string[] = useMemo(() => {
    return (property?.propertyPhotos || [])
      .map((f: any) => f.url)
      .filter(Boolean);
  }, [property]);

  const priceText = property?.price ? formatPrice(property.price) : "—";
  const tipoText = property?.operationType;

  React.useEffect(() => {
    const loadFav = async () => {
      try {
        if (!id) return;
        const favRes = await api.get("/api/properties/user/favorites");
        const favs = favRes.data?.data || [];
        const found = favs.some((f: any) => (f.propertyId ? f.propertyId : f.property?.id) === id);
        setIsFavorite(found);
      } catch (e) {
        // ignore if unauthenticated
      }
    };
    loadFav();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      await api.post(`/api/properties/${id}/favorite`);
      setIsFavorite((prev) => !prev);
    } catch (e) {
      console.error("Error toggling favorite: ", e);
    }
  };

  const handleConsultaSubmit = (message: string) => {
    // Por ahora solo mostramos un alert, luego conectaremos con el backend
    alert(`Consulta enviada correctamente\nMensaje: ${message}`);
    console.log("Consulta:", message);
    // Aquí se guardará en el estado local para mostrarlo en la sección de mensajes
  };

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
        <Pressable className="p-1" onPress={toggleFavorite}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color="#fff" />
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
                <Text className="text-sm px-2 py-1 bg-primary text-white rounded-md font-semibold">
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
                  {property.city || "—"},
                </Text>
                <Text
                  className="text-base text-gray-600 ml-1"
                  numberOfLines={1}
                >
                  {property.address || "—"}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-primary">
                {priceText}
              </Text>
             
            </View>
          </View>

          {/* Description */}
          <View className="mt-4">
            <Text className="text-lg font-bold mb-2">Descripción</Text>
            <Text className="text-base text-gray-700 leading-6">
              {property.description || "Sin descripción"}
            </Text>
          </View>

          {/* Map */}
          <PropertyMap
            latitude={property.latitude}
            longitude={property.longitude}
            address={property.address}
            city={property.city}
          />
          {/* Info Owner*/}
          <View className="bg-gray-50 rounded-xl py-4 mb-4">
          <Text className="text-lg font-bold mb-3">
              Información del propietario
            </Text>
            <View className="flex-row items-center">
              {property.owner.profilePhoto ? (
                <Image 
                  source={{ uri: property.owner.profilePhoto }}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                  <Text className="text-white font-bold text-lg">
                    {property.owner.fullName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="ml-3 flex-1">
                <Text className="text-gray-900 font-semibold text-lg">{property.owner.fullName}</Text>
                <Text className="text-gray-500 text-base">{property.owner.email}</Text>
                <Text className="text-gray-500 text-base">{property.owner.phone}</Text>
              </View>
            </View>
          </View>

          {/* Owner info */}
          <View>
            
            <View className="gap-3 mb-6">
              <Pressable
                className="bg-primary rounded-xl py-4 flex-row items-center justify-center"
                onPress={() => handleCall(property.owner.phone)}
              >
                <Ionicons name="call" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Llamar</Text>
              </Pressable>
              <View className="flex-row gap-3">
                <Pressable
                  className="flex-1 bg-green-500 rounded-xl py-4 flex-row items-center justify-center"
                  onPress={() => handleWhatsApp(property.owner.phone)}
                >
                  <Ionicons name="logo-whatsapp" size={20} color="white" />
                  <Text className="text-white font-semibold ml-2">
                    WhatsApp
                  </Text>
                </Pressable>
                <Pressable
                  className="flex-1 bg-blue-500 rounded-xl py-4 flex-row items-center justify-center"
                  onPress={() => handleEmail(property.owner.email)}
                >
                  <Ionicons name="mail" size={20} color="white" />
                  <Text className="text-white font-semibold ml-2">Email</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Reviews (estático) */}
          {/* <View>
            <Text className="text-lg font-semibold mb-2">Reseñas</Text>
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-8 h-8 rounded-full bg-purple-200 items-center justify-center">
                <Text className="text-purple-700 font-semibold">A</Text>
              </View>
              <View className="flex-1 border-b border-gray-200 pb-3">
                <Text className="text-sm font-semibold">Usuario demo 1</Text>
                <Text className="text-sm text-gray-600">
                  Muy buen lugar, zona tranquila con acceso a supermercados...
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center">
                <Text className="text-gray-700 font-semibold">A</Text>
              </View>
              <View className="flex-1 border-b border-gray-200 pb-3">
                <Text className="text-sm font-semibold">Usuario demo 2</Text>
                <Text className="text-sm text-gray-600">
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
