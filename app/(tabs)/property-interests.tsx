import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import Logo from "@/assets/logo";
import {
  useOwnerInterests,
  useUpdateInterestStatus,
  InterestStatus,
} from "@/hooks/interests/useInterests";
import { formatPrice } from "@/utils/propertyHelpers";
import { formatDate } from "@/utils/dateHelpers";

type FilterType = "all" | InterestStatus;

export default function PropertyInterestsScreen() {
  const [filter, setFilter] = useState<FilterType>("all");
  const {
    data: interests,
    isLoading,
    refetch,
    isRefetching,
  } = useOwnerInterests();
  const { mutate: updateStatus } = useUpdateInterestStatus();

  // Recargar datos cuando se enfoca la pantalla
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const filteredInterests = useMemo(() => {
    if (!interests) return [];
    if (filter === "all") return interests;
    return interests.filter((interest) => interest.status === filter);
  }, [interests, filter]);

  const handleAccept = (interestId: string) => {
    Alert.alert(
      "Aceptar solicitud",
      "¿Estás seguro de que deseas aceptar esta solicitud? El usuario podrá contactarte.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aceptar",
          onPress: () => {
            updateStatus({
              interestId,
              payload: { status: "aceptado" },
            });
          },
        },
      ]
    );
  };

  const handleReject = (interestId: string) => {
    Alert.alert(
      "Rechazar solicitud",
      "¿Estás seguro de que deseas rechazar esta solicitud?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Rechazar",
          style: "destructive",
          onPress: () => {
            updateStatus({
              interestId,
              payload: { status: "rechazado" },
            });
          },
        },
      ]
    );
  };

  const getStatusBadge = (status: InterestStatus) => {
    const config = {
      pendiente: {
        icon: "time",
        color: "#F59E0B",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        text: "Pendiente",
        textColor: "text-yellow-700",
      },
      aceptado: {
        icon: "checkmark-circle",
        color: "#10B981",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        text: "Aceptado",
        textColor: "text-green-700",
      },
      rechazado: {
        icon: "close-circle",
        color: "#EF4444",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        text: "Rechazado",
        textColor: "text-red-700",
      },
    };

    const statusConfig = config[status];

    return (
      <View
        className={`flex-row items-center px-3 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border`}
      >
        <Ionicons
          name={statusConfig.icon as any}
          size={16}
          color={statusConfig.color}
        />
        <Text
          className={`ml-1 text-xs font-semibold ${statusConfig.textColor}`}
        >
          {statusConfig.text}
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
        <Logo size={20} />
        <Text className="text-white font-semibold text-lg">RentaYa</Text>
      </View>
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Solicitudes
        </Text>
      </View>

      {isLoading && (
        <View className="mt-10 items-center justify-center">
          <ActivityIndicator size="large" color="#D65E48" />
          <Text className="text-gray-500 mt-2">Cargando solicitudes...</Text>
        </View>
      )}

      {!isLoading && (
        <>
          <View className="flex-row px-4 py-3 gap-2 border-b border-gray-200">
            <Pressable
              onPress={() => setFilter("all")}
              className={`px-4 py-2 rounded-full ${
                filter === "all" ? "bg-primary" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  filter === "all" ? "text-white" : "text-gray-700"
                }`}
              >
                Todos ({interests?.length || 0})
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setFilter("pendiente")}
              className={`px-4 py-2 rounded-full ${
                filter === "pendiente" ? "bg-primary" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  filter === "pendiente" ? "text-white" : "text-gray-700"
                }`}
              >
                Pendientes (
                {interests?.filter((i) => i.status === "pendiente").length || 0}
                )
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setFilter("aceptado")}
              className={`px-4 py-2 rounded-full ${
                filter === "aceptado" ? "bg-primary" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  filter === "aceptado" ? "text-white" : "text-gray-700"
                }`}
              >
                Aceptados (
                {interests?.filter((i) => i.status === "aceptado").length || 0})
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setFilter("rechazado")}
              className={`px-4 py-2 rounded-full ${
                filter === "rechazado" ? "bg-primary" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  filter === "rechazado" ? "text-white" : "text-gray-700"
                }`}
              >
                Rechazados (
                {interests?.filter((i) => i.status === "rechazado").length || 0}
                )
              </Text>
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                colors={["#D65E48"]}
                tintColor="#D65E48"
              />
            }
          >
            {filteredInterests.length === 0 ? (
              <View className="flex-1 items-center justify-center px-8 py-16">
                <Ionicons name="file-tray-outline" size={64} color="#D1D5DB" />
                <Text className="text-gray-400 text-lg font-semibold mt-4 text-center">
                  {filter === "all"
                    ? "No has recibido solicitudes para tus propiedades"
                    : `No tienes solicitudes ${filter === "pendiente" ? "pendientes" : filter === "aceptado" ? "aceptadas" : "rechazadas"}`}
                </Text>
                <Text className="text-gray-400 text-sm mt-2 text-center">
                  {filter === "all" &&
                    "Los usuarios interesados en tus propiedades aparecerán aquí"}
                </Text>
              </View>
            ) : (
              <View className="px-4 py-4">
                {filteredInterests.map((interest) => {
                  const firstPhoto =
                    interest.property?.propertyPhotos?.[0]?.url || undefined;
                  const userPhoto = interest.user?.profilePhoto;

                  return (
                    <View
                      key={interest.id}
                      className="bg-white rounded-2xl border border-gray-200 mb-4 overflow-hidden"
                    >
                      <View className="w-full h-32 bg-gray-100">
                        {firstPhoto ? (
                          <Image
                            source={{ uri: firstPhoto }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="w-full h-full items-center justify-center">
                            <Ionicons name="home" size={32} color="#D1D5DB" />
                          </View>
                        )}
                        <View className="absolute top-2 right-2">
                          {getStatusBadge(interest.status)}
                        </View>
                      </View>

                      <View className="p-4">
                        <View className="flex-row items-center mb-3">
                          {userPhoto ? (
                            <Image
                              source={{ uri: userPhoto }}
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                              <Text className="text-white font-bold text-lg">
                                {interest.user?.fullName
                                  ?.charAt(0)
                                  .toUpperCase() || "U"}
                              </Text>
                            </View>
                          )}
                          <View className="ml-3 flex-1">
                            <Text className="text-base font-semibold text-gray-900">
                              {interest.user?.fullName || "Usuario"}
                            </Text>
                            <Text className="text-sm text-gray-500">
                              {interest.user?.email || ""}
                            </Text>
                          </View>
                        </View>

                        <Pressable
                          onPress={() =>
                            router.push(`/property/${interest.propertyId}`)
                          }
                          className="mb-3"
                        >
                          <Text
                            className="text-base font-bold text-gray-900 mb-1"
                            numberOfLines={1}
                          >
                            {interest.property?.title || "Propiedad"}
                          </Text>
                          <Text className="text-lg font-bold text-primary">
                            {formatPrice(interest.property?.price || 0)}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            <Ionicons
                              name="location"
                              size={14}
                              color="#6B7280"
                            />
                            <Text
                              className="text-xs text-gray-600 ml-1"
                              numberOfLines={1}
                            >
                              {interest.property?.city || ""}
                            </Text>
                          </View>
                        </Pressable>

                        {interest.message && (
                          <View className="bg-gray-50 rounded-xl p-3 mb-3">
                            <Text
                              className="text-sm text-gray-700"
                              numberOfLines={3}
                            >
                              &quot;{interest.message}&quot;
                            </Text>
                          </View>
                        )}

                        <View className="flex-row items-center justify-between mb-3">
                          <Text className="text-xs text-gray-500">
                            {formatDate(interest.createdAt as any)}
                          </Text>
                        </View>

                        {interest.status === "pendiente" && (
                          <View className="flex-row gap-2 pt-3 border-t border-gray-200">
                            <Pressable
                              className="flex-1 bg-green-500 rounded-xl py-3 flex-row items-center justify-center"
                              onPress={() => handleAccept(interest.id)}
                            >
                              <Ionicons
                                name="checkmark"
                                size={18}
                                color="white"
                              />
                              <Text className="text-white font-semibold ml-1">
                                Aceptar
                              </Text>
                            </Pressable>
                            <Pressable
                              className="flex-1 bg-red-500 rounded-xl py-3 flex-row items-center justify-center"
                              onPress={() => handleReject(interest.id)}
                            >
                              <Ionicons name="close" size={18} color="white" />
                              <Text className="text-white font-semibold ml-1">
                                Rechazar
                              </Text>
                            </Pressable>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}
