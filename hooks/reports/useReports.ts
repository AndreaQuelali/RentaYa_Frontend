import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Alert } from "react-native";

export interface CreateReportPayload {
  propertyId: string;
  startDate: string;
  finishDate: string;
  interestId: string;
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateReportPayload) => {
      const response = await api.post("/api/reports", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al crear el reporte";
      console.error("Error creating report:", message);
    },
  });
}

export function useAcceptReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interestId: string) => {
      const response = await api.patch(`/api/reports/${interestId}/accept`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al aceptar el reporte";
      console.error("Error accepting report:", message);
    },
  });
}

