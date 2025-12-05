import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Logo from "@/assets/logo";
import { api } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import { router, useFocusEffect } from "expo-router";
import SearchBar from "@/components/SearchBar";
import FilterModal, { FilterValues } from "@/components/FilterModal";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

interface Property {
  id: string;
  title: string;
  description?: string;
  address: string;
  city?: string;
  bedrooms: number;
  bathrooms: number;
  areaM2?: number;
  price: number;
  operationType: string;
  propertyPhotos?: {
    id: string;
    url: string;
  }[];
}

export default function HomeScreen() {
  const [items, setItems] = useState<Property[]>([]);
  const [filteredItems, setFilteredItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const res = await api.get("/api/properties");

      const data = res.data?.data?.items || res.data?.items || [];
      setItems(data);
      try {
        const favRes = await api.get("/api/properties/user/favorites");
        const favs = favRes.data?.data || [];
        const ids = new Set<string>(
          favs.map((f: any) => (f.propertyId ? f.propertyId : f.property?.id)).filter(Boolean),
        );
        setFavorites(ids);
      } catch {
        // Not critical if user is not authenticated
      }
    } catch (e: any) {
      console.error("Error fetching properties:", e);
      setError("No se pudieron cargar los inmuebles");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchData(true);
  };

  useEffect(() => {
    if (searchQuery.trim() === "" && Object.keys(filters).length === 0) {
      setFilteredItems(items);
    } else {
      let filtered = items;

      // Filtro de búsqueda por texto
      if (searchQuery.trim() !== "") {
        filtered = filtered.filter(
          (property) =>
            property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filtro por provincia
      if (filters.provincia) {
        filtered = filtered.filter(
          (property) =>
            property.city?.toLowerCase() === filters.provincia?.toLowerCase()
        );
      }

      // Filtro por tipo de propiedad
      if (filters.tipoPropiedad) {
        filtered = filtered.filter((property) =>
          property.title.includes(filters.tipoPropiedad!)
        );
      }

      // Filtro por modalidad
      if (filters.modalidad) {
        const modalidadMap: { [key: string]: string } = {
          Alquiler: "RENT",
          Venta: "SALE",
          Anticrético: "ANTICRETICO",
        };
        const operationType = modalidadMap[filters.modalidad];
        if (operationType) {
          filtered = filtered.filter(
            (property) => property.operationType === operationType
          );
        }
      }

      // Filtro por rango de precio
      const min = filters.precioMin ? parseFloat(filters.precioMin) : undefined;
      const max = filters.precioMax ? parseFloat(filters.precioMax) : undefined;
      if ((min !== undefined && !isNaN(min)) || (max !== undefined && !isNaN(max))) {
        filtered = filtered.filter((property) => {
          const p = property.price ?? 0;
          if (min !== undefined && !isNaN(min) && p < min) return false;
          if (max !== undefined && !isNaN(max) && p > max) return false;
          return true;
        });
      }

      setFilteredItems(filtered);
    }
  }, [searchQuery, items, filters]);

  const handlePropertyPress = (propertyId: string) => {
    router.push(`/property/${propertyId}`);
  };

  const getOperationTypeLabel = (operationType: string) => {
    const labels: { [key: string]: string } = {
      RENT: "Alquiler",
      ANTICRETICO: "Anticrético",
      rent: "Alquiler",
      anticretico: "Anticrético",
    };
    return labels[operationType] || operationType;
  };

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
        <Logo size={20} />
        <Text className="text-white font-semibold text-lg">RentaYa</Text>
      </View>

      <ScrollView className="flex-1" refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#D65E48"]} />
      }>
        <View className="px-4 py-4">
          <View className="mb-4">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFilterPress={() => setShowFilterModal(true)}
            />
          </View>

          <FilterModal
            visible={showFilterModal}
            onClose={() => setShowFilterModal(false)}
            onApplyFilters={setFilters}
            initialFilters={filters}
          />

          {/* Mapa con marcadores de propiedades */}
          <View className="mt-2 mb-4 overflow-hidden rounded-xl border border-gray-200">
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ height: 260, width: "100%" }}
              initialRegion={(function () {
                const withCoords = items.filter(
                  (p) => typeof (p as any).latitude === 'number' && typeof (p as any).longitude === 'number'
                );
                if (withCoords.length > 0) {
                  const lat = Number((withCoords[0] as any).latitude);
                  const lng = Number((withCoords[0] as any).longitude);
                  return { latitude: lat, longitude: lng, latitudeDelta: 0.08, longitudeDelta: 0.08 };
                }
                // Fallback: centro de Cochabamba
                return { latitude: -17.3895, longitude: -66.1568, latitudeDelta: 0.2, longitudeDelta: 0.2 };
              })()}
            >
              {filteredItems
                .filter((p) => (p as any).latitude != null && (p as any).longitude != null)
                .map((p) => (
                  <Marker
                    key={p.id}
                    coordinate={{
                      latitude: Number((p as any).latitude),
                      longitude: Number((p as any).longitude),
                    }}
                    title={p.title}
                    description= {"Bs. " + p.price.toString()}
                    onPress={() => handlePropertyPress(p.id)}
                  />
                ))}
            </MapView>
          </View>

          {loading && (
            <View className="mt-6 items-center justify-center">
              <ActivityIndicator size="large" color="#D65E48" />
              <Text className="text-gray-500 mt-2">
                Cargando propiedades...
              </Text>
            </View>
          )}

          {error && !loading && (
            <View className="mt-6 items-center justify-center bg-red-50 p-4 rounded-xl">
              <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
              <Text className="text-red-500 mt-2 text-center">{error}</Text>
              <Pressable
                className="mt-4 bg-red-500 px-4 py-2 rounded-lg"
                onPress={fetchData}
              >
                <Text className="text-white font-semibold">Reintentar</Text>
              </Pressable>
            </View>
          )}

          {!loading &&
            !error &&
            filteredItems.length === 0 &&
            items.length > 0 && (
              <View className="mt-6 items-center justify-center">
                <Ionicons name="search-outline" size={64} color="#D1D5DB" />
                <Text className="text-gray-500 mt-4 text-center">
                  No se encontraron propiedades que coincidan con su búsqueda
                </Text>
              </View>
            )}

          {!loading && !error && items.length === 0 && (
            <View className="mt-6 items-center justify-center">
              <Ionicons name="home-outline" size={64} color="#D1D5DB" />
              <Text className="text-gray-500 mt-4 text-center">
                No hay propiedades disponibles en este momento
              </Text>
            </View>
          )}

          {!loading && !error && filteredItems.length > 0 && (
            <>
              <Text className="text-lg font-semibold mb-3">
                {filteredItems.length}{" "}
                {filteredItems.length === 1
                  ? "propiedad encontrada"
                  : "propiedades encontradas"}
              </Text>
              <View className="flex-col">
                {filteredItems.map((property) => {
                  const firstPhoto =
                    property.propertyPhotos &&
                    property.propertyPhotos.length > 0
                      ? property.propertyPhotos[0].url
                      : undefined;

                  return (
                    <PropertyCard
                      key={property.id}
                      propertyId={property.id}
                      title={property.title}
                      imageUrl={firstPhoto}
                      price={Number(property.price) || 0}
                      tipo={getOperationTypeLabel(property.operationType)}
                      ubicacion={property.city || property.address}
                      address={property.address}
                      favorited={favorites.has(property.id)}
                      onToggleFavorite={(isFav) => {
                        setFavorites((prev) => {
                          const next = new Set(prev);
                          if (isFav) next.add(property.id);
                          else next.delete(property.id);
                          return next;
                        });
                      }}
                      onPress={() => handlePropertyPress(property.id)}
                    />
                  );
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
