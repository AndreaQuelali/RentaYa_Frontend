import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface CatalogItem {
  id: string;
  name: string;
}

export interface CatalogsResponse {
  success: boolean;
  data: CatalogItem[];
}

export function useOperationTypes() {
  return useQuery<CatalogItem[], Error>({
    queryKey: ["operation-types"],
    queryFn: async () => {
      const response = await api.get<CatalogsResponse>(
        "/api/properties/catalogo/operation-types"
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function usePropertyTypes() {
  return useQuery<CatalogItem[], Error>({
    queryKey: ["property-types"],
    queryFn: async () => {
      const response = await api.get<CatalogsResponse>(
        "/api/properties/catalogo/property-types"
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useProvinces() {
  return useQuery<CatalogItem[], Error>({
    queryKey: ["provinces"],
    queryFn: async () => {
      const response = await api.get<CatalogsResponse>(
        "/api/properties/catalogo/provinces"
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
