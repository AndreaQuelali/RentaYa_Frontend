import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";
import { api } from "@/lib/api";

export type PreferencesPayload = {
  propertyTypes: string[];
  modality?: string;
  locations: string[];
};

export function useSavePreferences() {
  return useMutation<any, Error, PreferencesPayload>({
    mutationFn: async (payload: PreferencesPayload) => {
      const response = await api.post("/api/users/preferences", payload);
      return response.data;
    },
    onSuccess: () => {
      Alert.alert(
        "¡Listo!",
        "Tus preferencias han sido guardadas correctamente.",
        [{ text: "Continuar", onPress: () => router.replace("/(auth)/login") }]
      );
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error al guardar preferencias";
      Alert.alert("Error", message);
    },
  });
}
