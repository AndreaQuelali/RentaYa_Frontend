import React from "react";
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RatingModal from "@/components/RatingModal";
import { router, useFocusEffect } from "expo-router";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/auth/use-auth";

type RentalItem = {
  propertyId: string;
  title: string;
  city?: string;
  address?: string;
  price?: number;
  photo?: string;
  canRate: boolean;
  rated: boolean;
};

export default function RentalsScreen() {
  const { user } = useAuth();
  const [items, setItems] = React.useState<RentalItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [showRating, setShowRating] = React.useState(false);
  const [selected, setSelected] = React.useState<{ id: string; title: string } | null>(null);
  

  const openRate = (id: string, title: string) => {
    setSelected({ id, title });
    setShowRating(true);
  };

  const fetchRentals = React.useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);

      // 1) Traer propiedades disponibles (públicas)
      const resProps = await api.get("/api/properties");
      const propsList = resProps.data?.data?.items || resProps.data?.items || [];

      // 2) Traer reseñas del usuario para saber cuáles ya calificó
      let ratedSet = new Set<string>();
      try {
        const resReviews = await api.get(`/api/reviews/user/${user.id}`);
        const reviews = resReviews.data?.data || [];
        ratedSet = new Set<string>(reviews.map((r: any) => r.propertyId));
      } catch {}

      // 3) Determinar por reportes si el usuario alquiló cada propiedad
      const now = new Date();
      const rentals: RentalItem[] = [];
      // Ejecutar de forma limitada para evitar demasiadas solicitudes concurrentes
      const concurrency = 5;
      let i = 0;
      async function worker() {
        while (i < propsList.length) {
          const idx = i++;
          const p = propsList[idx];
          try {
            const repRes = await api.get(`/api/reports/${user.id}/${p.id}`);
            const reports = repRes.data?.data || [];
            if (Array.isArray(reports) && reports.length > 0) {
              // Verificar si terminó el periodo (finishDate) para habilitar calificación
              const latest = reports[0];
              const finish = latest.finishDate ? new Date(latest.finishDate) : null;
              const canRate = !!finish && finish.getTime() <= now.getTime();

              rentals.push({
                propertyId: p.id,
                title: p.title,
                city: p.city,
                address: p.address,
                price: p.price,
                photo: p.propertyPhotos?.[0]?.url,
                canRate,
                rated: ratedSet.has(p.id),
              });
            }
          } catch (e) {
            // si falla para una propiedad, continuar con las demás
          }
        }
      }
      await Promise.all(Array.from({ length: concurrency }, () => worker()));

      // Ordenar por fecha (opcional): ya calificadas abajo
      rentals.sort((a, b) => Number(a.rated) - Number(b.rated));
      setItems(rentals);
    } catch (e: any) {
      console.error("Error fetching rentals:", e);
      setError("No se pudieron cargar tus alquileres");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    React.useCallback(() => {
      fetchRentals();
    }, [fetchRentals])
  );

  const handleRatingSubmit = async (rating: number, comment: string) => {
    if (!selected || !user?.id) return;
    try {
      await api.post("/api/reviews", {
        userId: user.id,
        propertyId: selected.id,
        rating,
        content: comment || "",
      });
      Alert.alert('Éxito', 'Tu calificación fue enviada correctamente.');
      setItems((prev) => prev.map((it) => (it.propertyId === selected.id ? { ...it, rated: true } : it)));
    } catch (e: any) {
      const msg = e.response?.data?.message || "No se pudo enviar la calificación";
      Alert.alert('Error', msg);
    } finally {
      setShowRating(false);
      setSelected(null);
    }
  };

  const handleOpenProperty = (id: string) => {
    router.push(`/property/${id}`);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-12 pb-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold">Mis alquileres y anticréticos</Text>
        <Text className="text-sm text-gray-600 mt-1">
          {items.length} {items.length === 1 ? "propiedad" : "propiedades"}
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-4 py-4">
          {loading && (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#D65E48" />
              <Text className="text-gray-600 mt-4">Cargando tus alquileres...</Text>
            </View>
          )}

          {error && !loading && (
            <View className="items-center justify-center py-20">
              <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
              <Text className="text-gray-600 mt-4">{error}</Text>
            </View>
          )}

          {!loading && !error && items.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Ionicons name="home-outline" size={64} color="#d1d5db" />
              <Text className="text-gray-600 mt-4">Aún no tienes alquileres o anticreticos de propiedades</Text>
            </View>
          ) : (
            items.map((r) => (
              <View key={r.propertyId} className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden">
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
                      className={`flex-1 rounded-xl py-3 items-center justify-center ${r.rated ? "bg-gray-200" : r.canRate ? "bg-black" : "bg-gray-200"}`}
                      disabled={r.rated || !r.canRate}
                      onPress={() => openRate(r.propertyId, r.title)}
                    >
                      <Text className={`font-semibold ${r.rated || !r.canRate ? "text-gray-500" : "text-white"}`}>
                        {r.rated ? "Calificada" : r.canRate ? "Calificar" : "Aún no disponible"}
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
        propertyTitle={selected?.title || ""}
        onSubmit={handleRatingSubmit}
      />
    </View>
  );
}
