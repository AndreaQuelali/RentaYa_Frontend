import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import type { RegisterFormData } from "@/lib/validation/authSchema";

export type RegisterResponse = {
  data: {
    user: {
      id: string;
      email: string;
      fullName: string;
      phone: string;
    };
    accessToken: string;
    refreshToken: string;
  };
};

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterFormData>({
    mutationFn: async (payload: RegisterFormData) => {
      const response = await api.post("/api/auth/register", payload);
      return response.data;
    },
    onSuccess: async (response) => {
      // Guardar los tokens para poder enviar las preferencias
      const { accessToken, refreshToken } = response.data;
      if (accessToken) {
        await storage.setToken(accessToken);
      }
      if (refreshToken) {
        await storage.setRefreshToken(refreshToken);
      }

      Alert.alert(
        "Éxito",
        "Registro exitoso. Ahora personaliza tu experiencia.",
        [
          {
            text: "Continuar",
            onPress: () => router.replace("/(auth)/preferences"),
          },
        ]
      );
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error en el registro";
      Alert.alert("Error", message);
    },
  });
}
