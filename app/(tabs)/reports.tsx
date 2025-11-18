import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface PropertyStats {
  totalProperties: number;
  availableCount: number;
  rentedCount: number;
  anticreticoCount: number;
  estimatedIncome: number;
  averageRating: number | null;
  totalReviews: number;
}

interface ReportItem {
  id: string;
  propertyName: string;
  propertyType: string;
  status: string;
  income: number;
  createdAt: string;
  tenantName?: string;
}

function SummaryCards({ stats, isLoading }: { stats: PropertyStats; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <View className="mb-6">
        <Text className="text-gray-500 text-center py-8">Cargando estadísticas...</Text>
      </View>
    );
  }

  const cards = [
    {
      title: 'Total Propiedades',
      value: stats.totalProperties.toString(),
      icon: 'business-outline',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Disponibles',
      value: stats.availableCount.toString(),
      icon: 'home-outline',
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Alquiladas',
      value: stats.rentedCount.toString(),
      icon: 'key-outline',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Anticrético',
      value: stats.anticreticoCount.toString(),
      icon: 'shield-outline',
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Ingresos Estimados',
      value: `Bs ${stats.estimatedIncome.toLocaleString()}`,
      icon: 'wallet-outline',
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Calificación Promedio',
      value: stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A',
      icon: 'star-outline',
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Total Reseñas',
      value: stats.totalReviews.toString(),
      icon: 'chatbubble-outline',
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
  ];

  return (
    <View className="mb-6">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-3 px-4">
          {cards.map((card, index) => (
            <View
              key={index}
              className={`${card.bgColor} rounded-xl p-4 min-w-[140px] shadow-sm`}
            >
              <View className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
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

function ReportsTable({ reports, isLoading, onExport }: { reports: ReportItem[]; isLoading?: boolean; onExport: () => void }) {
  if (isLoading) {
    return (
      <View className="bg-white rounded-xl p-4 shadow-sm">
        <Text className="text-gray-500 text-center py-8">Cargando reportes...</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'alquilado':
        return 'bg-blue-100 text-blue-800';
      case 'anticrético':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <View className="bg-white rounded-xl shadow-sm">
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-900">Reportes de Propiedades</Text>
          <TouchableOpacity
            onPress={onExport}
            className="bg-primary px-4 py-2 rounded-lg flex-row items-center gap-2"
          >
            <Ionicons name="download-outline" size={16} color="white" />
            <Text className="text-white font-medium text-sm">Exportar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {reports.length === 0 ? (
        <View className="p-8">
          <View className="items-center">
            <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-3 text-center">No hay reportes disponibles</Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">Los reportes aparecerán aquí cuando tengas actividad en tus propiedades</Text>
          </View>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="min-w-full">
            <View className="flex-row bg-gray-50 p-3 border-b border-gray-200">
              <Text className="flex-1 text-xs font-semibold text-gray-700">Propiedad</Text>
              <Text className="flex-1 text-xs font-semibold text-gray-700">Tipo</Text>
              <Text className="flex-1 text-xs font-semibold text-gray-700">Estado</Text>
              <Text className="flex-1 text-xs font-semibold text-gray-700">Ingreso</Text>
              <Text className="flex-1 text-xs font-semibold text-gray-700">Inquilino</Text>
              <Text className="flex-1 text-xs font-semibold text-gray-700">Fecha</Text>
            </View>
            {reports.map((item, index) => (
              <View key={item.id} className={`flex-row p-3 border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <Text className="flex-1 text-sm text-gray-900" numberOfLines={1}>{item.propertyName}</Text>
                <Text className="flex-1 text-sm text-gray-600">{item.propertyType}</Text>
                <View className="flex-1">
                  <Text className={`text-xs px-2 py-1 rounded-full text-center ${getStatusColor(item.status)}`}>
                    {item.status}
                  </Text>
                </View>
                <Text className="flex-1 text-sm text-gray-900">Bs {item.income.toLocaleString()}</Text>
                <Text className="flex-1 text-sm text-gray-600" numberOfLines={1}>{item.tenantName || 'N/A'}</Text>
                <Text className="flex-1 text-sm text-gray-600">{formatDate(item.createdAt)}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

export default function ReportsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['property-stats'],
    queryFn: async () => {
      const response = await api.get('/api/users/properties/stats');
      return response.data;
    },
  });

  const { data: reportsData, isLoading: reportsLoading, refetch: refetchReports } = useQuery({
    queryKey: ['property-reports'],
    queryFn: async () => {
      const response = await api.get('/api/users/properties/reports');
      return response.data;
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchStats(), refetchReports()]);
    setRefreshing(false);
  };

  const handleExport = () => {
    Alert.alert(
      'Exportar Reportes',
      '¿Cómo deseas exportar los datos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excel', onPress: () => console.log('Exportar a Excel') },
        { text: 'PDF', onPress: () => console.log('Exportar a PDF') },
      ]
    );
  };

  const stats = statsData?.data || {
    totalProperties: 0,
    availableCount: 0,
    rentedCount: 0,
    anticreticoCount: 0,
    estimatedIncome: 0,
    averageRating: null,
    totalReviews: 0,
  };

  const reports = reportsData?.data || [];

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
        <Ionicons name="bar-chart-outline" size={20} color="#fff" />
        <Text className="text-white font-semibold text-lg">Reportes</Text>
      </View>

      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-2">Reportes</Text>
        <Text className="text-gray-600 mb-6">Métricas y reportes de tus propiedades</Text>

        <SummaryCards stats={stats} isLoading={statsLoading} />
        <ReportsTable reports={reports} isLoading={reportsLoading} onExport={handleExport} />
      </View>
    </ScrollView>
  );
}
