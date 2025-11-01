import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { PropertyDetail } from "@/types/property";

export const usePropertyDetail = (propertyId: string) => {
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/api/properties/${propertyId}`);
        setProperty(res.data.data);
      } catch (e: any) {
        console.error("Error fetching property details:", e);
        setError("No se pudieron cargar los detalles de la propiedad");
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);

  return {
    property,
    loading,
    error,
    currentPhotoIndex,
    setCurrentPhotoIndex,
  };
};
