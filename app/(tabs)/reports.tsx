import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Logo from "@/assets/logo";
import {
  usePropertyTypes,
  useOperationTypes,
  useProvinces,
} from "@/hooks/property/use-catalogs";

interface PropertyStats {
  totalProperties: number;
  availableCount: number;
  rentedCount: number;
  anticreticoCount: number;
  estimatedIncome: number;
  averageRating: number | null;
  totalReviews: number;
}

interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  areaM2: string;
  price: string;
  latitude: string | null;
  longitude: string | null;
  operationType?: string | { id: string; name: string } | null;
  propertyType?: { id: string; name: string } | null;
  province?: { id: string; name: string } | null;
  averageRating?: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ReportUser {
  id: string;
  email: string;
  fullName: string;
  profilePhoto: string | null;
}

interface ReportItem {
  id: string;
  userId: string;
  propertyId: string;
  type: string;
  status: string;
  totalPrice: string;
  startDate: string;
  finishDate: string;
  uploadedAt: string;
  parameters: any;
  fileUrl: string | null;
  createdAt: string;
  property: Property;
  user: ReportUser;
}

interface SummaryCard {
  title: string;
  value: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
}

function SummaryCards({
  stats,
  isLoading,
}: {
  stats: PropertyStats;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <View className="mb-6">
        <Text className="text-gray-500 text-center py-8">
          Cargando estadísticas...
        </Text>
      </View>
    );
  }

  const cards: SummaryCard[] = [
    {
      title: "Total Propiedades",
      value: stats.totalProperties.toString(),
      icon: "business-outline",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Disponibles",
      value: stats.availableCount.toString(),
      icon: "home-outline",
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Alquiladas",
      value: stats.rentedCount.toString(),
      icon: "key-outline",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Anticrético",
      value: stats.anticreticoCount.toString(),
      icon: "shield-outline",
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      title: "Ingresos Estimados",
      value: `Bs ${stats.estimatedIncome.toLocaleString()}`,
      icon: "wallet-outline",
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Calificación Promedio",
      value: stats.averageRating ? stats.averageRating.toFixed(1) : "N/A",
      icon: "star-outline",
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Total Reseñas",
      value: stats.totalReviews.toString(),
      icon: "chatbubble-outline",
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
  ];

  return (
    <View className="mb-6">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-3 px-4">
          {cards.map((card, index) => (
            <View
              key={`card-${index}`}
              className={`${card.bgColor} rounded-xl p-4 min-w-[140px] shadow-sm`}
            >
              <View
                className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}
              >
                <Ionicons name={card.icon as any} size={20} color="white" />
              </View>
              <Text className={`text-xs ${card.textColor} font-medium mb-1`}>
                {card.title}
              </Text>
              <Text className={`text-xl font-bold ${card.textColor}`}>
                {card.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ReportsTable({
  reports,
  isLoading,
  onExport,
  filters,
  onFilterChange,
}: {
  reports: ReportItem[];
  isLoading?: boolean;
  onExport: () => void;
  filters: {
    propertyType: string | null;
    operationType: string | null;
    province: string | null;
  };
  onFilterChange: (
    filter: "propertyType" | "operationType" | "province",
    value: string | null
  ) => void;
}) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  // Filtrar reportes - debe estar antes de cualquier return
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (
        filters.propertyType &&
        report.property?.propertyType?.name !== filters.propertyType
      ) {
        return false;
      }
      if (filters.operationType) {
        const operationTypeName =
          typeof report.property?.operationType === "object" &&
          report.property?.operationType !== null
            ? report.property.operationType.name
            : report.property?.operationType;
        if (operationTypeName !== filters.operationType) {
          return false;
        }
      }
      if (
        filters.province &&
        report.property?.province?.name !== filters.province
      ) {
        return false;
      }
      return true;
    });
  }, [reports, filters]);

  if (isLoading) {
    return (
      <View className="bg-white rounded-xl p-4 shadow-sm">
        <Text className="text-gray-500 text-center py-8">
          Cargando reportes...
        </Text>
      </View>
    );
  }

  if (reports.length === 0) {
    return (
      <View className="bg-white rounded-xl shadow-sm">
        <View className="p-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">
              Reportes de Propiedades
            </Text>
            <TouchableOpacity
              onPress={onExport}
              className="bg-primary px-4 py-2 rounded-lg flex-row items-center gap-2"
            >
              <Ionicons name="download-outline" size={16} color="white" />
              <Text className="text-white font-medium text-sm">Exportar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="p-8">
          <View className="items-center">
            <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-3 text-center">
              No hay reportes disponibles
            </Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
              Los reportes aparecerán aquí cuando tengas actividad en tus
              propiedades
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-xl shadow-sm">
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-900">
            Reportes de Propiedades
          </Text>
          <TouchableOpacity
            onPress={onExport}
            className="bg-primary px-4 py-2 rounded-lg flex-row items-center gap-2"
          >
            <Ionicons name="download-outline" size={16} color="white" />
            <Text className="text-white font-medium text-sm">Exportar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="min-w-full">
          <View className="flex-row bg-gray-50 p-3 border-b border-gray-200">
            <Text className="w-48 text-xs font-semibold text-gray-700">
              Propiedad
            </Text>
            <Text className="w-32 text-xs font-semibold text-gray-700">
              Tipo
            </Text>
            <Text className="w-32 text-xs font-semibold text-gray-700">
              Modalidad
            </Text>
            <Text className="w-32 text-xs font-semibold text-gray-700">
              Provincia
            </Text>
            <Text className="w-32 text-xs font-semibold text-gray-700">
              Precio
            </Text>
            <Text className="w-24 text-xs font-semibold text-gray-700">
              Rating
            </Text>
            <Text className="w-32 text-xs font-semibold text-gray-700">
              Fecha inicio
            </Text>
            <Text className="w-32 text-xs font-semibold text-gray-700">
              Fecha fin
            </Text>
          </View>
          {filteredReports.map((item) => {
            const operationTypeName =
              typeof item.property?.operationType === "object" &&
              item.property?.operationType !== null
                ? item.property.operationType.name
                : item.property?.operationType || "N/A";
            const propertyTypeName = item.property?.propertyType?.name || "N/A";
            const provinceName =
              item.property?.province?.name || item.property?.city || "N/A";
            const rating = item.property?.averageRating
              ? item.property.averageRating.toFixed(1)
              : "N/A";

            return (
              <View
                key={item.id}
                className="flex-row p-3 border-b border-gray-100 bg-white"
              >
                <View className="w-48">
                  <Text
                    className="text-sm text-gray-900 font-medium"
                    numberOfLines={1}
                  >
                    {item.property?.title || "N/A"}
                  </Text>
                </View>
                <View className="w-32 justify-center">
                  <Text className="text-sm text-gray-600">
                    {propertyTypeName}
                  </Text>
                </View>
                <View className="w-32 justify-center">
                  <Text className="text-sm text-gray-600">
                    {operationTypeName}
                  </Text>
                </View>
                <View className="w-32 justify-center">
                  <Text className="text-sm text-gray-600">{provinceName}</Text>
                </View>
                <View className="w-32 justify-center">
                  <Text className="text-sm text-gray-900 font-semibold">
                    Bs {Number(item.totalPrice || 0).toLocaleString()}
                  </Text>
                </View>
                <View className="w-24 justify-center">
                  <Text className="text-sm text-gray-600">{rating}</Text>
                </View>
                <View className="w-32 justify-center">
                  <Text className="text-xs text-gray-600">
                    {formatDate(item.startDate)}
                  </Text>
                </View>
                <View className="w-32 justify-center">
                  <Text className="text-xs text-gray-600">
                    {formatDate(item.finishDate)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

export default function ReportsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<{
    propertyType: string | null;
    operationType: string | null;
    province: string | null;
  }>({
    propertyType: null,
    operationType: null,
    province: null,
  });

  // Obtener catálogos para filtros
  const { data: propertyTypes } = usePropertyTypes();
  const { data: operationTypes } = useOperationTypes();
  const { data: provinces } = useProvinces();

  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["property-stats"],
    queryFn: async () => {
      const response = await api.get("/api/users/properties/stats");
      return response.data;
    },
  });

  const {
    data: reportsData,
    isLoading: reportsLoading,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ["property-reports"],
    queryFn: async () => {
      // Intentar primero con /api/users/properties/reports, si falla usar /api/reports
      try {
        const response = await api.get("/api/users/properties/reports");
        return response.data;
      } catch {
        // Fallback a /api/reports
        const response = await api.get("/api/reports");
        return response.data;
      }
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchStats(), refetchReports()]);
    setRefreshing(false);
  };

  const handleExport = () => {
    Alert.alert("Exportar Reportes", "¿Cómo deseas exportar los datos?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excel", onPress: () => console.log("Exportar a Excel") },
      { text: "PDF", onPress: () => console.log("Exportar a PDF") },
    ]);
  };

  const handleFilterChange = (
    filter: "propertyType" | "operationType" | "province",
    value: string | null
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: value === prev[filter] ? null : value, // Toggle filter
    }));
  };

  const stats: PropertyStats = statsData?.data || {
    totalProperties: 0,
    availableCount: 0,
    rentedCount: 0,
    anticreticoCount: 0,
    estimatedIncome: 0,
    averageRating: null,
    totalReviews: 0,
  };

  const reports: ReportItem[] = Array.isArray(reportsData?.data)
    ? reportsData.data
    : [];

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
        <Logo size={20} />
        <Text className="text-white font-semibold text-lg">RentaYa</Text>
      </View>

      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-2">Reportes</Text>
        <Text className="text-gray-600 mb-6">
          Métricas y reportes de tus propiedades
        </Text>

        <SummaryCards stats={stats} isLoading={statsLoading} />

        {/* Filtros */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-sm font-semibold text-gray-700 mb-3">
            Filtrar por:
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <Pressable
              onPress={() => {
                // Mostrar selector de tipo de propiedad
                Alert.alert("Tipo de propiedad", "Selecciona un tipo", [
                  {
                    text: "Todos",
                    onPress: () => handleFilterChange("propertyType", null),
                  },
                  ...(propertyTypes?.map((pt) => ({
                    text: pt.name,
                    onPress: () => handleFilterChange("propertyType", pt.name),
                  })) || []),
                  { text: "Cancelar", style: "cancel" },
                ]);
              }}
              className={`px-4 py-2 rounded-lg border ${
                filters.propertyType
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  filters.propertyType ? "text-white" : "text-gray-700"
                }`}
              >
                {filters.propertyType || "Tipo de propiedad"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                Alert.alert("Modalidad", "Selecciona una modalidad", [
                  {
                    text: "Todas",
                    onPress: () => handleFilterChange("operationType", null),
                  },
                  ...(operationTypes?.map((ot) => ({
                    text: ot.name,
                    onPress: () => handleFilterChange("operationType", ot.name),
                  })) || []),
                  { text: "Cancelar", style: "cancel" },
                ]);
              }}
              className={`px-4 py-2 rounded-lg border ${
                filters.operationType
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  filters.operationType ? "text-white" : "text-gray-700"
                }`}
              >
                {filters.operationType || "Modalidad"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                Alert.alert("Provincia", "Selecciona una provincia", [
                  {
                    text: "Todas",
                    onPress: () => handleFilterChange("province", null),
                  },
                  ...(provinces?.map((p) => ({
                    text: p.name,
                    onPress: () => handleFilterChange("province", p.name),
                  })) || []),
                  { text: "Cancelar", style: "cancel" },
                ]);
              }}
              className={`px-4 py-2 rounded-lg border ${
                filters.province
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  filters.province ? "text-white" : "text-gray-700"
                }`}
              >
                {filters.province || "Provincia"}
              </Text>
            </Pressable>
          </View>
        </View>

        <ReportsTable
          reports={reports}
          isLoading={reportsLoading}
          onExport={handleExport}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </View>
    </ScrollView>
  );
}
