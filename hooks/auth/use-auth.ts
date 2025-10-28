import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import { Alert } from "react-native";

export type User = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role?: string;
  statusVerification?: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type BackendResponse = {
  success: boolean;
  data: AuthResponse;
  message: string;
  timestamp: string;
};

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const token = await storage.getToken();
      if (!token) return null;

      try {
        const response = await api.get("/api/auth/me");
        const userData = response.data.success
          ? response.data.data.user
          : response.data.user;
        return userData;
      } catch {
        await storage.clear();
        return null;
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      // Limpiar storage antes de hacer login con nuevo usuario
      await storage.clear();
      queryClient.setQueryData(["auth", "user"], null);

      const response = await api.post("/api/auth/login", payload);
      return response.data as BackendResponse;
    },
    onSuccess: async (BackendResponse) => {
      const { data: authData } = BackendResponse;
      await storage.setToken(authData.accessToken);
      await storage.setUser(authData.user);
      await storage.setRefreshToken(authData.refreshToken);

      queryClient.setQueryData(["auth", "user"], authData.user);

      Alert.alert("Exito", BackendResponse.message, [
        { text: "OK", onPress: () => router.replace("/(tabs)") },
      ]);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al iniciar sesión";
      Alert.alert("Error", message);
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async (googleToken: string) => {
      // Limpiar storage antes de hacer login con nuevo usuario
      await storage.clear();
      queryClient.setQueryData(["auth", "user"], null);

      const response = await api.post("/api/auth/google", {
        token: googleToken,
      });
      return response.data as BackendResponse;
    },
    onSuccess: async (BackendResponse) => {
      const { data: authData } = BackendResponse;

      await storage.setToken(authData.accessToken);
      await storage.setRefreshToken(authData.refreshToken);
      await storage.setUser(authData.user);
      queryClient.setQueryData(["auth", "user"], authData.user);
      router.replace("/(tabs)");
    },
  });

  const logout = async () => {
    await storage.clear();
    queryClient.setQueryData(["auth", "user"], null);
    router.replace("/");
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation,
    googleLogin: googleLoginMutation,
    logout,
  };
}
