import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Logo from "@/assets/logo";
import { inmuebleService, Inmueble } from "@/lib/services/inmuebleService";
import { useRouter } from "expo-router";

interface PropertyCardProps {
  property: Inmueble;
  onPress?: () => void;
}

interface Filters {
  operationType: string; // 'all' | 'alquiler' | 'anticretico'
  propertyType: string; // 'all' | 'casa' | 'departamento' | 'oficina' | 'terreno'
  minPrice: string;
  maxPrice: string;
  bedrooms: string; // 'all' | '1' | '2' | '3' | '4+'
}

function PropertyCard({ property, onPress }: PropertyCardProps) {
  return (
    <Pressable onPress={onPress} className="w-[48%] bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
      <View className="flex-row justify-between items-center p-2 absolute top-0 left-0 right-0 z-10">
        <Text className="text-xs px-2 py-1 bg-white/90 rounded-full">
          {property.operationType === "alquiler" ? "Alquiler" : "Anticrético"}
        </Text>
        <View className="bg-white/90 rounded-full p-1">
          <Ionicons name="heart-outline" size={18} color="#6B7280" />
        </View>
      </View>

      {property.propertyPhotos?.[0]?.url ? (
        <Image
          source={{ uri: property.propertyPhotos[0].url }}
          className="w-full h-24"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-24 bg-gray-200 items-center justify-center">
          <Ionicons name="image-outline" size={24} color="#9CA3AF" />
        </View>
      )}

      <View className="p-3">
        <Text
          className="text-xs text-gray-700 mb-1 font-medium"
          numberOfLines={1}
        >
          {property.title}
        </Text>
        <View className="flex-row items-center mb-2">
          <Ionicons name="location-outline" size={12} color="#6B7280" />
          <Text className="text-xs text-gray-500 ml-1" numberOfLines={1}>
            {property.city}
          </Text>
        </View>
        <Text className="text-base font-semibold text-gray-900">
          Bs {parseFloat(property.price).toLocaleString()}
          <Text className="text-xs font-normal text-gray-500">
            {property.operationType === "alquiler" ? "/mes" : ""}
          </Text>
        </Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const [properties, setProperties] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    operationType: "all",
    propertyType: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "all",
  });
  const router = useRouter();

  const loadProperties = async () => {
    try {
      const data = await inmuebleService.listInmuebles();
      setProperties(data.items);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadProperties();
  };

  const applyFilters = (property: Inmueble): boolean => {
    // Filtro por búsqueda de texto
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (property.address &&
        property.address.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filtro por tipo de operación
    const matchesOperationType =
      filters.operationType === "all" ||
      property.operationType === filters.operationType;

    // Filtro por tipo de propiedad
    const matchesPropertyType =
      filters.propertyType === "all" ||
      property.propertyType === filters.propertyType;

    // Filtro por precio mínimo
    const matchesMinPrice =
      !filters.minPrice ||
      parseFloat(property.price) >= parseFloat(filters.minPrice);

    // Filtro por precio máximo
    const matchesMaxPrice =
      !filters.maxPrice ||
      parseFloat(property.price) <= parseFloat(filters.maxPrice);

    // Filtro por número de habitaciones
    const matchesBedrooms =
      filters.bedrooms === "all" ||
      (filters.bedrooms === "4+" && (property.bedrooms || 0) >= 4) ||
      Boolean(property.bedrooms?.toString() === filters.bedrooms);

    return Boolean(
      matchesSearch &&
        matchesOperationType &&
        matchesPropertyType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesBedrooms
    );
  };

  const filteredProperties = properties.filter(applyFilters);

  const clearFilters = () => {
    setFilters({
      operationType: "all",
      propertyType: "all",
      minPrice: "",
      maxPrice: "",
      bedrooms: "all",
    });
  };

  const hasActiveFilters =
    filters.operationType !== "all" ||
    filters.propertyType !== "all" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.bedrooms !== "all";

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
        <Logo size={20} />
        <Text className="text-white font-semibold text-lg">RentaYa</Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#DC2626"]}
          />
        }
      >
        <View className="px-4 py-4">
          <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-2">
            <Ionicons name="search-outline" size={18} color="#6B7280" />
            <TextInput
              placeholder="Buscar propiedades..."
              className="flex-1 px-2 py-1"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== "" && (
              <Pressable onPress={() => setSearchQuery("")} className="p-1">
                <Ionicons name="close-circle" size={18} color="#6B7280" />
              </Pressable>
            )}
            <Pressable
              className="ml-2 p-2 relative"
              onPress={() => setShowFilters(true)}
            >
              <Ionicons name="options-outline" size={18} color="#11181C" />
              {hasActiveFilters && (
                <View className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </Pressable>
          </View>

          {hasActiveFilters && (
            <View className="flex-row items-center justify-between mt-3 px-2">
              <Text className="text-sm text-gray-600">
                {filteredProperties.length}{" "}
                {filteredProperties.length === 1 ? "resultado" : "resultados"}
              </Text>
              <Pressable onPress={clearFilters}>
                <Text className="text-sm text-primary font-medium">
                  Limpiar filtros
                </Text>
              </Pressable>
            </View>
          )}

          {loading ? (
            <View className="py-20 items-center">
              <ActivityIndicator size="large" color="#DC2626" />
              <Text className="text-gray-500 mt-2">
                Cargando propiedades...
              </Text>
            </View>
          ) : filteredProperties.length === 0 ? (
            <View className="py-20 items-center">
              <Ionicons name="home-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">
                {searchQuery
                  ? "No se encontraron propiedades"
                  : "No hay propiedades disponibles"}
              </Text>
            </View>
          ) : (
            <View className="mt-4 flex-row flex-wrap justify-between">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onPress={() =>
                    router.push((`/property/${String(property.id)}` as any))
                  }
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de Filtros */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl max-h-[85%]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
              <Text className="text-xl font-semibold">Filtros</Text>
              <Pressable onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </Pressable>
            </View>

            <ScrollView className="px-4 py-4">
              {/* Tipo de Operación */}
              <View className="mb-6">
                <Text className="text-base font-semibold mb-3">
                  Tipo de operación
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    { label: "Todos", value: "all" },
                    { label: "Alquiler", value: "alquiler" },
                    { label: "Anticrético", value: "anticretico" },
                  ].map((option) => (
                    <Pressable
                      key={option.value}
                      onPress={() =>
                        setFilters({ ...filters, operationType: option.value })
                      }
                      className={`px-4 py-2 rounded-full border ${
                        filters.operationType === option.value
                          ? "bg-primary border-primary"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          filters.operationType === option.value
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Tipo de Propiedad */}
              <View className="mb-6">
                <Text className="text-base font-semibold mb-3">
                  Tipo de propiedad
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    { label: "Todos", value: "all" },
                    { label: "Casa", value: "casa" },
                    { label: "Departamento", value: "departamento" },
                    { label: "Oficina", value: "oficina" },
                    { label: "Terreno", value: "terreno" },
                  ].map((option) => (
                    <Pressable
                      key={option.value}
                      onPress={() =>
                        setFilters({ ...filters, propertyType: option.value })
                      }
                      className={`px-4 py-2 rounded-full border ${
                        filters.propertyType === option.value
                          ? "bg-primary border-primary"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          filters.propertyType === option.value
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Rango de Precio */}
              <View className="mb-6">
                <Text className="text-base font-semibold mb-3">
                  Rango de precio (Bs)
                </Text>
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-sm text-gray-600 mb-2">Mínimo</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="0"
                      keyboardType="numeric"
                      value={filters.minPrice}
                      onChangeText={(text) =>
                        setFilters({ ...filters, minPrice: text })
                      }
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-gray-600 mb-2">Máximo</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="∞"
                      keyboardType="numeric"
                      value={filters.maxPrice}
                      onChangeText={(text) =>
                        setFilters({ ...filters, maxPrice: text })
                      }
                    />
                  </View>
                </View>
              </View>

              {/* Habitaciones */}
              <View className="mb-6">
                <Text className="text-base font-semibold mb-3">
                  Habitaciones
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    { label: "Todas", value: "all" },
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3", value: "3" },
                    { label: "4+", value: "4+" },
                  ].map((option) => (
                    <Pressable
                      key={option.value}
                      onPress={() =>
                        setFilters({ ...filters, bedrooms: option.value })
                      }
                      className={`px-4 py-2 rounded-full border ${
                        filters.bedrooms === option.value
                          ? "bg-primary border-primary"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          filters.bedrooms === option.value
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Footer con botones */}
            <View className="px-4 py-3 border-t border-gray-200 flex-row gap-3">
              <Pressable
                onPress={() => {
                  clearFilters();
                  setShowFilters(false);
                }}
                className="flex-1 bg-gray-100 py-3 rounded-lg items-center"
              >
                <Text className="text-gray-700 font-semibold">Limpiar</Text>
              </Pressable>
              <Pressable
                onPress={() => setShowFilters(false)}
                className="flex-1 bg-primary py-3 rounded-lg items-center"
              >
                <Text className="text-white font-semibold">
                  Aplicar ({filteredProperties.length})
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
