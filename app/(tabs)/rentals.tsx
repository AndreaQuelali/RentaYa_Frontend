import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RatingModal from "@/components/RatingModal";
import { router } from "expo-router";

// Temporal: lista mock de propiedades alquiladas por el usuario
const RENTALS_MOCK = [
  {
    id: "r1",
    propertyId: "1",
    title: "Depto cerca del centro",
    city: "Cochabamba",
    price: 2200,
    photo: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    rated: false,
  },
  {
    id: "r2",
    propertyId: "2",
    title: "Casa con jardín",
    city: "Quillacollo",
    price: 3500,
    photo: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
    rated: true,
  },
];

export default function RentalsScreen() {
  const [rentals, setRentals] = useState(RENTALS_MOCK);
  const [showRating, setShowRating] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");

  const openRate = (title: string) => {
    setSelectedTitle(title);
    setShowRating(true);
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    // Aquí conectar con backend para guardar calificación
    alert(`Calificación enviada: ${rating} estrellas\n${comment ? `Comentario: ${comment}` : ""}`);
  };

  const handleOpenProperty = (id: string) => {
    router.push(`/property/${id}`);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-12 pb-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold">Mis alquileres y anticréticos</Text>
        <Text className="text-sm text-gray-600 mt-1">
          {rentals.length} {rentals.length === 1 ? "propiedad" : "propiedades"}
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-4 py-4">
          {rentals.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Ionicons name="home-outline" size={64} color="#d1d5db" />
              <Text className="text-gray-600 mt-4">Aún no tienes alquileres o anticreticos de propiedades</Text>
            </View>
          ) : (
            rentals.map((r) => (
              <View key={r.id} className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden">
                {r.photo ? (
                  <Image source={{ uri: r.photo }} className="w-full h-40" />
                ) : (
                  <View className="w-full h-40 bg-gray-100 items-center justify-center">
                    <Ionicons name="image-outline" size={40} color="#9CA3AF" />
                  </View>
                )}

                <View className="p-4">
                  <Text className="text-base font-semibold" numberOfLines={2}>{r.title}</Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location-outline" size={16} color="#6b7280" />
                    <Text className="text-sm text-gray-600 ml-1">{r.city}</Text>
                  </View>

                  <View className="flex-row gap-2 mt-4">
                    <Pressable
                      className="flex-1 bg-primary rounded-xl py-3 items-center justify-center"
                      onPress={() => handleOpenProperty(r.propertyId)}
                    >
                      <Text className="text-white font-semibold">Ver propiedad</Text>
                    </Pressable>
                    <Pressable
                      className={`flex-1 rounded-xl py-3 items-center justify-center ${r.rated ? "bg-gray-200" : "bg-black"}`}
                      disabled={r.rated}
                      onPress={() => openRate(r.title)}
                    >
                      <Text className={`font-semibold ${r.rated ? "text-gray-500" : "text-white"}`}>
                        {r.rated ? "Calificada" : "Calificar"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <RatingModal
        visible={showRating}
        onClose={() => setShowRating(false)}
        propertyTitle={selectedTitle}
        onSubmit={handleRatingSubmit}
      />
    </View>
  );
}
