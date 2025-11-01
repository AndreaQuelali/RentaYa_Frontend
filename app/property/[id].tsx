import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import { usePropertyDetail } from "@/hooks/properties/usePropertyDetail";
import {
  translateStatus,
  getOperationTypeSuffix,
  formatPrice,
  getStatusColorClasses,
} from "@/utils/propertyHelpers";
import {
  handleCall,
  handleEmail,
  handleWhatsApp,
} from "@/utils/contactHelpers";

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { property, loading, error, currentPhotoIndex, setCurrentPhotoIndex } =
    usePropertyDetail(id);
  const { goBack } = useNavigationHelper();

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
          onPress={goBack}
        >
          <Text className="text-white font-semibold">Volver</Text>
        </Pressable>
      </View>
    );
  }

  const statusColorClasses = getStatusColorClasses(property.status);
  const translatedStatus = translateStatus(property.status);

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center">
        <Pressable onPress={goBack} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text className="text-white font-semibold text-lg flex-1">
          Detalles de Propiedad
        </Text>
        <Pressable>
          <Ionicons name="heart-outline" size={24} color="white" />
        </Pressable>
      </View>

      <ScrollView className="flex-1">
        {property.propertyPhotos && property.propertyPhotos.length > 0 ? (
          <View>
            <Image
              source={{ uri: property.propertyPhotos[currentPhotoIndex].url }}
              className="w-full h-64"
              resizeMode="cover"
            />
            {property.propertyPhotos.length > 1 && (
              <View className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded-full">
                <Text className="text-white text-xs">
                  {currentPhotoIndex + 1} / {property.propertyPhotos.length}
                </Text>
              </View>
            )}
            {property.propertyPhotos.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="absolute bottom-2 left-0 right-0"
                contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
              >
                {property.propertyPhotos.map((photo, index) => (
                  <Pressable
                    key={photo.id}
                    onPress={() => setCurrentPhotoIndex(index)}
                  >
                    <Image
                      source={{ uri: photo.url }}
                      className={`w-16 h-16 rounded-lg ${index === currentPhotoIndex ? "border-2 border-white" : ""}`}
                    />
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        ) : (
          <View className="w-full h-64 bg-gray-200 items-center justify-center">
            <Ionicons name="image-outline" size={64} color="#9CA3AF" />
          </View>
        )}

        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-3xl font-bold text-gray-900">
                {formatPrice(property.price)}
              </Text>
              <Text className="text-gray-500 mt-1">
                {getOperationTypeSuffix(property.operationType)}
              </Text>
            </View>
            <View
              className={`px-4 py-2 rounded-full ${statusColorClasses.containerClass}`}
            >
              <Text className={`font-semibold ${statusColorClasses.textClass}`}>
                {translatedStatus}
              </Text>
            </View>
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {property.title}
          </Text>

          <View className="flex-row items-center mb-4">
            <Ionicons name="location" size={20} color="#D65E48" />
            <Text className="text-gray-600 ml-2">
              {property.address}, {property.city}
            </Text>
          </View>

          <View className="flex-row items-center bg-gray-50 rounded-xl p-4 mb-4">
            <View className="flex-1 items-center border-r border-gray-200">
              <Ionicons name="bed-outline" size={24} color="#D65E48" />
              <Text className="text-gray-900 font-semibold mt-1">
                {property.bedrooms}
              </Text>
              <Text className="text-gray-500 text-xs">Dormitorios</Text>
            </View>
            <View className="flex-1 items-center border-r border-gray-200">
              <Ionicons name="water-outline" size={24} color="#D65E48" />
              <Text className="text-gray-900 font-semibold mt-1">
                {property.bathrooms}
              </Text>
              <Text className="text-gray-500 text-xs">Baños</Text>
            </View>
            <View className="flex-1 items-center">
              <Ionicons name="resize-outline" size={24} color="#D65E48" />
              <Text className="text-gray-900 font-semibold mt-1">
                {property.areaM2}
              </Text>
              <Text className="text-gray-500 text-xs">m²</Text>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Descripción
            </Text>
            <Text className="text-gray-600 leading-6">
              {property.description}
            </Text>
          </View>

          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Propietario
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
                <Text className="text-gray-900 font-semibold">
                  {property.owner.fullName}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {property.owner.email}
                </Text>
              </View>
            </View>
          </View>

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
                <Text className="text-white font-semibold ml-2">WhatsApp</Text>
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
      </ScrollView>
    </View>
  );
}
