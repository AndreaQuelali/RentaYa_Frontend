import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AddressMapPreviewProps {
  address?: string;
  city?: string;
  onCoordinatesFound?: (lat: number, lng: number) => void;
  onShowMapPicker?: (show: boolean) => void;
  currentLatitude?: number;
  currentLongitude?: number;
}

export default function AddressMapPreview({
  address,
  city,
  onCoordinatesFound,
  onShowMapPicker,
  currentLatitude,
  currentLongitude,
}: AddressMapPreviewProps) {
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(
    currentLatitude && currentLongitude
      ? { lat: currentLatitude, lng: currentLongitude }
      : null
  );
  const [error, setError] = useState<string | null>(null);

  // No hacer geocodificación automática, solo usar coordenadas existentes
  useEffect(() => {
    if (currentLatitude && currentLongitude) {
      setCoordinates({ lat: currentLatitude, lng: currentLongitude });
      setError(null);
    } else {
      setCoordinates(null);
      // Solo mostrar error si hay dirección pero no coordenadas
      if (address && city) {
        setError("Selecciona la ubicación en el mapa");
      } else {
        setError(null);
      }
    }
  }, [currentLatitude, currentLongitude, address, city]);

  const openInMaps = () => {
    if (coordinates) {
      const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
      Linking.openURL(url);
    }
  };

  // Si no hay coordenadas, mostrar botón para seleccionar
  if (!coordinates) {
    if (!address || !city) {
      return null;
    }

    return (
      <View className="mt-4 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
        <View className="flex-row items-center mb-3">
          <Ionicons name="information-circle-outline" size={20} color="#F59E0B" />
          <Text className="text-sm font-medium text-yellow-800 ml-2 flex-1">
            Selecciona la ubicación en el mapa
          </Text>
        </View>
        {onShowMapPicker && (
          <Pressable
            onPress={() => {
              onShowMapPicker(true);
            }}
            className="bg-primary rounded-lg py-3 px-4 flex-row items-center justify-center"
          >
            <Ionicons name="map-outline" size={18} color="#fff" />
            <Text className="text-white font-semibold ml-2">
              Seleccionar en mapa
            </Text>
          </Pressable>
        )}
      </View>
    );
  }

  // Mostrar coordenadas confirmadas de forma simple
  return (
    <View className="mt-4 bg-green-50 rounded-xl p-4 border border-green-200">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Ionicons name="checkmark-circle" size={20} color="#059669" />
          <Text className="text-sm font-medium text-green-800 ml-2">
            Ubicación confirmada
          </Text>
        </View>
        {onShowMapPicker && (
          <Pressable
            onPress={() => onShowMapPicker(true)}
            className="px-3 py-1 bg-green-100 rounded-full"
          >
            <Text className="text-xs text-green-700 font-medium">
              Cambiar
            </Text>
          </Pressable>
        )}
      </View>

      <View className="bg-white rounded-lg p-3 mt-2">
        <View className="flex-row items-center mb-2">
          <Ionicons name="location" size={16} color="#059669" />
          <Text className="text-sm text-gray-700 ml-2 flex-1" numberOfLines={2}>
            {address || "Dirección no especificada"}
            {city && `, ${city}`}
          </Text>
        </View>
        <View className="flex-row items-center mt-2 pt-2 border-t border-gray-100">
          <Ionicons name="map-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600 ml-2 font-mono">
            Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={openInMaps}
        className="mt-3 flex-row items-center justify-center py-2"
      >
        <Ionicons name="navigate-circle" size={16} color="#D65E48" />
        <Text className="text-xs text-primary font-medium ml-1">
          Ver en Google Maps
        </Text>
      </Pressable>
    </View>
  );
}
