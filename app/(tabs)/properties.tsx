import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import NewPropertyForm from "@/components/NewPropertyForm";
import { useUserProperties } from "@/hooks/properties/useUserProperties";
import {
  translateStatus,
  getOperationTypeLabel,
  formatPrice,
  getStatusColorClasses,
} from "@/utils/propertyHelpers";
import { UserProperty } from "@/types/property";
import Logo from "@/assets/logo";
import AssignUserModal from "@/components/AssignUserModal";
import { api } from "@/lib/api";

export default function PropertiesScreen() {
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<UserProperty | null>(
    null,
  );
  const [assignVisible, setAssignVisible] = useState(false);
  const [assignPropertyId, setAssignPropertyId] = useState<string | null>(null);

  const { properties, loading, error, fetchUserProperties, deleteProperty } =
    useUserProperties();

  useFocusEffect(
    React.useCallback(() => {
      fetchUserProperties();
    }, []),
  );

  const handlePropertyPress = (propertyId: string) => {
    router.push(`/property/${propertyId}`);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    const success = await deleteProperty(propertyId);
    if (success) {
      Alert.alert("Éxito", "Propiedad eliminada correctamente");
    } else {
      Alert.alert("Error", "No se pudo eliminar la propiedad. Intenta de nuevo.");
    }
  };

  const handleEditProperty = (property: UserProperty) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProperty(null);
    fetchUserProperties();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProperty(null);
  };

  const handleAssignSubmit = async (payload: {
    email: string;
    propertyId: string;
    type: string;
    startDate: string;
    finishDate: string;
    totalPrice: number;
  }) => {
    try {
      const body = {
        propertyId: payload.propertyId,
        totalPrice: payload.totalPrice,
        startDate: payload.startDate,
        finishDate: payload.finishDate,
        email: payload.email,
      };

      const response = await api.post('/api/reports/email', body);
      
      Alert.alert("Éxito", "Inquilino asignado correctamente");
      setAssignVisible(false);
      setAssignPropertyId(null);
      fetchUserProperties();
    } catch (e: any) {
      let errorMessage = 'No se pudo asignar el inquilino';
      
      if (e?.response) {
        const status = e.response.status;
        const data = e.response.data;
        
        if (typeof data === 'string' && data.includes('<!DOCTYPE')) {
          errorMessage = `Error del servidor (${status}). Verifica que el endpoint esté disponible.`;
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (status === 404) {
          errorMessage = 'Endpoint no encontrado. Verifica la configuración del servidor.';
        } else if (status === 400) {
          errorMessage = 'Datos inválidos. Verifica los campos ingresados.';
        } else if (status === 500) {
          errorMessage = 'Error interno del servidor. Intenta más tarde.';
        } else {
          errorMessage = `Error ${status}: ${data?.error || 'Error desconocido'}`;
        }
      } else if (e?.message) {
        errorMessage = e.message;
      }
      
      Alert.alert("Error", errorMessage);
    }
  };

  const renderPropertyCard = (property: UserProperty) => {
    const firstPhoto = property.propertyPhotos?.[0]?.url;
    const statusColorClasses = getStatusColorClasses(property.status);
    const translatedStatus = translateStatus(property.status);

    return (
      <Pressable
        key={property.id}
        className="bg-white border border-gray-200 rounded-xl mb-3 overflow-hidden"
        onPress={() => handlePropertyPress(property.id)}
      >
        <View className="flex-row">
          {firstPhoto ? (
            <Image
              source={{ uri: firstPhoto }}
              className="w-28 h-28"
              resizeMode="cover"
            />
          ) : (
            <View className="w-28 h-28 bg-gray-200 items-center justify-center">
              <Ionicons name="image-outline" size={32} color="#9CA3AF" />
            </View>
          )}

          <View className="flex-1 p-3">
            <View className="flex-row items-center justify-between mb-1">
              <View
                className={`px-2 py-1 rounded-full ${statusColorClasses.containerClass}`}
              >
                <Text
                  className={`text-xs font-medium ${statusColorClasses.textClass}`}
                >
                  {translatedStatus}
                </Text>
              </View>
              <View className="bg-primary/10 px-2 py-1 rounded-full">
                <Text className="text-xs text-primary font-medium">
                  {getOperationTypeLabel(property.operationType)}
                </Text>
              </View>
            </View>

            <Text
              className="text-base font-semibold text-gray-900 mb-1"
              numberOfLines={1}
            >
              {property.title}
            </Text>

            <View className="flex-row items-center mb-1">
              <Ionicons name="location-outline" size={12} color="#6B7280" />
              <Text className="text-xs text-gray-500 ml-1" numberOfLines={1}>
                {property.city}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">
                {formatPrice(property.price)}
              </Text>

              <View className="flex-row gap-2">
                <Pressable
                  className="p-2"
                  onPress={(e) => {
                    e.stopPropagation();
                    setAssignPropertyId(property.id);
                    setAssignVisible(true);
                  }}
                >
                  <Ionicons name="person-add-outline" size={20} color="#D65E48" />
                </Pressable>
                <Pressable
                  className="p-2"
                  onPress={(e) => {
                    e.stopPropagation();
                    handleEditProperty(property);
                  }}
                >
                  <Ionicons name="create-outline" size={20} color="#D65E48" />
                </Pressable>
                <Pressable
                  className="p-2"
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDeleteProperty(property.id);
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
        {showForm ? (
          <Pressable onPress={handleCloseForm} className="pr-2">
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>
        ) : (
        <Logo size={20} />
        )}
        <Text className="text-white font-semibold text-lg">
          {showForm
            ? editingProperty
              ? "Editar Propiedad"
              : "Nueva Propiedad"
            : "RentaYa"}
        </Text>
      </View>

      {showForm ? (
        <NewPropertyForm
          propertyToEdit={editingProperty}
          onSuccess={handleFormSuccess}
        />
      ) : (
        <ScrollView className="flex-1">
          <View className="p-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-semibold">Mis propiedades</Text>
              <Pressable
                className="bg-primary rounded-xl py-2 px-4 flex-row items-center gap-2"
                onPress={() => setShowForm(true)}
              >
                <Ionicons name="add-circle-outline" size={20} color="white" />
                <Text className="text-white font-semibold">Publicar</Text>
              </Pressable>
            </View>

            {loading && (
              <View className="mt-10 items-center justify-center">
                <ActivityIndicator size="large" color="#D65E48" />
                <Text className="text-gray-500 mt-2">
                  Cargando propiedades...
                </Text>
              </View>
            )}

            {error && !loading && (
              <View className="mt-10 items-center justify-center bg-red-50 p-4 rounded-xl">
                <Ionicons
                  name="alert-circle-outline"
                  size={48}
                  color="#EF4444"
                />
                <Text className="text-red-500 mt-2 text-center">{error}</Text>
                <Pressable
                  className="mt-4 bg-red-500 px-4 py-2 rounded-lg"
                  onPress={fetchUserProperties}
                >
                  <Text className="text-white font-semibold">Reintentar</Text>
                </Pressable>
              </View>
            )}

            {!loading && !error && properties.length === 0 && (
              <View className="mt-10 items-center">
                <Ionicons name="home-outline" size={64} color="#D1D5DB" />
                <Text className="text-gray-500 text-center mb-4 mt-4">
                  Aún no tienes propiedades publicadas.{"\n"}¡Empieza ahora y
                  publica tu primera propiedad!
                </Text>
                
              </View>
            )}

            {!loading && !error && properties.length > 0 && (
              <View>
                <Text className="text-gray-500 mb-3">
                  {properties.length}{" "}
                  {properties.length === 1 ? "propiedad" : "propiedades"}
                </Text>
                {properties.map(renderPropertyCard)}
              </View>
            )}
          </View>
        </ScrollView>
      )}
      <AssignUserModal
        visible={assignVisible}
        onClose={() => setAssignVisible(false)}
        propertyId={assignPropertyId}
        onSubmit={handleAssignSubmit}
      />
    </KeyboardAvoidingView>
  );
}
