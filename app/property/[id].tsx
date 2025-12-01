import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePropertyDetail } from "@/hooks/properties/usePropertyDetail";
import { formatPrice } from "@/utils/propertyHelpers";
import PropertyMap from "@/components/PropertyMap";
import {
  handleCall,
  handleEmail,
  handleWhatsApp,
} from "@/utils/contactHelpers";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/auth/use-auth";
import {
  useMyInterests,
  useCreateInterest,
} from "@/hooks/interests/useInterests";
import CreateReportModal from "@/components/CreateReportModal";
import { Alert, TextInput } from "react-native";

const { width } = Dimensions.get("window");
const galleryHeight = 220;

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { property, loading, error } = usePropertyDetail(id);
  const { user } = useAuth();
  const { data: myInterests } = useMyInterests();
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [createdInterestId, setCreatedInterestId] = useState<string | null>(
    null
  );
  const [solicitudMessage, setSolicitudMessage] = useState("");
  const [isSubmittingSolicitud, setIsSubmittingSolicitud] = useState(false);
  const { mutate: createInterest } = useCreateInterest();

  const existingInterest = useMemo(() => {
    if (!myInterests || !id) return null;
    return myInterests.find((interest) => interest.propertyId === id);
  }, [myInterests, id]);

  const isRentante = user?.role === "rentante";
  const isArrendador = user?.role === "arrendador";
  const isOwner = property?.owner?.id === user?.id;

  const photos: string[] = useMemo(() => {
    return (property?.propertyPhotos || [])
      .map((f: any) => f.url)
      .filter(Boolean);
  }, [property]);

  const priceText = property?.price ? formatPrice(property.price) : "—";
  const tipoText = property?.operationType;

  React.useEffect(() => {
    const loadFav = async () => {
      try {
        if (!id) return;
        const favRes = await api.get("/api/properties/user/favorites");
        const favs = favRes.data?.data || [];
        const found = favs.some(
          (f: any) => (f.propertyId ? f.propertyId : f.property?.id) === id
        );
        setIsFavorite(found);
      } catch {
        // Error loading favorites silently
      }
    };
    loadFav();
  }, [id]);

  React.useEffect(() => {
    const loadReviews = async () => {
      try {
        if (!id) return;
        const res = await api.get(`/api/reviews/property/${id}`);
        const list: any[] = res.data?.data || [];
        setReviews(list);
        const count = list.length;
        const avg =
          count > 0
            ? Number(
                (list.reduce((s, r) => s + (r.rating || 0), 0) / count).toFixed(
                  1
                )
              )
            : 0;
        setAvgRating(avg);
      } catch {
        // Error loading reviews silently
      }
    };
    loadReviews();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      await api.post(`/api/properties/${id}/favorite`);
      setIsFavorite((prev) => !prev);
    } catch (e) {
      console.error("Error toggling favorite: ", e);
    }
  };

  const handleSolicitar = () => {
    if (isSubmittingSolicitud || !id) return;

    setIsSubmittingSolicitud(true);

    createInterest(
      {
        propertyId: id,
        message: solicitudMessage.trim() || undefined,
      },
      {
        onSuccess: (interest: any) => {
          const interestId = interest?.id || interest?.data?.id;

          if (!interestId) {
            setIsSubmittingSolicitud(false);
            Alert.alert("Error", "No se pudo obtener el ID del interés creado");
            return;
          }

          setIsSubmittingSolicitud(false);
          setCreatedInterestId(interestId);
          setSolicitudMessage("");
          setShowReportModal(true);
        },
        onError: (error: any) => {
          setIsSubmittingSolicitud(false);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Error al crear el interés. Por favor, intenta de nuevo.";
          Alert.alert("Error", errorMessage);
        },
      }
    );
  };

  const handleReportModalClose = () => {
    setShowReportModal(false);
    setCreatedInterestId(null);
  };

  const handleReportSuccess = () => {
    setShowReportModal(false);
    setCreatedInterestId(null);
    // Refrescar los intereses para que aparezca el estado
    // Esto se hará automáticamente con el query invalidation del hook
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#D65E48" />
        <Text className="text-gray-500 mt-2">Cargando detalles...</Text>
      </View>
    );
  }

  if (error || !property) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-4">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-red-500 mt-4 text-center">{error}</Text>
        <Pressable
          className="mt-4 bg-primary px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="p-1 rounded-full bg-white/10"
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
        <Pressable className="p-1" onPress={toggleFavorite}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color="#fff"
          />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-4 pt-4">
          <View
            className="rounded-xl overflow-hidden bg-gray-100"
            style={{ height: galleryHeight }}
          >
            {photos.length > 0 ? (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={{ width }}
              >
                {photos.map((uri, idx) => (
                  <Image
                    key={`${uri}-${idx}`}
                    source={{ uri }}
                    style={{ width, height: galleryHeight }}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500">
                  Galería de imágenes de la propiedad
                </Text>
              </View>
            )}
            {tipoText && (
              <View className="absolute top-3 left-3">
                <Text className="text-sm px-2 py-1 bg-primary text-white rounded-md font-semibold">
                  {tipoText}
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row items-start justify-between mt-4">
            <View className="flex-1 pr-2">
              <Text className="text-xl font-bold" numberOfLines={2}>
                {property.title || "—"}
              </Text>
              <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-center w-full">
                  <Ionicons name="location" size={18} color="#D65E48" />
                  <Text
                    className="text-base text-gray-600 ml-1"
                    numberOfLines={1}
                  >
                    {property.city || "—"}, {property.address || "—"}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={16} color="#D65E48" />
                  <Text className="text-base text-gray-700 ml-1">
                    {avgRating.toFixed(1)} ({reviews.length})
                  </Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-primary">
                {priceText}
              </Text>
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-lg font-bold mb-2">Descripción</Text>
            <Text className="text-base text-gray-700 leading-6">
              {property.description || "Sin descripción"}
            </Text>
          </View>

          <PropertyMap
            latitude={property.latitude}
            longitude={property.longitude}
            address={property.address}
            city={property.city}
          />
          <View className="bg-gray-50 rounded-xl py-4 mb-4">
            <Text className="text-lg font-bold mb-3">
              Información del propietario
            </Text>
            <View className="flex-row items-center">
              {property.owner.profilePhoto ? (
                <Image
                  source={{ uri: property.owner.profilePhoto }}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                  <Text className="text-white font-bold text-lg">
                    {property.owner.fullName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="ml-3 flex-1">
                <Text className="text-gray-900 font-semibold text-lg">
                  {property.owner.fullName}
                </Text>
                <Text className="text-gray-500 text-base">
                  {property.owner.email}
                </Text>
                <Text className="text-gray-500 text-base">
                  {property.owner.phone}
                </Text>
              </View>
            </View>
          </View>

          {isRentante && !isOwner && !existingInterest && (
            <View className="mb-6">
              <View className="bg-gray-50 rounded-xl p-4 mb-4">
                <Text className="text-lg font-bold mb-3">Solicitud</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base min-h-[100px] bg-white"
                  placeholder="Mensaje (opcional)"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  value={solicitudMessage}
                  onChangeText={setSolicitudMessage}
                  maxLength={500}
                  editable={!isSubmittingSolicitud}
                />
                <Text className="text-xs text-gray-500 mt-1 text-right">
                  {solicitudMessage.length}/500
                </Text>
              </View>
              <Pressable
                className="bg-primary rounded-xl py-4 flex-row items-center justify-center"
                onPress={handleSolicitar}
                disabled={isSubmittingSolicitud}
              >
                {isSubmittingSolicitud ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Ionicons name="send" size={20} color="white" />
                    <Text className="text-white font-semibold ml-2">
                      Solicitar
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          )}

          {isRentante && !isOwner && existingInterest && (
            <View>
              <View className="mb-4">
                <View
                  className={`flex-row items-center justify-center py-3 rounded-xl ${
                    existingInterest.status === "aceptado"
                      ? "bg-green-50 border border-green-200"
                      : existingInterest.status === "rechazado"
                        ? "bg-red-50 border border-red-200"
                        : "bg-yellow-50 border border-yellow-200"
                  }`}
                >
                  <Ionicons
                    name={
                      existingInterest.status === "aceptado"
                        ? "checkmark-circle"
                        : existingInterest.status === "rechazado"
                          ? "close-circle"
                          : "time"
                    }
                    size={20}
                    color={
                      existingInterest.status === "aceptado"
                        ? "#10B981"
                        : existingInterest.status === "rechazado"
                          ? "#EF4444"
                          : "#F59E0B"
                    }
                  />
                  <Text
                    className={`ml-2 font-semibold ${
                      existingInterest.status === "aceptado"
                        ? "text-green-700"
                        : existingInterest.status === "rechazado"
                          ? "text-red-700"
                          : "text-yellow-700"
                    }`}
                  >
                    {existingInterest.status === "aceptado"
                      ? "Interés Aceptado"
                      : existingInterest.status === "rechazado"
                        ? "Interés Rechazado"
                        : "Interés Pendiente"}
                  </Text>
                </View>
              </View>

              {existingInterest.status === "aceptado" && (
                <View className="gap-3">
                  <Pressable
                    className="bg-primary rounded-xl py-4 flex-row items-center justify-center"
                    onPress={() => handleCall(property.owner.phone)}
                  >
                    <Ionicons name="call" size={20} color="white" />
                    <Text className="text-white font-semibold ml-2">
                      Llamar
                    </Text>
                  </Pressable>
                  <View className="flex-row gap-3">
                    <Pressable
                      className="flex-1 bg-green-500 rounded-xl py-4 flex-row items-center justify-center"
                      onPress={() => handleWhatsApp(property.owner.phone)}
                    >
                      <Ionicons name="logo-whatsapp" size={20} color="white" />
                      <Text className="text-white font-semibold ml-2">
                        WhatsApp
                      </Text>
                    </Pressable>
                    <Pressable
                      className="flex-1 bg-blue-500 rounded-xl py-4 flex-row items-center justify-center"
                      onPress={() => handleEmail(property.owner.email)}
                    >
                      <Ionicons name="mail" size={20} color="white" />
                      <Text className="text-white font-semibold ml-2">
                        Email
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          )}
          {isArrendador && !isOwner && !existingInterest && (
            <View className="mb-6">
              <View className="bg-gray-50 rounded-xl p-4 mb-4">
                <Text className="text-lg font-bold mb-3">Solicitud</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base min-h-[100px] bg-white"
                  placeholder="Mensaje (opcional)"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  value={solicitudMessage}
                  onChangeText={setSolicitudMessage}
                  maxLength={500}
                  editable={!isSubmittingSolicitud}
                />
                <Text className="text-xs text-gray-500 mt-1 text-right">
                  {solicitudMessage.length}/500
                </Text>
              </View>
              <Pressable
                className="bg-primary rounded-xl py-4 flex-row items-center justify-center"
                onPress={handleSolicitar}
                disabled={isSubmittingSolicitud}
              >
                {isSubmittingSolicitud ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Ionicons name="send" size={20} color="white" />
                    <Text className="text-white font-semibold ml-2">
                      Solicitar
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          )}

          {!user && (
            <View className="mb-6">
              <Pressable
                className="bg-primary rounded-xl py-4 flex-row items-center justify-center"
                onPress={() => router.push("/(auth)/login")}
              >
                <Ionicons name="heart" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  Mostrar Interés
                </Text>
              </Pressable>
            </View>
          )}

          {isOwner && (
            <View className="mb-6 p-4 bg-gray-50 rounded-xl">
              <Text className="text-center text-gray-600 font-medium">
                Esta es tu propiedad. Los interesados podrán contactarte una vez
                que aceptes su solicitud.
              </Text>
            </View>
          )}

          <View className="mt-2">
            <Text className="text-lg font-semibold mb-2">
              Reseñas de la propiedad
            </Text>
            {reviews.length === 0 ? (
              <Text className="text-base text-gray-600">
                Esta propiedad aún no tiene reseñas.
              </Text>
            ) : (
              <View className="gap-4">
                {reviews.map((rv, idx) => {
                  const reviewer =
                    rv.user?.fullName ||
                    rv.user?.name ||
                    rv.userFullName ||
                    rv.userName ||
                    rv.authorName ||
                    "Usuario";
                  const initial = reviewer?.charAt(0)?.toUpperCase?.() || "U";
                  return (
                    <View
                      key={rv.id || idx}
                      className="border-b border-gray-200 pb-3"
                    >
                      {rv.content ? (
                        <View className="flex-col items-start mb-2 gap-2">
                          <View className="flex-row items-center justify-between gap-2">
                            <View className="flex-row items-center gap-2">
                              <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center">
                                <Text className="text-gray-700 font-semibold">
                                  {initial}
                                </Text>
                              </View>
                              <Text className="text-sm font-semibold text-gray-800">
                                {reviewer}
                              </Text>
                            </View>
                            <View className="flex-row items-center">
                              <Ionicons name="star" size={14} color="#D65E48" />
                              <Text className="text-sm text-gray-700 ml-1">
                                {rv.rating}
                              </Text>
                            </View>
                          </View>
                          <Text className="text-base text-gray-700">
                            {rv.content}
                          </Text>
                        </View>
                      ) : (
                        ""
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {id && createdInterestId && (
        <CreateReportModal
          visible={showReportModal}
          onClose={handleReportModalClose}
          propertyId={id}
          propertyTitle={property?.title || ""}
          interestId={createdInterestId}
          onSuccess={handleReportSuccess}
        />
      )}
    </View>
  );
}
