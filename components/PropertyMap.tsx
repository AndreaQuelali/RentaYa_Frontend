import React from "react";
import { View, Text, Linking, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

interface PropertyMapProps {
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  city?: string | null;
}

export default function PropertyMap({
  latitude,
  longitude,
  address,
  city,
}: PropertyMapProps) {
  const hasCoordinates =
    latitude !== null &&
    longitude !== null &&
    latitude !== undefined &&
    longitude !== undefined;
  const hasAddress = address && address.trim() !== "";

  const openInMaps = () => {
    if (hasCoordinates) {
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url);
    } else if (hasAddress) {
      const fullAddress = city
        ? `${address}, ${city}, Cochabamba, Bolivia`
        : `${address}, Cochabamba, Bolivia`;
      const encodedAddress = encodeURIComponent(fullAddress);
      const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      Linking.openURL(url);
    }
  };

  // Si no hay ni coordenadas ni dirección
  if (!hasCoordinates && !hasAddress) {
    return (
      <View className="mt-4">
        <Text className="text-base font-bold mb-2">Ubicación</Text>
        <View className="h-32 bg-gray-100 rounded-xl items-center justify-center border border-gray-200">
          <Ionicons name="location-outline" size={32} color="#9CA3AF" />
          <Text className="text-sm text-gray-500 mt-2">
            Ubicación no disponible
          </Text>
        </View>
      </View>
    );
  }

  const displayAddress = hasAddress ? address : `${latitude}, ${longitude}`;
  const coordinatesText = hasCoordinates
    ? `${Number(latitude).toFixed(6)}, ${Number(longitude).toFixed(6)}`
    : null;

  return (
    <View className="mt-4">
      <Text className="text-lg font-bold mb-2">Ubicación</Text>

      <View className="bg-white rounded-xl overflow-hidden border border-gray-200">
        {/* Sección visual del mapa */}
        {hasCoordinates ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ height: 200, width: "100%" }}
            initialRegion={{
              latitude: Number(latitude),
              longitude: Number(longitude),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{ latitude: Number(latitude), longitude: Number(longitude) }}
              title={city || "Ubicación"}
              description={displayAddress || undefined}
            />
          </MapView>
        ) : (
          <View
            className="h-40 items-center justify-center"
            style={{ backgroundColor: "#FFF5F3" }}
          >
            <View className="items-center">
              {/* Icono de ubicación grande */}
              <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-3 shadow-lg">
                <Ionicons name="location" size={32} color="#fff" />
              </View>

              {/* Dirección */}
              <Text className="text-base font-semibold text-gray-900 text-center px-4 mb-1">
                {displayAddress}
              </Text>

              {/* Ciudad */}
              {city && (
                <Text className="text-sm text-gray-600">{city}, Cochabamba</Text>
              )}
            </View>
          </View>
        )}

        {/* Información adicional y botón */}
        <View className="p-4 bg-white border-t border-gray-100">
       
          {/* Botón para abrir en Google Maps */}
          <Pressable
            onPress={openInMaps}
            className="bg-primary rounded-xl py-3.5 flex-row items-center justify-center active:opacity-80"
          >
            <Ionicons name="map" size={20} color="#fff" />
            <Text className="text-white font-semibold text-base ml-2">
              Abrir en Google Maps
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
