import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NewPropertyForm from "@/components/NewPropertyForm";
import { inmuebleService, Inmueble } from "@/lib/services/inmuebleService";
import { useAuth } from "@/hooks/auth/use-auth";

export default function PropertiesScreen() {
  const [showForm, setShowForm] = useState(false);
  const [properties, setProperties] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isAuthenticated } = useAuth();

  const loadMyProperties = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      const data = await inmuebleService.listMyInmuebles();
      setProperties(data.items);
    } catch (error) {
      console.error("Error loading my properties:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadMyProperties();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const onRefresh = () => {
    setRefreshing(true);
    loadMyProperties();
  };

  const handlePropertyCreated = () => {
    setShowForm(false);
    loadMyProperties();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header rojo */}
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
        {showForm ? (
          <Pressable onPress={() => setShowForm(false)} className="pr-2">
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>
        ) : (
          <Ionicons name="home-outline" size={20} color="#fff" />
        )}
        <Text className="text-white font-semibold text-lg">RentaYa</Text>
      </View>

      {showForm ? (
        <NewPropertyForm onSuccess={handlePropertyCreated} />
      ) : (
        <View className="flex-1">
          <View className="px-4 py-3 border-b border-gray-100">
            <Text className="text-xl font-semibold">Mis propiedades</Text>
            <Text className="text-gray-500 text-sm mt-1">
              {properties.length}{" "}
              {properties.length === 1 ? "propiedad" : "propiedades"}
            </Text>
          </View>

          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#DC2626" />
              <Text className="mt-2 text-gray-600">
                Cargando propiedades...
              </Text>
            </View>
          ) : properties.length === 0 ? (
            <View className="flex-1 items-center justify-center px-6">
              <Ionicons name="home-outline" size={64} color="#D1D5DB" />
              <Text className="text-gray-500 text-center mt-4 text-base">
                Aún no tienes propiedades publicadas
              </Text>
              <Text className="text-gray-400 text-center mt-2 text-sm">
                Toca el botón + para publicar tu primera propiedad
              </Text>
            </View>
          ) : (
            <FlatList
              data={properties}
              keyExtractor={(item) => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#DC2626"]}
                />
              }
              contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
              ItemSeparatorComponent={() => <View className="h-3" />}
              renderItem={({ item }) => (
                <Pressable className="bg-white rounded-xl overflow-hidden border border-gray-100">
                  {/* Imagen principal */}
                  {item.propertyPhotos?.[0]?.url ? (
                    <Image
                      source={{ uri: item.propertyPhotos[0].url }}
                      className="w-full h-48"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-48 bg-gray-200 items-center justify-center">
                      <Ionicons
                        name="image-outline"
                        size={48}
                        color="#9CA3AF"
                      />
                      <Text className="text-gray-400 text-xs mt-2">
                        Sin imagen
                      </Text>
                    </View>
                  )}

                  {/* Información */}
                  <View className="p-4">
                    {/* Título y ubicación */}
                    <Text
                      className="text-lg font-semibold mb-1"
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>

                    <View className="flex-row items-center mb-3">
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color="#6B7280"
                      />
                      <Text
                        className="text-gray-600 text-sm ml-1 flex-1"
                        numberOfLines={1}
                      >
                        {item.address || item.city}
                      </Text>
                    </View>

                    {/* Precio y botón editar */}
                    <View className="flex-row items-center justify-between mb-3">
                      <Text className="text-2xl font-bold text-gray-900">
                        Bs {parseFloat(item.price).toLocaleString()}
                        <Text className="text-sm font-normal text-gray-500">
                          {item.operationType === "alquiler" ? "/mes" : ""}
                        </Text>
                      </Text>

                      {/* Botón Editar */}
                      <Pressable
                        className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg"
                        onPress={() => {
                          // TODO: Implementar edición
                          console.log("Editar propiedad:", item.id);
                        }}
                      >
                        <Ionicons
                          name="create-outline"
                          size={16}
                          color="#374151"
                        />
                        <Text className="text-gray-700 text-xs font-medium ml-1">
                          Editar
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          )}

          {/* Botón flotante (FAB) */}
          <Pressable
            className="absolute bottom-6 right-6 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
            style={{
              shadowColor: "#DC2626",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
            onPress={() => setShowForm(true)}
          >
            <Ionicons name="add" size={28} color="white" />
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
