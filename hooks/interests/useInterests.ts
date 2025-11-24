import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Alert } from "react-native";

export type InterestStatus = "pendiente" | "aceptado" | "rechazado";

export interface Interest {
  id: string;
  propertyId: string;
  property: {
    id: string;
    title: string;
    price: number;
    address: string;
    city?: string;
    propertyPhotos?: { id: string; url: string }[];
    owner: {
      id: string;
      fullName: string;
      email: string;
      phone?: string;
      profilePhoto?: string;
    };
  };
  user: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    profilePhoto?: string;
  };
  message?: string;
  status: InterestStatus;
  createdAt: string | number | bigint | object | Date;
  updatedAt: string | number | bigint | object | Date;
}

export interface CreateInterestPayload {
  propertyId: string;
  message?: string;
}

export interface UpdateInterestStatusPayload {
  status: "aceptado" | "rechazado";
}

export function useCreateInterest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateInterestPayload) => {
      const response = await api.post("/api/interests", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["interests", "my-interests"],
      });
      queryClient.invalidateQueries({ queryKey: ["interests", "owner"] });
      Alert.alert(
        "Éxito",
        "Tu interés ha sido enviado al propietario. Te notificaremos cuando responda.",
      );
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al mostrar interés";
      Alert.alert("Error", message);
    },
  });
}

export function useMyInterests() {
  return useQuery({
    queryKey: ["interests", "my-interests"],
    queryFn: async () => {
      const response = await api.get("/api/interests/my-interests");
      return (response.data?.data || response.data || []) as Interest[];
    },
  });
}

export function useOwnerInterests() {
  return useQuery({
    queryKey: ["interests", "owner"],
    queryFn: async () => {
      const response = await api.get(
        "/api/interests/owner/my-properties-interests",
      );
      return (response.data?.data || response.data || []) as Interest[];
    },
  });
}

export function useUpdateInterestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      interestId,
      payload,
    }: {
      interestId: string;
      payload: UpdateInterestStatusPayload;
    }) => {
      const response = await api.patch(
        `/api/interests/${interestId}/status`,
        payload,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["interests", "my-interests"],
      });
      queryClient.invalidateQueries({ queryKey: ["interests", "owner"] });

      const statusText =
        variables.payload.status === "aceptado" ? "aceptado" : "rechazado";
      Alert.alert("Éxito", `El interés ha sido ${statusText} correctamente.`);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al actualizar el interés";
      Alert.alert("Error", message);
    },
  });
}

export function usePropertyInterests(propertyId: string) {
  return useQuery({
    queryKey: ["interests", "property", propertyId],
    queryFn: async () => {
      const response = await api.get(`/api/interests/property/${propertyId}`);
      return (response.data?.data || response.data || []) as Interest[];
    },
    enabled: !!propertyId,
  });
}
