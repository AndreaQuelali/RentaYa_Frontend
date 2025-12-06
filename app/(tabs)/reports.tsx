import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { api } from "@/lib/api";
import Logo from "@/assets/logo";
import {
  usePropertyTypes,
  useOperationTypes,
  useProvinces,
} from "@/hooks/property/use-catalogs";
// Estas importaciones requieren que tengas instalados los paquetes de Expo correspondientes.
// Si aún no los tienes, puedes instalarlos con:
//   npx expo install expo-print expo-file-system expo-sharing
// La app seguirá compilando aunque el linter marque advertencias si aún no están instalados.
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

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

interface FilterModalProps {
  visible: boolean;
  title: string;
  options: { label: string; value: string | null }[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
  onClose: () => void;
}

function FilterModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: FilterModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-white rounded-t-3xl p-4 max-h-[60%]">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-gray-900">{title}</Text>
            <Pressable onPress={onClose} className="px-2 py-1">
              <Text className="text-primary font-medium">Cerrar</Text>
            </Pressable>
          </View>
          <ScrollView>
            {options.map((opt) => {
              const isSelected = selectedValue === opt.value;
              return (
                <Pressable
                  key={opt.label}
                  onPress={() => {
                    onSelect(opt.value);
                    onClose();
                  }}
                  className={`flex-row items-center justify-between px-3 py-3 rounded-xl mb-2 ${
                    isSelected ? "bg-primary/10" : "bg-gray-50"
                  }`}
                >
                  <Text
                    className={`text-base ${
                      isSelected
                        ? "text-primary font-semibold"
                        : "text-gray-800"
                    }`}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#D65E48"
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
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
          Cargando resumen...
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
              <Text className="text-white font-medium text-md">Exportar</Text>
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
  const [isRefreshingOnFocus, setIsRefreshingOnFocus] = useState(false);
  const [filters, setFilters] = useState<{
    propertyType: string | null;
    operationType: string | null;
    province: string | null;
  }>({
    propertyType: null,
    operationType: null,
    province: null,
  });
  const [propertyTypeModalVisible, setPropertyTypeModalVisible] =
    useState(false);
  const [operationTypeModalVisible, setOperationTypeModalVisible] =
    useState(false);
  const [provinceModalVisible, setProvinceModalVisible] = useState(false);

  // Obtener catálogos para filtros
  const { data: propertyTypes } = usePropertyTypes();
  const { data: operationTypes } = useOperationTypes();
  const { data: provinces } = useProvinces();

  const {
    data: statsData,
    isLoading: statsLoading,
    isFetching: statsFetching,
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
    isFetching: reportsFetching,
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

  // Recargar datos cuando se enfoca la pantalla
  useFocusEffect(
    React.useCallback(() => {
      setIsRefreshingOnFocus(true);
      const loadData = async () => {
        await Promise.all([refetchStats(), refetchReports()]);
        setIsRefreshingOnFocus(false);
      };
      loadData();
    }, [refetchStats, refetchReports])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchStats(), refetchReports()]);
    setRefreshing(false);
  };

  const exportToCsv = async () => {
    if (!reports.length) {
      Alert.alert("Exportar a Excel", "No hay datos para exportar.");
      return;
    }

    try {
      const header = [
        "Propiedad",
        "Tipo",
        "Modalidad",
        "Provincia",
        "Precio (Bs)",
        "Rating",
        "Fecha inicio",
        "Fecha fin",
      ];

      const rows = reports.map((item) => {
        const operationTypeName =
          typeof item.property?.operationType === "object" &&
          item.property?.operationType !== null
            ? item.property.operationType.name
            : (item.property?.operationType as string) || "N/A";
        const propertyTypeName = item.property?.propertyType?.name || "N/A";
        const provinceName =
          item.property?.province?.name || item.property?.city || "N/A";
        const rating = item.property?.averageRating
          ? item.property.averageRating.toFixed(1)
          : "N/A";

        const formatDate = (dateString: string) => {
          try {
            const date = new Date(dateString);
            return date.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          } catch {
            return "";
          }
        };

        return [
          item.property?.title || "N/A",
          propertyTypeName,
          operationTypeName,
          provinceName,
          Number(item.totalPrice || 0).toLocaleString("es-BO"),
          rating,
          formatDate(item.startDate),
          formatDate(item.finishDate),
        ]
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",");
      });

      const csvContent = [header.join(","), ...rows].join("\n");

      const file = new FileSystem.File(
        FileSystem.Paths.document,
        "reportes_propiedades.csv"
      );
      await file.write(csvContent);

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "text/csv",
          dialogTitle: "Exportar reportes (Excel/CSV)",
        });
      } else {
        Alert.alert(
          "Archivo generado",
          `El archivo CSV fue generado en: ${file.uri}`
        );
      }
    } catch (error) {
      console.error("Error exportando a CSV:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al exportar a Excel/CSV. Intenta de nuevo."
      );
    }
  };

  const exportToPdf = async () => {
    if (!reports.length) {
      Alert.alert("Exportar a PDF", "No hay datos para exportar.");
      return;
    }

    try {
      const rowsHtml = reports
        .map((item) => {
          const operationTypeName =
            typeof item.property?.operationType === "object" &&
            item.property?.operationType !== null
              ? item.property.operationType.name
              : (item.property?.operationType as string) || "N/A";
          const propertyTypeName = item.property?.propertyType?.name || "N/A";
          const provinceName =
            item.property?.province?.name || item.property?.city || "N/A";
          const rating = item.property?.averageRating
            ? item.property.averageRating.toFixed(1)
            : "N/A";

          const formatDate = (dateString: string) => {
            try {
              const date = new Date(dateString);
              return date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
            } catch {
              return "";
            }
          };

          return `<tr>
<td>${item.property?.title || "N/A"}</td>
<td>${propertyTypeName}</td>
<td>${operationTypeName}</td>
<td>${provinceName}</td>
<td>Bs ${Number(item.totalPrice || 0).toLocaleString("es-BO")}</td>
<td>${rating}</td>
<td>${formatDate(item.startDate)}</td>
<td>${formatDate(item.finishDate)}</td>
</tr>`;
        })
        .join("");

      const html = `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Reportes de Propiedades</title>
    <style>
      body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 24px; }
      h1 { font-size: 20px; margin-bottom: 16px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border: 1px solid #e5e7eb; padding: 6px 8px; text-align: left; }
      th { background-color: #f3f4f6; }
    </style>
  </head>
  <body>
    <h1>Reportes de Propiedades</h1>
    <table>
      <thead>
        <tr>
          <th>Propiedad</th>
          <th>Tipo</th>
          <th>Modalidad</th>
          <th>Provincia</th>
          <th>Precio (Bs)</th>
          <th>Rating</th>
          <th>Fecha inicio</th>
          <th>Fecha fin</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  </body>
</html>`;

      const { uri } = await Print.printToFileAsync({ html });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Exportar reportes en PDF",
        });
      } else {
        Alert.alert("PDF generado", `El archivo PDF fue generado en: ${uri}`);
      }
    } catch (error) {
      console.error("Error exportando a PDF:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al exportar a PDF. Intenta de nuevo."
      );
    }
  };

  const handleExport = () => {
    Alert.alert("Exportar Reportes", "¿Cómo deseas exportar los datos?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excel (CSV)", onPress: () => exportToCsv() },
      { text: "PDF", onPress: () => exportToPdf() },
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

  // Mostrar loading si es la carga inicial o si se está recargando al enfocar la pantalla
  const isLoading = statsLoading || reportsLoading || isRefreshingOnFocus;

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#D65E48"]}
        />
      }
    >
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
        <Logo size={20} />
        <Text className="text-white font-semibold text-lg">RentaYa</Text>
      </View>

      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-2">Reportes</Text>

        {isLoading && (
          <View className="mt-10 items-center justify-center">
            <ActivityIndicator size="large" color="#D65E48" />
            <Text className="text-gray-500 mt-2">Cargando reportes...</Text>
          </View>
        )}

        {!isLoading && (
          <>
            <SummaryCards stats={stats} isLoading={statsLoading} />

            {/* Filtros */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-md font-semibold text-gray-700 mb-3">
                Filtrar por:
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <Pressable
                  onPress={() => setPropertyTypeModalVisible(true)}
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
                  onPress={() => setOperationTypeModalVisible(true)}
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
                  onPress={() => setProvinceModalVisible(true)}
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

            {/* Modales de filtros */}
            <FilterModal
              visible={propertyTypeModalVisible}
              title="Tipo de propiedad"
              selectedValue={filters.propertyType}
              onSelect={(value) => handleFilterChange("propertyType", value)}
              onClose={() => setPropertyTypeModalVisible(false)}
              options={[
                { label: "Todos", value: null },
                ...(propertyTypes?.map((pt) => ({
                  label: pt.name,
                  value: pt.name as string,
                })) || []),
              ]}
            />

            <FilterModal
              visible={operationTypeModalVisible}
              title="Modalidad"
              selectedValue={filters.operationType}
              onSelect={(value) => handleFilterChange("operationType", value)}
              onClose={() => setOperationTypeModalVisible(false)}
              options={[
                { label: "Todas", value: null },
                ...(operationTypes?.map((ot) => ({
                  label: ot.name,
                  value: ot.name as string,
                })) || []),
              ]}
            />

            <FilterModal
              visible={provinceModalVisible}
              title="Provincia"
              selectedValue={filters.province}
              onSelect={(value) => handleFilterChange("province", value)}
              onClose={() => setProvinceModalVisible(false)}
              options={[
                { label: "Todas", value: null },
                ...(provinces?.map((p) => ({
                  label: p.name,
                  value: p.name as string,
                })) || []),
              ]}
            />

            <ReportsTable
              reports={reports}
              isLoading={reportsLoading}
              onExport={handleExport}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}
