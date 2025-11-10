import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Pressable,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AddressMapPreviewProps {
  address?: string;
  city?: string;
  onCoordinatesFound?: (lat: number, lng: number) => void;
}

export default function AddressMapPreview({
  address,
  city,
  onCoordinatesFound,
}: AddressMapPreviewProps) {
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || !city) {
      setCoordinates(null);
      setError(null);
      return;
    }

    const geocodeAddress = async () => {
      setLoading(true);
      setError(null);

      try {
        // Construir la dirección completa
        const fullAddress = `${address}, ${city}, Cochabamba, Bolivia`;
        const encodedAddress = encodeURIComponent(fullAddress);

        // Usar la API de geocodificación de Google Maps
        const apiKey = "AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8";
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setCoordinates({ lat: location.lat, lng: location.lng });

          // Notificar las coordenadas encontradas
          if (onCoordinatesFound) {
            onCoordinatesFound(location.lat, location.lng);
          }
        } else {
          setError("No se pudo encontrar la ubicación. Verifica la dirección.");
        }
      } catch (err) {
        console.error("Error geocoding:", err);
        setError("Error al buscar la ubicación");
      } finally {
        setLoading(false);
      }
    };

    // Debounce la búsqueda
    const timeoutId = setTimeout(() => {
      geocodeAddress();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [address, city, onCoordinatesFound]);

  const openInMaps = () => {
    if (coordinates) {
      const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
      Linking.openURL(url);
    }
  };

  if (!address || !city) {
    return (
      <View className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
        <View className="flex-row items-center mb-2">
          <Ionicons name="location-outline" size={20} color="#6B7280" />
          <Text className="text-sm font-medium text-gray-700 ml-2">
            Previsualización del mapa
          </Text>
        </View>
        <Text className="text-xs text-gray-500">
          Ingresa la dirección y provincia para ver la ubicación en el mapa
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="mt-4 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <View className="items-center">
          <ActivityIndicator size="small" color="#D65E48" />
          <Text className="text-sm text-gray-600 mt-2">
            Buscando ubicación...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="mt-4 bg-red-50 rounded-xl p-4 border border-red-200">
        <View className="flex-row items-center">
          <Ionicons name="alert-circle-outline" size={20} color="#EF4444" />
          <Text className="text-sm text-red-600 ml-2 flex-1">{error}</Text>
        </View>
        <Text className="text-xs text-red-500 mt-1">
          Verifica que la dirección esté escrita correctamente
        </Text>
      </View>
    );
  }

  if (!coordinates) {
    return null;
  }

  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=15&size=600x300&markers=color:red%7C${coordinates.lat},${coordinates.lng}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;

  return (
    <View className="mt-4">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Ionicons name="location" size={20} color="#D65E48" />
          <Text className="text-sm font-medium text-gray-900 ml-2">
            Previsualización del mapa
          </Text>
        </View>
        <View className="bg-green-100 px-2 py-1 rounded-full">
          <Text className="text-xs text-green-700 font-medium">
            ✓ Ubicación encontrada
          </Text>
        </View>
      </View>

      <Pressable
        onPress={openInMaps}
        className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200"
      >
        <View className="w-full h-40 bg-gray-200">
          <Image
            source={{ uri: staticMapUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View className="flex-row items-center justify-between p-3 bg-white">
          <View className="flex-row items-center flex-1">
            <Ionicons name="navigate-circle" size={18} color="#059669" />
            <Text
              className="text-xs text-gray-600 ml-2 flex-1"
              numberOfLines={2}
            >
              {address}, {city}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-xs text-primary font-medium mr-1">
              Ver en Google Maps
            </Text>
            <Ionicons name="chevron-forward" size={14} color="#D65E48" />
          </View>
        </View>
      </Pressable>

      <Text className="text-xs text-gray-500 mt-2">
        Coordenadas: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
      </Text>
    </View>
  );
}
