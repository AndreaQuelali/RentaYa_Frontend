import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Logo from "@/assets/logo";
import { useMyInterests, InterestStatus } from "@/hooks/interests/useInterests";
import { formatPrice } from "@/utils/propertyHelpers";
import { formatDate } from "@/utils/dateHelpers";
import {
  handleCall,
  handleEmail,
  handleWhatsApp,
} from "@/utils/contactHelpers";

type FilterType = "all" | InterestStatus;

export default function MyInterestsScreen() {
  const [filter, setFilter] = useState<FilterType>("all");
  const {
    data: interests,
    isLoading,
    refetch,
    isRefetching,
  } = useMyInterests();

  const filteredInterests = useMemo(() => {
    if (!interests) return [];
    if (filter === "all") return interests;
    return interests.filter((interest) => interest.status === filter);
  }, [interests, filter]);

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

  if (isLoading) {
    return (
      <View className="flex-1 bg-white">
        <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
          <Logo size={20} />
          <Text className="text-white font-semibold text-lg">RentaYa</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#D65E48" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-3 px-4">
        <View className="flex-row items-center gap-2 mb-3">
          <Logo size={20} />
          <Text className="text-white font-semibold text-lg">RentaYa</Text>
        </View>
        <Text className="text-white text-2xl font-bold">Mis Intereses</Text>
      </View>

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
            {interests?.filter((i) => i.status === "pendiente").length || 0})
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
            {interests?.filter((i) => i.status === "rechazado").length || 0})
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
            <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 text-lg font-semibold mt-4 text-center">
              {filter === "all"
                ? "No has mostrado interés en ninguna propiedad"
                : `No tienes intereses ${filter === "pendiente" ? "pendientes" : filter === "aceptado" ? "aceptados" : "rechazados"}`}
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
                        {interest.property?.city &&
                          interest.property?.address &&
                          ", "}
                        {interest.property?.address || ""}
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

                    {interest.status === "aceptado" &&
                      interest.property?.owner && (
                        <View className="mt-4 pt-4 border-t border-gray-200">
                          <Text className="text-sm font-semibold text-gray-700 mb-2">
                            Contactar propietario:
                          </Text>
                          <View className="flex-row gap-2">
                            <Pressable
                              className="flex-1 bg-primary rounded-xl py-2 flex-row items-center justify-center"
                              onPress={() =>
                                handleCall(interest.property.owner.phone || "")
                              }
                            >
                              <Ionicons name="call" size={16} color="white" />
                              <Text className="text-white font-semibold ml-1 text-xs">
                                Llamar
                              </Text>
                            </Pressable>
                            <Pressable
                              className="flex-1 bg-green-500 rounded-xl py-2 flex-row items-center justify-center"
                              onPress={() =>
                                handleWhatsApp(
                                  interest.property.owner.phone || "",
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
                                handleEmail(interest.property.owner.email || "")
                              }
                            >
                              <Ionicons name="mail" size={16} color="white" />
                              <Text className="text-white font-semibold ml-1 text-xs">
                                Email
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
