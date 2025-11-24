import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { UserProperty } from "@/types/property";

export const useUserProperties = () => {
  const [properties, setProperties] = useState<UserProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(
    null
  );

  const fetchUserProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/api/properties/user/my-properties");
      setProperties(res.data.data || []);
    } catch (e: any) {
      console.error("Error fetching user properties:", e);
      setError("No se pudieron cargar tus propiedades");
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);

  const deleteProperty = useCallback(
    async (propertyId: string): Promise<boolean> => {
      try {
        setDeletingPropertyId(propertyId);
        await api.delete(`/api/properties/${propertyId}`);
        setProperties((prev) => prev.filter((p) => p.id !== propertyId));
        return true;
      } catch (e: any) {
        console.error("Error deleting property:", e);
        setError("No se pudo eliminar la propiedad");
        return false;
      } finally {
        setDeletingPropertyId(null);
      }
    },
    []
  );

  return {
    properties,
    loading,
    error,
    initialLoad,
    deletingPropertyId,
    fetchUserProperties,
    deleteProperty,
  };
};
