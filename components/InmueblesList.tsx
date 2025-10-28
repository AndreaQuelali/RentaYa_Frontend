import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { inmuebleService, Inmueble } from "@/lib/services/inmuebleService";

export default function InmueblesList() {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadInmuebles = async () => {
    try {
      const data = await inmuebleService.listInmuebles();
      setInmuebles(data.items);
    } catch (error) {
      console.error("Error loading inmuebles:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInmuebles();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadInmuebles();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-2 text-gray-600">Cargando propiedades...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={inmuebles}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={
        <View className="items-center py-8">
          <Text className="text-gray-500">No hay propiedades publicadas</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View className="mb-4 bg-white rounded-xl shadow-sm overflow-hidden">
          {item.propertyPhotos?.[0]?.url && (
            <Image
              source={{ uri: item.propertyPhotos[0].url }}
              className="w-full h-48"
              resizeMode="cover"
            />
          )}
          <View className="p-4">
            <Text className="text-lg font-semibold mb-1">{item.title}</Text>
            <Text className="text-gray-600 mb-2">{item.address}</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-green-600">
                Bs {parseFloat(item.price).toLocaleString()}
              </Text>
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-800 text-xs font-medium capitalize">
                  {item.operationType}
                </Text>
              </View>
            </View>
            {item.bedrooms || item.bathrooms ? (
              <View className="flex-row gap-4 mt-3">
                {item.bedrooms && (
                  <Text className="text-gray-600 text-sm">
                    🛏️ {item.bedrooms} dorm.
                  </Text>
                )}
                {item.bathrooms && (
                  <Text className="text-gray-600 text-sm">
                    🚿 {item.bathrooms} baños
                  </Text>
                )}
                {item.areaM2 && (
                  <Text className="text-gray-600 text-sm">
                    📐 {item.areaM2} m²
                  </Text>
                )}
              </View>
            ) : null}
          </View>
        </View>
      )}
    />
  );
}
