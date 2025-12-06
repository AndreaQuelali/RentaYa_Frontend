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
import { useMyInterests, InterestStatus } from "@/hooks/interests/useInterests";
import { formatPrice } from "@/utils/propertyHelpers";
import { formatDate } from "@/utils/dateHelpers";
import {
  handleCall,
  handleEmail,
  handleWhatsApp,
} from "@/utils/contactHelpers";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/auth/use-auth";
import RatingModal from "@/components/RatingModal";

type FilterType = "all" | InterestStatus;

export default function MyInterestsScreen() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>("all");
  const [isRefreshingOnFocus, setIsRefreshingOnFocus] = useState(false);
  const {
    data: interests,
    isLoading,
    refetch,
    isRefetching,
  } = useMyInterests();

  const [showRating, setShowRating] = useState(false);
  const [selected, setSelected] = useState<{
    propertyId: string;
    title: string;
  } | null>(null);
  const [ratedPropertyIds, setRatedPropertyIds] = useState<string[]>([]);

  // Recargar datos cuando se enfoca la pantalla
  useFocusEffect(
    React.useCallback(() => {
      setIsRefreshingOnFocus(true);
      const loadData = async () => {
        await refetch();
        setIsRefreshingOnFocus(false);
      };
      loadData();
    }, [refetch])
  );

  const filteredInterests = useMemo(() => {
    if (!interests) return [];
    if (filter === "all") return interests;
    return interests.filter((interest) => interest.status === filter);
  }, [interests, filter]);

  const openRate = (propertyId: string, title: string) => {
    setSelected({ propertyId, title });
    setShowRating(true);
  };

  const handleRatingSubmit = async (rating: number, comment: string) => {
    if (!user?.id || !selected) return;

    try {
      await api.post("/api/reviews", {
        userId: user.id,
        propertyId: selected.propertyId,
        rating,
        content: comment || "",
      });

      setRatedPropertyIds((prev) =>
        prev.includes(selected.propertyId)
          ? prev
          : [...prev, selected.propertyId]
      );

      Alert.alert("Éxito", "Tu calificación fue enviada correctamente.");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "No se pudo enviar la calificación";
      Alert.alert("Error", msg);
    } finally {
      setShowRating(false);
      setSelected(null);
    }
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

  // Mostrar loading si es la carga inicial o si se está recargando al enfocar la pantalla
  const showLoading = isLoading || isRefreshingOnFocus;

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-3 px-4">
        <View className="flex-row items-center gap-2">
          <Logo size={20} />
          <Text className="text-white font-semibold text-lg">RentaYa</Text>
        </View>
      </View>
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Mis solicitudes
        </Text>

        {showLoading && (
          <View className="mt-10 items-center justify-center">
            <ActivityIndicator size="large" color="#D65E48" />
            <Text className="text-gray-500 mt-2">Cargando solicitudes...</Text>
          </View>
        )}
      </View>

      {!showLoading && (
        <>
          <View className="border-b border-gray-200">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                gap: 8,
              }}
              className="flex-row"
            >
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
                  {interests?.filter((i) => i.status === "pendiente").length ||
                    0}
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
                  {interests?.filter((i) => i.status === "aceptado").length ||
                    0}
                  )
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
                  {interests?.filter((i) => i.status === "rechazado").length ||
                    0}
                  )
                </Text>
              </Pressable>
            </ScrollView>
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
                    ? "No has mostrado interés en ninguna propiedad"
                    : `No tienes solicitudes ${filter === "pendiente" ? "pendientes" : filter === "aceptado" ? "aceptados" : "rechazados"}`}
                </Text>
                <Text className="text-gray-400 text-sm mt-2 text-center">
                  {filter === "all" &&
                    "Explora propiedades y muestra tu interés para contactar con los propietarios"}
                </Text>
              </View>
            ) : (
              <View className="px-4 py-4">
                {filteredInterests.map((interest) => {
                  const firstPhoto =
                    interest.property?.propertyPhotos?.[0]?.url || undefined;

                  return (
                    <Pressable
                      key={interest.id}
                      className="bg-white rounded-2xl border border-gray-200 mb-4 overflow-hidden"
                      onPress={() =>
                        router.push(`/property/${interest.propertyId}`)
                      }
                    >
                      <View className="w-full h-48 bg-gray-100">
                        {firstPhoto ? (
                          <Image
                            source={{ uri: firstPhoto }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="w-full h-full items-center justify-center">
                            <Ionicons name="home" size={48} color="#D1D5DB" />
                          </View>
                        )}
                        <View className="absolute top-3 right-3">
                          {getStatusBadge(interest.status)}
                        </View>
                      </View>

                      <View className="p-4">
                        <Text
                          className="text-lg font-bold text-gray-900 mb-1"
                          numberOfLines={2}
                        >
                          {interest.property?.title || "Propiedad"}
                        </Text>
                        <Text className="text-xl font-bold text-primary mb-2">
                          {formatPrice(interest.property?.price || 0)}
                        </Text>

                        <View className="flex-row items-center mb-2">
                          <Ionicons name="location" size={16} color="#6B7280" />
                          <Text
                            className="text-sm text-gray-600 ml-1"
                            numberOfLines={1}
                          >
                            {interest.property?.city || ""}
                          </Text>
                        </View>

                        {interest.message && (
                          <View className="bg-gray-50 rounded-xl p-3 mb-3">
                            <Text
                              className="text-sm text-gray-700"
                              numberOfLines={2}
                            >
                              &quot;{interest.message}&quot;
                            </Text>
                          </View>
                        )}

                        <View className="flex-row items-center justify-between">
                          <Text className="text-xs text-gray-500">
                            {formatDate(interest.createdAt as any)}
                          </Text>
                        </View>

                        {interest.status === "aceptado" && (
                          <View className="mt-4 pt-4 border-t border-gray-200 gap-3">
                            {interest.property?.owner && (
                              <>
                                <Text className="text-sm font-semibold text-gray-700 mb-2">
                                  Contactar propietario:
                                </Text>
                                <View className="flex-row gap-2">
                                  <Pressable
                                    className="flex-1 bg-primary rounded-xl py-2 flex-row items-center justify-center"
                                    onPress={() =>
                                      handleCall(
                                        interest.property.owner.phone || ""
                                      )
                                    }
                                  >
                                    <Ionicons
                                      name="call"
                                      size={16}
                                      color="white"
                                    />
                                    <Text className="text-white font-semibold ml-1 text-xs">
                                      Llamar
                                    </Text>
                                  </Pressable>
                                  <Pressable
                                    className="flex-1 bg-green-500 rounded-xl py-2 flex-row items-center justify-center"
                                    onPress={() =>
                                      handleWhatsApp(
                                        interest.property.owner.phone || ""
                                      )
                                    }
                                  >
                                    <Ionicons
                                      name="logo-whatsapp"
                                      size={16}
                                      color="white"
                                    />
                                    <Text className="text-white font-semibold ml-1 text-xs">
                                      WhatsApp
                                    </Text>
                                  </Pressable>
                                  <Pressable
                                    className="flex-1 bg-blue-500 rounded-xl py-2 flex-row items-center justify-center"
                                    onPress={() =>
                                      handleEmail(
                                        interest.property.owner.email || ""
                                      )
                                    }
                                  >
                                    <Ionicons
                                      name="mail"
                                      size={16}
                                      color="white"
                                    />
                                    <Text className="text-white font-semibold ml-1 text-xs">
                                      Email
                                    </Text>
                                  </Pressable>
                                </View>
                              </>
                            )}

                            <Pressable
                              className={`mt-1 rounded-xl py-3 items-center justify-center ${
                                ratedPropertyIds.includes(interest.propertyId)
                                  ? "bg-gray-200"
                                  : "bg-black"
                              }`}
                              disabled={ratedPropertyIds.includes(
                                interest.propertyId
                              )}
                              onPress={() =>
                                openRate(
                                  interest.propertyId,
                                  interest.property?.title || "Propiedad"
                                )
                              }
                            >
                              <Text
                                className={`font-semibold ${
                                  ratedPropertyIds.includes(interest.propertyId)
                                    ? "text-gray-500"
                                    : "text-white"
                                }`}
                              >
                                {ratedPropertyIds.includes(interest.propertyId)
                                  ? "Calificada"
                                  : "Calificar"}
                              </Text>
                            </Pressable>
                          </View>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </>
      )}
      <RatingModal
        visible={showRating}
        onClose={() => setShowRating(false)}
        propertyTitle={selected?.title || ""}
        onSubmit={handleRatingSubmit}
      />
    </View>
  );
}
