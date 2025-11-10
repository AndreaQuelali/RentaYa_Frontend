import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Logo from "@/assets/logo";
import { api } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import { router, useFocusEffect } from "expo-router";
import SearchBar from "@/components/SearchBar";
import FilterModal, { FilterValues } from "@/components/FilterModal";

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
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/api/properties");

      const data = res.data?.data?.items || res.data?.items || [];
      setItems(data);
    } catch (e: any) {
      console.error("Error fetching properties:", e);
      setError("No se pudieron cargar los inmuebles");
    } finally {
      setLoading(false);
    }
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

      // Filtro por precio
      if (filters.precio) {
        const price = parseFloat(filters.precio);
        if (!isNaN(price)) {
          filtered = filtered.filter((property) => property.price <= price);
        }
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
      SALE: "Venta",
      ANTICRETICO: "Anticrético",
      rent: "Alquiler",
      sale: "Venta",
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

      <ScrollView className="flex-1">
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
                  No se encontraron propiedades con `{searchQuery}`
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
              <View className="flex-row flex-wrap justify-between">
                {filteredItems.map((property) => {
                  const firstPhoto =
                    property.propertyPhotos &&
                    property.propertyPhotos.length > 0
                      ? property.propertyPhotos[0].url
                      : undefined;

                  const priceText = property.price
                    ? `Bs ${property.price.toLocaleString("es-BO")}`
                    : "Precio no disponible";

                  return (
                    <PropertyCard
                      key={property.id}
                      title={property.title}
                      imageUrl={firstPhoto}
                      price={priceText}
                      tipo={getOperationTypeLabel(property.operationType)}
                      ubicacion={property.city || property.address}
                      area={property.areaM2}
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
