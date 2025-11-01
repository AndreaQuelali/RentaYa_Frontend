import { useState } from "react";
import { api } from "@/lib/api";
import { UserProperty } from "@/types/property";

export const useUserProperties = () => {
  const [properties, setProperties] = useState<UserProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProperties = async () => {
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
    }
  };

  const deleteProperty = async (propertyId: string): Promise<boolean> => {
    try {
      await api.delete(`/api/properties/${propertyId}`);
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      return true;
    } catch (e: any) {
      console.error("Error deleting property:", e);
      setError("No se pudo eliminar la propiedad");
      return false;
    }
  };

  return {
    properties,
    loading,
    error,
    fetchUserProperties,
    deleteProperty,
  };
};
