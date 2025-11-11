import React from "react";
import {
  View,
  Text,
  Switch,
  Pressable,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMode } from "@/context/ModeContext";
import { useAuth } from "@/hooks/auth/use-auth";
import { useUserProfile } from "@/context/UserProfileContext";
import { useProfileImage } from "@/hooks/profile/use-profile-image";
import { router } from "expo-router";
import Logo from "@/assets/logo";

export default function ProfileScreen() {
  const { mode, toggle } = useMode();
  const { user, logout } = useAuth();
  const { profile, loading } = useUserProfile();
  const { uploading, selectImageSource } = useProfileImage();
  const isOwner = mode === "owner";

  const onToggle = () => {
    toggle();
    if (mode === "user") {
      router.push("/(tabs)/properties");
    } else {
      router.push("/(tabs)");
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error("Error signing out:", error);
              Alert.alert("Error", "Hubo un problema al cerrar sesión", [
                {
                  text: "OK",
                  onPress: () => router.replace("/"),
                },
              ]);
            }
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
        <Logo size={20} />
        <Text className="text-white font-semibold text-lg">RentaYa</Text>
      </View>

      {loading && !profile ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#D65E48" />
        </View>
      ) : (
        <View className="px-4 py-5">
          <View className="flex-row items-center gap-3 mb-6">
            <Pressable onPress={selectImageSource} disabled={uploading}>
              <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center overflow-hidden">
                {uploading ? (
                  <ActivityIndicator size="small" />
                ) : profile?.profilePhoto ? (
                  <Image
                    source={{ uri: profile.profilePhoto }}
                    className="w-full h-full"
                  />
                ) : (
                  <Text className="text-gray-600 font-semibold">
                    {profile?.fullName?.charAt(0).toUpperCase() || "U"}
                  </Text>
                )}
              </View>
              <View className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                <Ionicons name="camera" size={12} color="#fff" />
              </View>
            </Pressable>
            <View>
              <Text className="text-lg font-semibold">
                {profile?.fullName || user?.fullName || "Usuario"}
              </Text>
              <Text className="text-gray-500 text-base">
                {profile?.email || user?.email || "email@ejemplo.com"}
              </Text>
            </View>
          </View>

          <View className="mb-2">
            <Text className="text-gray-600 text-base mb-2">Modo de usuario</Text>
            <View className="flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-3">
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name="person-circle-outline"
                  size={18}
                  color="#11181C"
                />
                <Text className="font-medium">
                  {isOwner ? "Propietario" : "Usuario"}
                </Text>
              </View>
              <Switch value={isOwner} onValueChange={onToggle} thumbColor={"#D65E48"} trackColor={{true: "#D65E48" }} />
            </View>
            <Text className="text-gray-500 text-base mt-2">
              {isOwner
                ? "Puedes publicar y administrar tus propiedades."
                : "Puedes buscar y contactar propietarios."}
            </Text>
          </View>

          <View className="mt-6 gap-3">
            <Pressable
              className="flex-row items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-3"
              onPress={() => router.push("/settings")}
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="create-outline" size={18} />
                <Text className="text-base">Editar perfil</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#6B7280" />
            </Pressable>

            <Pressable className="flex-row items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="notifications-outline" size={18} />
                <Text className="text-base">Notificaciones</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#6B7280" />
            </Pressable>
          </View>

          <Pressable
            className="mt-8 border bg-black rounded-xl py-3 items-center"
            onPress={handleSignOut}
          >
            <Text className="font-semibold text-white">Cerrar sesión</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
