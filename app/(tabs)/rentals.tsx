import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RatingModal from "@/components/RatingModal";
import { router, useFocusEffect } from "expo-router";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/auth/use-auth";
import Logo from "@/assets/logo";

type RentalItem = {
  propertyId: string;
  title: string;
  city?: string;
  address?: string;
  price?: number;
  photo?: string;
  canRate: boolean;
  rated: boolean;
  status: string; // e.g., ACTIVE | FINALIZED or backend values
  startDate?: string;
  finishDate?: string;
};

export default function RentalsScreen() {
  const { user } = useAuth();
  const [items, setItems] = React.useState<RentalItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [showRating, setShowRating] = React.useState(false);
  const [selected, setSelected] = React.useState<{
    id: string;
    title: string;
  } | null>(null);

  const [tab, setTab] = React.useState<"ACTIVO" | "FINALIZADO">("ACTIVO");

  const openRate = (id: string, title: string) => {
    setSelected({ id, title });
    setShowRating(true);
  };

  const fetchRentals = React.useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);

      // 1) Traer reseñas del usuario para saber cuáles ya calificó
      let ratedSet = new Set<string>();
      try {
        const resReviews = await api.get(`/api/reviews/user/${user.id}`);
        const reviews = resReviews.data?.data || [];
        const ids: string[] = [];
        for (const r of reviews) {
          if (r.propertyId) ids.push(r.propertyId);
          else if (r.property?.id) ids.push(r.property.id);
        }
        ratedSet = new Set<string>(ids);
      } catch {}
      const now = new Date();
      const rentals: RentalItem[] = [];

      // 2) Traer reportes del usuario en bulk y unir con properties
      let reportsList: any[] | null = null;
      try {
        const reps = await api.get(`/api/reports/user/${user.id}`);
        reportsList = reps.data?.data || reps.data || [];
      } catch (e) {
        reportsList = null;
      }

      // 3) Traer propiedades para unir por propertyId (en bulk solo una vez)
      const resProps = await api.get("/api/properties");
      const propsList =
        resProps.data?.data?.items || resProps.data?.items || [];
      const propById = new Map<string, any>(
        propsList.map((p: any) => [p.id, p])
      );

      if (Array.isArray(reportsList)) {
        for (const r of reportsList) {
          const pid = r.propertyId || r.property?.id;
          const p = propById.get(pid);
          const start = r.startDate ? new Date(r.startDate) : null;
          const finish = r.finishDate ? new Date(r.finishDate) : null;
          let status: string = (r.status || "").toString().toUpperCase();
          if (!status) {
            if (start && finish) {
              if (now >= start && now <= finish) status = "ACTIVO";
              else if (finish && now > finish) status = "FINALIZADO";
            }
          }
          if (p) {
            rentals.push({
              propertyId: p.id,
              title: p.title,
              city: p.city,
              address: p.address,
              price: p.price,
              photo: p.propertyPhotos?.[0]?.url,
              canRate: true,
              rated: ratedSet.has(p.id),
              status: status || "ACTIVO",
              startDate: r.startDate,
              finishDate: r.finishDate,
            });
          } else if (r.property) {
            rentals.push({
              propertyId: pid,
              title: r.property.title,
              city: r.property.city,
              address: r.property.address,
              price: r.property.price,
              photo: r.property.propertyPhotos?.[0]?.url,
              canRate: true,
              rated: ratedSet.has(pid),
              status: status || "ACTIVO",
              startDate: r.startDate,
              finishDate: r.finishDate,
            });
          }
        }
        // Además, asegurar que TODAS las calificadas aparezcan aunque no haya reporte
        for (const pid of ratedSet) {
          if (rentals.some((x) => x.propertyId === pid)) continue;
          const p = propById.get(pid);
          if (p) {
            rentals.push({
              propertyId: p.id,
              title: p.title,
              city: p.city,
              address: p.address,
              price: p.price,
              photo: p.propertyPhotos?.[0]?.url,
              canRate: true,
              rated: true,
              status: "FINALIZADO",
              startDate: undefined,
              finishDate: undefined,
            });
          }
        }
      } else {
        // Fallback: per-property requests with small concurrency
        const concurrency = 3;
        let i = 0;
        async function worker() {
          while (i < propsList.length) {
            const idx = i++;
            const p = propsList[idx];
            try {
              const repRes = await api.get(`/api/reports/${user.id}/${p.id}`);
              const reports = repRes.data?.data || [];
              if (Array.isArray(reports) && reports.length > 0) {
                const latest = reports[0];
                const start = latest.startDate
                  ? new Date(latest.startDate)
                  : null;
                const finish = latest.finishDate
                  ? new Date(latest.finishDate)
                  : null;
                let status: string = (latest.status || "")
                  .toString()
                  .toUpperCase();
                if (!status) {
                  if (start && finish) {
                    if (now >= start && now <= finish) status = "ACTIVO";
                    else if (finish && now > finish) status = "FINALIZADO";
                  }
                }
                rentals.push({
                  propertyId: p.id,
                  title: p.title,
                  city: p.city,
                  address: p.address,
                  price: p.price,
                  photo: p.propertyPhotos?.[0]?.url,
                  canRate: true,
                  rated: ratedSet.has(p.id),
                  status: status || "ACTIVO",
                  startDate: latest.startDate,
                  finishDate: latest.finishDate,
                });
              }
            } catch {}
          }
        }
        await Promise.all(Array.from({ length: concurrency }, () => worker()));
        // Fallback: también agregamos calificadas sin reporte visible
        for (const pid of ratedSet) {
          if (rentals.some((x) => x.propertyId === pid)) continue;
          const p = propById.get(pid);
          if (p) {
            rentals.push({
              propertyId: p.id,
              title: p.title,
              city: p.city,
              address: p.address,
              price: p.price,
              photo: p.propertyPhotos?.[0]?.url,
              canRate: true,
              rated: true,
              status: "FINALIZADO",
              startDate: undefined,
              finishDate: undefined,
            });
          }
        }
      }

      // Ordenar: no calificadas primero
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
      Alert.alert("Éxito", "Tu calificación fue enviada correctamente.");
      setItems((prev) =>
        prev.map((it) =>
          it.propertyId === selected.id ? { ...it, rated: true } : it
        )
      );
    } catch (e: any) {
      const msg =
        e.response?.data?.message || "No se pudo enviar la calificación";
      Alert.alert("Error", msg);
    } finally {
      setShowRating(false);
      setSelected(null);
    }
  };

  const handleOpenProperty = (id: string) => {
    router.push(`/property/${id}`);
  };

  const filtered = React.useMemo(() => {
    const key = tab === "ACTIVO" ? "ACTIVO" : "FINALIZADO";
    return items.filter((it) => (it.status || "").toUpperCase().includes(key));
  }, [items, tab]);

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-3 px-4">
        <View className="flex-row items-center gap-2">
          <Logo size={20} />
          <Text className="text-white font-semibold text-lg">RentaYa</Text>
        </View>
      </View>
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-2">Mis alquileres y antcréticos</Text>   
        <Text className="text-sm text-gray-600 mt-1">
          {items.length} {items.length === 1 ? "propiedad" : "propiedades"}
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-4 py-4">
          {/* Tabs */}
          <View className="flex-row bg-gray-100 rounded-xl p-1 mb-4">
            <Pressable
              className={`flex-1 py-2 rounded-lg items-center ${tab === "ACTIVO" ? "bg-white" : ""}`}
              onPress={() => setTab("ACTIVO")}
            >
              <Text
                className={`font-semibold ${tab === "ACTIVO" ? "text-gray-900" : "text-gray-500"}`}
              >
                Activo
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 py-2 rounded-lg items-center ${tab === "FINALIZADO" ? "bg-white" : ""}`}
              onPress={() => setTab("FINALIZADO")}
            >
              <Text
                className={`font-semibold ${tab === "FINALIZADO" ? "text-gray-900" : "text-gray-500"}`}
              >
                Finalizado
              </Text>
            </Pressable>
          </View>
          {loading && (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#D65E48" />
              <Text className="text-gray-600 mt-4">
                Cargando tus alquileres...
              </Text>
            </View>
          )}

          {error && !loading && (
            <View className="items-center justify-center py-20">
              <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
              <Text className="text-gray-600 mt-4">{error}</Text>
            </View>
          )}

          {!loading && !error && filtered.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Ionicons name="home-outline" size={64} color="#d1d5db" />
              <Text className="text-gray-600 mt-4">
                No hay propiedades en esta sección
              </Text>
            </View>
          ) : (
            filtered.map((r) => (
              <View
                key={r.propertyId}
                className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden"
              >
                {r.photo ? (
                  <Image source={{ uri: r.photo }} className="w-full h-40" />
                ) : (
                  <View className="w-full h-40 bg-gray-100 items-center justify-center">
                    <Ionicons name="image-outline" size={40} color="#9CA3AF" />
                  </View>
                )}

                <View className="p-4">
                  <Text className="text-base font-semibold" numberOfLines={2}>
                    {r.title}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color="#6b7280"
                    />
                    <Text className="text-sm text-gray-600 ml-1">{r.city}</Text>
                  </View>
                  <View className="flex-row items-center mt-1">
                    <Ionicons
                      name={
                        r.status?.toUpperCase().includes("FINAL")
                          ? "checkmark-circle"
                          : "time-outline"
                      }
                      size={16}
                      color={
                        r.status?.toUpperCase().includes("FINAL")
                          ? "#10B981"
                          : "#F59E0B"
                      }
                    />
                    <Text
                      className={`text-xs ml-1 ${r.status?.toUpperCase().includes("FINAL") ? "text-green-600" : "text-amber-600"}`}
                    >
                      {r.status || "Activo"}
                    </Text>
                  </View>

                  <View className="flex-row gap-2 mt-4">
                    <Pressable
                      className="flex-1 bg-primary rounded-xl py-3 items-center justify-center"
                      onPress={() => handleOpenProperty(r.propertyId)}
                    >
                      <Text className="text-white font-semibold">
                        Ver propiedad
                      </Text>
                    </Pressable>
                    <Pressable
                      className={`flex-1 rounded-xl py-3 items-center justify-center ${r.rated ? "bg-gray-200" : r.canRate ? "bg-black" : "bg-gray-200"}`}
                      disabled={r.rated || !r.canRate}
                      onPress={() => openRate(r.propertyId, r.title)}
                    >
                      <Text
                        className={`font-semibold ${r.rated || !r.canRate ? "text-gray-500" : "text-white"}`}
                      >
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
        propertyTitle={selected?.title || ""}
        onSubmit={handleRatingSubmit}
      />
    </View>
  );
}
