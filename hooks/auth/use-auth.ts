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

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      try {
        const token = await storage.getToken();
        if (!token) {
          return null;
        }

        // Primero obtener el usuario almacenado como fallback
        const storedUser = await storage.getUser();

        try {
          // Usar el endpoint correcto para obtener el perfil del usuario actual
          const response = await api.get("/api/users/profile");
          const userData = response.data.success
            ? response.data.data
            : response.data;

          if (userData) {
            // Asegurarse de que el rol esté presente
            if (!userData.role && storedUser && (storedUser as User).role) {
              userData.role = (storedUser as User).role;
            }
            await storage.setUser(userData);
            return userData;
          }
        } catch (profileError) {
          console.warn("Error al obtener perfil del usuario:", profileError);
          // Si falla la petición, usar el usuario almacenado
          if (storedUser) {
            const userWithRole = storedUser as User;
            return userWithRole;
          }
        }

        return null;
      } catch (error) {
        console.error("Error in auth query:", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Usar el usuario almacenado como initialData para evitar flash de contenido incorrecto
    placeholderData: async () => {
      try {
        const token = await storage.getToken();
        if (!token) return null;
        const storedUser = await storage.getUser();
        return (storedUser as User) || null;
      } catch {
        return null;
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const response = await api.post("/api/auth/login", payload);
      return response.data as BackendResponse;
    },
    onSuccess: async (backendResponse) => {
      const { data: authData } = backendResponse;

      await storage.setToken(authData.accessToken);
      await storage.setRefreshToken(authData.refreshToken);
      await storage.setUser(authData.user);

      queryClient.setQueryData(["auth", "user"], authData.user);

      Alert.alert("Éxito", backendResponse.message, [
        {
          text: "OK",
          onPress: () => {
            router.replace("/(tabs)");
          },
        },
      ]);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al iniciar sesión";
      Alert.alert("Error", message);
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async (payload: {
      token: string;
      role: "rentante" | "arrendador";
    }) => {
      const response = await api.post("/api/auth/google", {
        token: payload.token,
        role: payload.role,
      });
      return response.data as BackendResponse;
    },
    onSuccess: async (backendResponse) => {
      const { data: authData } = backendResponse;

      await storage.setToken(authData.accessToken);
      await storage.setRefreshToken(authData.refreshToken);
      await storage.setUser(authData.user);

      queryClient.setQueryData(["auth", "user"], authData.user);

      // Redirigir según el rol del usuario
      // Si es rentante y no tiene preferencias, podría ir a preferences
      // Por ahora, todos van a tabs
      router.replace("/(tabs)");
    },
    onError: (googleError: any) => {
      console.error("Error en login de Google:", googleError);
      const message =
        googleError.response?.data?.message ||
        "Error al iniciar sesión con Google";
      Alert.alert("Error", message);
    },
  });

  const logout = async () => {
    try {
      try {
        await api.post("/api/auth/logout");
      } catch (error) {}

      await storage.clear();

      queryClient.setQueryData(["auth", "user"], null);
      queryClient.clear();

      setTimeout(() => {
        router.replace("/");
      }, 100);
    } catch (error) {
      console.error("Error during logout:", error);
      router.replace("/");
    }
  };

  const clearCorruptedSession = async () => {
    try {
      console.warn("Clearing potentially corrupted session data");
      await storage.clear();
      queryClient.setQueryData(["auth", "user"], null);
      queryClient.clear();
      router.replace("/");
    } catch (error) {
      console.error("Error clearing corrupted session:", error);
    }
  };

  const refreshAuth = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    } catch (error) {
      console.error("Error refreshing auth:", error);
    }
  };

  return {
    user,
    isLoading: isLoading || (!user && !error),
    isAuthenticated: !!user,
    login: loginMutation,
    googleLogin: googleLoginMutation,
    logout,
    refreshAuth,
    clearCorruptedSession,
  };
}
